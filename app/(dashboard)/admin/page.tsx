'use client'

import { BookOpen, Heart, Users, Calendar, TrendingUp, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { useState,useEffect, use } from 'react'

export default function AdminDashboard() {

  const [sermons, setSermons] = useState<any[]>([])
  const [quotes, setQuotes] = useState<any[]>([])
  const [devotionals, setDevotionals] = useState<any[]>([])
  const [testimonies, setTestimonies] = useState<any[]>([])
  const [articles, setArticles] = useState<any[]>([])
  const [events, setEvents] = useState<any[]>([])

  const { data: sermonData } = useQuery<any[]>({
    queryKey: ['sermons', 'all'],
  })
  const { data: quoteData } = useQuery<any[]>({
    queryKey: ['quotes', 'all'],
  })
  const { data: devotionalsData } = useQuery<any[]>({
    queryKey: ['devotionals', 'all'],
  })
  const { data: testimonyData } = useQuery<any[]>({
    queryKey: ['testimony', 'all'],
  })

  useEffect(() => { 
  if (sermonData) {
     setSermons(sermonData)
  }
  if (quoteData) {
     setQuotes(quoteData)
  }
  if (devotionalsData) {
     setDevotionals(devotionalsData)
  }
  if (testimonyData) {
     setTestimonies(testimonyData)
  }

}, [sermonData, quoteData, devotionalsData, testimonyData])


  const stats = [
    { label: 'Sermons', count: sermons.length, icon: BookOpen, color: 'text-blue-600' },
    { label: 'Quotes', count: quotes.length, icon: MessageSquare, color: 'text-green-600' },
    { label: 'Devotionals', count: devotionals.length, icon: Calendar, color: 'text-purple-600' },
    { label: 'Testimonies', count: testimonies.length, icon: Heart, color: 'text-red-600' },
    // { label: 'Articles', count: articles.length, icon: Users, color: 'text-orange-600' },
    // { label: 'Events', count: events.length, icon: TrendingUp, color: 'text-teal-600' },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-serif font-bold text-primary mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the admin dashboard. Manage your content and community here.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.count}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon className={`${stat.color}`} size={24} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Items */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Recent Content</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Latest Sermon</p>
              <p className="text-foreground font-medium">
                {sermons.length > 0 ? sermons[sermons.length - 1].title : 'No sermons yet'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Latest Testimony</p>
              <p className="text-foreground font-medium">
                {testimonies.length > 0 ? testimonies[testimonies.length - 1].name : 'No testimonies yet'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Latest Event</p>
              <p className="text-foreground font-medium">
                {events.length > 0 ? events[events.length - 1].title : 'No events yet'}
              </p>
            </div>
          </div>
        </div>

        {/* Management Links */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Quick Management</h2>
          <div className="space-y-3">
            <Link
              href="/admin/resources"
              className="block px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-medium"
            >
              Manage Resources
            </Link>
            <Link
              href="/admin/testimonies"
              className="block px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-medium"
            >
              Manage Testimonies
            </Link>
            {/* <Link
              href="/admin/empowerment"
              className="block px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-medium"
            >
              Manage Empowerment
            </Link>
            <Link
              href="/admin/settings"
              className="block px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-medium"
            >
              System Settings
            </Link> */}
          </div>
        </div>
      </div>
    </div>
  )
}
