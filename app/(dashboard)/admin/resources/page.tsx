'use client'

import { useState } from 'react'
import { useAdmin } from '@/lib/admin-context'
import Tabs from '@/components/tabs'
import { Trash2, Plus, Edit2 } from 'lucide-react'
import { Sermon, Quote, Devotional } from '@/lib/mock-data'

export default function ResourcesManager() {
  const { sermons, quotes, devotionals, addSermon, updateSermon, deleteSermon, addQuote, updateQuote, deleteQuote, addDevotional, updateDevotional, deleteDevotional } = useAdmin()
  const [editingSermon, setEditingSermon] = useState<Sermon | null>(null)
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null)
  const [editingDevotional, setEditingDevotional] = useState<Devotional | null>(null)

  const sermonsContent = (
    <div>
      <div className="mb-6">
        <button
          onClick={() => setEditingSermon({ id: Date.now().toString(), title: '', speaker: '', date: '', duration: '', description: '', passage: '' })}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-all flex items-center gap-2"
        >
          <Plus size={18} /> Add Sermon
        </button>
      </div>

      {editingSermon && (
        <div className="bg-card rounded-lg border border-border p-6 mb-6">
          <h3 className="text-lg font-bold text-foreground mb-4">{editingSermon.id.length > 10 ? 'Edit Sermon' : 'New Sermon'}</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={editingSermon.title}
              onChange={(e) => setEditingSermon({ ...editingSermon, title: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              placeholder="Speaker"
              value={editingSermon.speaker}
              onChange={(e) => setEditingSermon({ ...editingSermon, speaker: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <textarea
              placeholder="Description"
              value={editingSermon.description}
              onChange={(e) => setEditingSermon({ ...editingSermon, description: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none h-20"
            />
            <input
              type="text"
              placeholder="Bible Passage"
              value={editingSermon.passage}
              onChange={(e) => setEditingSermon({ ...editingSermon, passage: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (sermons.some((s) => s.id === editingSermon.id)) {
                    updateSermon(editingSermon.id, editingSermon)
                  } else {
                    addSermon(editingSermon)
                  }
                  setEditingSermon(null)
                }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-all"
              >
                Save
              </button>
              <button
                onClick={() => setEditingSermon(null)}
                className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-card transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {sermons.map((sermon) => (
          <div key={sermon.id} className="bg-card rounded-lg border border-border p-6 flex justify-between items-start">
            <div>
              <h3 className="font-bold text-foreground mb-1">{sermon.title}</h3>
              <p className="text-sm text-muted-foreground">by {sermon.speaker} • {sermon.passage}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingSermon(sermon)}
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-primary"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => deleteSermon(sermon.id)}
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

  const quotesContent = (
    <div>
      <div className="mb-6">
        <button
          onClick={() => setEditingQuote({ id: Date.now().toString(), text: '', author: '', passage: '' })}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-all flex items-center gap-2"
        >
          <Plus size={18} /> Add Quote
        </button>
      </div>

      {editingQuote && (
        <div className="bg-card rounded-lg border border-border p-6 mb-6">
          <h3 className="text-lg font-bold text-foreground mb-4">{editingQuote.id.length > 10 ? 'Edit Quote' : 'New Quote'}</h3>
          <div className="space-y-4">
            <textarea
              placeholder="Quote text"
              value={editingQuote.text}
              onChange={(e) => setEditingQuote({ ...editingQuote, text: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none h-20"
            />
            <input
              type="text"
              placeholder="Bible Passage"
              value={editingQuote.passage}
              onChange={(e) => setEditingQuote({ ...editingQuote, passage: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (quotes.some((q) => q.id === editingQuote.id)) {
                    updateQuote(editingQuote.id, editingQuote)
                  } else {
                    addQuote(editingQuote)
                  }
                  setEditingQuote(null)
                }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-all"
              >
                Save
              </button>
              <button
                onClick={() => setEditingQuote(null)}
                className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-card transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {quotes.map((quote) => (
          <div key={quote.id} className="bg-card rounded-lg border border-border p-6 flex justify-between items-start">
            <div>
              <p className="text-foreground mb-2 italic">"{quote.text.substring(0, 60)}..."</p>
              <p className="text-sm text-muted-foreground">{quote.passage}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingQuote(quote)}
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-primary"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => deleteQuote(quote.id)}
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

  const devotionalsContent = (
    <div>
      <div className="mb-6">
        <button
          onClick={() => setEditingDevotional({ id: Date.now().toString(), title: '', date: '', scripture: '', reflection: '', prayer: '' })}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-all flex items-center gap-2"
        >
          <Plus size={18} /> Add Devotional
        </button>
      </div>

      {editingDevotional && (
        <div className="bg-card rounded-lg border border-border p-6 mb-6">
          <h3 className="text-lg font-bold text-foreground mb-4">{editingDevotional.id.length > 10 ? 'Edit Devotional' : 'New Devotional'}</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={editingDevotional.title}
              onChange={(e) => setEditingDevotional({ ...editingDevotional, title: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              placeholder="Scripture Reference"
              value={editingDevotional.scripture}
              onChange={(e) => setEditingDevotional({ ...editingDevotional, scripture: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <textarea
              placeholder="Reflection"
              value={editingDevotional.reflection}
              onChange={(e) => setEditingDevotional({ ...editingDevotional, reflection: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none h-20"
            />
            <textarea
              placeholder="Prayer"
              value={editingDevotional.prayer}
              onChange={(e) => setEditingDevotional({ ...editingDevotional, prayer: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none h-20"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (devotionals.some((d) => d.id === editingDevotional.id)) {
                    updateDevotional(editingDevotional.id, editingDevotional)
                  } else {
                    addDevotional(editingDevotional)
                  }
                  setEditingDevotional(null)
                }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-all"
              >
                Save
              </button>
              <button
                onClick={() => setEditingDevotional(null)}
                className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-card transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {devotionals.map((devotional) => (
          <div key={devotional.id} className="bg-card rounded-lg border border-border p-6 flex justify-between items-start">
            <div>
              <h3 className="font-bold text-foreground mb-1">{devotional.title}</h3>
              <p className="text-sm text-muted-foreground">{devotional.scripture}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingDevotional(devotional)}
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-primary"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => deleteDevotional(devotional.id)}
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
    { id: 'sermons', label: 'Sermons', content: sermonsContent },
    { id: 'quotes', label: 'Gospel Quotes', content: quotesContent },
    { id: 'devotionals', label: 'Devotionals', content: devotionalsContent },
  ]

  return (
    <div>
      <h1 className="text-3xl font-serif font-bold text-primary mb-8">Manage Resources</h1>
      <div className="bg-card rounded-lg border border-border p-6">
        <Tabs tabs={tabs} />
      </div>
    </div>
  )
}
