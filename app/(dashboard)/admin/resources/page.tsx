"use client"

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Tabs from '@/components/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Trash2, Plus, Edit2, Play, Music, MoreVertical, Eye, Heart, Share2 } from 'lucide-react'
import { Sermon, Quote, Devotional, sermons as initialSermons, quotes as initialQuotes, devotionals as initialDevotionals } from '@/lib/mock-data'

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false })

export default function ResourcesPage() {
  const [search, setSearch] = useState('')
  const [searchQuotes, setSearchQuotes] = useState('')
  const [searchDevotionals, setSearchDevotionals] = useState('')
  const [sermons, setSermons] = useState<Sermon[]>(initialSermons)
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes)
  const [devotionals, setDevotionals] = useState<Devotional[]>(initialDevotionals)

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
  const videoRefs: Record<string, HTMLVideoElement | null> = {}

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
            setTimeout(() => initializeYoutubePlayer(sermon.id, sermon.videoId!), 100)
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

  function togglePlay(id: string) {
    setPlaying((prev) => {
      const next: Record<string, boolean> = {}
      // make playback mutually exclusive
      Object.keys(prev).forEach((k) => (next[k] = false))
      next[id] = !prev[id]
      return next
    })
  }

  // Sermon CRUD helpers (in-memory)
  function addSermon(s: Sermon) {
    setSermons((prev) => [s, ...prev])
  }
  function updateSermon(id: string, updated: Sermon) {
    setSermons((prev) => prev.map((p) => (p.id === id ? updated : p)))
  }
  function deleteSermon(id: string) {
    setSermons((prev) => prev.filter((p) => p.id !== id))
  }

  // Quote & Devotional helpers
  function addQuote(q: Quote) { setQuotes((p) => [q, ...p]) }
  function updateQuote(id: string, q: Quote) { setQuotes((p) => p.map((x) => x.id === id ? q : x)) }
  function deleteQuote(id: string) { setQuotes((p) => p.filter((x) => x.id !== id)) }

  function addDevotional(d: Devotional) { setDevotionals((p) => [d, ...p]) }
  function updateDevotional(id: string, d: Devotional) { setDevotionals((p) => p.map((x) => x.id === id ? d : x)) }
  function deleteDevotional(id: string) { setDevotionals((p) => p.filter((x) => x.id !== id)) }

  const sermonsContent = (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search sermons or speaker..."
          className="w-full md:max-w-md px-4 py-2 border border-border rounded-lg bg-card"
        />
        <button
          onClick={() => setEditingSermon({ id: Date.now().toString(), title: '', speaker: '', date: '', duration: '', description: '', passage: '', videoId: '', videoUrl: '', audioUrl: '' })}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2"
        >
          <Plus size={16} /> Add Sermon
        </button>
      </div>

      {editingSermon && (
        <Dialog open={!!editingSermon} onOpenChange={(open) => {
          if (!open) {
            setEditingSermon(null)
            setSelectedVideo(null)
            setSelectedAudio(null)
          }
        }}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingSermon.id.length > 10 ? 'Edit Sermon' : 'New Sermon'}</DialogTitle>
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
                <input type="text" placeholder="e.g., /sermon.mp4" value={(editingSermon as any).videoUrl || ''} onChange={(e) => setEditingSermon({ ...editingSermon, videoUrl: e.target.value } as any)} className="w-full px-3 py-2 border border-border rounded-lg bg-white" />
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
                  {selectedVideo && videoPreviewUrl && (
                    <div className="mt-4 bg-black rounded-lg overflow-hidden aspect-video">
                      <video 
                        controls 
                        className="w-full h-full"
                        src={videoPreviewUrl}
                        key={videoPreviewUrl}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Audio URL (MP3)</label>
                <input type="text" placeholder="e.g., /sermon.mp3" value={(editingSermon as any).audioUrl || ''} onChange={(e) => setEditingSermon({ ...editingSermon, audioUrl: e.target.value } as any)} className="w-full px-3 py-2 border border-border rounded-lg bg-white" />
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
                  {selectedAudio && audioPreviewUrl && (
                    <div className="mt-4 bg-gray-100 rounded-lg p-3">
                      <audio 
                        controls 
                        className="w-full"
                        src={audioPreviewUrl}
                        key={audioPreviewUrl}
                      >
                        Your browser does not support the audio tag.
                      </audio>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => { if (sermons.some((s) => s.id === editingSermon.id)) { updateSermon(editingSermon.id, editingSermon) } else { addSermon(editingSermon) } setEditingSermon(null); setSelectedVideo(null); setSelectedAudio(null) }} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex-1">Save</button>
                <button onClick={() => { setEditingSermon(null); setSelectedVideo(null); setSelectedAudio(null) }} className="px-4 py-2 border rounded-lg flex-1">Cancel</button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sermons.filter((s) => {
          if (!search.trim()) return true
          const q = search.toLowerCase()
          return s.title.toLowerCase().includes(q) || s.speaker.toLowerCase().includes(q)
        }).map((sermon) => {
          return (
            <div key={sermon.id} className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full group relative">
              {sermon.videoId && (
                <div className="bg-black aspect-video flex flex-col relative">
                  {/* Custom Controls Bar */}
                  <div className="bg-gray-900 px-3 py-2 flex items-center gap-2 text-white text-xs border-b border-gray-700 z-10">
                    <button
                      onClick={() => {
                        const player = youtubePlayers[sermon.id]
                        if (player) {
                          if (player.getPlayerState?.() === 1) {
                            player.pauseVideo?.()
                          } else {
                            player.playVideo?.()
                          }
                          setTimeout(() => updateYoutubeState(sermon.id, player), 100)
                        }
                      }}
                        className="hover:bg-white/20 px-2 py-1 rounded shrink-0"
                      >
                      {youtubeStates[sermon.id]?.isPlaying ? '⏸' : '▶'}
                    </button>
                    <span className="text-xs  shrink-0 w-8" id={`yt-time-${sermon.id}`}>0:00</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={youtubeStates[sermon.id]?.duration ? (youtubeStates[sermon.id].currentTime / youtubeStates[sermon.id].duration) * 100 : 0}
                      onChange={(e) => {
                        const player = youtubePlayers[sermon.id]
                        if (player && youtubeStates[sermon.id]) {
                          const newTime = (parseFloat(e.target.value) / 100) * youtubeStates[sermon.id].duration
                          player.seekTo?.(newTime)
                          setTimeout(() => updateYoutubeState(sermon.id, player), 100)
                        }
                      }}
                      className="flex-1 h-1 bg-gray-700 rounded cursor-pointer accent-primary"
                    />
                    <span className="text-xs  shrink-0 w-8" id={`yt-duration-${sermon.id}`}>0:00</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={(youtubeStates[sermon.id]?.volume || 1) * 100}
                      onChange={(e) => {
                        const player = youtubePlayers[sermon.id]
                        if (player) {
                          const vol = parseFloat(e.target.value)
                          player.setVolume?.(vol)
                          setYoutubeStates((prev) => ({ ...prev, [sermon.id]: { ...prev[sermon.id], volume: vol / 100 } }))
                        }
                      }}
                      className="w-12 h-1 bg-gray-700 rounded cursor-pointer accent-primary shrink-0"
                    />
                    <button
                      onClick={() => {
                        const iframe = document.getElementById(`youtube-${sermon.id}`) as HTMLIFrameElement
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
                    id={`youtube-${sermon.id}`}
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${sermon.videoId}?allow-fullscreen&enablejsapi=1&modestbranding=1&rel=0&fs=1`}
                    title={sermon.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="flex-1"
                    onLoad={() => {
                      setTimeout(() => initializeYoutubePlayer(sermon.id, sermon.videoId!), 500)
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
                        const video = document.getElementById(`video-${sermon.id}`) as HTMLVideoElement
                        if (video) {
                          if (video.paused) {
                            video.play()
                            setVideoStates(prev => ({ ...prev, [sermon.id]: { ...prev[sermon.id], isPlaying: true } }))
                          } else {
                            video.pause()
                            setVideoStates(prev => ({ ...prev, [sermon.id]: { ...prev[sermon.id], isPlaying: false } }))
                          }
                        }
                      }}
                      className="hover:bg-white/20 px-2 py-1 rounded shrink-0"
                    >
                      {videoStates[sermon.id]?.isPlaying ? '⏸' : '▶'}
                    </button>
                    <span className="text-xs shrink-0 w-8" id={`time-${sermon.id}`}>0:00</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={videoStates[sermon.id]?.currentTime ? (videoStates[sermon.id].currentTime / videoStates[sermon.id].duration) * 100 : 0}
                      onChange={(e) => {
                        const video = document.getElementById(`video-${sermon.id}`) as HTMLVideoElement
                        if (video && videoStates[sermon.id]) {
                          const newTime = (parseFloat(e.target.value) / 100) * videoStates[sermon.id].duration
                          video.currentTime = newTime
                        }
                      }}
                      className="flex-1 h-1 bg-gray-700 rounded cursor-pointer accent-primary"
                    />
                    <span className="text-xs shrink-0 w-8" id={`duration-${sermon.id}`}>0:00</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={(videoStates[sermon.id]?.volume || 1) * 100}
                      onChange={(e) => {
                        const video = document.getElementById(`video-${sermon.id}`) as HTMLVideoElement
                        if (video) {
                          const vol = parseFloat(e.target.value) / 100
                          video.volume = vol
                          setVideoStates(prev => ({ ...prev, [sermon.id]: { ...prev[sermon.id], volume: vol } }))
                        }
                      }}
                      className="w-12 h-1 bg-gray-700 rounded cursor-pointer accent-primary shrink-0"
                    />
                    <button
                      onClick={() => {
                        const video = document.getElementById(`video-${sermon.id}`) as HTMLVideoElement
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
                    id={`video-${sermon.id}`}
                    className="w-full flex-1 bg-black"
                    onPlay={() => setVideoStates(prev => ({ ...prev, [sermon.id]: { ...prev[sermon.id], isPlaying: true } }))}
                    onPause={() => setVideoStates(prev => ({ ...prev, [sermon.id]: { ...prev[sermon.id], isPlaying: false } }))}
                    onTimeUpdate={(e) => {
                      const video = e.currentTarget
                      setVideoStates(prev => ({ ...prev, [sermon.id]: { ...prev[sermon.id], currentTime: video.currentTime } }))
                      const mins = Math.floor(video.currentTime / 60)
                      const secs = Math.floor(video.currentTime % 60)
                      const timeEl = document.getElementById(`time-${sermon.id}`)
                      if (timeEl) timeEl.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`
                    }}
                    onLoadedMetadata={(e) => {
                      const video = e.currentTarget
                      setVideoStates(prev => ({ ...prev, [sermon.id]: { ...prev[sermon.id], duration: video.duration } }))
                      const mins = Math.floor(video.duration / 60)
                      const secs = Math.floor(video.duration % 60)
                      const durationEl = document.getElementById(`duration-${sermon.id}`)
                      if (durationEl) durationEl.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`
                    }}
                  >
                    <source src={sermon.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
              {sermon.audioUrl && !sermon.videoId && !sermon.videoUrl && (
                <div className="bg-linear-to-br relative from-primary/10 to-accent/10 p-6 flex items-center justify-center aspect-video">
                  <div className="text-center w-full">
                    <Music className="text-primary mx-auto mb-3" size={32} />
                    <p className="text-sm font-semibold text-foreground mb-3">Audio Sermon</p>
                    
                  </div><audio controls className="w-full absolute top-0" src={sermon.audioUrl} />
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
                      <span>{sermon.likes || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye size={12} className="text-blue-400" />
                      <span>{sermon.views || 0}</span>
                    </div>
                  </div>
                </div>
                <div className="relative ml-4 pointer-events-auto">
                  <button onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === sermon.id ? null : sermon.id); }} className="p-2 hover:bg-white/20 rounded text-white">
                    <MoreVertical size={16} />
                  </button>
                  {openMenu === sermon.id && (
                    <div className="absolute right-0 bottom-full mb-2 bg-black border border-gray-600 rounded shadow-lg z-30 w-32">
                      <button onClick={() => { setEditingSermon(sermon); setOpenMenu(null); }} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 flex items-center gap-2 border-b border-gray-600">
                        <Edit2 size={14} /> Edit
                      </button>
                      <button onClick={() => { deleteSermon(sermon.id); setOpenMenu(null); }} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 flex items-center gap-2">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  const quotesContent = (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <input
          value={searchQuotes}
          onChange={(e) => setSearchQuotes(e.target.value)}
          placeholder="Search quotes or scripture..."
          className="w-full md:max-w-md px-4 py-2 border border-border rounded-lg bg-card"
        />
        <button onClick={() => setEditingQuote({ id: Date.now().toString(), text: '', author: '', passage: '' })} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2"><Plus size={16} /> Add Quote</button>
      </div>

      {editingQuote && (
        <div className="bg-card rounded-lg border border-border p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">{editingQuote.id.length > 10 ? 'Edit Quote' : 'New Quote'}</h3>
          <div className="space-y-4">
            <textarea placeholder="Quote text" value={editingQuote.text} onChange={(e) => setEditingQuote({ ...editingQuote, text: e.target.value })} className="w-full px-4 py-2 border border-border rounded-lg bg-white h-28" />
            <input type="text" placeholder="Author" value={editingQuote.author} onChange={(e) => setEditingQuote({ ...editingQuote, author: e.target.value })} className="w-full px-4 py-2 border border-border rounded-lg bg-white" />
            <input type="text" placeholder="Bible Passage" value={editingQuote.passage} onChange={(e) => setEditingQuote({ ...editingQuote, passage: e.target.value })} className="w-full px-4 py-2 border border-border rounded-lg bg-white" />
            <div className="flex gap-3"><button onClick={() => { if (quotes.some((q) => q.id === editingQuote.id)) { updateQuote(editingQuote.id, editingQuote) } else { addQuote(editingQuote) } setEditingQuote(null) }} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">Save</button><button onClick={() => setEditingQuote(null)} className="px-4 py-2 border rounded-lg">Cancel</button></div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {quotes.filter((quote) => {
          if (!searchQuotes.trim()) return true
          const q = searchQuotes.toLowerCase()
          return quote.text.toLowerCase().includes(q) || quote.passage.toLowerCase().includes(q)
        }).map((quote) => (
          <div key={quote.id} className="bg-card rounded-lg border border-border p-6 flex flex-col h-full hover:shadow-lg transition-shadow">
            <div className="flex-1 mb-4">
              <p className="text-foreground mb-3 italic text-sm">"{quote.text.substring(0, 200)}{quote.text.length > 200 ? '...' : ''}"</p>
              <p className="text-xs text-muted-foreground font-medium mb-4">{quote.passage}</p>
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye size={14} />
                  <span>{quote.views || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart size={14} />
                  <span>{quote.likes || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Share2 size={14} />
                  <span>{quote.shares || 0}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-4 border-t border-border">
              <button onClick={() => setEditingQuote(quote)} className="flex-1 p-2 hover:bg-primary/10 rounded-lg transition-colors text-primary text-sm font-medium"><Edit2 size={16} className="inline mr-1" /> Edit</button>
              <button onClick={() => deleteQuote(quote.id)} className="flex-1 p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive text-sm font-medium"><Trash2 size={16} className="inline mr-1" /> Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const devotionalsContent = (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <input
          value={searchDevotionals}
          onChange={(e) => setSearchDevotionals(e.target.value)}
          placeholder="Search devotionals or scripture..."
          className="w-full md:max-w-md px-4 py-2 border border-border rounded-lg bg-card"
        />
        <button onClick={() => setEditingDevotional({ id: Date.now().toString(), title: '', date: '', scripture: '', reflection: '', prayer: '' })} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2"><Plus size={16} /> Add Devotional</button>
      </div>

      {editingDevotional && (
        <div className="bg-card rounded-lg border border-border p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">{editingDevotional.id.length > 10 ? 'Edit Devotional' : 'New Devotional'}</h3>
          <div className="space-y-4">
            <input type="text" placeholder="Title" value={editingDevotional.title} onChange={(e) => setEditingDevotional({ ...editingDevotional, title: e.target.value })} className="w-full px-4 py-2 border border-border rounded-lg bg-white" />
            <input type="text" placeholder="Scripture Reference" value={editingDevotional.scripture} onChange={(e) => setEditingDevotional({ ...editingDevotional, scripture: e.target.value })} className="w-full px-4 py-2 border border-border rounded-lg bg-white" />
            <textarea placeholder="Reflection" value={editingDevotional.reflection} onChange={(e) => setEditingDevotional({ ...editingDevotional, reflection: e.target.value })} className="w-full px-4 py-2 border border-border rounded-lg bg-white h-28" />
            <textarea placeholder="Prayer" value={editingDevotional.prayer} onChange={(e) => setEditingDevotional({ ...editingDevotional, prayer: e.target.value })} className="w-full px-4 py-2 border border-border rounded-lg bg-white h-28" />
            <div className="flex gap-3"><button onClick={() => { if (devotionals.some((d) => d.id === editingDevotional.id)) { updateDevotional(editingDevotional.id, editingDevotional) } else { addDevotional(editingDevotional) } setEditingDevotional(null) }} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">Save</button><button onClick={() => setEditingDevotional(null)} className="px-4 py-2 border rounded-lg">Cancel</button></div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {devotionals.filter((d) => {
          if (!searchDevotionals.trim()) return true
          const q = searchDevotionals.toLowerCase()
          return d.title.toLowerCase().includes(q) || d.scripture.toLowerCase().includes(q)
        }).map((d) => (
          <div key={d.id} className="bg-card rounded-lg border border-border p-6 flex flex-col h-full hover:shadow-lg transition-shadow">
            <div className="flex-1 mb-4">
              <h3 className="font-bold text-foreground mb-2">{d.title}</h3>
              <p className="text-xs text-muted-foreground font-medium mb-3">{d.scripture}</p>
              <p className="text-sm text-foreground line-clamp-3 mb-4">{d.reflection.substring(0, 150)}{d.reflection.length > 150 ? '...' : ''}</p>
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye size={14} />
                  <span>{d.views || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart size={14} />
                  <span>{d.likes || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Share2 size={14} />
                  <span>{d.shares || 0}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-4 border-t border-border">
              <button onClick={() => setEditingDevotional(d)} className="flex-1 p-2 hover:bg-primary/10 rounded-lg transition-colors text-primary text-sm font-medium"><Edit2 size={16} className="inline mr-1" /> Edit</button>
              <button onClick={() => deleteDevotional(d.id)} className="flex-1 p-2 hover:bg-destructive/10 rounded-lg transition-colors text-destructive text-sm font-medium"><Trash2 size={16} className="inline mr-1" /> Delete</button>
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
