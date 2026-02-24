'use client'

import React, { createContext, useContext, useState } from 'react'
import {
  Sermon,
  Quote,
  Devotional,
  Testimony,
  Article,
  Event,
  sermons as initialSermons,
  quotes as initialQuotes,
  devotionals as initialDevotionals,
  testimonies as initialTestimonies,
  empowermentArticles as initialArticles,
  events as initialEvents,
} from './mock-data'

interface AdminContextType {
  sermons: Sermon[]
  quotes: Quote[]
  devotionals: Devotional[]
  testimonies: Testimony[]
  articles: Article[]
  events: Event[]
  addSermon: (sermon: Sermon) => void
  updateSermon: (id: string, sermon: Partial<Sermon>) => void
  deleteSermon: (id: string) => void
  addQuote: (quote: Quote) => void
  updateQuote: (id: string, quote: Partial<Quote>) => void
  deleteQuote: (id: string) => void
  addDevotional: (devotional: Devotional) => void
  updateDevotional: (id: string, devotional: Partial<Devotional>) => void
  deleteDevotional: (id: string) => void
  addTestimony: (testimony: Testimony) => void
  updateTestimony: (id: string, testimony: Partial<Testimony>) => void
  deleteTestimony: (id: string) => void
  addArticle: (article: Article) => void
  updateArticle: (id: string, article: Partial<Article>) => void
  deleteArticle: (id: string) => void
  addEvent: (event: Event) => void
  updateEvent: (id: string, event: Partial<Event>) => void
  deleteEvent: (id: string) => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [sermons, setSermons] = useState<Sermon[]>(initialSermons)
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes)
  const [devotionals, setDevotionals] = useState<Devotional[]>(initialDevotionals)
  const [testimonies, setTestimonies] = useState<Testimony[]>(initialTestimonies)
  const [articles, setArticles] = useState<Article[]>(initialArticles)
  const [events, setEvents] = useState<Event[]>(initialEvents)

  const addSermon = (sermon: Sermon) => setSermons([...sermons, sermon])
  const updateSermon = (id: string, updates: Partial<Sermon>) =>
    setSermons(sermons.map((s) => (s.id === id ? { ...s, ...updates } : s)))
  const deleteSermon = (id: string) => setSermons(sermons.filter((s) => s.id !== id))

  const addQuote = (quote: Quote) => setQuotes([...quotes, quote])
  const updateQuote = (id: string, updates: Partial<Quote>) =>
    setQuotes(quotes.map((q) => (q.id === id ? { ...q, ...updates } : q)))
  const deleteQuote = (id: string) => setQuotes(quotes.filter((q) => q.id !== id))

  const addDevotional = (devotional: Devotional) => setDevotionals([...devotionals, devotional])
  const updateDevotional = (id: string, updates: Partial<Devotional>) =>
    setDevotionals(devotionals.map((d) => (d.id === id ? { ...d, ...updates } : d)))
  const deleteDevotional = (id: string) => setDevotionals(devotionals.filter((d) => d.id !== id))

  const addTestimony = (testimony: Testimony) => setTestimonies([...testimonies, testimony])
  const updateTestimony = (id: string, updates: Partial<Testimony>) =>
    setTestimonies(testimonies.map((t) => (t.id === id ? { ...t, ...updates } : t)))
  const deleteTestimony = (id: string) => setTestimonies(testimonies.filter((t) => t.id !== id))

  const addArticle = (article: Article) => setArticles([...articles, article])
  const updateArticle = (id: string, updates: Partial<Article>) =>
    setArticles(articles.map((a) => (a.id === id ? { ...a, ...updates } : a)))
  const deleteArticle = (id: string) => setArticles(articles.filter((a) => a.id !== id))

  const addEvent = (event: Event) => setEvents([...events, event])
  const updateEvent = (id: string, updates: Partial<Event>) =>
    setEvents(events.map((e) => (e.id === id ? { ...e, ...updates } : e)))
  const deleteEvent = (id: string) => setEvents(events.filter((e) => e.id !== id))

  return (
    <AdminContext.Provider
      value={{
        sermons,
        quotes,
        devotionals,
        testimonies,
        articles,
        events,
        addSermon,
        updateSermon,
        deleteSermon,
        addQuote,
        updateQuote,
        deleteQuote,
        addDevotional,
        updateDevotional,
        deleteDevotional,
        addTestimony,
        updateTestimony,
        deleteTestimony,
        addArticle,
        updateArticle,
        deleteArticle,
        addEvent,
        updateEvent,
        deleteEvent,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider')
  }
  return context
}
