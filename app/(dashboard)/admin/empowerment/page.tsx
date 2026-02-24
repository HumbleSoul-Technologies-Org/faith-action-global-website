'use client'

import { useState } from 'react'
import { useAdmin } from '@/lib/admin-context'
import Tabs from '@/components/tabs'
import { formatDate } from '@/lib/date-utils'
import { Trash2, Plus, Edit2 } from 'lucide-react'
import { Article, Event } from '@/lib/mock-data'

export default function EmpowermentManager() {
  const { articles, events, addArticle, updateArticle, deleteArticle, addEvent, updateEvent, deleteEvent } = useAdmin()
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)

  const articlesContent = (
    <div>
      <div className="mb-6">
        <button
          onClick={() =>
            setEditingArticle({
              id: Date.now().toString(),
              title: '',
              author: '',
              date: new Date().toISOString().split('T')[0],
              category: '',
              content: '',
            })
          }
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-all flex items-center gap-2"
        >
          <Plus size={18} /> Add Article
        </button>
      </div>

      {editingArticle && (
        <div className="bg-card rounded-lg border border-border p-6 mb-6">
          <h3 className="text-lg font-bold text-foreground mb-4">
            {editingArticle.id.length > 10 ? 'Edit Article' : 'New Article'}
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={editingArticle.title}
              onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              placeholder="Author"
              value={editingArticle.author}
              onChange={(e) => setEditingArticle({ ...editingArticle, author: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              placeholder="Category"
              value={editingArticle.category}
              onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <textarea
              placeholder="Content"
              value={editingArticle.content}
              onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none h-20"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (articles.some((a) => a.id === editingArticle.id)) {
                    updateArticle(editingArticle.id, editingArticle)
                  } else {
                    addArticle(editingArticle)
                  }
                  setEditingArticle(null)
                }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-all"
              >
                Save
              </button>
              <button
                onClick={() => setEditingArticle(null)}
                className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-card transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {articles.map((article) => (
          <div key={article.id} className="bg-card rounded-lg border border-border p-6 flex justify-between items-start">
            <div>
              <h3 className="font-bold text-foreground mb-1">{article.title}</h3>
              <p className="text-sm text-muted-foreground">
                by {article.author} • {article.category}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingArticle(article)}
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-primary"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => deleteArticle(article.id)}
                className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const eventsContent = (
    <div>
      <div className="mb-6">
        <button
          onClick={() =>
            setEditingEvent({
              id: Date.now().toString(),
              title: '',
              date: new Date().toISOString().split('T')[0],
              time: '',
              location: '',
              description: '',
            })
          }
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-all flex items-center gap-2"
        >
          <Plus size={18} /> Add Event
        </button>
      </div>

      {editingEvent && (
        <div className="bg-card rounded-lg border border-border p-6 mb-6">
          <h3 className="text-lg font-bold text-foreground mb-4">
            {editingEvent.id.length > 10 ? 'Edit Event' : 'New Event'}
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={editingEvent.title}
              onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="date"
              value={editingEvent.date}
              onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="time"
              value={editingEvent.time}
              onChange={(e) => setEditingEvent({ ...editingEvent, time: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              placeholder="Location"
              value={editingEvent.location}
              onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <textarea
              placeholder="Description"
              value={editingEvent.description}
              onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none h-20"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (events.some((e) => e.id === editingEvent.id)) {
                    updateEvent(editingEvent.id, editingEvent)
                  } else {
                    addEvent(editingEvent)
                  }
                  setEditingEvent(null)
                }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-all"
              >
                Save
              </button>
              <button
                onClick={() => setEditingEvent(null)}
                className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-card transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="bg-card rounded-lg border border-border p-6 flex justify-between items-start">
            <div>
              <h3 className="font-bold text-foreground mb-1">{event.title}</h3>
              <p className="text-sm text-muted-foreground">
                {formatDate(event.date)} at {event.time} • {event.location}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingEvent(event)}
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-primary"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => deleteEvent(event.id)}
                className="p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const tabs = [
    { id: 'articles', label: 'Articles', content: articlesContent },
    { id: 'events', label: 'Events', content: eventsContent },
  ]

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-primary mb-8">Manage Empowerment</h1>
      <div className="bg-card rounded-lg border border-border p-6">
        <Tabs tabs={tabs} />
      </div>
    </div>
  )
}
