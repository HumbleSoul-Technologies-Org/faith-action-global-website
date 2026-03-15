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
  
  articles: Article[]
  events: Event[]
   
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
        
       
         
        articles,
        events,
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
