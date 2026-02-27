'use client'

import { useState, useEffect } from 'react'
import { useAdmin } from '@/lib/admin-context'
import Tabs from '@/components/tabs'
import { formatDate } from '@/lib/date-utils'
import { Trash2, Plus, Edit2, MoreVertical, Eye, Heart, Share2 } from 'lucide-react'
import { Article, Event } from '@/lib/mock-data'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function EmpowermentManager() {
  const { articles, events, addArticle, updateArticle, deleteArticle, addEvent, updateEvent, deleteEvent } = useAdmin()
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)

  const [hoveredArticle, setHoveredArticle] = useState<string | null>(null)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [viewArticle, setViewArticle] = useState<Article | null>(null)
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null)
  const [openEventMenu, setOpenEventMenu] = useState<string | null>(null)
  const [viewEvent, setViewEvent] = useState<Event | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  // create and cleanup preview URL for uploaded image
  useEffect(() => {
    if (!selectedImage) return
    const url = URL.createObjectURL(selectedImage)
    setImagePreview(url)
    return () => URL.revokeObjectURL(url)
  }, [selectedImage])

  // when opening an edit/create dialog, reset selectedImage and set preview to existing image URL
  useEffect(() => {
    if (editingArticle) {
      setSelectedImage(null)
      setImagePreview(editingArticle.image || '')
    }
  }, [editingArticle])

  useEffect(() => {
    if (editingEvent) {
      setSelectedImage(null)
      setImagePreview(editingEvent.image || '')
    }
  }, [editingEvent])

  const articlesContent = (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div />
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

      <Dialog open={!!editingArticle} onOpenChange={(open) => !open && setEditingArticle(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-background z-10 pb-4">
            <DialogTitle>{editingArticle ? (editingArticle.id.length > 10 ? 'Edit Article' : 'New Article') : ''}</DialogTitle>
          </DialogHeader>

          {editingArticle && (
            <form className="space-y-4 p-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Image URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={editingArticle.image || ''}
                  onChange={(e) => setEditingArticle({ ...editingArticle, image: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="mt-3 flex items-center gap-3">
                  <label className="flex items-center justify-center gap-2 px-3 py-2 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/20 transition text-sm">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setSelectedImage(file)
                          const url = URL.createObjectURL(file)
                          setImagePreview(url)
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  {imagePreview && (
                    <img src={imagePreview} alt="preview" className="h-20 rounded-md object-cover" />
                  )}
                </div>
              </div>
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
                className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none h-40"
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
                  type="button"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-all"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingArticle(null)}
                  type="button"
                  className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-card transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div
            key={article.id}
            className="relative h-96 rounded-lg overflow-hidden shadow-sm"
            onMouseEnter={() => {
              setHoveredArticle(article.id)
              // when opening form clear previous selected image
              setSelectedImage(null)
              setImagePreview(article.image || '')
            }}
            onMouseLeave={() => {
              setHoveredArticle(null)
              setOpenMenu(null)
            }}
          >
            <div
              className="absolute inset-0 bg-center bg-cover"
              style={{ backgroundImage: `url(${article.image  || '/placeholder.jpg'})` }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-linear-to-b from-black/80 to-transparent p-4 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">{article.title}</h3>
                  <p className="text-white/90 text-sm">by {article.author} • {formatDate(article.date)}</p>
                </div>

                {/* 3-dot menu */}
                <div className="relative">
                  <button
                    onClick={() => setOpenMenu(openMenu === article.id ? null : article.id)}
                    className="p-2 rounded-md text-white hover:bg-white/10"
                  >
                    <MoreVertical size={18} />
                  </button>
                  {openMenu === article.id && (
                    <div className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-lg z-50">
                      <button
                        onClick={() => {
                          setViewArticle(article)
                          setOpenMenu(null)
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-muted transition-colors text-sm text-foreground border-b border-border"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => {
                          setEditingArticle(article)
                          setOpenMenu(null)
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-muted transition-colors text-sm text-foreground border-b border-border"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          deleteArticle(article.id)
                          setOpenMenu(null)
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-destructive/10 transition-colors text-sm text-destructive"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 text-white text-sm">
                {article.views !== undefined && (
                  <span className="flex items-center gap-1">
                    <Eye size={14} /> {article.views}
                  </span>
                )}
                {article.likes !== undefined && (
                  <span className="flex items-center gap-1">
                    <Heart size={14} /> {article.likes}
                  </span>
                )}
                {(article as any).shares !== undefined && (
                  <span className="flex items-center gap-1">
                    <Share2 size={14} /> {(article as any).shares}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Article Details Dialog */}
      <Dialog open={!!viewArticle} onOpenChange={(open) => !open && setViewArticle(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
          

          {viewArticle && (
            <div className="space-y-6 px-6 pb-6">
              {viewArticle.image && (
                <img src={viewArticle.image} alt={viewArticle.title} className="w-full h-64 object-cover rounded-lg" />
              )}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">{viewArticle.title}</h2>
                <p className="text-sm text-muted-foreground">by {viewArticle.author} • {formatDate(viewArticle.date)}</p>
                <div className="flex gap-6 text-sm text-muted-foreground mt-4">
                  {viewArticle.views !== undefined && <span className="flex items-center gap-2"><Eye size={16} /> {viewArticle.views} views</span>}
                  {viewArticle.likes !== undefined && <span className="flex items-center gap-2"><Heart size={16} /> {viewArticle.likes} likes</span>}
                  {(viewArticle as any).shares !== undefined && <span className="flex items-center gap-2"><Share2 size={16} /> {(viewArticle as any).shares} shares</span>}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Article</h3>
                <p className="text-foreground text-justify leading-relaxed whitespace-pre-wrap">{viewArticle.content}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
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

      <Dialog open={!!editingEvent} onOpenChange={(open) => !open && setEditingEvent(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="sticky top-0 bg-background z-10 pb-4">
            <DialogTitle>{editingEvent ? (editingEvent.id.length > 10 ? 'Edit Event' : 'New Event') : ''}</DialogTitle>
          </DialogHeader>

          {editingEvent && (
            <form className="space-y-4 p-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Image URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={editingEvent.image || ''}
                  onChange={(e) => setEditingEvent({ ...editingEvent, image: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="mt-3 flex items-center gap-3">
                  <label className="flex items-center justify-center gap-2 px-3 py-2 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/20 transition text-sm">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setSelectedImage(file)
                          const url = URL.createObjectURL(file)
                          setImagePreview(url)
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                  {imagePreview && (
                    <img src={imagePreview} alt="preview" className="h-20 rounded-md object-cover" />
                  )}
                </div>
              </div>
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 6.5244"
                    value={editingEvent.latitude ?? ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, latitude: e.target.value ? parseFloat(e.target.value) : undefined })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g. 3.3792"
                    value={editingEvent.longitude ?? ''}
                    onChange={(e) => setEditingEvent({ ...editingEvent, longitude: e.target.value ? parseFloat(e.target.value) : undefined })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <textarea
                placeholder="Description"
                value={editingEvent.description}
                onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none h-40"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const payload = { ...editingEvent }
                    if (editingEvent.latitude !== undefined && editingEvent.longitude !== undefined) {
                      payload.location = `${editingEvent.latitude}, ${editingEvent.longitude}`
                    }
                    if (events.some((e) => e.id === editingEvent.id)) {
                      updateEvent(editingEvent.id, payload as Event)
                    } else {
                      addEvent(payload as Event)
                    }
                    setEditingEvent(null)
                  }}
                  type="button"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-all"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingEvent(null)}
                  type="button"
                  className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-card transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="relative h-96 rounded-lg overflow-hidden shadow-sm"
            onMouseEnter={() => {
              setHoveredEvent(event.id)
              setSelectedImage(null)
              setImagePreview(event.image || '')
            }}
            onMouseLeave={() => {
              setHoveredEvent(null)
              setOpenEventMenu(null)
            }}
          >
            <div
              className="absolute inset-0 bg-center bg-cover"
              style={{ backgroundImage: `url(${event.image || '/placeholder.jpg'})` }}
            />

            <div className="absolute inset-0 bg-linear-to-b from-black/80 to-transparent p-4 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">{event.title}</h3>
                  <p className="text-white/90 text-sm">{formatDate(event.date)} at {event.time}</p>
                  <p className="text-white/80 text-sm">{event.location}</p>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setOpenEventMenu(openEventMenu === event.id ? null : event.id)}
                    className="p-2 rounded-md text-white hover:bg-white/10"
                  >
                    <MoreVertical size={18} />
                  </button>
                  {openEventMenu === event.id && (
                    <div className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-lg z-50">
                      <button
                        onClick={() => {
                          setViewEvent(event)
                          setOpenEventMenu(null)
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-muted transition-colors text-sm text-foreground border-b border-border"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => {
                          setEditingEvent(event)
                          setOpenEventMenu(null)
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-muted transition-colors text-sm text-foreground border-b border-border"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          deleteEvent(event.id)
                          setOpenEventMenu(null)
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-destructive/10 transition-colors text-sm text-destructive"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 text-white text-sm">
                {event.views !== undefined && (
                  <span className="flex items-center gap-1">
                    <Eye size={14} /> {event.views}
                  </span>
                )}
                {event.likes !== undefined && (
                  <span className="flex items-center gap-1">
                    <Heart size={14} /> {event.likes}
                  </span>
                )}
                {(event as any).shares !== undefined && (
                  <span className="flex items-center gap-1">
                    <Share2 size={14} /> {(event as any).shares}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Event Details Dialog */}
      <Dialog open={!!viewEvent} onOpenChange={(open) => !open && setViewEvent(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
          

          {viewEvent && (
            <div className="space-y-6 px-6 pb-6">
              {viewEvent.image && (
                <img src={viewEvent.image} alt={viewEvent.title} className="w-full h-64 object-cover rounded-lg" />
              )}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">{viewEvent.title}</h2>
                <p className="text-sm text-muted-foreground">{formatDate(viewEvent.date)} at {viewEvent.time} • {viewEvent.location}</p>
                <div className="flex gap-6 text-sm text-muted-foreground mt-4">
                  {viewEvent.views !== undefined && <span className="flex items-center gap-2"><Eye size={16} /> {viewEvent.views} views</span>}
                  {viewEvent.likes !== undefined && <span className="flex items-center gap-2"><Heart size={16} /> {viewEvent.likes} likes</span>}
                  {(viewEvent as any).shares !== undefined && <span className="flex items-center gap-2"><Share2 size={16} /> {(viewEvent as any).shares} shares</span>}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Event Details</h3>
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">{viewEvent.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
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
