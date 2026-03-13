"use client"

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Tabs from '@/components/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Trash2, Plus, Edit2, Play, Music, MoreVertical, Eye, Heart, Share2, Loader, File, PlaySquareIcon, Music2, QuoteIcon, BookA, BookOpen, BookOpenTextIcon } from 'lucide-react'
import { Sermon, Quote, Devotional, sermons as initialSermons, quotes as initialQuotes, devotionals as initialDevotionals } from '@/lib/mock-data'
import { uploadToCloudinary } from '@/lib/api'


import { apiRequest } from '@/lib/query-client'
import { useQuery } from '@tanstack/react-query'
import { log } from 'node:console'

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false })

export default function ResourcesPage() {

  const { data: allSermons,isLoading } = useQuery<any>({
    queryKey:['sermons','all']
  })
  const { data: allQuotes, isLoading: isQuotesLoading } = useQuery<any>({
    queryKey:['quotes','all']
  })
  const { data: allDevotionals, isLoading: isDevotionalsLoading } = useQuery<any>({
    queryKey:['devotionals','all']
  })
  const [search, setSearch] = useState('')
  const [searchQuotes, setSearchQuotes] = useState('')
  const [searchDevotionals, setSearchDevotionals] = useState('')
  const [sermons, setSermons] = useState<Sermon[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [devotionals, setDevotionals] = useState<Devotional[]>([])

  const [editingSermon, setEditingSermon] = useState<Sermon | null>(null)
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null)
  const [editingDevotional, setEditingDevotional] = useState<Devotional | null>(null)

  const [playing, setPlaying] = useState<Record<string, boolean>>({})
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [videoStates, setVideoStates] = useState<Record<string, { currentTime: number; duration: number; volume: number; isPlaying: boolean }>>({})
  const [youtubeStates, setYoutubeStates] = useState<Record<string, { currentTime: number; duration: number; volume: number; isPlaying: boolean }>>({})
  const [youtubePlayers, setYoutubePlayers] = useState<Record<string, any>>({})
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null)
  const [selectedAudio, setSelectedAudio] = useState<File | null>(null)
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>('')
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [videoProgress, setVideoProgress] = useState(0)
  const [audioProgress, setAudioProgress] = useState(0)
  const videoRefs: Record<string, HTMLVideoElement | null> = {}
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState('')


  // Create preview URL for selected video
  useEffect(() => {
    if (selectedVideo) {
      const url = URL.createObjectURL(selectedVideo)
      setVideoPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setVideoPreviewUrl('')
    }
  }, [selectedVideo])

  // Create preview URL for selected audio
  useEffect(() => {
    if (selectedAudio) {
      const url = URL.createObjectURL(selectedAudio)
      setAudioPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setAudioPreviewUrl('')
    }
  }, [selectedAudio])

  useEffect(() => {
    // Load YouTube IFrame API
    if (typeof window !== 'undefined' && !(window as any).YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
      
      ;(window as any).onYouTubeIframeAPIReady = () => {
        // Initialize all existing YouTube embeds
        sermons.forEach((sermon) => {
          if (sermon.videoId) {
            setTimeout(() => initializeYoutubePlayer(sermon._id, sermon.videoId!), 100)
          }
        })
      }
    }
  }, [])

  // Poll YouTube player state for time updates
  useEffect(() => {
    const interval = setInterval(() => {
      Object.entries(youtubePlayers).forEach(([sermonId, player]) => {
        if (player) {
          updateYoutubeState(sermonId, player)
          const mins = Math.floor(player.getCurrentTime?.() / 60 || 0)
          const secs = Math.floor((player.getCurrentTime?.() || 0) % 60)
          const timeEl = document.getElementById(`yt-time-${sermonId}`)
          if (timeEl) timeEl.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`
          
          const durationMins = Math.floor(player.getDuration?.() / 60 || 0)
          const durationSecs = Math.floor((player.getDuration?.() || 0) % 60)
          const durationEl = document.getElementById(`yt-duration-${sermonId}`)
          if (durationEl) durationEl.textContent = `${durationMins}:${durationSecs < 10 ? '0' : ''}${durationSecs}`
        }
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [youtubePlayers])


  useEffect(() => {
 if (allSermons) {
  setSermons(allSermons.sermons)
    }
    
    if (allQuotes) {
      setQuotes(allQuotes)
    }
    if (allDevotionals) {
      setDevotionals(allDevotionals)
    }
  }, [allSermons,allQuotes,allDevotionals])
  

  function initializeYoutubePlayer(sermonId: string, videoId: string) {
    if (typeof window !== 'undefined' && (window as any).YT && (window as any).YT.Player) {
      try {
        const player = new (window as any).YT.Player(`youtube-${sermonId}`, {
          events: {
            onReady: (event: any) => {
              setYoutubePlayers((prev) => ({ ...prev, [sermonId]: event.target }))
              updateYoutubeState(sermonId, event.target)
            },
            onStateChange: (event: any) => {
              updateYoutubeState(sermonId, event.target)
            },
          },
        })
      } catch (e) {
        // Player already initialized
      }
    }
  }

  function updateYoutubeState(sermonId: string, player: any) {
    if (player) {
      const currentTime = player.getCurrentTime?.() || 0
      const duration = player.getDuration?.() || 0
      const volume = (player.getVolume?.() || 100) / 100
      const isPlaying = player.getPlayerState?.() === 1 // 1 = playing
      
      setYoutubeStates((prev) => ({
        ...prev,
        [sermonId]: { currentTime, duration, volume, isPlaying },
      }))
    }
  }

  

  // Sermon CRUD helpers (in-memory)
  async function addSermon(s: Sermon) {
     
   await apiRequest('POST','/sermons/create', s)
    setSermons((prev) => [s, ...prev])
    setEditingSermon(null)
      setSelectedVideo(null)
      setSelectedAudio(null)
      setVideoProgress(0)
      setAudioProgress(0)
      setIsUploading(false)
  }
  async function updateSermon(id: string, updated: Sermon) {
    await apiRequest('PUT', `/sermons/update/${id}`, updated)
    setSermons((prev) => prev.map((p) => (p._id === id ? updated : p)))
    setEditingSermon(null)
      setSelectedVideo(null)
      setSelectedAudio(null)
      setVideoProgress(0)
      setAudioProgress(0)
      setIsUploading(false)
  }
  async function deleteSermon(id: string) {
   try {     setDeleting(id)
     await apiRequest('DELETE', `/sermons/delete/${id}`)
    setSermons((prev) => prev.filter((p) => p._id !== id))
   } catch (error) {
    console.error('Error deleting sermon:', error)
   } finally {
     setDeleting('')
   }
  }

  // Quote & Devotional helpers
  async function addQuote(q: Quote) { 
    try {
      setSaving(true)
      await apiRequest('POST', '/quotes/create', q); setQuotes((p) => [q, ...p]);
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
    } finally { 
      setSaving(false)
    }
   }
  async function updateQuote(id: string, q: Quote) {
    try {
       setSaving(true); await apiRequest('PUT', `/quotes/update/${id}`, q); setQuotes((p) => p.map((x) => x._id === id ? q : x));  
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
    }finally{setSaving(false)}
  }
  async function deleteQuote(id: string) { setSaving(true); await apiRequest('DELETE', `/quotes/delete/${id}`); setQuotes((p) => p.filter((x) => x._id !== id)); setSaving(false) }

  async function addDevotional(d: Devotional) { 
    try {
      setSaving(true);
      await apiRequest('POST', '/devotionals/create', d);
      setDevotionals((p) => [d, ...p]); 
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
    }finally{setSaving(false)}
   }
  async function updateDevotional(id: string, d: Devotional) { 
    try {
      setSaving(true);
      await apiRequest('PUT', `/devotionals/update/${id}`, d);
      setDevotionals((p) => p.map((x) => x._id === id ? d : x));   
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
    }finally{setSaving(false)}
  }
  async function deleteDevotional(id: string) { 
    try {
      setSaving(true);
      await apiRequest('DELETE', `/devotionals/delete/${id}`);
      setDevotionals((p) => p.filter((x) => x._id !== id));
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
    }finally{setSaving(false)}
   }

  // Upload files to Cloudinary
  async function handleSaveSermon(sermon: Sermon) {
    try {
      setIsUploading(true)
      setUploadError(null)
      setVideoProgress(0)
      setAudioProgress(0)
      let updatedSermon = { ...sermon }

      // Upload video if selected
      if (selectedVideo) {
        try {
          const videoResponse = await uploadToCloudinary(selectedVideo, 'video', setVideoProgress)
          updatedSermon = { ...updatedSermon, videoUrl: { url: videoResponse.url, public_id: videoResponse.publicId } }
        } catch (error) {
          setUploadError('Failed to upload video. Please try again.')
          setIsUploading(false)
          return
        }
      }

      // Upload audio if selected
      if (selectedAudio) {
        try {
          const audioResponse = await uploadToCloudinary(selectedAudio, 'auto', setAudioProgress)
          updatedSermon = { ...updatedSermon, audioUrl: { url: audioResponse.url, public_id: audioResponse.publicId } }
        } catch (error) {
          setUploadError('Failed to upload audio. Please try again.')
          setIsUploading(false)
          return
        }
      }

      // Save the sermon
      if (sermons.some((s) => s._id === sermon._id)) {
        updateSermon(sermon._id, updatedSermon)
       
      } else {
        await addSermon(updatedSermon)
        
      }

      
    } catch (error) {
      console.error('Error saving sermon:', error)
      setUploadError('An unexpected error occurred. Please try again.')
      setIsUploading(false)
    }
  }

  const sermonsContent = (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
       {sermons.length > 0 &&  <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search sermons or speaker..."
          className="w-full md:max-w-md px-4 py-2 border border-border rounded-lg bg-card"
        />}
       {sermons.length > 0 &&  <button
          onClick={() => setEditingSermon({_id:"", title: '', speaker: '', date: '', duration: '', description: '', passage: '', videoId: '', videoUrl: undefined, audioUrl: undefined })}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2"
        >
          <Plus size={16} /> Add Sermon
        </button>}
      </div>

      {editingSermon && (
        <Dialog open={!!editingSermon} onOpenChange={(open) => {
          if (!open) {
            setEditingSermon(null)
            setSelectedVideo(null)
            setSelectedAudio(null)
          }
        }}>

          {/* Sermon Edit/Create Form */}
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingSermon._id.length > 10 ? 'Edit Sermon' : 'New Sermon'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Title</label>
                <input type="text" placeholder="Sermon title" value={editingSermon.title} onChange={(e) => setEditingSermon({ ...editingSermon, title: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg bg-white" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Speaker</label>
                <input type="text" placeholder="Speaker name" value={editingSermon.speaker} onChange={(e) => setEditingSermon({ ...editingSermon, speaker: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg bg-white" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Date</label>
                <input type="date" value={editingSermon.date} onChange={(e) => setEditingSermon({ ...editingSermon, date: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg bg-white" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Duration</label>
                <input type="text" placeholder="e.g., 45 mins" value={editingSermon.duration} onChange={(e) => setEditingSermon({ ...editingSermon, duration: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg bg-white" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Scripture</label>
                <input type="text" placeholder="e.g., John 3:16" value={editingSermon.passage} onChange={(e) => setEditingSermon({ ...editingSermon, passage: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg bg-white" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <textarea placeholder="Sermon description" value={editingSermon.description} onChange={(e) => setEditingSermon({ ...editingSermon, description: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg bg-white h-20" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">YouTube Video ID</label>
                <input type="text" placeholder="e.g., hMMl6KqQY_4" value={(editingSermon as any).videoId || ''} onChange={(e) => setEditingSermon({ ...editingSermon, videoId: e.target.value } as any)} className="w-full px-3 py-2 border border-border rounded-lg bg-white" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Video URL (MP4)</label>
                <input type="text" placeholder="e.g., /sermon.mp4" value={typeof (editingSermon as any).videoUrl === 'string' ? (editingSermon as any).videoUrl : (editingSermon as any).videoUrl?.url || ''} onChange={(e) => setEditingSermon({ ...editingSermon, videoUrl: e.target.value } as any)} className="w-full px-3 py-2 border border-border rounded-lg bg-white" />
                <div className="mt-3">
                  <label className="text-sm font-medium mb-2 block">Or upload video file</label>
                  <div
                    className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors"
                    onDragOver={(e) => {
                      e.preventDefault()
                      e.currentTarget.classList.add('border-primary', 'bg-gray-50')
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.classList.remove('border-primary', 'bg-gray-50')
                    }}
                    onDrop={(e) => {
                      e.preventDefault()
                      e.currentTarget.classList.remove('border-primary', 'bg-gray-50')
                      if (e.dataTransfer.files?.[0]) {
                        const file = e.dataTransfer.files[0]
                        if (file.type.startsWith('video/')) {
                          setSelectedVideo(file)
                        }
                      }
                    }}
                  >
                    <input 
                      type="file" 
                      accept="video/*" 
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setSelectedVideo(e.target.files[0])
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div>
                      <p className="text-gray-500 font-medium">Drag and drop your video here</p>
                      <p className="text-xs text-gray-400 mt-1">or click to select</p>
                    </div>
                  </div>
                  {selectedVideo && (
                    <div className="mt-2 p-2 bg-green-50 rounded-lg border border-green-200 flex justify-between items-center">
                      <p className="text-xs text-green-700 font-medium">✓ {selectedVideo.name} ({(selectedVideo.size / 1024 / 1024).toFixed(2)} MB)</p>
                      <button 
                        type="button"
                        onClick={() => setSelectedVideo(null)}
                        className="text-xs text-red-600 hover:text-red-800 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  {(selectedVideo && videoPreviewUrl || editingSermon .videoUrl?.url  ) && (
                    <div className="mt-4 bg-black rounded-lg overflow-hidden aspect-video">
                      <video 
                        controls 
                        className="w-full h-full"
                        src={videoPreviewUrl || editingSermon .videoUrl?.url}
                        key={videoPreviewUrl || editingSermon .videoUrl?.url}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Audio URL (MP3)</label>
                <input type="text" placeholder="e.g., /sermon.mp3" value={typeof (editingSermon as any).audioUrl === 'string' ? (editingSermon as any).audioUrl : (editingSermon as any).audioUrl?.url || ''} onChange={(e) => setEditingSermon({ ...editingSermon, audioUrl: e.target.value } as any)} className="w-full px-3 py-2 border border-border rounded-lg bg-white" />
                <div className="mt-3">
                  <label className="text-sm font-medium mb-2 block">Or upload audio file</label>
                  <div
                    className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors"
                    onDragOver={(e) => {
                      e.preventDefault()
                      e.currentTarget.classList.add('border-primary', 'bg-gray-50')
                    }}
                    onDragLeave={(e) => {
                      e.currentTarget.classList.remove('border-primary', 'bg-gray-50')
                    }}
                    onDrop={(e) => {
                      e.preventDefault()
                      e.currentTarget.classList.remove('border-primary', 'bg-gray-50')
                      if (e.dataTransfer.files?.[0]) {
                        const file = e.dataTransfer.files[0]
                        if (file.type.startsWith('audio/')) {
                          setSelectedAudio(file)
                        }
                      }
                    }}
                  >
                    <input 
                      type="file" 
                      accept="audio/*" 
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setSelectedAudio(e.target.files[0])
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div>
                      <p className="text-gray-500 font-medium">Drag and drop your audio here</p>
                      <p className="text-xs text-gray-400 mt-1">or click to select</p>
                    </div>
                  </div>
                  {selectedAudio && (
                    <div className="mt-2 p-2 bg-green-50 rounded-lg border border-green-200 flex justify-between items-center">
                      <p className="text-xs text-green-700 font-medium">✓ {selectedAudio.name} ({(selectedAudio.size / 1024 / 1024).toFixed(2)} MB)</p>
                      <button 
                        type="button"
                        onClick={() => setSelectedAudio(null)}
                        className="text-xs text-red-600 hover:text-red-800 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  {(selectedAudio && audioPreviewUrl||(editingSermon as any).audioUrl?.url) && (
                    <div className="mt-4 bg-gray-100 rounded-lg p-3">
                      <audio 
                        controls 
                        className="w-full"
                        src={audioPreviewUrl || (editingSermon as any).audioUrl?.url}
                        key={audioPreviewUrl||(editingSermon as any).audioUrl?.url}
                      >
                        Your browser does not support the audio tag.
                      </audio>
                    </div>
                  )}
                </div>
              </div>{isUploading && selectedVideo && videoProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-medium text-gray-600">Video Upload Progress</p>
                    <p className="text-xs font-medium text-gray-600">{videoProgress}%</p>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-200" 
                      style={{ width: `${videoProgress}%` }}
                    />
                  </div>
                </div>
              )}
              {isUploading && selectedAudio && audioProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-medium text-gray-600">Audio Upload Progress</p>
                    <p className="text-xs font-medium text-gray-600">{audioProgress}%</p>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-200" 
                      style={{ width: `${audioProgress}%` }}
                    />
                  </div>
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => handleSaveSermon(editingSermon)} 
                  disabled={isUploading}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? 'Uploading...' : 'Save'}
                </button>
                <button 
                  onClick={() => { setEditingSermon(null); setSelectedVideo(null); setSelectedAudio(null);setIsUploading(false); setUploadError(null) }} 
                  className="px-4 py-2 border rounded-lg flex-1"
                >
                  Cancel
                </button>
              </div>
              
              {uploadError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{uploadError}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {sermons.length > 0 ? ( <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sermons.filter((s) => {
          if (!search.trim()) return true
          const q = search.toLowerCase()
          return s.title.toLowerCase().includes(q) || s.speaker.toLowerCase().includes(q)
        }).map((sermon) => {
          return (
            <div key={sermon._id} className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full group relative">
              {sermon.videoId && (
                <div className="bg-black h-full  border-0 aspect-video flex flex-col relative">
                  {/* Custom Controls Bar */}
                  <div className="bg-gray-900 px-3 py-2 flex items-center gap-2 text-white text-xs border-b border-gray-700 z-10">
                    <button
                      onClick={() => {
                        const player = youtubePlayers[sermon._id]
                        if (player) {
                          if (player.getPlayerState?.() === 1) {
                            player.pauseVideo?.()
                          } else {
                            player.playVideo?.()
                          }
                          setTimeout(() => updateYoutubeState(sermon._id, player), 100)
                        }
                      }}
                        className="hover:bg-white/20 px-2 py-1 rounded shrink-0"
                      >
                      {youtubeStates[sermon._id]?.isPlaying ? '⏸' : '▶'}
                    </button>
                    <span className="text-xs  shrink-0 w-8" id={`yt-time-${sermon._id}`}>0:00</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={youtubeStates[sermon._id]?.duration ? (youtubeStates[sermon._id].currentTime / youtubeStates[sermon._id].duration) * 100 : 0}
                      onChange={(e) => {
                        const player = youtubePlayers[sermon._id]
                        if (player && youtubeStates[sermon._id]) {
                          const newTime = (parseFloat(e.target.value) / 100) * youtubeStates[sermon._id].duration
                          player.seekTo?.(newTime)
                          setTimeout(() => updateYoutubeState(sermon._id, player), 100)
                        }
                      }}
                      className="flex-1 h-1 w-full bg-gray-700 rounded cursor-pointer accent-primary"
                    />
                    <span className="text-xs  shrink-0 w-8" id={`yt-duration-${sermon._id}`}>0:00</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={(youtubeStates[sermon._id]?.volume || 1) * 100}
                      onChange={(e) => {
                        const player = youtubePlayers[sermon._id]
                        if (player) {
                          const vol = parseFloat(e.target.value)
                          player.setVolume?.(vol)
                          setYoutubeStates((prev) => ({ ...prev, [sermon._id]: { ...prev[sermon._id], volume: vol / 100 } }))
                        }
                      }}
                      className="w-12 h-1 bg-gray-700 rounded cursor-pointer accent-primary shrink-0"
                    />
                    <button
                      onClick={() => {
                        const iframe = document.getElementById(`youtube-${sermon._id}`) as HTMLIFrameElement
                        if (iframe && iframe.requestFullscreen) {
                          iframe.requestFullscreen()
                        }
                      }}
                      className="hover:bg-white/20 px-2 py-1 rounded shrink-0"
                    >
                      ⛶
                    </button>
                  </div>
                  <iframe
                    id={`youtube-${sermon._id}`}
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${sermon.videoId}?allow-fullscreen&enablejsapi=1&modestbranding=1&rel=0&fs=1`}
                    title={sermon.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="flex-1 w-full "
                    onLoad={() => {
                      setTimeout(() => initializeYoutubePlayer(sermon._id, sermon.videoId!), 500)
                    }}
                  />
                </div>
              )}
              {sermon.videoUrl && !sermon.videoId && (
                <div className="bg-black aspect-video flex flex-col relative">
                  {/* Custom Controls Bar */}
                  <div className="bg-gray-900 px-3 py-2 flex items-center gap-2 text-white text-xs border-b border-gray-700 z-10">
                    <button
                      onClick={() => {
                        const video = document.getElementById(`video-${sermon._id}`) as HTMLVideoElement
                        if (video) {
                          if (video.paused) {
                            video.play()
                            setVideoStates(prev => ({ ...prev, [sermon._id]: { ...prev[sermon._id], isPlaying: true } }))
                          } else {
                            video.pause()
                            setVideoStates(prev => ({ ...prev, [sermon._id]: { ...prev[sermon._id], isPlaying: false } }))
                          }
                        }
                      }}
                      className="hover:bg-white/20 px-2 py-1 rounded shrink-0"
                    >
                      {videoStates[sermon._id]?.isPlaying ? '⏸' : '▶'}
                    </button>
                    <span className="text-xs shrink-0 w-8" id={`time-${sermon._id}`}>0:00</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={videoStates[sermon._id]?.currentTime ? (videoStates[sermon._id].currentTime / videoStates[sermon._id].duration) * 100 : 0}
                      onChange={(e) => {
                        const video = document.getElementById(`video-${sermon._id}`) as HTMLVideoElement
                        if (video && videoStates[sermon._id]) {
                          const newTime = (parseFloat(e.target.value) / 100) * videoStates[sermon._id].duration
                          video.currentTime = newTime
                        }
                      }}
                      className="flex-1 h-1 bg-gray-700 rounded cursor-pointer accent-primary"
                    />
                    <span className="text-xs shrink-0 w-8" id={`duration-${sermon._id}`}>0:00</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={(videoStates[sermon._id]?.volume || 1) * 100}
                      onChange={(e) => {
                        const video = document.getElementById(`video-${sermon._id}`) as HTMLVideoElement
                        if (video) {
                          const vol = parseFloat(e.target.value) / 100
                          video.volume = vol
                          setVideoStates(prev => ({ ...prev, [sermon._id]: { ...prev[sermon._id], volume: vol } }))
                        }
                      }}
                      className="w-12 h-1 bg-gray-700 rounded cursor-pointer accent-primary shrink-0"
                    />
                    <button
                      onClick={() => {
                        const video = document.getElementById(`video-${sermon._id}`) as HTMLVideoElement
                        if (video) {
                          if (video.requestFullscreen) {
                            video.requestFullscreen()
                          }
                        }
                      }}
                      className="hover:bg-white/20 px-2 py-1 rounded shrink-0"
                    >
                      ⛶
                    </button>
                  </div>
                  {/* Video Element */}
                  <video
                    id={`video-${sermon._id}`}
                    className="w-full max-h-80 flex-1 bg-black"
                    onPlay={() => setVideoStates(prev => ({ ...prev, [sermon._id]: { ...prev[sermon._id], isPlaying: true } }))}
                    onPause={() => setVideoStates(prev => ({ ...prev, [sermon._id]: { ...prev[sermon._id], isPlaying: false } }))}
                    onTimeUpdate={(e) => {
                      const video = e.currentTarget
                      setVideoStates(prev => ({ ...prev, [sermon._id]: { ...prev[sermon._id], currentTime: video.currentTime } }))
                      const mins = Math.floor(video.currentTime / 60)
                      const secs = Math.floor(video.currentTime % 60)
                      const timeEl = document.getElementById(`time-${sermon._id}`)
                      if (timeEl) timeEl.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`
                    }}
                    onLoadedMetadata={(e) => {
                      const video = e.currentTarget
                      setVideoStates(prev => ({ ...prev, [sermon._id]: { ...prev[sermon._id], duration: video.duration } }))
                      const mins = Math.floor(video.duration / 60)
                      const secs = Math.floor(video.duration % 60)
                      const durationEl = document.getElementById(`duration-${sermon._id}`)
                      if (durationEl) durationEl.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`
                    }}
                  >
                    <source src={typeof sermon.videoUrl === 'string' ? sermon.videoUrl : sermon.videoUrl?.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
              {sermon.audioUrl && !sermon.videoId && !sermon.videoUrl && (
                <div className="bg-linear-to-br h-full relative from-primary/10 to-accent/10 p-6 flex items-center justify-center aspect-video">
                  <div className="text-center w-full">
                    <Music className="text-primary mx-auto mb-3" size={32} />
                    <p className="text-sm font-semibold text-foreground mb-3">{sermon.title}-Audio Sermon</p>
                    
                  </div><audio controls className="w-full absolute top-0" src={typeof sermon.audioUrl === 'string' ? sermon.audioUrl : sermon.audioUrl?.url} />
                </div>
              )}
              {!sermon.videoId && !sermon.videoUrl && !sermon.audioUrl && sermon.image && (
                <div className="bg-black aspect-video overflow-hidden">
                  <img src={sermon.image} alt={sermon.title} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black via-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex justify-between items-end pointer-events-none z-20">
                <div className="flex-1 pointer-events-none">
                  <h4 className="text-white font-bold mb-1">{sermon.title}</h4>
                  <p className="text-sm text-gray-300 mb-2">{sermon.speaker}</p>
                  <p className="text-xs text-gray-400 line-clamp-1 mb-2">{sermon.description}</p>
                  <div className="flex gap-3 text-xs text-gray-400">
                    <span className="font-semibold">{sermon.passage}</span>
                    <span>•</span>
                    <span>{sermon.duration}</span>
                  </div>
                  <div className="flex gap-4 mt-2 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <Heart size={12} className="text-red-400" />
                      <span>{sermon.likes?.length || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Share2 size={12} className="text-blue-400" />
                      <span>{sermon.shares?.length || 0}</span>
                    </div>
                  </div>
                </div>
                <div className="relative ml-4 pointer-events-auto">
                  <button onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === sermon._id ? null : sermon._id); }} className="p-2 hover:bg-white/20 rounded text-white">
                    <MoreVertical size={16} />
                  </button>
                  {openMenu === sermon._id && (
                    <div className="absolute right-0 bottom-full mb-2 bg-black border border-gray-600 rounded shadow-lg z-30 w-32">
                      <button onClick={() => { setEditingSermon(sermon); setOpenMenu(null); }} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 flex items-center gap-2 border-b border-gray-600">
                        <Edit2 size={14} /> Edit
                      </button>
                      <button onClick={() => { deleteSermon(sermon._id); setOpenMenu(null); }} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 flex items-center gap-2">
                        {deleting === sermon._id ? <><Loader className='w-3 h-3 animate-spin'/>Deleting...</>: <><Trash2 size={14} /> Delete</>}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>) : (
        <div className="text-center py-20">
            <span className='flex items-center w-full justify-center gap-3'>
              <PlaySquareIcon size={48} className="text-muted-foreground   " />
          <Music2 size={48} className="text-muted-foreground  " /></span>
            <p className="text-muted-foreground">No sermons found. Click "Add Sermon" to create your first one!</p>
            <span className='flex items-center mt-10 w-full justify-center gap-3'>
               <button
          onClick={() => setEditingSermon({_id:"", title: '', speaker: '', date: '', duration: '', description: '', passage: '', videoId: '', videoUrl: undefined, audioUrl: undefined })}
          className="px-4 cursor-pointer py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2"
        >
          <Plus size={16} /> Add Sermon
        </button>
           </span>
             
        </div>
      )}
    </div>
  )

  const quotesContent = (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
      {quotes.length>0 &&   <input
          value={searchQuotes}
          onChange={(e) => setSearchQuotes(e.target.value)}
          placeholder="Search quotes or scripture..."
          className="w-full md:max-w-md px-4 py-2 border border-border rounded-lg bg-card"
        />}
        {quotes.length > 0 && <button onClick={() => setEditingQuote({ _id: '', quote: '', author: '', scripture: '' })} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2"><Plus size={16} /> Add Quote</button>}
      </div>

      
      {/* quote form */}
      {editingQuote && (
        <Dialog open={!!editingQuote} onOpenChange={(open) => { if (!open) setEditingQuote(null) }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingQuote._id.length > 10 ? 'Edit Quote' : 'New Quote'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Quote</label>
                <textarea placeholder="Quote text" value={editingQuote.quote} onChange={(e) => setEditingQuote({ ...editingQuote, quote: e.target.value })} className="w-full px-4 py-2 border border-border rounded-lg bg-white h-28" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Author</label>
                <input type="text" placeholder="Author" value={editingQuote.author} onChange={(e) => setEditingQuote({ ...editingQuote, author: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg bg-white" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Scripture</label>
                <input type="text" placeholder="Bible Scripture" value={editingQuote.scripture} onChange={(e) => setEditingQuote({ ...editingQuote, scripture: e.target.value })} className="w-full px-3 py-2 border border-border rounded-lg bg-white" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => { if (quotes.some((q) => q._id === editingQuote._id)) { updateQuote(editingQuote._id, editingQuote) } else { addQuote(editingQuote) } setEditingQuote(null) }} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex-1">{saving ? 'Saving...' : 'Save'}</button>
                <button onClick={() => setEditingQuote(null)} className="px-4 py-2 border rounded-lg flex-1">Cancel</button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      
        {quotes.length >  0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quotes.filter((quote) => {
          if (!searchQuotes.trim()) return true
          const q = searchQuotes.toLowerCase()
          return quote.quote.toLowerCase().includes(q) || quote.scripture.toLowerCase().includes(q)
        }).map((quote) => (
          <div key={quote._id} className="bg-card rounded-lg border border-border p-6 flex flex-col h-full hover:shadow-lg transition-shadow">
            <div className="flex-1 mb-4">
              <p className="text-foreground mb-3 italic text-sm">"{quote?.quote.substring(0, 200)}{quote?.quote.length > 200 ? '...' : ''}"</p>
              <p className="text-xs text-muted-foreground font-medium mb-4">{quote?.scripture}</p>
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                
                <div className="flex items-center gap-1">
                  <Heart size={14} />
                  <span>{quote.likes?.length || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Share2 size={14} />
                  <span>{quote.shares?.length || 0}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-4 border-t border-border">
              <button onClick={() => setEditingQuote(quote)} className="flex-1 p-2 hover:bg-primary/10 rounded-lg transition-colors text-primary text-sm font-medium"><Edit2 size={16} className="inline mr-1" /> Edit</button>
              <button onClick={() => deleteQuote(quote._id)} className="flex-1 p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive text-sm font-medium"><Trash2 size={16} className="inline mr-1" /> Delete</button>
            </div>
          </div>
        ))}
          </div>
      ) : (
          <div className="text-center py-20">
            <span className='flex items-center w-full justify-center gap-3'>
               
              <QuoteIcon size={48} className="text-muted-foreground  " />
              <QuoteIcon size={48} className="text-muted-foreground  " />
            </span>
            <p className="text-muted-foreground">No quotes found. Click "Add Quote" to create your first one!</p>
            <span className='flex items-center mt-10 w-full justify-center gap-3'>
                <button onClick={() => setEditingQuote({ _id: '', quote: '', author: '', scripture: '' })} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2"><Plus size={16} /> Add Quote</button>
           </span>
             
        </div>
        )}
      
    </div>
  )

  const devotionalsContent = (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        {devotionals.length > 0 && <input
          value={searchDevotionals}
          onChange={(e) => setSearchDevotionals(e.target.value)}
          placeholder="Search devotionals or scripture..."
          className="w-full md:max-w-md px-4 py-2 border border-border rounded-lg bg-card"
        />}
       {devotionals.length > 0 &&  <button onClick={() => setEditingDevotional({ _id: Date.now().toString(), title: '', date: '', scripture: '', reflection: '', prayer: '' })} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2"><Plus size={16} /> Add Devotional</button>}
      </div>

      {/* Devotional form */}

      {editingDevotional && (
        <Dialog open={!!editingDevotional} onOpenChange={(open) => { if (!open) setEditingDevotional(null) }}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingDevotional._id.length > 10 ? 'Edit Devotional' : 'New Devotional'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Title</label>
                <input type="text" placeholder="Title" value={editingDevotional.title} onChange={(e) => setEditingDevotional({ ...editingDevotional, title: e.target.value })} className="w-full px-4 py-2 border border-border rounded-lg bg-white" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Scripture Reference</label>
                <input type="text" placeholder="Scripture Reference" value={editingDevotional.scripture} onChange={(e) => setEditingDevotional({ ...editingDevotional, scripture: e.target.value })} className="w-full px-4 py-2 border border-border rounded-lg bg-white" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Reflection</label>
                <textarea placeholder="Reflection" value={editingDevotional.reflection} onChange={(e) => setEditingDevotional({ ...editingDevotional, reflection: e.target.value })} className="w-full px-4 py-2 border border-border rounded-lg bg-white h-28" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Prayer</label>
                <textarea placeholder="Prayer" value={editingDevotional.prayer} onChange={(e) => setEditingDevotional({ ...editingDevotional, prayer: e.target.value })} className="w-full px-4 py-2 border border-border rounded-lg bg-white h-28" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => { if (devotionals.some((d) => d._id === editingDevotional._id)) { updateDevotional(editingDevotional._id, editingDevotional) } else { addDevotional(editingDevotional) } setEditingDevotional(null) }} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex-1">{ saving ? 'Saving...' : 'Save' }</button>
                <button onClick={() => setEditingDevotional(null)} className="px-4 py-2 border rounded-lg flex-1">Cancel</button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {devotionals.length > 0 ? (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {devotionals.filter((d) => {
          if (!searchDevotionals.trim()) return true
          const q = searchDevotionals.toLowerCase()
          return d.title.toLowerCase().includes(q) || d.scripture.toLowerCase().includes(q)
        }).map((d) => (
          <div key={d._id} className="bg-card rounded-lg border border-border p-6 flex flex-col h-full hover:shadow-lg transition-shadow">
            <div className="flex-1 mb-4">
              <h3 className="font-bold text-foreground mb-2">{d.title}</h3>
              <p className="text-xs text-muted-foreground font-medium mb-3">{d.scripture}</p>
              <p className="text-sm text-foreground line-clamp-3 mb-4">{d.reflection.substring(0, 150)}{d.reflection.length > 150 ? '...' : ''}</p>
              <p className="text-xs text-muted-foreground font-medium mb-3">{d.prayer}</p>

              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                 
                <div className="flex items-center gap-1">
                  <Heart size={14} />
                  <span>{d.likes?.length || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Share2 size={14} />
                  <span>{d?.shares?.length || 0}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-4 border-t border-border">
              <button onClick={() => setEditingDevotional(d)} className="flex-1 p-2 hover:bg-primary/10 rounded-lg transition-colors text-primary text-sm font-medium"><Edit2 size={16} className="inline mr-1" /> Edit</button>
              <button onClick={() => deleteDevotional(d._id)} className="flex-1 p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive text-sm font-medium"><Trash2 size={16} className="inline mr-1" /> Delete</button>
            </div>
          </div>
        ))}
      </div>) : (
           <div className="text-center py-20">
            <span className='flex items-center w-full justify-center gap-3'>
               
              <BookOpenTextIcon size={48} className="text-muted-foreground  " />
            </span>
            <p className="text-muted-foreground">No devotionals found. Click "Add Devotional" to create your first one!</p>
            <span className='flex items-center mt-10 w-full justify-center gap-3'>
                <button onClick={() => setEditingDevotional({ _id: Date.now().toString(), title: '', date: '', scripture: '', reflection: '', prayer: '' })} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2"><Plus size={16} /> Add Devotional</button>
           </span>
             
        </div>
      )}
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
