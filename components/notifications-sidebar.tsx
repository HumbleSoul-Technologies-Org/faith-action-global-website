'use client'

import Link from 'next/link'
import { notifications } from '@/lib/mock-data'
import { X, Bell, MessageSquare, ThumbsUp, Eye, AlertCircle, MessageCircle } from 'lucide-react'
import { formatDate } from '@/lib/date-utils'
import { use, useEffect,useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '@/lib/query-client'
interface NotificationsSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function NotificationsSidebar({ isOpen, onClose }: NotificationsSidebarProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageSquare size={16} className="text-blue-500" />
      case 'comment':
        return <MessageCircle size={16} className="text-purple-500" />
      case 'like':
        return <ThumbsUp size={16} className="text-red-500" />
      case 'view':
        return <Eye size={16} className="text-green-500" />
      case 'sys':
        return <AlertCircle size={16} className="text-yellow-500" />
      default:
        return <Bell size={16} className="text-gray-500" />
    }
  }
  
  const [notifications, setNotifications] = useState<any[]>([])

  const { data: fetchedNotifications } = useQuery<any[]>({
    queryKey: ['notifications','all'],
  })

  useEffect(() => {
    if (fetchedNotifications) {
      setNotifications(fetchedNotifications)
    }
  }, [fetchedNotifications])
  
  const handleRead = async (id: string) => { 
    try {
      await apiRequest('PUT', `/notifications/${id}/read`)
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, isSeen: true } : n
        )
      )
    } catch (error) {
      
    }
  }
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed right-0 top-0 h-screen w-full sm:w-96 bg-card border-l border-border shadow-lg transform transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-bold text-lg text-foreground">Notifications</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto h-[calc(100vh-80px)]">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No notifications Yet!
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 hover:bg-muted transition ${
                    notification.isSeen ? 'opacity-60' : 'bg-primary/5'
                  }`}
                >
                  {notification.href ? (
                    <Link href={notification.href} onClick={() => { onClose(); handleRead(notification._id); } } className="block">
                      <div className="flex gap-3">
                        <div className="shrink-0 mt-1">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground text-sm">
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {notification.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatDate(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="flex gap-3">
                      <div className="shrink-0 mt-1">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm">
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {notification.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
