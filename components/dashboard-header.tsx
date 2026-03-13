'use client'

import { useState,useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Mail, Bell, LogOut } from 'lucide-react'
import {notifications } from '@/lib/mock-data'
import NotificationsSidebar from './notifications-sidebar'
import { useQuery } from '@tanstack/react-query'

export default function DashboardHeader() {
  const { data:messageData } = useQuery<any[]>({
    queryKey: ['messages','all'],
  })

    const [messages, setMessages] = useState<any[]>([])
  
  const { logout, username } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)
  const unreadMessages = messages.filter((m) => !m.isRead).length
  const unseenNotifications = notifications.filter((n) => !n.isSeen).length

   useEffect(() => { 
    if (messageData) {
       setMessages(messageData)
    }
  }, [messageData])

  return (
    <>
      <header className="bg-card border-b w-full border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Left Side - Branding */}
          <div className="flex items-center gap-4">
            
          </div>

          {/* Right Side - Icons and Actions */}
          <div className="flex items-center gap-4">
            {/* Messages Icon */}
            <Link href="/admin/messages" className="relative p-2 hover:bg-muted rounded-lg transition">
              <Mail size={20} className="text-foreground" />
              {unreadMessages > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-accent rounded-full">
                  {unreadMessages}
                </span>
              )}
            </Link>

            {/* Notifications Icon */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative mr-10 p-2 hover:bg-muted rounded-lg transition"
            >
              <Bell size={20} className="text-foreground" />
              {unseenNotifications > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-accent rounded-full">
                  {unseenNotifications}
                </span>
              )}
            </button>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-red-50 text-red-700 hover:bg-red-100 rounded-lg transition"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Notifications Sidebar */}
      <NotificationsSidebar isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
    </>
  )
}
