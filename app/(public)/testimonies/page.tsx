
'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import Link from 'next/link'
import { SkeletonGrid } from '@/components/skeleton-card'
import { Heart, Play, Music, ArrowRight, X, Upload, Eye, Share2,Facebook, Twitter, Instagram, LucideYoutube, } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { testimonies } from '@/lib/mock-data'

type FilterType = 'all' | 'video' | 'audio' | 'article'

interface TestimonyForm {
  name: string
  title: string
  content: string
  image: string
  videoId: string
  videoUrl: string
  audioUrl: string
  category: string
}

interface FilePreviewsState {
  imagePreview: string | null
  videoPreview: string | null
  audioPreview: string | null
}

export default function TestimoniesPage() {
  
  const [filter, setFilter] = useState<FilterType>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [testimonies, setTestimonies] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<TestimonyForm>({
    name: '',
    title: '',
    content: '',
    image: '',
    videoId: '',
    videoUrl: '',
    audioUrl: '',
    category: '',
  })
  const [filePreviews, setFilePreviews] = useState<FilePreviewsState>({
    imagePreview: null,
    videoPreview: null,
    audioPreview: null,
  })

  const { data: testimonyData } = useQuery<any[]>({
    queryKey: ['testimony', 'all'],
  })

  useEffect(() => {
    if (testimonyData && testimonyData.length > 0) {
      setTestimonies(testimonyData)
    } else {
      // Fallback to mock data
      setTestimonies(testimonies)
    }

    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [testimonyData])

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'audio') => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        if (type === 'image') {
          setFilePreviews((prev) => ({ ...prev, imagePreview: result }))
        } else if (type === 'video') {
          setFilePreviews((prev) => ({ ...prev, videoPreview: result }))
        } else if (type === 'audio') {
          setFilePreviews((prev) => ({ ...prev, audioPreview: result }))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to a backend
    console.log('Testimony submitted:', formData)
    alert('Thank you for sharing your testimony! We will review it shortly.')
    setFormData({
      name: '',
      title: '',
      content: '',
      image: '',
      videoId: '',
      videoUrl: '',
      audioUrl: '',
      category: '',
    })
    setFilePreviews({
      imagePreview: null,
      videoPreview: null,
      audioPreview: null,
    })
    setShowForm(false)
  }

  const filteredTestimonies = testimonies.filter((testimony) => {
    const hasVideo = testimony.videoUrl && (typeof testimony.videoUrl === 'object' ? testimony.videoUrl.url : testimony.videoUrl)
    const hasVideoId = hasVideo || testimony.videoId  
    const hasAudio = testimony.audioUrl && (typeof testimony.audioUrl === 'object' ? testimony.audioUrl.url : testimony.audioUrl)
    
    if (filter === 'all') return true
    if (filter === 'video') return hasVideoId  
    if (filter === 'audio') return hasAudio
    return true
  })

  const filterOptions: { label: string; value: FilterType; count: number }[] = [
    {
      label: 'All Testimonies',
      value: 'all',
      count: testimonies.length,
    },
    {
      label: 'Videos',
      value: 'video',
      count: testimonies.filter((t) => {
        const hasVideoId = t.videoId
        const hasVideoUrl = t.videoUrl && (typeof t.videoUrl === 'object' ? t.videoUrl.url : t.videoUrl)
        return hasVideoId || hasVideoUrl
      }).length,
    },
    {
      label: 'Audio',
      value: 'audio',
      count: testimonies.filter((t) => {
        const hasAudio = t.audioUrl && (typeof t.audioUrl === 'object' ? t.audioUrl.url : t.audioUrl)
        return hasAudio
      }).length,
    },
    
  ]

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        {/* Page Header */}
        <section className="bg-linear-to-b from-primary/10 to-transparent py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
            Testimonies
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Read inspiring stories from community members whose lives have been transformed through faith, prayer, and service.
            </p>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-8 md:py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
              <div className="flex flex-wrap gap-3 items-center">
                {/* <span className="text-sm font-semibold text-muted-foreground">Filter by:</span> */}
                <div className="flex flex-wrap gap-2">
                  {filterOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setFilter(option.value)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        filter === option.value
                          ? 'bg-primary text-primary-foreground shadow-lg'
                          : 'bg-muted text-foreground hover:bg-muted/80'
                      }`}
                    >
                      {option.label}
                      <span className="ml-2 text-xs opacity-70">({option.count})</span>
                    </button>
                  ))}
                </div>
              </div>

               
            </div>
          </div>
        </section>

        {/* Testimony Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-lg border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-background">
                <h2 className="text-2xl font-bold text-foreground">Share Your Testimony</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="Your full name"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    placeholder="A short title for your testimony"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Content *</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleFormChange}
                    placeholder="Share your testimony story..."
                    rows={5}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select a category</option>
                    <option value="Spiritual Renewal">Spiritual Renewal</option>
                    <option value="Life Change">Life Change</option>
                    <option value="Purpose & Mission">Purpose & Mission</option>
                    <option value="Healing">Healing</option>
                    <option value="Family">Family</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Image</label>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-2 block">Upload Image</label>
                      <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/20 transition">
                        <Upload size={18} className="text-primary" />
                        <span className="text-sm">Choose image file</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'image')}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <div className="relative">
                      <span className="text-xs text-muted-foreground">Or paste image URL</span>
                      <input
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleFormChange}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      />
                    </div>
                    {(filePreviews.imagePreview || (formData.image && formData.image.startsWith('http'))) && (
                      <div className="mt-3">
                        <p className="text-xs text-muted-foreground mb-2">Preview:</p>
                        <img
                          src={filePreviews.imagePreview || formData.image}
                          alt="Preview"
                          className="max-w-full h-32 rounded-lg object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

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

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Video URL (Alternative)</label>
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
                        <video
                          src={filePreviews.videoPreview}
                          controls
                          className="max-w-full h-32 rounded-lg object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

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
                        <audio
                          src={filePreviews.audioPreview}
                          controls
                          className="w-full"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-6">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-all font-medium"
                  >
                    Submit Testimony
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
            </div>
          </div>
        )}

        {/* Testimonies Grid */}
        <section className="py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4">
            {isLoading ? (
              <SkeletonGrid count={3} />
            ) : filteredTestimonies.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground">
                  No testimonies found for this category. Try another filter.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredTestimonies.map((testimony,i) => (
                <Link
                  key={i}
                  href={`/testimonies/${testimony._id}`}
                  className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-xl transition-all hover:scale-105"
                >
                  {/* Image */}
                  {testimony.image && (
                    <div className="relative h-52 overflow-hidden bg-muted">
                      <img
                        src={testimony.image?.url|| '/no-image.jpg'}
                        alt={testimony.name}
                        className="w-full h-full object-cover"
                      />
                      {/* Media Badges */}
                      <div className="absolute top-3 right-3 flex gap-2">
                        {((typeof testimony.videoUrl === 'object' ? testimony.videoUrl?.url : testimony.videoUrl) || testimony.videoId) && (
                          <div className="bg-accent text-white p-2 rounded-full">
                            <Play size={16} fill="white" />
                          </div>
                        )}
                        {(typeof testimony.audioUrl === 'object' ? testimony.audioUrl?.url : testimony.audioUrl) && (
                          <div className="bg-secondary text-foreground p-2 rounded-full">
                            <Music size={16} />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-foreground mb-1">{testimony.title}</h3>
                        <p className="text-sm text-muted-foreground">{testimony.name}</p>
                      </div>
                      <Heart className="text-primary  shrink-0 mt-1" size={18} />
                    </div>
                    {testimony.category && (
                      <p className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full mb-3 inline-block">
                        {testimony.category}
                      </p>
                    )}
                    <p className="text-sm text-foreground leading-relaxed mb-4 line-clamp-3">
                      {testimony.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex gap-3 text-xs text-muted-foreground">
                        {testimony.likes !== undefined && (
                          <span className="flex items-center gap-1">
                            <Heart size={14} /> {testimony.likes?.length}
                          </span>
                        )}
                        {testimony.views !== undefined && (
                          <span className="flex items-center gap-1">
                            <Eye size={14} /> {testimony.views?.length}
                          </span>
                        )}
                        {testimony.shares !== undefined && (
                          <span className="flex items-center gap-1">
                            <Share2 size={14} /> {testimony.shares?.length}
                          </span>
                        )}
                      </div>
                      <ArrowRight size={16} className="text-primary group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
              )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-card border-y border-border">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
              Share Your Story
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Do you have a testimony? We'd love to hear how God is working in your life. Share your story with our community.
            </p>
            {/* <button onClick={() => setShowForm(true)} className="px-8 py-3 bg-primary text-primary-foreground rounded-md hover:bg-opacity-90 transition-all font-medium">
              Submit Your Testimony
            </button> */}
             <div className="flex items-center justify-center gap-4">
              {[
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: LucideYoutube, href: '#', label: 'YouTube' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 cursor-pointer mnbv tbxsfdsdQ  ` rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-80 transition-opacity"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
