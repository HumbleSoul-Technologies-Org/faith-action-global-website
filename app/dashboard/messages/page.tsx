'use client'

import { useState } from 'react'
import Link from 'next/link'
import { messages } from '@/lib/mock-data'
import { formatDate } from '@/lib/date-utils'
import { ArrowLeft, Mail, CheckCircle2, Circle } from 'lucide-react'

export default function MessagesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selected = selectedId ? messages.find((m) => m.id === selectedId) : null
  const unreadCount = messages.filter((m) => !m.isRead).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="p-2 hover:bg-muted rounded-lg transition">
              <ArrowLeft size={20} className="text-foreground" />
            </Link>
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
          <div className="bg-card rounded-lg border border-border divide-y divide-border max-h-[600px] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No messages
              </div>
            ) : (
              messages.map((message) => (
                <button
                  key={message.id}
                  onClick={() => setSelectedId(message.id)}
                  className={`w-full p-4 text-left hover:bg-muted transition ${
                    selectedId === message.id ? 'bg-primary/10' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
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
                      <p className="text-xs text-muted-foreground truncate">{message.subject}</p>
                      <p className="text-xs text-muted-foreground mt-1">{formatDate(message.date)}</p>
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
            <div className="bg-card rounded-lg border border-border p-6 space-y-4">
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
                  <p className="text-sm text-foreground">{formatDate(selected.date)}</p>
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
              {selected.reply ? (
                <div className="bg-primary/5 rounded-lg p-4 space-y-2 border border-primary/20">
                  <p className="text-xs font-semibold text-primary uppercase">Reply</p>
                  <p className="text-xs text-muted-foreground">Replied on {formatDate(selected.reply.repliedOn || '')}</p>
                  <div className="bg-background rounded p-3 text-sm text-foreground whitespace-pre-wrap mt-2">
                    {selected.reply.reply}
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">No reply yet. Reply will appear here.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-card rounded-lg border border-border p-12 text-center">
              <Mail size={48} className="text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
