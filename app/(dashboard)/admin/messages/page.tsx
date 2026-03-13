'use client'

import { useState,useEffect } from 'react'
import Link from 'next/link'
// import { messages } from '@/lib/mock-data'
import { formatDate } from '@/lib/date-utils'
import { ArrowLeft, Mail, CheckCircle2, Circle, Reply, Trash2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { set } from 'react-hook-form'
import { apiRequest } from '@/lib/query-client'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default function MessagesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false)
  const [replying, setReplying] = useState(false)
  const [replyMessage, setReplyMessage] = useState('')

  const { data:messageData, isLoading, error } = useQuery<any[]>({
    queryKey: ['messages','all'],
  })

  useEffect(() => { 
    if (messageData) {
       setMessages(messageData)
    }
  }, [messageData])

  const selected = selectedId ? messages.find((m) => m._id === selectedId) : null
  const unreadCount = messages.filter((m) => !m.isRead).length

  const readMessage = async (id: string) => { 
    try {
      await apiRequest('POST', `/messages/${id}/read`)
      setMessages((prev) => prev.map((m) => m._id === id ? { ...m, isRead: true } : m))
    } catch (error) {
      console.error('Error marking message as read:', error)
    }
  }
  const handleReply = async () => { 
    setReplying(true)
    try {
      await apiRequest('POST', `/messages/${selectedId}/reply`, { reply: replyMessage })
      setMessages((prev) => prev.map((m) => m._id === selectedId ? { ...m, isReplied: true } : m))
    } catch (error) {
      console.error('Error sending reply:', error)
    }finally{
      setReplying(false)
      // setIsReplyDialogOpen(false)
      //             setReplyMessage('')
      }
  }

  const deleteMessage = async (id: string) => { 
    setReplying(true)
    try {
      await apiRequest('DELETE', `/messages/${id}/delete`)
      setMessages((prev) => prev.filter((m) => m._id !== id))
    } catch (error) {
      console.error('Error deleting message:', error)
    } finally {
      setReplying(false)
      setIsReplyDialogOpen(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            {/* <Link href="/admin" className="p-2 hover:bg-muted rounded-lg transition">
              <ArrowLeft size={20} className="text-foreground" />
            </Link> */}
            <div>
              <h1 className="text-3xl font-serif font-bold text-primary">Messages</h1>
              <p className="text-sm text-muted-foreground">{unreadCount} unread</p>
            </div>
          </div>
        </div>
      </div>

     

      {/* Messages Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border border-border divide-y divide-border max-h-150 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No messages
              </div>
            ) : (
              messages.map((message) => (
                <button
                  key={message._id}
                  onClick={() => { setSelectedId(message._id); if (!message.isRead) readMessage(message._id)}}
                  className={`w-full p-4 text-left cursor-pointer hover:bg-muted transition ${
                    selectedId === message._id ? 'bg-primary/10' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 mt-1">
                      {message.isRead ? (
                        <CheckCircle2 size={18} className="text-muted-foreground" />
                      ) : (
                        <Circle size={18} className="text-accent fill-accent" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${message.isRead ? 'text-muted-foreground' : 'text-foreground font-bold'}`}>
                        {message.name}
                      </p>
                      <p className="text-sm text-semibold text-muted-foreground truncate">{message.subject}</p>
                      <p className="text-xs text-muted-foreground truncate">{message.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatDate(message.createdAt)}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-card relative rounded-lg border border-border p-6 space-y-4">
              {/* From */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">From</p>
                <p className="font-semibold text-foreground">{selected.name}</p>
                <p className="text-sm text-muted-foreground">{selected.email}</p>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-border">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Phone</p>
                  <p className="text-sm text-foreground">{selected.phone}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Date</p>
                  <p className="text-sm text-foreground">{formatDate(selected.createdAt)}</p>
                </div>
              </div>

              {/* Subject */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Subject</p>
                <p className="font-semibold text-foreground">{selected.subject}</p>
              </div>

              {/* Message Content */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Message</p>
                <div className="bg-muted rounded-lg p-4 text-foreground whitespace-pre-wrap">
                  {selected.message}
                </div>
              </div>

              {/* Reply Section */}
              {selected.isReplied ? (
                <div className="bg-primary/5 rounded-lg p-4 space-y-2 border border-primary/20">
                  <p className="text-xs font-semibold text-primary uppercase">Reply</p>
                 {selected.reply && selected.reply.length > 0 && (
                   selected.reply.map((r:any, idx:number) => (
                     <div key={idx} className="bg-primary/10 relative rounded-lg p-3 text-foreground whitespace-pre-wrap">
                       {r.reply}
                        {r.repliedOn && <p className="text-xs text-right text-muted-foreground mt-2">Replied On: {formatDate(r.repliedOn)}</p>}
                     </div>
                    ))
                )}

                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">No reply yet. Reply will appear here.</p>
                </div>
              )}
              
              <button onClick={() => deleteMessage(selected._id)} className='flex border-2 p-1 rounded-b-md cursor-pointer hover:shadow-lg items-center justify-center hover:bg-red-600 hover:border-0 hover:text-white gap-2 absolute top-3 right-5'>{ replying? <span className="animate-spin">↻</span> :<><Trash2 className='w-5 h-5' />Delete </>}</button>
              
              <button onClick={() => setIsReplyDialogOpen(true)} className='flex border-2 p-1 rounded-b-md cursor-pointer hover:shadow-lg items-center justify-center gap-2 absolute top-3 right-30'><Reply className='w-5 h-5'/>Reply</button>
            </div>
          ) : (
            <div className="bg-card rounded-lg border border-border p-12 text-center">
              <Mail size={48} className="text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">Select a message to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Reply Dialog */}
      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reply to Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Reply Message</label>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your reply here..."
                className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none h-40"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                onClick={() => {
                  setIsReplyDialogOpen(false)
                  setReplyMessage('')
                }}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // Handle send reply logic here
                  handleReply()
                }}
                disabled={replying || replyMessage.trim() === ''}
                className={`${replying?'hover:cursor-not-allowed':''}`}
              >
                {replying ? 'Sending Reply...' : 'Send Reply'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
