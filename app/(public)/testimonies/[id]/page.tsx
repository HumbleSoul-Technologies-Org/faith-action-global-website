"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import Link from "next/link";
import { testimonies } from "@/lib/mock-data";
import { formatDate } from "@/lib/date-utils";
import { SkeletonDetailPage } from "@/components/skeleton-card";
import { useQuery } from "@tanstack/react-query";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

import {
  Heart,
  Share2,
  MessageCircle,
  Music,
  Play,
  ArrowLeft,
  Copy,
  Mail,
  Facebook,
  Twitter,
  Zap,
  Hand,
  Eye,
} from "lucide-react";
import { set } from "react-hook-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  likes: number;
}

interface Reaction {
  type: "heart" | "pray" | "amen";
  count: number;
}

export default function TestimonyDetailsPage({ params }: PageProps) {
  const resolvedParams = require("react").use(params);
  // const testimony = testimonies.find((t) => t._id === resolvedParams.id);

  const { data: testimonyData ,isLoading} = useQuery<any>({
    queryKey: ["testimony", resolvedParams.id],
  })

  // const [isLoading, setIsLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [testimony, setTestimony] = useState<any|null>(null);
  const [likeCount, setLikeCount] = useState(testimony?.likes.length || 0);
  const [views, setViews] = useState(testimony?.views.length || 0);

  useEffect(() => {
    if (testimonyData) {
      setTestimony(testimonyData);
      
    }
    
   
  }, [testimonyData]);
  const [reactions, setReactions] = useState<Reaction[]>([
    { type: "heart", count: testimony?.reactions?.heart || 0 },
    { type: "pray", count: testimony?.reactions?.pray || 0 },
    { type: "amen", count: testimony?.reactions?.amen || 0 },
  ]);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "Sarah Miller",
      text: "This testimony is so inspiring! Thank you for sharing your journey.",
      timestamp: "2 hours ago",
      likes: 12,
    },
    {
      id: "2",
      author: "James Wilson",
      text: "God is truly amazing. Grateful for your faithfulness.",
      timestamp: "5 hours ago",
      likes: 8,
    },
  ]);
  const [commentText, setCommentText] = useState("");
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);

  if (!testimony) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen bg-background">
          <div className="max-w-4xl mx-auto px-4 py-12 text-center">
            <p className="text-lg text-muted-foreground">Testimony not found</p>
            <Link
              href="/testimonies"
              className="text-primary hover:underline mt-4 inline-block"
            >
              Back to Testimonies
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const handleReaction = (type: string) => {
    setReactions(
      reactions.map((r) =>
        r.type === type
          ? { ...r, count: r.count + (selectedReaction === type ? -1 : 1) }
          : r,
      ),
    );
    setSelectedReaction(selectedReaction === type ? null : type);
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: String(comments.length + 1),
      author: "You",
      text: commentText,
      timestamp: "Just now",
      likes: 0,
    };
    setComments([newComment, ...comments]);
    setCommentText("");
  };

  const handleShareReaction = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

  const handleShare = (platform: string) => {
    const text = `Check out this inspiring testimony: ${testimony.title}`;
    const url = window.location.href;

    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    } else if (platform === "email") {
      window.open(
        `mailto:?subject=${testimony.title}&body=${text}%0D%0A${url}`,
      );
    } else if (platform === "facebook") {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      );
    } else if (platform === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      );
    }
    setShowShareMenu(false);
  };

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
    );
  }

  return (
    <>
      <Navigation />
      <main className="min-h-screen relative bg-background">
        {/* Back Button */}
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link
            href="/testimonies"
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
          >
            <ArrowLeft size={18} />
            Back to Testimonies
          </Link>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 pb-12">
          {/* Header Image and Info */}
          <div className="bg-card rounded-lg border border-border overflow-hidden mb-8">
            {testimony.image.url && (
              <img
                src={testimony.image?.url}
                alt={testimony.name}
                className="w-full h-96 object-cover"
              />
            )}

            {/* Header Content */}
            <div className="p-8">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                <div>
                  <h1 className="text-4xl font-serif font-bold text-foreground mb-2">
                    {testimony.title}
                  </h1>
                  <p className="text-xl text-muted-foreground font-medium mb-2">
                    {testimony.name}
                  </p>
                  {testimony.date && (
                    <p className="text-sm text-muted-foreground">
                      {formatDate(testimony.date)} •{" "}
                      {testimony.category || "Personal Story"}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className=" hidden gap-3 flex-wrap">
                  <button
                    onClick={handleLike}
                    className={`flex items-center cursor-pointer gap-2 px-4 py-2 rounded-md border transition-all ${
                      liked
                        ? "bg-primary/10 border-primary text-primary"
                        : "bg-muted border-border text-muted-foreground hover:border-primary"
                    }`}
                  >
                    <Heart size={18} fill={liked ? "currentColor" : "none"} />
                    <span className="font-medium">{likeCount}</span>
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-md border border-border text-muted-foreground hover:border-primary transition-all"
                    >
                      <Share2 size={18} />
                      Share
                    </button>

                    {showShareMenu && (
                      <div className="absolute top-12 right-0 bg-white border border-border rounded-lg shadow-lg z-50">
                        <button
                          onClick={() => handleShare("copy")}
                          className="flex items-center cursor-pointer gap-3 px-4 py-2 hover:bg-muted w-full text-left"
                        >
                          <Copy size={16} />
                          Copy Link
                        </button>
                        <button
                          onClick={() => handleShare("email")}
                          className="flex items-center cursor-pointer gap-3 px-4 py-2 hover:bg-muted w-full text-left"
                        >
                          <Mail size={16} />
                          Email
                        </button>
                        <button
                          onClick={() => handleShare("facebook")}
                          className="flex items-center cursor-pointer gap-3 px-4 py-2 hover:bg-muted w-full text-left"
                        >
                          <Facebook size={16} />
                          Facebook
                        </button>
                        <button
                          onClick={() => handleShare("twitter")}
                          className="flex items-center cursor-pointer gap-3 px-4 py-2 hover:bg-muted w-full text-left"
                        >
                          <Twitter size={16} />
                          Twitter
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Media Section */}
               {!!testimony.videoId && (
                    <div className="bg-black rounded-lg overflow-hidden mb-6">
                      <div className="aspect-video">
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${testimony.videoId}`}
                          title={testimony.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  )}
              {testimony.videoUrl.url  && (
                    <div className="bg-black rounded-lg overflow-hidden mb-6">
                      <div
                        className="relative w-full"
                        style={{ paddingBottom: "56.25%", height: 0 }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                          }}
                        >
                          <ReactPlayer
                            url={testimony.videoUrl.url}
                            controls
                            width="100%"
                            height="100%"
                            playing={false}
                          />
                        </div>
                      </div>
                    </div>
                  )}
               {testimony.audioUrl?.url && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                        <Music size={16} />
                        {testimony.title} - Audio Testimony
                      </p>
                      <audio
                        controls
                        className="w-full rounded-lg"
                        src={testimony.audioUrl.url}
                      />
                    </div>
                  )}
            </div>
          </div>

          {/* Reactions Section */}
          <div className="bg-card rounded-lg border border-border p-8 mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Reactions
            </h2>
            <div className="flex gap-3 flex-wrap">
              {[
                { type: "heart", icon: Heart, label: "Love", color: "#e74c3c" },
                 
              ].map((reaction) => {
                const count =
                  reactions.find((r) => r.type === reaction.type)?.count || 0;
                const Icon = reaction.icon;
                return (
                  <button
                    key={reaction.type}
                    onClick={() => handleReaction(reaction.type)}
                    className={`flex items-center gap-2 px-4 py-2 cursor-pointer rounded-full border transition-all ${
                      selectedReaction === reaction.type
                        ? "bg-primary/10 border-primary"
                        : "bg-muted border-border hover:border-primary"
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{count}</span>
                  </button>
                );
              })}
              <button
                disabled
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-muted text-muted-foreground cursor-default"
              >
                <Eye size={18} />
                <span className="font-medium">{views}</span>
              </button>
              <button
                onClick={handleShareReaction}
                className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-full border border-border bg-muted text-muted-foreground hover:border-primary transition-all"
              >
                <Share2 size={18} />
                <span className="font-medium">Share</span>
              </button>
            </div>
          </div>


          {/* Full Text Content */}
          <div className="bg-card rounded-lg border border-border p-8 mb-8">
            <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
              Full Testimony
            </h2>
            <p className="text-md text-justify text-foreground   mb-6   leading-relaxed">
              {testimony.description}
            </p>
            
          </div>

          
          
        </div>
        {/* Comments Section */}
          <div className="bg-card sm:absolute  sm:max-w-100 sm:top-10 left-10 rounded-lg border border-border p-8">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <MessageCircle size={24} />
              Comments ({comments.length})
            </h2>

            {/* Add Comment */}
            <div className="mb-8 pb-8 border-b border-border">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts and encouragement..."
                className="w-full p-4 border border-border rounded-lg bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
              />
              <button
                onClick={handleAddComment}
                disabled={!commentText.trim()}
                className="mt-3 px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
              >
                Post Comment
              </button>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="border-b border-border pb-6 last:border-b-0"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-foreground">
                        {comment.author}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {comment.timestamp}
                      </p>
                    </div>
                    <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition">
                      <Heart size={16} />
                      {comment.likes}
                    </button>
                  </div>
                  <p className="text-foreground leading-relaxed">
                    {comment.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
      </main>
      <Footer />
    </>
  );
}
