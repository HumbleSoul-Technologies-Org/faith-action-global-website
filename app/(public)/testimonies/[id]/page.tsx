"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import Link from "next/link";
import { testimonies } from "@/lib/mock-data";
import { formatDate, timeAgo } from "@/lib/date-utils";
import { SkeletonDetailPage } from "@/components/skeleton-card";
import { useQuery } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";


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
  ThumbsUpIcon,
} from "lucide-react";
import { set } from "react-hook-form";
import { apiRequest } from "@/lib/query-client";
import test from "node:test";
import { api } from "@/lib/api";
import { tryLoadManifestWithRetries } from "next/dist/server/load-components";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface Comment {
  _id: string;
  name: string;
  comment: string;
  createdAt: string;
  likes: string[];
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
  const [userId, setUserId] = useState<string>("");
 const createUserId = async () => {
    try {
      const savedId = localStorage.getItem("userId");
      if (savedId) {
        setUserId(savedId);
      } else {
        const newId = uuidv4();
        localStorage.setItem("userId", newId);
        setUserId(newId);
      }
    } catch (error) {
      const savedId = localStorage.getItem("userId");
      if (savedId) {
        setUserId(savedId);
      }
    }
  };


  useEffect(() => {
    if (testimonyData) {
      setTestimony(testimonyData);
      
    }
    createUserId()
   
  }, [testimonyData]);
  const [reactions, setReactions] = useState<Reaction[]>([
    { type: "heart", count: testimony?.reactions?.heart || 0 },
    { type: "pray", count: testimony?.reactions?.pray || 0 },
    { type: "amen", count: testimony?.reactions?.amen || 0 },
  ]);
  const [comments, setComments] = useState<Comment[]>([
    testimony?.comments||[]
  ]);
  const [commentText, setCommentText] = useState("");
  const [commentName, setCommentName] = useState("");
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [saving, setSaving] = useState(false);
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

  

  const handleLikes = () => {
    apiRequest("POST", `/testimony/${testimony._id}/likes`, { uuid: userId })
    setTestimony((prev: any) => {
      if (!prev) return prev;
      const hasLiked = prev.likes?.includes(userId);
      const updatedLikes = hasLiked
        ? prev.likes.filter((id: string) => id !== userId)
        : [...(prev.likes || []), userId];
      return {
        ...prev,
        likes: updatedLikes,
      };
    });
    toast.success("Liked!", {
      description: "Your like has been recorded.",
    });
  };

  const handleAddComment = async() => {
    if (!commentText.trim()) return;

    try {
      setSaving(true);
      const newComment = {
        name: commentName.trim() || "Anonymous",
        comment: commentText.trim(),
        type: "testimony",
        typeId: testimony._id,
        uuid:userId
      }

      await apiRequest("POST", `/comments/new`, newComment);
       
      setCommentText("");
      setCommentName("");
      toast.success("Comment posted!", {
        description: "Your comment has been added successfully.",
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to post comment", {
        description: "Please try again later.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleShareReaction = async (testimonyId: string) => {
    const shareUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/testimonies/${testimonyId}`
        : "";

    if (shareUrl && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied!", {
        description: "Testimony link copied to clipboard.",
      });
    }

    try {
      await apiRequest("POST", `/testimony/${testimonyId}/shares`, {
        uuid: userId,
      });
      setTestimony((prev: any) => {
        if (!prev) return prev;
        return {
          ...prev,
          shares: [...(prev.shares || []), userId],
        };
      });
    } catch (error) {
      console.error("Error recording share:", error);
    }
  };


  const hundleLikeComment = async (commentId: string) => { 
    try {
      await apiRequest("POST", `/comments/${commentId}/like`, {
        uuid: userId,
      });
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
              likes: comment.likes?.includes(userId)
                ? comment.likes.filter((id) => id !== userId)
                : [...(comment.likes || []), userId],
            }
            : comment
        )
      );
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
    }
  }
  
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
                  {testimony.createdAt && (
                    <p className="text-sm text-muted-foreground">
                      {formatDate(testimony.createdAt)} •{" "}
                      {testimony.category || "Personal Story"}
                    </p>
                  )}
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
               
              <button onClick={() => handleLikes()}
                
                className={`flex cursor-pointer items-center gap-2 px-4 py-2 rounded-full border border-border bg-muted text-muted-foreground  ${
                      testimony.likes?.includes(userId)
                        ? "bg-primary border-0 text-white border-primary"
                        : "bg-muted border-border hover:border-primary"
                    }`}
              >
                
                  
                <Heart size={18} />
                <span className="font-medium">{testimony.likes?.length}</span>
              </button>
              <button
                disabled
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-muted text-muted-foreground cursor-pointer"
              >
                <Eye size={18} />
                <span className="font-medium">{testimony.views?.length}</span>
              </button>
              <button
                onClick={() => handleShareReaction(testimony._id)}
                className="flex items-center cursor-pointer gap-2 px-4 py-2 rounded-full border border-border bg-muted text-muted-foreground hover:border-primary transition-all"
              >
                <Share2 size={18} />
                <span className="font-medium">Share: {testimony.shares?.length}</span>
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
              Comments ({comments?.length})
            </h2>

            {/* Add Comment */}
            <div className="mb-8 pb-8 border-b border-border">
              <input
                type="text"
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                placeholder="Your name (leave blank for Anonymous)"
                className="w-full p-3 mb-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts and encouragement..."
                className="w-full p-4 border border-border rounded-lg bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
              />
              <button
                onClick={handleAddComment}
                disabled={!commentText.trim() || saving}
                className="mt-3 px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
              >
                {saving ? "Posting..." : "Post Comment"}
              </button>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
              {testimony.comments.map((comment:any) => (
                <div
                  key={comment._id}
                  className="border-b relative border-border pb-6 last:border-b-0"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="flex items-center gap-1 w-full">
                        <img loading='lazy' className = 'w-12 h-12' src='/user.jpg'/>
                        <p className="font-semibold text-foreground">
                        {comment.name}
                      </p></span>
                      <p className="text-sm text-muted-foreground">
                        {timeAgo(comment.createdAt)}
                      </p>
                    </div>
                    <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition">
                      <Heart className="fill-pink-600 text-pink-600" size={16} />
                      {comment.likes?.length || 0}
                    </button>
                    
                  </div>
                  <p className="text-foreground mb-5 text-justify leading-relaxed">
                    {comment.comment}
                  </p>
                    <button onClick={()=>hundleLikeComment(comment._id)} className={`flex items-center absolute bottom-2 right-1 gap-1 text-sm text-muted-foreground hover:text-primary transition `}>
                        <ThumbsUpIcon className={`cursor-pointer ${                      comment.likes?.includes(userId)
                        ? "text-primary fill-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`} size={20} />
                       
                    </button>
                </div>
              ))}
            </div>
          </div>
      </main>
      <Footer />
    </>
  );
}
