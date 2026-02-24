'use client'

import { useState } from 'react'
import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import Link from 'next/link'
import { sermons } from '@/lib/mock-data'
import { formatDate } from '@/lib/date-utils'
import { SkeletonDetailPage } from '@/components/skeleton-card'
import {
  Heart,
  MessageCircle,
  Music,
  Play,
  ArrowLeft,
  Send,
  Zap,
} from 'lucide-react'
import { Share2 } from 'lucide-react'

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false })

interface PageProps {
  params: Promise<{ id: string }>
}

interface SermonState {
  reactions: { [key: string]: number }
  comments: Array<{ id: string; name: string; message: string; date: string }>
  liked: boolean
}

export default function SermonDetailsPage({ params }: PageProps) {
  const [sermonId, setSermonId] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [state, setState] = useState<SermonState>({
    reactions: { heart: 0, amen: 0, inspiring: 0 },
    comments: [],
    liked: false,
  })
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])
  const [commentName, setCommentName] = useState('')

  useEffect(() => {
    params.then((p) => {
      setSermonId(p.id)
      const sermon = sermons.find((s) => s.id === p.id)
      if (sermon) {
        setState({
          reactions: sermon.reactions || { heart: 0, amen: 0, inspiring: 0 },
          comments: [],
          liked: false,
        })
      }
    })
  }, [params])

  const sermon = sermons.find((s) => s.id === sermonId)

  if (isLoading) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <SkeletonDetailPage />
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!sermon) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background">
          <div className="max-w-4xl mx-auto px-4 py-16">
            <p className="text-center text-muted-foreground">Sermon not found</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const handleReaction = (reactionType: string) => {
    setState((prev) => ({
      ...prev,
      reactions: {
        ...prev.reactions,
        [reactionType]: (prev.reactions[reactionType] || 0) + 1,
      },
    }))
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return

    setState((prev) => ({
      ...prev,
      comments: [
        ...prev.comments,
        {
          id: Date.now().toString(),
          name: commentName || 'Anonymous',
          message: newComment,
          date: new Date().toLocaleDateString(),
        },
      ],
    }))
    setNewComment('')
    setCommentName('')
  }

  const handleLike = () => {
    setState((prev) => ({
      ...prev,
      liked: !prev.liked,
      reactions: {
        ...prev.reactions,
        heart: prev.liked
          ? (prev.reactions.heart || 0) - 1
          : (prev.reactions.heart || 0) + 1,
      },
    }))
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Back Link */}
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition"
          >
            <ArrowLeft size={18} />
            Back to Sermons
          </Link>

          {/* Sermon Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              {sermon.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-muted-foreground mb-6">
              <span>By {sermon.speaker}</span>
              <span>•</span>
              <span>{formatDate(sermon.date)}</span>
              <span>•</span>
              <span>{sermon.passage}</span>
              <span>•</span>
              <span>{sermon.duration}</span>
            </div>
          </div>

          {/* Media Player */}
          {(sermon.videoId || sermon.videoUrl || sermon.audioUrl) && (
            <div className="bg-black rounded-lg overflow-hidden mb-8">
              {sermon.videoId && (
                <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${sermon.videoId}`}
                    title={sermon.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
              {sermon.videoUrl && !sermon.videoId && (
                <div className="aspect-video">
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <ReactPlayer
                      url={sermon.videoUrl}
                      controls
                      width="100%"
                      height="100%"
                      playing={false}
                    />
                  </div>
                </div>
              )}
              {sermon.audioUrl && !sermon.videoId && !sermon.videoUrl && (
                <div className="bg-linaer-to-br from-primary/10 to-accent/10 p-8 flex items-center justify-center min-h-48">
                  <div className="text-center">
                    <Music className="text-primary mx-auto mb-4" size={48} />
                    <p className="text-lg font-semibold text-foreground mb-6">{sermon.title}</p>
                    <audio
                      controls
                      className="w-full max-w-md"
                      src={sermon.audioUrl}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sermon Description */}
          <div className="bg-card rounded-lg border border-border p-8 mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">About This Sermon</h2>
            <p className="text-foreground leading-relaxed text-lg">{sermon.description}</p>
          </div>

          {/* Reactions Bar */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-1 bg-muted/10 p-2 rounded-full">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
                  state.liked
                    ? 'bg-accent text-white'
                    : 'hover:bg-primary/20 text-foreground'
                }`}
              >
                <Heart size={18} fill={state.liked ? 'currentColor' : 'none'} />
                <span className="text-sm font-medium">{state.reactions.heart || 0}</span>
              </button>
              <button
                onClick={() => handleReaction('amen')}
                className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-primary/20 text-foreground transition"
              >
                <Zap size={18} />
                <span className="text-sm font-medium">Amen ({state.reactions.amen || 0})</span>
              </button>
              <button
                onClick={() => handleReaction('inspiring')}
                className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-primary/20 text-foreground transition"
              >
                <span className="text-sm font-medium">Inspiring ({state.reactions.inspiring || 0})</span>
              </button>
              <button
                onClick={() => {
                  const url = (typeof window !== 'undefined')
                    ? `${window.location.origin}/resources/${sermon.id}`
                    : `/resources/${sermon.id}`
                  if (navigator.share) {
                    navigator.share({ title: sermon.title, url }).catch(() => {})
                  } else if (navigator.clipboard) {
                    navigator.clipboard.writeText(url).then(() => {
                      alert('Sermon link copied to clipboard')
                    })
                  } else {
                    prompt('Copy this link', url)
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-primary/20 text-foreground transition"
              >
                <Share2 size={18} />
                <span className="text-sm font-medium">Share</span>
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-card rounded-lg border border-border p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <MessageCircle size={24} />
              Comments ({state.comments.length})
            </h2>

            {/* Add Comment Form */}
            <div className="mb-8 p-6 bg-muted/20 rounded-lg border border-border">
              <input
                type="text"
                placeholder="Your name (optional)"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                className="w-full px-4 py-2 mb-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <textarea
                placeholder="Share your thoughts about this sermon..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full px-4 py-2 mb-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={4}
              />
              <button
                onClick={handleAddComment}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition font-medium"
              >
                <Send size={18} />
                Post Comment
              </button>
            </div>

            {/* Comments List */}
            {state.comments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No comments yet. Be the first to share your thoughts!
              </p>
            ) : (
              <div className="space-y-4">
                {state.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-4 bg-background border border-border rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold text-foreground">{comment.name}</p>
                      <p className="text-xs text-muted-foreground">{comment.date}</p>
                    </div>
                    <p className="text-foreground leading-relaxed">{comment.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
