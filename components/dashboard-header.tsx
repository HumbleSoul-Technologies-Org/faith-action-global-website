'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { Mail, Bell, LogOut } from 'lucide-react'
import { messages, notifications } from '@/lib/mock-data'
import NotificationsSidebar from './notifications-sidebar'

export default function DashboardHeader() {
  const { logout, username } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)
  
  const unreadMessages = messages.filter((m) => !m.isRead).length
  const unseenNotifications = notifications.filter((n) => !n.isSeen).length

  return (
    <>
      <header className="bg-card border-b w-full border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Left Side - Branding */}
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-serif font-bold text-primary">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome, {username}</p>
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
              className="relative p-2 hover:bg-muted rounded-lg transition"
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
