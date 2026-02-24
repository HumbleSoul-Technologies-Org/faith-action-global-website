'use client'

import { useState, useEffect } from 'react'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import Link from 'next/link'
import { empowermentArticles } from '@/lib/mock-data'
import { formatDate } from '@/lib/date-utils'
import { SkeletonDetailPage } from '@/components/skeleton-card'
import { Heart, ArrowLeft, Eye, Share2, MessageCircle, Send } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

interface ArticleComment {
  id: string
  name: string
  message: string
  date: string
}

export default function ArticleDetailsPage({ params }: PageProps) {
  const [articleId, setArticleId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [reactions, setReactions] = useState<{ [key: string]: number }>({})
  const [comments, setComments] = useState<ArticleComment[]>([])
  const [commentInput, setCommentInput] = useState('')
  const [commentName, setCommentName] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const article = empowermentArticles.find((a) => a.id === articleId)

  params.then((p) => {
    if (!articleId) setArticleId(p.id)
  })

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

  if (!article) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-lg text-muted-foreground">Article not found</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  const handleLike = () => {
    setLiked(!liked)
  }

  const handleReaction = (type: string) => {
    setReactions((prev) => ({
      ...prev,
      [type]: (prev[type] || 0) + 1,
    }))
  }

  const handleAddComment = () => {
    if (!commentInput.trim() || !commentName.trim()) return

    setComments((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: commentName,
        message: commentInput,
        date: new Date().toLocaleDateString(),
      },
    ])
    setCommentInput('')
    setCommentName('')
  }

  const handleShare = () => {
    const text = `${article.title}\n\nby ${article.author}\n\n${article.content}`
    if (navigator.share) {
      navigator.share({ title: article.title, text })
    } else {
      navigator.clipboard.writeText(text)
      alert('Article copied to clipboard!')
    }
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        {/* Article Content */}
        <section className="py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            {/* Back Button */}
            <Link href="/empowerment" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8">
              <ArrowLeft size={18} />
              Back to Articles
            </Link>

            {/* Article Header */}
            <article className="mb-12">
              {article.image && (
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-96 object-cover rounded-lg mb-8"
                />
              )}

              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {article.category}
                  </span>
                  <span className="text-sm text-muted-foreground">{formatDate(article.date)}</span>
                </div>

                <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
                  {article.title}
                </h1>

                <p className="text-lg text-muted-foreground mb-6">
                  By <span className="font-semibold text-foreground">{article.author}</span>
                </p>

                {/* Engagement Buttons */}
                <div className="flex gap-3 flex-wrap border-t border-b border-border py-4">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition ${
                      liked ? 'bg-accent text-white' : 'bg-muted hover:bg-muted/80 text-foreground'
                    }`}
                  >
                    <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
                    Like ({(article.likes || 0) + (liked ? 1 : 0)})
                  </button>

                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground font-medium">
                    <Eye size={18} />
                    Views: {article.views || 0}
                  </div>

                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-foreground font-medium transition"
                  >
                    <Share2 size={18} />
                    Share
                  </button>

                  <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-foreground font-medium ml-auto">
                    <MessageCircle size={18} />
                    {comments.length} Comments
                  </button>
                </div>
              </div>

              {/* Article Content */}
              <div className="prose prose-invert max-w-none mb-12">
                <p className="text-lg text-justify text-foreground leading-relaxed whitespace-pre-wrap">{article.content}</p>
              </div>

              {/* Quick Reactions */}
              <div className="bg-primary/5 rounded-lg p-6 mb-12">
                <p className="text-sm font-semibold text-foreground mb-4">Quick Reactions:</p>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleReaction('love')}
                    className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-foreground transition"
                  >
                    ❤️ Love ({reactions.love || 0})
                  </button>
                  <button
                    onClick={() => handleReaction('inspire')}
                    className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-foreground transition"
                  >
                    ✨ Inspiring ({reactions.inspire || 0})
                  </button>
                  <button
                    onClick={() => handleReaction('pray')}
                    className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-foreground transition"
                  >
                    🙏 Pray ({reactions.pray || 0})
                  </button>
                </div>
              </div>
            </article>

            {/* Comments Section */}
            <section className="bg-card rounded-lg border border-border p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Comments</h2>

              {/* Add Comment Form */}
              <div className="mb-8">
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={commentName}
                    onChange={(e) => setCommentName(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <textarea
                    placeholder="Share your thoughts..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={4}
                  />
                  <button
                    onClick={handleAddComment}
                    className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition font-medium"
                  >
                    <Send size={16} />
                    Post Comment
                  </button>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No comments yet. Be the first to share!</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="bg-background rounded p-4 border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-foreground">{comment.name}</p>
                        <p className="text-xs text-muted-foreground">{comment.date}</p>
                      </div>
                      <p className="text-sm text-foreground">{comment.message}</p>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
