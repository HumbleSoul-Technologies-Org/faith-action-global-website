'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import Tabs from '@/components/tabs'
import Link from 'next/link'
import { empowermentArticles, events } from '@/lib/mock-data'
import { formatDate } from '@/lib/date-utils'
import { SkeletonGrid } from '@/components/skeleton-card'
import { BookOpen, Calendar, ArrowRight, MapPin, Clock } from 'lucide-react'

export default function EmpowermentPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])
  const articlesContent = (
    <div className="space-y-6">
      <p className="text-muted-foreground mb-6">
        Discover articles and resources designed to empower women in their spiritual journey, leadership, and personal growth.
      </p>
      {isLoading ? (
        <SkeletonGrid count={2} />
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {empowermentArticles.map((article) => (
          <div
            key={article.id}
            className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow group"
          >
            {/* Image */}
            {article.image && (
              <div className="overflow-hidden h-96">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-fill group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full">
                  {article.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{article.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                by {article.author} • {formatDate(article.date)}
              </p>
              <p className="text-sm text-foreground text-justify leading-relaxed mb-4 line-clamp-2">{article.content}</p>
              <Link href={`/empowerment/articles/${article.id}`} className="inline-flex items-center gap-2 text-primary hover:gap-4 transition-all font-medium text-sm">
                Read More <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  )

  const eventsContent = (
    <div className="space-y-6">
      <p className="text-muted-foreground mb-6">
        Join us for inspiring events, conferences, and gatherings that bring our community together.
      </p>
      {isLoading ? (
        <SkeletonGrid count={2} />
      ) : (
      <div className="space-y-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="flex flex-col md:flex-row">
              {/* Image */}
              {event.image && (
                <div className="md:w-80 h-64 md:h-auto overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{event.title}</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar size={18} className="text-primary" />
                      <span>{formatDate(event.date)} </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock size={18} className="text-primary" />
                      <span> {event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin size={18} className="text-primary" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <p className="text-foreground leading-relaxed mb-4 line-clamp-2">{event.description}</p>
                </div>
                <span className='w-full text-right'><Link href={`/empowerment/events/${event.id}`} className="inline-flex items-center gap-2 text-primary hover:gap-4 transition-all font-medium">
                  Learn More <ArrowRight size={16} />
                </Link></span>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  )

  const tabs = [
    { id: 'events', label: 'Events', content: eventsContent },
    { id: 'articles', label: 'Articles', content: articlesContent },

  ]

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        {/* Page Header */}
        <section className="bg-linear-to-b from-primary/10 to-transparent py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
              Christian Empowerment
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Discover resources, articles, and events designed to empower and inspire christians in their faith, leadership, and life journey.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4">
            <Tabs tabs={tabs} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
