'use client'

import { useState, useEffect } from 'react'
import { useAdmin } from '@/lib/admin-context'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Trash2, Plus, Edit2, Heart, Music, Play, Upload, X, Eye, Share2, MoreVertical } from 'lucide-react'
import { Testimony } from '@/lib/mock-data'
import dynamic from 'next/dynamic'

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false })

export default function TestimoniesManager() {
  const { testimonies, addTestimony, updateTestimony, deleteTestimony } = useAdmin()
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState<'all' | 'video' | 'audio' >('all')
  const [editing, setEditing] = useState<Testimony | null>(null)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [viewDetails, setViewDetails] = useState<Testimony | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    content: '',
    category: '',
    videoId: '',
    videoUrl: '',
    audioUrl: '',
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [filePreviews, setFilePreviews] = useState({
    imagePreview: '',
    videoPreview: '',
    audioPreview: '',
  })

  // Create preview URLs
  useEffect(() => {
    if (selectedImage) {
      const url = URL.createObjectURL(selectedImage)
      setFilePreviews((prev) => ({ ...prev, imagePreview: url }))
      return () => URL.revokeObjectURL(url)
    } else {
      setFilePreviews((prev) => ({ ...prev, imagePreview: '' }))
    }
  }, [selectedImage])

  // Filter testimonies by category
  const filteredTestimonies = testimonies.filter((testimony) => {
    if (filter === 'video') return testimony.videoUrl || testimony.videoId
    if (filter === 'audio') return testimony.audioUrl
    
    return true
  })

  // Count by category
  const counts = {
    all: testimonies.length,
    video: testimonies.filter((t) => t.videoUrl || t.videoId).length,
    audio: testimonies.filter((t) => t.audioUrl).length,
    article: testimonies.filter((t) => !t.videoUrl && !t.audioUrl && !t.videoId).length,
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'audio') => {
    const file = e.target.files?.[0]
    if (file) {
      if (type === 'image') {
        setSelectedImage(file)
      } else if (type === 'video') {
        const url = URL.createObjectURL(file)
        setFilePreviews((prev) => ({ ...prev, videoPreview: url }))
      } else if (type === 'audio') {
        const url = URL.createObjectURL(file)
        setFilePreviews((prev) => ({ ...prev, audioPreview: url }))
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newTestimony: Testimony = {
      id: editing?.id || Date.now().toString(),
      ...formData,
      image: filePreviews.imagePreview || editing?.image || '',
      views: editing?.views || 0,
      likes: editing?.likes || 0,
      shares: editing?.shares || 0,
      reactions: editing?.reactions || {},
    }

    if (editing && testimonies.some((t) => t.id === editing.id)) {
      updateTestimony(editing.id, newTestimony)
    } else {
      addTestimony(newTestimony)
    }

    resetForm()
    setShowForm(false)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      title: '',
      content: '',
      category: '',
      videoId: '',
      videoUrl: '',
      audioUrl: '',
    })
    setSelectedImage(null)
    setEditing(null)
    setFilePreviews({ imagePreview: '', videoPreview: '', audioPreview: '' })
  }

  const openEditForm = (testimony: Testimony) => {
    setFormData({
      name: testimony.name,
      title: testimony.title,
      content: testimony.content,
      category: testimony.category || '',
      videoId: testimony.videoId || '',
      videoUrl: testimony.videoUrl || '',
      audioUrl: testimony.audioUrl || '',
    })
    if (testimony.image) {
      setFilePreviews((prev) => ({ ...prev, imagePreview: testimony.image || '' }))
    }
    setEditing(testimony)
    setShowForm(true)
  }

  return (
    <main>
      <div className="py-8 md:py-12 bg-linear-to-b from-background to-muted/20">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2">Manage Testimonies</h1>
          <p className="text-muted-foreground text-lg">Review and manage testimonies from your community.</p>
        </div>
      </div>

      <section className="py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3 mb-8">
            {[
              { label: 'All', value: 'all' as const, count: counts.all },
              { label: 'Videos', value: 'video' as const, count: counts.video },
              { label: 'Audio', value: 'audio' as const, count: counts.audio },
               
            ].map((btn) => (
              <button
                key={btn.value}
                onClick={() => setFilter(btn.value)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  filter === btn.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                {btn.label} <span className="text-sm opacity-75">({btn.count})</span>
              </button>
            ))}
          </div>

          {/* Add Testimony Button */}
          <div className="mb-8">
            <button
              onClick={() => {
                resetForm()
                setShowForm(true)
              }}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-all flex items-center gap-2 font-medium"
            >
              <Plus size={18} /> Add Testimony
            </button>
          </div>
        </div>
      </section>

      {/* Form Modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-h-[90vh] overflow-y-auto max-w-2xl">
          <DialogHeader className="  bg-background   pb-4">
            <DialogTitle>{editing ? 'Edit Testimony' : 'Add New Testimony'}</DialogTitle>
            
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 px-6 pb-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Testifier's name"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                placeholder="Testimony title"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                placeholder="e.g., Healing, Salvation, Miracle"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Content</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleFormChange}
                placeholder="Full testimony content"
                rows={5}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Image</label>
              <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/20 transition">
                <Upload size={18} className="text-primary" />
                <span className="text-sm">Choose image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'image')}
                  className="hidden"
                />
              </label>
              {filePreviews.imagePreview && (
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                  <img
                    src={filePreviews.imagePreview}
                    alt="Preview"
                    className="max-w-full h-32 rounded-lg object-cover"
                  />
                </div>
              )}
            </div>

            {/* YouTube Video ID */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">YouTube Video ID</label>
              <input
                type="text"
                name="videoId"
                value={formData.videoId}
                onChange={handleFormChange}
                placeholder="e.g., dQw4w9WgXcQ"
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Video URL */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Video URL</label>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Upload Video File</label>
                  <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/20 transition">
                    <Upload size={18} className="text-primary" />
                    <span className="text-sm">Choose video file</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleFileChange(e, 'video')}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="relative">
                  <span className="text-xs text-muted-foreground">Or paste video URL</span>
                  <input
                    type="url"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleFormChange}
                    placeholder="https://example.com/video.mp4"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>
                {filePreviews.videoPreview && (
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                    <video src={filePreviews.videoPreview} controls className="max-w-full h-32 rounded-lg object-cover" />
                  </div>
                )}
              </div>
            </div>

            {/* Audio URL */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Audio URL</label>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Upload Audio File</label>
                  <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/20 transition">
                    <Upload size={18} className="text-primary" />
                    <span className="text-sm">Choose audio file</span>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => handleFileChange(e, 'audio')}
                      className="hidden"
                    />
                  </label>
                </div>
                <div className="relative">
                  <span className="text-xs text-muted-foreground">Or paste audio URL</span>
                  <input
                    type="url"
                    name="audioUrl"
                    value={formData.audioUrl}
                    onChange={handleFormChange}
                    placeholder="https://example.com/audio.mp3"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>
                {filePreviews.audioPreview && (
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                    <audio src={filePreviews.audioPreview} controls className="w-full" />
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-6">
              <button
                type="submit"
                className="flex-1 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-all font-medium"
              >
                {editing ? 'Update Testimony' : 'Submit Testimony'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-6 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-all font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Testimonies Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          {filteredTestimonies.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">
                No testimonies found in this category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredTestimonies.map((testimony) => (
                <div
                  key={testimony.id}
                  className="relative h-96 bg-muted rounded-lg border border-border overflow-hidden group"
                  onMouseEnter={() => setHoveredCard(testimony.id)}
                  onMouseLeave={() => {
                    setHoveredCard(null)
                    setOpenMenu(null)
                  }}
                >
                  {/* Image */}
                  {testimony.image && (
                    <img
                      src={testimony.image}
                      alt={testimony.name}
                      className="w-full h-full object-fill"
                    />
                  )}

                  {/* Hover Overlay */}
                  {hoveredCard === testimony.id && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col justify-between p-4">
                      {/* Top Section with Menu */}
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-white font-bold text-lg mb-1">{testimony.title}</h3>
                          <p className="text-white/90 text-sm mb-2">{testimony.name}</p>
                          {testimony.category && (
                            <p className="text-xs bg-primary text-white px-2 py-1 rounded-full w-fit">
                              {testimony.category}
                            </p>
                          )}
                        </div>

                        {/* 3-Dot Menu */}
                        <div className="relative">
                          <button
                            onClick={() => setOpenMenu(openMenu === testimony.id ? null : testimony.id)}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
                          >
                            <MoreVertical size={18} />
                          </button>

                          {/* Dropdown Menu */}
                          {openMenu === testimony.id && (
                            <div className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-lg z-50">
                              <button
                                onClick={() => {
                                  setViewDetails(testimony)
                                  setOpenMenu(null)
                                }}
                                className="w-full px-4 py-2 text-left hover:bg-muted transition-colors text-sm text-foreground border-b border-border"
                              >
                                View Details
                              </button>
                              <button
                                onClick={() => {
                                  openEditForm(testimony)
                                  setOpenMenu(null)
                                }}
                                className="w-full px-4 py-2 text-left hover:bg-muted transition-colors text-sm text-foreground border-b border-border"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  deleteTestimony(testimony.id)
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

                      {/* Bottom Section with Metrics */}
                      <div className="flex gap-4 text-white text-sm">
                        {testimony.views !== undefined && (
                          <span className="flex items-center gap-1">
                            <Eye size={14} /> {testimony.views}
                          </span>
                        )}
                        {testimony.likes !== undefined && (
                          <span className="flex items-center gap-1">
                            <Heart size={14} /> {testimony.likes}
                          </span>
                        )}
                        {testimony.shares !== undefined && (
                          <span className="flex items-center gap-1">
                            <Share2 size={14} /> {testimony.shares}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Media Badges */}
                  {!hoveredCard && (
                    <div className="absolute top-3 right-3 flex gap-2">
                      {(testimony?.videoUrl || testimony?.videoId) && (
                        <div className="bg-accent text-white p-2 rounded-full">
                          <Play size={16} fill="white" />
                        </div>
                      )}
                      {testimony.audioUrl && (
                        <div className="bg-secondary text-foreground p-2 rounded-full">
                          <Music size={16} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* View Details Dialog */}
      <Dialog open={!!viewDetails} onOpenChange={(open) => !open && setViewDetails(null)}>
        <DialogContent className="max-h-[90vh]  overflow-y-auto max-w-2xl">
          

          {viewDetails && (
            <div className="space-y-6 px-6 pb-6">
              {/* Image */}
              {viewDetails.image && (
                <img
                  src={viewDetails.image}
                  alt={viewDetails.name}
                  className="w-full h-96 object-fill rounded-lg"
                />
              )}

              {/* Title and Name */}
              <div className='mt-5'>
                <h2 className="text-2xl font-bold text-foreground mb-2">{viewDetails.title}</h2>
                <p className="text-lg text-primary font-semibold mb-2">{viewDetails.name}</p>
                {viewDetails.category && (
                  <p className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full w-fit">
                    {viewDetails.category}
                  </p>
                )}
              </div>

              {/* Engagement Metrics */}
              <div className="flex gap-6 text-sm text-muted-foreground border-y border-border py-4">
                {viewDetails.views !== undefined && (
                  <span className="flex items-center gap-2">
                    <Eye size={16} /> {viewDetails.views} views
                  </span>
                )}
                {viewDetails.likes !== undefined && (
                  <span className="flex items-center gap-2">
                    <Heart size={16} /> {viewDetails.likes} likes
                  </span>
                )}
                {viewDetails.shares !== undefined && (
                  <span className="flex items-center gap-2">
                    <Share2 size={16} /> {viewDetails.shares} shares
                  </span>
                )}
              </div>

              {/* Video Player */}
              {(viewDetails.videoUrl || viewDetails.videoId) && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">Video</h3>
                  {viewDetails.videoId ? (
                    <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${viewDetails.videoId}`}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="w-full rounded-lg overflow-hidden bg-black">
                      <ReactPlayer
                        url={viewDetails.videoUrl}
                        controls
                        width="100%"
                        height="auto"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Audio Player */}
              {viewDetails.audioUrl && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">Audio</h3>
                  <audio
                    src={viewDetails.audioUrl}
                    controls
                    className="w-full"
                  />
                </div>
              )}

              {/* Content */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Testimony</h3>
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {viewDetails.content}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}
