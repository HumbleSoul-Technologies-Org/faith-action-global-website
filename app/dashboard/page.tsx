'use client'

import { messages, notifications } from '@/lib/mock-data'
import { Mail, Bell, Users, Eye } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const unreadMessages = messages.filter((m) => !m.isRead).length
  const unseenNotifications = notifications.filter((n) => !n.isSeen).length

  const stats = [
    {
      label: 'Unread Messages',
      value: unreadMessages,
      icon: Mail,
      href: '/dashboard/messages',
      color: 'bg-blue-50 text-blue-700',
    },
    {
      label: 'Unseen Notifications',
      value: unseenNotifications,
      icon: Bell,
      href: '#',
      color: 'bg-yellow-50 text-yellow-700',
    },
    {
      label: 'Total Messages',
      value: messages.length,
      icon: Users,
      href: '/dashboard/messages',
      color: 'bg-purple-50 text-purple-700',
    },
    {
      label: 'Total Notifications',
      value: notifications.length,
      icon: Eye,
      href: '#',
      color: 'bg-green-50 text-green-700',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section>
        <h1 className="text-4xl font-serif font-bold text-primary mb-2">Dashboard</h1>
        <p className="text-muted-foreground">View and manage your messages and notifications</p>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className={`rounded-lg border border-border p-6 hover:shadow-lg transition-shadow cursor-pointer ${
                stat.href === '#' ? 'cursor-default' : ''
              }`}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${stat.color}`}>
                <Icon size={24} />
              </div>
              <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            </Link>
          )
        })}
      </section>

      {/* Recent Messages Section */}
      <section className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Recent Messages</h2>
          <Link href="/dashboard/messages" className="text-sm text-primary hover:underline">
            View All
          </Link>
        </div>
        <div className="space-y-3">
          {messages.slice(0, 3).map((message) => (
            <div
              key={message.id}
              className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition"
            >
              <div className="flex-1 min-w-0">
                <p className={`font-medium ${message.isRead ? 'text-muted-foreground' : 'text-foreground font-bold'}`}>
                  {message.name}
                </p>
                <p className="text-sm text-muted-foreground truncate">{message.subject}</p>
              </div>
              {!message.isRead && <div className="w-2 h-2 bg-accent rounded-full ml-2" />}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
