'use client'

import { useState } from 'react'
import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import Link from 'next/link'
import { sermons } from '@/lib/mock-data'
import { formatDate, timeAgo } from '@/lib/date-utils'
import { SkeletonDetailPage } from '@/components/skeleton-card'
import { useQuery } from "@tanstack/react-query";

import {
  Heart,
  MessageCircle,
  Music,
  Play,
  ArrowLeft,
  Send,
  Zap,
  Eye,
  Loader,
  Clock,
  ThumbsUpIcon
} from 'lucide-react'
import { Share2 } from 'lucide-react'
import { set } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid';
import { apiRequest } from '@/lib/query-client'

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

  const resolvedParams = require("react").use(params);
  
   const { data: sermonData  } = useQuery<any>({
    queryKey: ["sermons", `${resolvedParams.id}`],
  })
  const [userId, setUserId] = useState<string>('')
  
  const [sermon, setSermon] = useState<any>(null)
  const [saving, setSaving] = useState<any>(false)
  const [processing, setProcessing] = useState<any>('')
  const [isLoading, setIsLoading] = useState(true)
   
  const [newComment, setNewComment] = useState('')
const [commentName, setCommentName] = useState('')
  const [commentErrors, setCommentErrors] = useState({
    name: '',
    comment: '',
  })
  const [commentTouched, setCommentTouched] = useState({
    name: false,
    comment: false,
  })

  const validateCommentField = (name: string, value: string) => {
    let error = ''

    switch (name) {
      case 'name':
        if (value.trim() && value.trim().length < 2) {
          error = 'Name must be at least 2 characters'
        } else if (value.trim() && !/^[a-zA-Z\s]+$/.test(value.trim())) {
          error = 'Name can only contain letters and spaces'
        }
        break

      case 'comment':
        if (!value.trim()) {
          error = 'Comment is required'
        } else if (value.trim().length < 5) {
          error = 'Comment must be at least 5 characters'
        } else if (value.trim().length > 500) {
          error = 'Comment must be less than 500 characters'
        }
        break

      default:
        break
    }

    return error
  }

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === 'commentName') setCommentName(value)
    if (name === 'newComment') setNewComment(value)

    // Clear error when user starts typing
    if (commentErrors[name === 'commentName' ? 'name' : 'comment']) {
      setCommentErrors((prev) => ({ ...prev, [name === 'commentName' ? 'name' : 'comment']: '' }))
    }
  }

  const handleCommentBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const fieldName = name === 'commentName' ? 'name' : 'comment'
    setCommentTouched((prev) => ({ ...prev, [fieldName]: true }))

    const error = validateCommentField(fieldName, value)
    setCommentErrors((prev) => ({ ...prev, [fieldName]: error }))
  }

  const validateCommentForm = () => {
    const newErrors = {
      name: validateCommentField('name', commentName),
      comment: validateCommentField('comment', newComment),
    }

    setCommentErrors(newErrors)
    setCommentTouched({
      name: true,
      comment: true,
    })

    return !Object.values(newErrors).some(error => error !== '')
  }
  
   const createUserId = async () => { 
    try {
       const savedId = localStorage.getItem('userId')
      if (savedId) {
        setUserId(savedId)
      } else {
        const newId = uuidv4();
        localStorage.setItem('userId', newId);
        setUserId(newId);
      }
      
    } catch (error) {
      const savedId = localStorage.getItem('userId')
      if (savedId) {
        setUserId(savedId)
      }
    }
  }
  useEffect(() => {
 if (sermonData) {
   setSermon(sermonData)
    createUserId()
 }

    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [sermonData,params])
  

  

  

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

  
 

  const handleAddComment = async() => {
    if (!validateCommentForm()) {
      return
    }

    try {
      setSaving(true)
      const commentData = {
        name: commentName.trim() || 'Anonymous',
        comment: newComment.trim(),
        type:'sermon',
        typeId: sermon._id,
        uuid: userId,
      };

      await apiRequest('POST', '/comments/new', commentData)
      setNewComment('')
      setCommentName('')
      setCommentErrors({ name: '', comment: '' })
      setCommentTouched({ name: false, comment: false })
      
  
} catch (error) {
  console.log('====================================');
  console.log(error);
  console.log('====================================');
} finally {
  setSaving(false)
  
}
   
  }

  const handleLike = async() => {
    try {
  await apiRequest('POST', `/sermons/${sermon._id}/like`, { uuid: userId })
  setSermon((prev: any) => ({
    ...prev,
    likes: prev.likes.includes(userId)
      ? prev.likes.filter((id: string) => id !== userId)
      : [...prev.likes, userId],
  }))
  
} catch (error) {
  console.log('====================================');
  console.log(error);
  console.log('====================================');
}
     
  }
  const handleShare = async() => {
    try {
  await apiRequest('POST', `/sermons/${sermon._id}/shares`, { uuid: userId })
  setSermon((prev: any) => ({
    ...prev,
    shares: [...prev.shares, userId],
  }))
  
} catch (error) {
  console.log('====================================');
  console.log(error);
  console.log('====================================');
}
    // setState((prev) => ({
    //   ...prev,
    //   liked: !prev.liked,
    //   reactions: {
    //     ...prev.reactions,
    //     heart: prev.liked
    //       ? (prev.reactions.heart || 0) - 1
    //       : (prev.reactions.heart || 0) + 1,
    //   },
    // }))
  }
  const likeComment = async(commentId: string) => {
    try {
       setProcessing(commentId)
      await apiRequest('POST', `/comments/${commentId}/like`, { uuid: userId })
      setSermon((prev: any) => ({
        ...prev,
        comments: prev.comments.map((comment: any) =>
          comment._id === commentId
            ? {
              ...comment,
              likes: comment.likes.includes(userId)
                ? comment.likes.filter((id: string) => id !== userId)
                : [...comment.likes, userId],
            }
            : comment
        ),
      }))
      
     } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
     } finally {
       setProcessing('')
     }
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen relative bg-background">
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
              <span>{sermon.scripture}</span>
              <span>•</span>
              <span>{sermon.duration}</span>
            </div>
          </div>

          {/* Media Player */}
          {(sermon.videoId || sermon.videoUrl?.url || sermon.audioUrl?.url) && (
            <div className="bg-linear-to-br from-primary/10 to-accent/10 rounded-lg overflow-hidden mb-8">
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
              {sermon.videoUrl?.url && !sermon.videoId && (
                <div className="aspect-video">
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <ReactPlayer
                      url={sermon.videoUrl?.url}
                      controls
                      width="100%"
                      height="100%"
                      playing={false}
                    />
                  </div>
                </div>
              )}
              {sermon.audioUrl?.url && !sermon.videoId && !sermon.videoUrl?.url && (
                <div className="bg-linaer-to-br from-primary/10 to-accent/10 p-8 flex items-center justify-center min-h-48">
                  <div className="text-center  ">
                    <Music className="text-primary mx-auto mb-4" size={48} />
                    <p className="text-lg font-semibold text-foreground mb-6">{sermon.title}</p>
                    <audio
                      controls
                      className="w-full max-w-md"
                      src={sermon.audioUrl?.url}
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
          <div className="mb-8 w-full text-right">
            <div className="inline-flex items-center gap-1 bg-muted/10 p-2 rounded-full">
              <button
                onClick={handleLike}
                className={`flex items-center cursor-pointer gap-2 px-4 py-2 rounded-full transition ${
                  sermon.likes.includes(userId)
                    ? 'bg-primary text-white'
                    : 'hover:bg-primary/20 text-foreground'
                }`}
              >
                <Heart size={18} fill={sermon.likes.includes(userId) ? 'currentColor' : 'none'} />
                <span className="text-sm font-medium">{sermon.likes.length || 0}</span>
              </button>
              <button
                
                className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-full transition bg-primary/20 text-foreground
                  `}
              >
                <Eye size={18}  />
                <span className="text-sm font-medium">{sermon.views.length || 0}</span>
              </button>
               
               
              <button
                onClick={() => {
                  const url = (typeof window !== 'undefined')
                    ? `${window.location.origin}/resources/${sermon._id}`
                    : `/resources/${sermon._id}`
                  if (navigator.share) {
                    navigator.share({ title: sermon.title, url }).catch(() => {})
                  } else if (navigator.clipboard) {
                    navigator.clipboard.writeText(url).then(() => {
                      handleShare();
                    })
                  } else {
                    prompt('Copy this link', url)
                  }
                }}
                className="flex cursor-pointer items-center gap-2 px-4 py-2 rounded-full hover:bg-primary/20 text-foreground transition"
              >
                <Share2 size={18} />
                <span className="text-sm font-medium">Shares: {sermon.shares.length}</span>
              </button>
            </div>
          </div>

          
        </div>
        {/* Comments Section */}
          <div className="bg-card sm:absolute top-10 left-10 sm:w-100 rounded-lg border border-border p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <MessageCircle size={24} />
              Comments ({sermon.comments.length})
            </h2>

            {/* Add Comment Form */}
            <div className="mb-8 p-6    border-b border-border">
              <input
                type="text"
                name="commentName"
                placeholder="Your name (leave blank for Anonymous)"
                value={commentName}
                onChange={handleCommentChange}
                onBlur={handleCommentBlur}
                className={`w-full px-4 py-2 mb-3 border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 ${
                  commentErrors.name && commentTouched.name
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-border focus:ring-primary'
                }`}
              />
              {commentErrors.name && commentTouched.name && (
                <p className="mt-1 mb-3 text-sm text-red-600">{commentErrors.name}</p>
              )}
              <textarea
                name="newComment"
                placeholder="Share your thoughts about this sermon..."
                value={newComment}
                onChange={handleCommentChange}
                onBlur={handleCommentBlur}
                className={`w-full px-4 py-2 mb-3 border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 resize-none ${
                  commentErrors.comment && commentTouched.comment
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-border focus:ring-primary'
                }`}
                rows={4}
              />
              {commentErrors.comment && commentTouched.comment && (
                <p className="mt-1 mb-3 text-sm text-red-600">{commentErrors.comment}</p>
              )}
              <p className="text-xs text-muted-foreground mb-3">
                {newComment.length}/500 characters
              </p>
              <button
                onClick={handleAddComment}
                disabled={saving || !newComment.trim()}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? <>Posting Comment ... <Loader className='w-4 h-4 animate-spin'/></> : <>Post Comment</>}
              </button>
            </div>

            {/* Comments List */}
            {sermon.comments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No comments yet. Be the first to share your thoughts!
              </p>
            ) : (
              <div className="space-y-4">
                {sermon.comments
                  .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((comment:any,i:number) => (
                  <div
                    key={i}
                    className="p-4 bg-background pb-3 relative border border-border rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className='flex items-center justify-center gap-1'><img loading='lazy' src='/user.jpg' className='w-10 h-10 rounded-full' /> <p className="font-semibold text-foreground">{comment.name}</p></span>
                     
                      
                    </div>
                    <p className="text-foreground mb-5 text-justify leading-relaxed">{comment.comment}</p>
                     <p className="text-xs absolute -top-1 right-2  mt-5 text-muted-foreground"><Clock className="w-4 h-4 inline mr-2" />{timeAgo(comment.createdAt)}</p>
                     {processing === comment._id ? <Loader className='w-4 h-4 animate-spin absolute bottom-2 right-2' /> :<p className="text-xs items-center justify-center absolute bottom-1 right-2  mt-5 text-muted-foreground"><ThumbsUpIcon onClick={()=>likeComment(comment._id)} className={`w-5 h-5 cursor-pointer ${comment.likes.includes(userId) ? 'text-primary fill-primary' : ''} inline mb-1 mr-1`} />: {comment.likes?.length} Likes</p>}
                    
                  </div>
                ))}
              </div>
            )}
          </div>
      </main>
      <Footer />
    </>
  )
}
