'use client'

import { useState, useEffect, use } from 'react'
import { useAdmin } from '@/lib/admin-context'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Trash2, Plus, Edit2, Heart, Music, Play, Upload, X, Eye, Share2, MoreVertical, ChurchIcon } from 'lucide-react'
import { Testimony } from '@/lib/mock-data'
import dynamic from 'next/dynamic'
import { uploadToCloudinary } from '@/lib/api'
import { apiRequest } from '@/lib/query-client'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { set } from 'react-hook-form'
import test from 'node:test'

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false })

export default function TestimoniesManager() {
  // const {   addTestimony, updateTestimony, deleteTestimony } = useAdmin()
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState<'all' | 'video' | 'audio' >('all')
  const [editing, setEditing] = useState<Testimony | null>(null)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [viewDetails, setViewDetails] = useState<Testimony | null>(null)
  const [testimonies, setTestimonies] = useState<Testimony[] | any[]>([])
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    content: '',
    category: '',
    videoId: '',
    videoUrl: {url: '', public_id: ''},
    audioUrl: {url: '', public_id: ''},
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null)
  const [selectedAudio, setSelectedAudio] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [selectedTestimony, setSelectedTestimony] = useState<any | null>(null)

  const [videoProgress, setVideoProgress] = useState(0)
  const [audioProgress, setAudioProgress] = useState(0)
  const [imageProgress, setImageProgress] = useState(0)
  const [filePreviews, setFilePreviews] = useState({
    imagePreview: '',
    videoPreview: '',
    audioPreview: '',
  })

  const { data: fetchedTestimonies, refetch } = useQuery<any[]>({
    queryKey: ['testimony','all'],
     
  })

  useEffect(() => { 
    if (fetchedTestimonies) {
     setTestimonies(fetchedTestimonies)
    }
  }, [fetchedTestimonies])

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
    video: testimonies.filter((t) => t.videoUrl?.url || t.videoId).length,
    audio: testimonies.filter((t) => t.audioUrl?.url).length,
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video' | 'audio') => {
    const file = e.target.files?.[0]
    const reader = new FileReader();
    reader.onload = () => {
     
      setSelectedImage(file as File) // Store the file for uploading;
      
    };

    if (file) {
      if (type === 'image') {
        setSelectedImage(file)
      } else if (type === 'video') {
        setSelectedVideo(file)
        const url = URL.createObjectURL(file)
        setFilePreviews((prev) => ({ ...prev, videoPreview: url }))
      } else if (type === 'audio') {
        setSelectedAudio(file)
        const url = URL.createObjectURL(file)
        setFilePreviews((prev) => ({ ...prev, audioPreview: url }))
      }
    }
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    setUploadError(null)
    setVideoProgress(0)
    setAudioProgress(0)
    setImageProgress(0)

    

     

    try {
      // build form data copy, we'll set image separately
      const updatedForm = { ...formData }

      // determine final image URL
      let finalImageUrl: string | undefined

      if (selectedImage) {
        // new file selected, upload it
        try {
          const imgResp = await uploadToCloudinary(selectedImage, 'auto', setImageProgress)
          finalImageUrl = imgResp.url
        } catch (err) {
          setUploadError('Failed to upload image. Please try again.')
          setIsUploading(false)
          return
        }
      } else if (editing?.image) {
        // keep existing URL when editing
        finalImageUrl = editing.image as unknown as string
      } else if (filePreviews.imagePreview) {
        finalImageUrl = filePreviews.imagePreview
      }

      if (finalImageUrl) {
        ;(updatedForm as any).image = finalImageUrl
      }

      // Upload video
      if (selectedVideo) {
        try {
          const videoResp = await uploadToCloudinary(selectedVideo, 'video', setVideoProgress)
          ;(updatedForm as any).videoUrl = { url: videoResp.url, public_id: videoResp.publicId }
        } catch (err) {
          setUploadError('Failed to upload video. Please try again.')
          setIsUploading(false)
          return
        }
      }

      // Upload audio
      if (selectedAudio) {
        try {
          const audioResp = await uploadToCloudinary(selectedAudio, 'auto', setAudioProgress)
          ;(updatedForm as any).audioUrl = { url: audioResp.url, public_id: audioResp.publicId }
        } catch (err) {
          setUploadError('Failed to upload audio. Please try again.')
          setIsUploading(false)
          return
        }
      }

      let imageData = null

      if (selectedImage) {
        imageData = await uploadFileToServer(selectedImage)
      } else {
        imageData = { url: selectedTestimony.image?.url , public_id: selectedTestimony.image?.public_id }
      }
      
      
      
      const newTestimony: any = {
        ...updatedForm,
        image: imageData || {url: '', public_id: ''},
      }

       

      if (editing && testimonies.some((t) => t._id === editing._id)) {
        await apiRequest('PUT', `/testimony/update/${editing._id}`, newTestimony)
        setTestimonies((prev) => prev.map((t) => (t._id === editing._id ? { ...t, ...newTestimony } : t)))

      } else {
        await apiRequest('POST', '/testimony/create', newTestimony)
        setTestimonies((prev) => [newTestimony, ...prev])  
        
      }

      resetForm()
      setShowForm(false)
    } catch (error) {
      console.error('Error submitting testimony:', error)
      setUploadError('An unexpected error occurred. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      title: '',
      content: '',
      category: '',
      videoId: '',
      videoUrl: {url: '', public_id: ''},
      audioUrl: {url: '', public_id: ''},
    })
    setSelectedImage(null)
    setSelectedVideo(null)
    setSelectedAudio(null)
    setEditing(null)
    setFilePreviews({ imagePreview: '', videoPreview: '', audioPreview: '' })
    setVideoProgress(0)
    setAudioProgress(0)
    setImageProgress(0)
    setUploadError(null)
    setIsUploading(false)
  }

  const openEditForm = (testimony: any) => {
    setFormData({
      name: testimony.name,
      title: testimony.title,
      content: testimony.description,
      category: testimony.category || '',
      videoId: testimony.videoId || '',
      videoUrl: testimony.videoUrl || {url: '', public_id: ''},
      audioUrl: testimony.audioUrl || {url: '', public_id: ''},
    })
    if (testimony.image) {
      setFilePreviews((prev) => ({ ...prev, imagePreview: testimony?.image?.url || '' }))
    }
    setEditing(testimony)
    setShowForm(true)
  }

  // upload the selected image to the server
  const uploadFileToServer = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/testimony/upload/image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return data;
    } catch (error) {
      console.error(error);
      return { url: "", public_id: "" };
    }
  };

  const deleteTestimony = async (testimony: any) => { 
    try {
      await apiRequest('DELETE', `/testimony/delete/${testimony}`)
      setTestimonies((prev) => prev.filter((t) => t._id !== testimony))
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
    }
  }

  return (
    <main>
      <div className="py-8 md:py-12 bg-linear-to-b from-background to-muted/20">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2">Manage Testimonies</h1>
          <p className="text-muted-foreground text-lg">Review and manage testimonies from your community.</p>
        </div>
      </div>

      {testimonies.length > 0 &&<section className="py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Filter Buttons */}
          <div className="flex w-full flex-wrap gap-3 mb-8">
            {[
              { label: 'All', value: 'all' as const, count: counts.all },
              { label: 'Videos', value: 'video' as const, count: counts.video },
              { label: 'Audio', value: 'audio' as const, count: counts.audio },
               
            ].map((btn) => (
              <button
                key={btn.value}
                onClick={() => setFilter(btn.value)}
                className={`px-6 py-2 rounded-full cursor-pointer font-medium transition-all ${
                  filter === btn.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                {btn.label} <span className="text-sm opacity-75">({btn.count})</span>
              </button>
            ))}

            <span className="mx-1 flex-1 text-muted-foreground">|</span>
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
      </section>}

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
                    value={formData.videoUrl.url}
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

                {isUploading && selectedVideo && videoProgress > 0 && (
                  <div className="space-y-2 mt-2">
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-medium text-foreground">Video upload</p>
                      <p className="text-xs font-medium text-foreground">{videoProgress}%</p>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all duration-200" style={{ width: `${videoProgress}%` }} />
                    </div>
                  </div>
                )}
                </div>
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
                    value={formData.audioUrl.url}
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

                {isUploading && selectedAudio && audioProgress > 0 && (
                  <div className="space-y-2 mt-2">
                    <div className="flex justify-between items-center">
                      <p className="text-xs font-medium text-foreground">Audio upload</p>
                      <p className="text-xs font-medium text-foreground">{audioProgress}%</p>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all duration-200" style={{ width: `${audioProgress}%` }} />
                    </div>
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
                {isUploading ? 'Uploading...' : (editing ? 'Update Testimony' : 'Submit Testimony')}
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
      {testimonies.length > 0 ? (
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
              {filteredTestimonies.map((testimony:any,i:number) => (
                <div
                  key={i}
                  className="relative h-96 bg-muted rounded-lg border border-border overflow-hidden group"
                  onMouseEnter={() => setHoveredCard(testimony._id)}
                  onMouseLeave={() => {
                    setHoveredCard(null)
                    setOpenMenu(null)
                  }}
                >
                  {/* Image */}
                  {testimony.image && (
                    <img
                      src={testimony.image.url || '/no-image.jpg'}
                      alt={testimony.name}
                      className="w-full h-full object-fill"
                    />
                  )}

                  {/* Hover Overlay */}
                  {hoveredCard === testimony._id && (
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
                            onClick={() => setOpenMenu(openMenu === testimony._id ? null : testimony._id)}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors text-green-500"
                          >
                            <MoreVertical size={18} />
                          </button>

                          {/* Dropdown Menu */}
                          {openMenu === testimony._id && (
                            <div className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-lg z-50">
                              <button
                                onClick={() => {
                                  setViewDetails(testimony)
                                  setOpenMenu(null)
                                }}
                                className="w-full px-4 py-2 text-left hover:bg-muted rounded-md transition-colors text-sm text-foreground border-b border-border"
                              >
                                View Details
                              </button>
                              <button
                                onClick={() => {
                                  openEditForm(testimony)
                                  setOpenMenu(null)
                                  setSelectedTestimony(testimony)
                                }}
                                className="w-full px-4 py-2 text-left hover:bg-muted rounded-md transition-colors text-sm text-foreground border-b border-border"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  deleteTestimony(testimony._id)
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
                            <Eye size={14} /> {testimony.views?.length || 0}
                          </span>
                        )}
                        {testimony.likes !== undefined && (
                          <span className="flex items-center gap-1">
                            <Heart size={14} /> {testimony.likes?.length || 0}
                          </span>
                        )}
                        {testimony.shares !== undefined && (
                          <span className="flex items-center gap-1">
                            <Share2 size={14} /> {testimony.shares?.length || 0}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Media Badges */}
                  {!hoveredCard && <div className="absolute top-3 right-3 flex gap-2">
                      
                      {!!testimony.audioUrl?.url && (
                        <div className="bg-secondary text-foreground p-2 rounded-full">
                          <Music size={16} />
                        </div>
                      )}
                      {(!!testimony?.videoUrl?.url  || (!!testimony?.videoId && testimony.videoId !== "")) && (
                        <div className="bg-accent text-white p-2 rounded-full">
                          <Play size={16} fill="white" />
                        </div>
                      )}
                    </div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>) : (
          <div className="text-center py-20">
            <span className='flex items-center w-full justify-center gap-3'>
               
              <ChurchIcon size={48} className="text-muted-foreground  " />
            </span>
            <p className="text-muted-foreground">No Testimonies  found. Click "Add Testimony" to create your first one!</p>
            <span className='flex items-center mt-10 w-full justify-center gap-3'>
                 <button
              onClick={() => {
                resetForm()
                setShowForm(true)
              }}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-all flex items-center gap-2 font-medium"
            >
              <Plus size={18} /> Add Testimony
            </button>
            </span>
            
            
             
        </div>
      )}

      {/* View Details Dialog */}
      <Dialog open={!!viewDetails} onOpenChange={(open) => !open && setViewDetails(null)}>
        <DialogContent className="max-h-[90vh]  overflow-y-auto max-w-2xl">
          

          {viewDetails && (
            <div className="space-y-6 px-6 pb-6">
              {/* Image */}
              {viewDetails.image && (
                <img
                  src={viewDetails.image?.url || '/no-image.jpg'}
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
                    <Eye size={16} /> {viewDetails.views?.length} views
                  </span>
                )}
                {viewDetails.likes !== undefined && (
                  <span className="flex items-center gap-2">
                    <Heart size={16} /> {viewDetails.likes?.length} likes
                  </span>
                )}
                {viewDetails.shares !== undefined && (
                  <span className="flex items-center gap-2">
                    <Share2 size={16} /> {viewDetails.shares?.length} shares
                  </span>
                )}
              </div>

              {/* Video Player */}
              {(viewDetails.videoUrl?.url || viewDetails.videoId) && (
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
                        url={viewDetails.videoUrl?.url}
                        controls
                        width="100%"
                        height="auto"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Audio Player */}
              {viewDetails.audioUrl?.url && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">Audio</h3>
                  <audio
                    src={viewDetails.audioUrl?.url}
                    controls
                    className="w-full"
                  />
                </div>
              )}

              <h2 className="text-xl font-bold text-foreground mt-6">Testimony Transcript Text</h2>
                <p className=" text-justify mt-3 text-muted-foreground text-sm mb-2">{viewDetails?.description}</p>


              {/* Content */}
              {/* <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Testimony</h3>
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {viewDetails.description}
                </p>
              </div> */}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}
