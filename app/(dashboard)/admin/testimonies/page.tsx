'use client'

import { useState } from 'react'
import { useAdmin } from '@/lib/admin-context'
import { Trash2, Plus, Edit2 } from 'lucide-react'
import { Testimony } from '@/lib/mock-data'

export default function TestimoniesManager() {
  const { testimonies, addTestimony, updateTestimony, deleteTestimony } = useAdmin()
  const [editing, setEditing] = useState<Testimony | null>(null)

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-primary">Manage Testimonies</h1>
        <button
          onClick={() => setEditing({ id: Date.now().toString(), name: '', title: '', content: '' })}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-all flex items-center gap-2"
        >
          <Plus size={18} /> Add Testimony
        </button>
      </div>

      {editing && (
        <div className="bg-card rounded-lg border border-border p-6 mb-8">
          <h2 className="text-lg font-bold text-foreground mb-4">{editing.id.length > 10 ? 'Edit Testimony' : 'New Testimony'}</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              placeholder="Title"
              value={editing.title}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <textarea
              placeholder="Content"
              value={editing.content}
              onChange={(e) => setEditing({ ...editing, content: e.target.value })}
              rows={6}
              className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (testimonies.some((t) => t.id === editing.id)) {
                    updateTestimony(editing.id, editing)
                  } else {
                    addTestimony(editing)
                  }
                  setEditing(null)
                }}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-all"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-card transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {testimonies.map((testimony) => (
          <div
            key={testimony.id}
            className="bg-card rounded-lg border border-border p-6 flex justify-between items-start hover:shadow-lg transition-shadow"
          >
            <div className="flex-1">
              <h3 className="font-bold text-foreground mb-1">{testimony.title}</h3>
              <p className="text-sm text-primary font-semibold mb-2">{testimony.name}</p>
              <p className="text-sm text-muted-foreground">{testimony.content.substring(0, 100)}...</p>
            </div>
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => setEditing(testimony)}
                className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-primary"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => deleteTestimony(testimony.id)}
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
}
