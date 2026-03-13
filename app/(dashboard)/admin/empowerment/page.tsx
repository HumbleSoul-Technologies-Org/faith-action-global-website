'use client'

import { useState, useEffect } from 'react'
import { useAdmin } from '@/lib/admin-context'
import Tabs from '@/components/tabs'
import { formatDate } from '@/lib/date-utils'
import { Trash2, Plus, Edit2, MoreVertical, Eye, Heart, Share2 } from 'lucide-react'
import { Article, Event } from '@/lib/mock-data'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { log } from 'console'

export default function EmpowermentManager() {
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)

  // separate form state for creating/editing an event
  const [evTitle, setEvTitle] = useState('')
  const [evDate, setEvDate] = useState('')
  const [evTime, setEvTime] = useState('')
  const [evLatitude, setEvLatitude] = useState<number | undefined>(undefined)
  const [evLongitude, setEvLongitude] = useState<number | undefined>(undefined)
  const [evDescription, setEvDescription] = useState('')
  const [evImageUrl, setEvImageUrl] = useState('')

  // separate form state for creating/editing an article
  const [artTitle, setArtTitle] = useState('')
  const [artAuthor, setArtAuthor] = useState('')
  const [artCategory, setArtCategory] = useState('')
  const [artContent, setArtContent] = useState('')
  const [artImageUrl, setArtImageUrl] = useState('')

  const [hoveredArticle, setHoveredArticle] = useState<string | null>(null)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [viewArticle, setViewArticle] = useState<Article | null>(null)
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null)
  const [openEventMenu, setOpenEventMenu] = useState<string | null>(null)
  const [viewEvent, setViewEvent] = useState<Event | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [events, setEvents] = useState<any[]>([])
  const [articles, setArticles] = useState<any[]>([])

  // populate form fields when editing an article
  useEffect(() => {
    if (editingArticle) {
      setArtTitle(editingArticle.title)
      setArtAuthor(editingArticle.author)
      setArtCategory(editingArticle.category)
      setArtContent(editingArticle.content)
      setArtImageUrl(editingArticle.image || '')
      setImagePreview(editingArticle.image || '')
      setSelectedImage(null)
    } else {
      // clear form when closing dialog
      setArtTitle('')
      setArtAuthor('')
      setArtCategory('')
      setArtContent('')
      setArtImageUrl('')
      setImagePreview('')
      setSelectedImage(null)
    }
  }, [editingArticle])

  // populate form fields when editing an event
  useEffect(() => {
    if (editingEvent) {
      setEvTitle(editingEvent.title)
      setEvDate(editingEvent.date)
      setEvTime(editingEvent.time)
      setEvLatitude(editingEvent.latitude)
      setEvLongitude(editingEvent.longitude)
      setEvDescription(editingEvent.description)
      setEvImageUrl(editingEvent.image?.url || '')
      setImagePreview(editingEvent.image?.url || '')
      setSelectedImage(null)
    } else {
      // clear form when closing dialog
      setEvTitle('')
      setEvDate('')
      setEvTime('')
      setEvLatitude(undefined)
      setEvLongitude(undefined)
      setEvDescription('')
      setEvImageUrl('')
      setImagePreview('')
      setSelectedImage(null)
    }
  }, [editingEvent])

  // upload the selected image directly to Cloudinary from the front end
  const uploadFileToCloudinary = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'gospel-assets');

      const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        return { url: data.secure_url, public_id: data.public_id };
      } else {
        console.error('Upload failed:', data);
        return { url: "", public_id: "" };
      }
    } catch (error) {
      console.error('Upload error:', error);
      return { url: "", public_id: "" };
    }
  };

  // submit a new article
  const submitNewArticle = async () => {
    try {
      const id = Date.now().toString()
      const payload: any = {
        id,
        title: artTitle,
        author: artAuthor,
        category: artCategory,
        content: artContent,
        date: new Date().toISOString().split('T')[0],
      }

      // handle image upload for new article
      if (selectedImage instanceof File) {
        const imageResp = await uploadFileToCloudinary(selectedImage);
        if (imageResp?.url) {
          payload.image = imageResp.url
        }
      } else if (artImageUrl) {
        payload.image = artImageUrl
      }

      // addArticle(payload)

      // reset form
      setEditingArticle(null)
      setSelectedImage(null)
      setImagePreview('')
      setArtTitle('')
      setArtAuthor('')
      setArtCategory('')
      setArtContent('')
      setArtImageUrl('')
    } catch (error) {
      console.error('submitNewArticle error:', error)
    }
  }

  // submit an updated article
  const submitUpdatedArticle = async () => {
    if (!editingArticle) return

    try {
      const payload: any = {
        id: editingArticle.id,
        title: artTitle,
        author: artAuthor,
        category: artCategory,
        content: artContent,
        date: editingArticle.date,
      }

      // handle image update
      if (selectedImage instanceof File) {
        // upload new image
        const imageResp = await uploadFileToCloudinary(selectedImage);
        if (imageResp?.url) {
          payload.image = imageResp.url
        }
      } else if (artImageUrl && artImageUrl !== editingArticle.image) {
        // use manually entered URL if different from current
        payload.image = artImageUrl
      } else if (editingArticle.image) {
        // keep existing image
        payload.image = editingArticle.image
      }

      // updateArticle(editingArticle.id, payload)

      // reset form
      setEditingArticle(null)
      setSelectedImage(null)
      setImagePreview('')
      setArtTitle('')
      setArtAuthor('')
      setArtCategory('')
      setArtContent('')
      setArtImageUrl('')
    } catch (error) {
      console.error('submitUpdatedArticle error:', error)
    }
  }

  // wrapper function to handle both new and existing articles
  const submitArticle = () => {
    if (editingArticle && articles.some((a) => a.id === editingArticle.id)) {
      submitUpdatedArticle()
    } else {
      submitNewArticle()
    }
  }

  // submit a new event
  const submitNewEvent = async () => {
    try {
      const id = Date.now().toString()
      const payload: any = {
        id,
        title: evTitle,
        date: evDate,
        time: evTime,
        description: evDescription,
        latitude: evLatitude,
        longitude: evLongitude,
        location:
          evLatitude != null && evLongitude != null && isFinite(evLatitude) && isFinite(evLongitude)
            ? `${evLatitude}, ${evLongitude}`
            : '',
      }

      // handle image upload for new event
      if (selectedImage instanceof File) {
        const imageResp = await uploadFileToCloudinary(selectedImage);
         console.log('====================================');
         console.log('Image upload response:', imageResp);
         console.log('====================================');
      }  

      // addEvent(payload)

      // reset form
      setEditingEvent(null)
      setSelectedImage(null)
      setImagePreview('')
      setEvTitle('')
      setEvDate('')
      setEvTime('')
      setEvLatitude(undefined)
      setEvLongitude(undefined)
      setEvDescription('')
      setEvImageUrl('')
    } catch (error) {
      console.error('submitNewEvent error:', error)
    }
  }

  // submit an updated event
  const submitUpdatedEvent = async () => {
    if (!editingEvent) return

    try {
      const payload: any = {
        id: editingEvent.id,
        title: evTitle,
        date: evDate,
        time: evTime,
        description: evDescription,
        latitude: evLatitude,
        longitude: evLongitude,
        location:
          evLatitude != null && evLongitude != null && isFinite(evLatitude) && isFinite(evLongitude)
            ? `${evLatitude}, ${evLongitude}`
            : '',
      }

      // handle image update
      if (selectedImage instanceof File) {
        // upload new image
        const imageResp = await uploadFileToCloudinary(selectedImage);
        if (imageResp?.url) {
          payload.image = imageResp
        }
      } else if (evImageUrl && evImageUrl !== editingEvent.image?.url) {
        // use manually entered URL if different from current
        payload.image = { url: evImageUrl, public_id: '' }
      } else if (editingEvent.image) {
        // keep existing image
        payload.image = editingEvent.image
      }

      // updateEvent(editingEvent.id, payload)

      // reset form
      setEditingEvent(null)
      setSelectedImage(null)
      setImagePreview('')
      setEvTitle('')
      setEvDate('')
      setEvTime('')
      setEvLatitude(undefined)
      setEvLongitude(undefined)
      setEvDescription('')
      setEvImageUrl('')
    } catch (error) {
      console.error('submitUpdatedEvent error:', error)
    }
  }

  // wrapper function to handle both new and existing events
  const submitEvent = () => {
    if (editingEvent && events.some((e) => e.id === editingEvent.id)) {
      submitUpdatedEvent()
    } else {
      submitNewEvent()
    }
  }

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
                  value={artImageUrl}
                  onChange={(e) => setArtImageUrl(e.target.value)}
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
                value={artTitle}
                onChange={(e) => setArtTitle(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="Author"
                value={artAuthor}
                onChange={(e) => setArtAuthor(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                placeholder="Category"
                value={artCategory}
                onChange={(e) => setArtCategory(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <textarea
                placeholder="Content"
                value={artContent}
                onChange={(e) => setArtContent(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none h-40"
              />

              <div className="flex gap-3">
                <button
                  onClick={submitArticle}
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
                          // deleteArticle(article.id)
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
              image: { url: '', public_id: '' },
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
                  value={evImageUrl}
                  onChange={(e) => setEvImageUrl(e.target.value)}
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
                value={evTitle}
                onChange={(e) => setEvTitle(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="date"
                value={evDate}
                onChange={(e) => setEvDate(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="time"
                value={evTime}
                onChange={(e) => setEvTime(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Latitude</label>
                  <input
                    type="text"
                    placeholder="e.g. 6.5244"
                    value={evLatitude != null && !isNaN(evLatitude) ? evLatitude : ''}
                    onChange={(e) => {
                      const num = parseFloat(e.target.value)
                      setEvLatitude(!isNaN(num) ? num : undefined)
                    }}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Longitude</label>
                  <input
                    type="text"
                    placeholder="e.g. 3.3792"
                    value={evLongitude != null && !isNaN(evLongitude) ? evLongitude : ''}
                    onChange={(e) => {
                      const num = parseFloat(e.target.value)
                      setEvLongitude(!isNaN(num) ? num : undefined)
                    }}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <textarea
                placeholder="Description"
                value={evDescription}
                onChange={(e) => setEvDescription(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none h-40"
              />

              <div className="flex gap-3">
                <Button
                  onClick={submitEvent}
                   
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-all"
                >
                  Save
                </Button>
                <Button 
                  onClick={() => setEditingEvent(null)}
                  
                  className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-card transition-all"
                >
                  Cancel
                </Button>
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
              setImagePreview(event.image?.url || '')
            }}
            onMouseLeave={() => {
              setHoveredEvent(null)
              setOpenEventMenu(null)
            }}
          >
            <div
              className="absolute inset-0 bg-center bg-cover"
              style={{ backgroundImage: `url(${event.image?.url || '/placeholder.jpg'})` }}
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
                <img src={viewEvent.image?.url} alt={viewEvent.title} className="w-full h-64 object-cover rounded-lg" />
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
