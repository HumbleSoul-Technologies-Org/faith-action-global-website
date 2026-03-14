"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import Tabs from "@/components/tabs";
import { formatDate } from "@/lib/date-utils";
import { SkeletonList } from "@/components/skeleton-card";
import {
  Quote,
  Calendar,
  Music,
  Video,
  Heart,
  MessageCircle,
  Send,
  ArrowRight,
  Eye,
  Share2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/query-client";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

type SermonFilterType = "all" | "video" | "audio";

interface SermonState {
  reactions: { [key: string]: number };
  comments: Array<{ id: string; name: string; message: string; date: string }>;
  liked: boolean;
}

interface EngagementState {
  views: number;
  likes: number;
  liked: boolean;
  reactions: { [key: string]: number };
}

export default function ResourcesPage() {
  const { data: sermonData } = useQuery<any[]>({
    queryKey: ["sermons", "all"],
  });
  const { data: quotesData } = useQuery<any[]>({
    queryKey: ["quotes", "all"],
  });
  const { data: devotionalData } = useQuery<any[]>({
    queryKey: ["devotionals", "all"],
  });
  const [userId, setUserId] = useState<string>("");

  const [sermonFilter, setSermonFilter] = useState<SermonFilterType>("all");
  const [sermonStates, setSermonStates] = useState<{
    [key: string]: SermonState;
  }>({});
   
  const [quoteEngagement, setQuoteEngagement] = useState<{
    [key: string]: EngagementState;
  }>({});
  
  const [isLoading, setIsLoading] = useState(true);
  const [sermons, setSermons] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const [devotionals, setDevotionals] = useState<any[]>([]);

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
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (sermonData) {
      setSermons(sermonData);
    }
    if (quotesData) {
      setQuotes(quotesData);
    }
    if (devotionalData) {
      setDevotionals(devotionalData);
    }

    createUserId();

    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [sermonData, quotesData, devotionalData]);

  const filteredSermons = sermons?.filter((sermon) => {
    if (sermonFilter === "all") return true;
    if (sermonFilter === "video") return sermon.videoId || sermon.videoUrl?.url;
    if (sermonFilter === "audio") return typeof sermon.audioUrl === "object" && sermon.audioUrl?.url;
    return true;
  });

  const getSermonState = (sermonId: string): SermonState => {
    if (!sermonStates[sermonId]) {
      const sermon = sermons.find((s) => s._id === sermonId);
      setSermonStates((prev) => ({
        ...prev,
        [sermonId]: {
          reactions: sermon?.reactions || { heart: 0, amen: 0, inspiring: 0 },
          comments: [],
          liked: false,
        },
      }));
      return (
        sermonStates[sermonId] || {
          reactions: sermon?.reactions || { heart: 0, amen: 0, inspiring: 0 },
          comments: [],
          liked: false,
        }
      );
    }
    return sermonStates[sermonId];
  };

  

  const getQuoteEngagement = (quoteId: string, quote: any): EngagementState => {
    if (!quoteEngagement[quoteId]) {
      setQuoteEngagement((prev) => ({
        ...prev,
        [quoteId]: {
          views: quote.views || 0,
          likes: quote.likes || 0,
          liked: false,
          reactions: quote.reactions || { love: 0, inspire: 0, pray: 0 },
        },
      }));
      return (
        quoteEngagement[quoteId] || {
          views: quote.views || 0,
          likes: quote.likes || 0,
          liked: false,
          reactions: quote.reactions || { love: 0, inspire: 0, pray: 0 },
        }
      );
    }
    return quoteEngagement[quoteId];
  };

  

  const handleQuoteLike = (quoteId: string) => {
   
    setQuoteEngagement((prev) => ({
      ...prev,
      [quoteId]: {
        ...prev[quoteId],
        liked: !prev[quoteId].liked,
        likes: prev[quoteId].liked
          ? prev[quoteId].likes - 1
          : prev[quoteId].likes + 1,
      },
    })); apiRequest("POST", `/quotes/${quoteId}/likes`, { uuid: userId });
  };

  const handleShareQuote = (quote: any) => {
    const text = `"${quote.quote}"\n\n- ${quote.scripture}`;
    if (navigator.share) {
      navigator.share({ title: "Gospel Quote", text });
      toast.success("Shared!", {
        description: "Quote shared successfully.",
      });
    } else {
      navigator.clipboard.writeText(text);
      apiRequest("POST", `/quotes/${quote._id}/shares`, { uuid: userId });
      toast.success("Copied to clipboard!", {
        description: "Quote link copied to clipboard.",
      });
    }
  };

  const handleDevotionalLike = (devotionalId: string) => {
    apiRequest("POST", `/devotionals/${devotionalId}/likes`, { uuid: userId });
    setDevotionals((prev) => 
      prev.map((d) =>
        d._id === devotionalId
          ? { ...d, liked: !d.liked, likes: d.liked ? d.likes - 1 : d.likes + 1 }
          : d
      )
    );
  };

  const handleShareDevotional = (devotional: any) => {
    const text = `${devotional.title}\n\nScripture: ${devotional.scripture}\n\n${devotional.reflection}`;
    if (navigator.share) {
      navigator.share({ title: devotional.title, text });
      toast.success("Shared!", {
        description: "Devotional shared successfully.",
      });
    } else {
      navigator.clipboard.writeText(text);
      apiRequest("POST", `/devotionals/${devotional._id}/shares`, { uuid: userId })
      setDevotionals((prev) =>
        prev.map((d) =>
          d._id === devotional._id
            ? { ...d, shares: [...(d.shares || []), userId] }
            : d
        )
      );
      toast.success("Copied to clipboard!", {
        description: "Devotional copied to clipboard.",
      });
    }
  };

  const handleShare = async (sermonId: string, type: string) => {
    try {
      await apiRequest("POST", `/${type}/${sermonId}/shares`, { uuid: userId });
      setSermons((prev) =>
        prev.map((s) =>
          s._id === sermonId ? { ...s, shares: [...s.shares, userId] } : s,
        ),
      );
      toast.success("Shared!", {
        description: "Your share has been recorded.",
      });
    } catch (error) {
      toast.error("Failed to share", {
        description: "Please try again later.",
      });
    }
  };

  const handleLike = async (sermonId: string, type: string) => {
    try {
      await apiRequest("POST", `/${type}/${sermonId}/like`, { uuid: userId });
      if (type === 'sermon') { 
         setSermons((prev) =>
        prev.map((s) =>
          s._id === sermonId ? { ...s, likes: [...s.likes, userId] } : s,
        ),
      );
      }
      toast.success("Liked!", {
        description: "Your like has been recorded.",
      });
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
      toast.error("Failed to like", {
        description: "Please try again later.",
      });
    }
  };
  const handleView = async (sermonId: string) => {
    try {
      await apiRequest("POST", `/sermons/${sermonId}/views`, { uuid: userId });
      setSermons((prev) =>
        prev.map((s) =>
          s._id === sermonId ? { ...s, views: [...s.views, userId] } : s,
        ),
      );
    } catch (error) {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
    }
  };

  const sermonsContent = (
    <div className="space-y-6">
      <p className="text-muted-foreground mb-6">
        Listen to inspiring messages from our pastors and teachers. Each sermon
        explores biblical truths and practical applications for daily living.
      </p>

      {/* Sermon Filters */}
      <div className="flex flex-wrap gap-2 items-center mb-8">
        <button
          onClick={() => setSermonFilter("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            sermonFilter === "all"
              ? "bg-primary text-primary-foreground shadow-lg"
              : "bg-muted text-foreground hover:bg-muted/80"
          }`}
        >
          All ({sermons.length})
        </button>
        <button
          onClick={() => setSermonFilter("video")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
            sermonFilter === "video"
              ? "bg-primary text-primary-foreground shadow-lg"
              : "bg-muted text-foreground hover:bg-muted/80"
          }`}
        >
          <Video size={16} /> Videos (
          {sermons.filter((s) => s.videoId || s.videoUrl?.url).length})
        </button>
        <button
          onClick={() => setSermonFilter("audio")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
            sermonFilter === "audio"
              ? "bg-primary text-primary-foreground shadow-lg"
              : "bg-muted text-foreground hover:bg-muted/80"
          }`}
        >
          <Music size={16} /> Audio (
          {sermons.filter((s) => s.audioUrl?.url).length})
        </button>
      </div>

      {isLoading ? (
        <SkeletonList count={2} />
      ) : filteredSermons.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            No sermons found for this category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSermons.map((sermon) => {
            const state = getSermonState(sermon._id);
            return (
              <div
                key={sermon._id}
                className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full"
              >
                {/* Video/Audio Player or Preview */}
                {sermon.videoId && (
                  <div className="bg-black aspect-video">
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
                {sermon.videoUrl?.url && (
                  <div className="bg-black aspect-video">
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                      }}
                    >
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
                {sermon.audioUrl?.url && (
                  <div className="bg-linear-to-br from-primary/10 to-accent/10 p-6 flex items-center justify-center min-h-32">
                    <div className="text-center">
                      <Music className="text-primary mx-auto mb-3" size={32} />
                      <p className="text-sm font-semibold text-foreground mb-3">
                        Audio Sermon
                      </p>
                      <audio
                        controls
                        className="w-full max-w-xs"
                        src={sermon.audioUrl?.url}
                      />
                    </div>
                  </div>
                )}

                {/* Sermon Info */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg truncate line-clamp-2 text-wrap font-bold text-foreground mb-1">
                        {sermon.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {sermon.speaker}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {sermon.videoId || sermon.videoUrl?.url ? (
                        <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center">
                          <Video size={16} />
                        </div>
                      ) : null}
                      {sermon.audioUrl?.url &&
                      !sermon.videoId &&
                      !sermon.videoUrl?.url ? (
                        <div className="w-8 h-8 rounded-full bg-secondary text-foreground flex items-center justify-center">
                          <Music size={16} />
                        </div>
                      ) : null}
                    </div>
                  </div>
                  {/* <p  className="text-sm truncate line-clamp-3 text-wrap text-foreground mb-4  text-justify ">
                    {sermon.description}
                  </p> */}
                  <div className="flex justify-between items-center text-xs text-muted-foreground pt-4 pb-4 border-t border-b border-border">
                    <span className="font-medium">{sermon.scripture}</span>
                    <span>{sermon.duration}</span>
                  </div>

                  {/* Reactions (grouped) */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="inline-flex items-center gap-1 bg-muted/10 p-1 rounded-full">
                      <button
                        // onClick={() => handleReaction(sermon._id, "heart")}
                        className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-primary/20 text-foreground transition"
                        aria-label="views"
                        disabled={true}
                      >
                        <Eye size={16} className="text-accent" />
                        <span className="text-xs">
                          {sermon.views.length || 0}
                        </span>
                      </button>
                      <button
                        onClick={() => handleLike(sermon._id,'sermons')}
                        className={`flex ${
                          sermon.likes.includes(userId)
                            ? "bg-primary text-white"
                            : "hover:bg-primary/20 text-foreground"
                        } cursor-pointer items-center gap-2 px-3 py-2 rounded-full hover:bg-primary/20 text-foreground transition`}
                        aria-label="Like"
                      >
                        <Heart
                          size={16}
                          className={`${sermon.likes.includes(userId) ? "text-current fill-current" : "text-accent"}`}
                        />
                        <span className="text-xs">
                          {sermon.likes.length || 0}
                        </span>
                      </button>

                      {/* Share BTN */}
                      <button
                        onClick={() => {
                          const url =
                            typeof window !== "undefined"
                              ? `${window.location.origin}/resources/${sermon._id}`
                              : `/resources/${sermon._id}`;
                          if (navigator.share) {
                            navigator
                              .share({ title: sermon.title, url })
                              .catch(() => {});
                          } else if (navigator.clipboard) {
                            navigator.clipboard.writeText(url).then(() => {
                              handleShare(sermon._id, 'sermons');
                            });
                          } else {
                            prompt("Copy this link", url);
                          }
                        }}
                        className="flex cursor-pointer items-center gap-2 px-3 py-2 rounded-full hover:bg-primary/20 text-foreground transition"
                        aria-label="Share"
                      >
                        <Share2 size={16} />
                        <span className="text-xs">
                          {sermon.shares.length || 0}
                        </span>
                      </button>
                    </div>

                    <Link
                      onClick={()=>handleView(sermon._id)}
                      href={`/resources/${sermon._id}`}
                      className="flex items-center gap-2 px-3 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition"
                    >
                      <MessageCircle size={16} />
                      <span className="text-xs">{sermon.comments.length}</span>
                    </Link>
                  </div>

                  {/* View Details Link */}
                  <div className="mt-4 text-right">
                    <Link
                      onClick={()=>{handleView(sermon._id)}}
                      href={`/resources/${sermon._id}`}
                      className="inline-flex  items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition"
                    >
                      View Full Sermon <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const quotesContent = (
    <div className="space-y-6">
      <p className="text-muted-foreground mb-6">
        Discover powerful verses from Scripture to inspire and encourage your
        faith journey.
      </p>
      <div className="space-y-4">
        {quotes.map((quote) => {
          const engagement = getQuoteEngagement(quote._id, quote);
          return (
            <div
              key={quote._id}
              className="bg-linaer-to-r from-primary/5 to-accent/5 rounded-lg border border-border p-8 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <Quote className="text-primary mt-1 shrink-0" size={24} />
                <div className="flex-1">
                  <p className="text-lg text-foreground mb-4 leading-relaxed italic">
                    "{quote.quote}"
                  </p>
                  <p className="text-sm font-medium text-primary mb-4">
                    {quote.scripture}
                  </p>

                  {/* Engagement Buttons */}
                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={() => handleQuoteLike(quote._id)}
                      className={`flex items-center cursor-pointer gap-2 px-3 py-2 rounded-full text-sm transition ${
                        quote.likes.includes(userId)
                          ? "bg-accent text-white"
                          : "bg-muted hover:bg-muted/80 text-foreground"
                      }`}
                    >
                      <Heart
                        size={14}
                        fill={quote.likes.includes(userId) ? "currentColor" : "none"}
                      />
                      <span>{quote.likes?.length}</span>
                    </button>

                    <button
                      onClick={() => handleShareQuote(quote)}
                      className="flex items-center cursor-pointer gap-2 px-3 py-2 rounded-full bg-muted hover:bg-muted/80 text-foreground text-sm transition ml-auto"
                    >
                      <Share2 size={14} />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const devotionalsContent = (
    <div className="space-y-6">
      <p className="text-muted-foreground mb-6">
        Start your day with our daily devotionals. Each reflection includes
        Scripture, insight, and prayer to guide your spiritual journey.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {devotionals.map((devotional) => {
           
          return (
            <div
              key={devotional._id}
              className="bg-card rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-foreground">
                    {devotional.title}
                  </h3>
                </div>
              </div>
              <span className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                <Calendar className="text-primary" size={20} />
                <p className="text-sm text-muted-foreground  ">
                  {formatDate(devotional.createdAt)}
                </p>
              </span>
              <div className="mb-4">
                <p className="text-xs font-semibold text-primary mb-2">
                  Scripture: {devotional.scripture}
                </p>
                <p className="text-sm text-foreground leading-relaxed mb-4">
                  {devotional.reflection}
                </p>
              </div>
              {devotional.prayer && (
                <div className="bg-primary/5 rounded p-4 border border-primary/20 mb-4">
                  <p className="text-xs font-semibold text-primary mb-2">
                    Prayer
                  </p>
                  {devotional?.prayer}
                </div>
              )}

              {/* Engagement Buttons */}
              <div className="flex gap-2 flex-wrap pt-4 border-t border-border">
                <button
                  onClick={() => handleDevotionalLike(devotional._id)}
                  className={`flex items-center cursor-pointer gap-1 px-2 py-1 rounded text-xs transition ${
                    devotional.likes.includes(userId)
                      ? "bg-accent text-white"
                      : "bg-muted hover:bg-muted/80 text-foreground"
                  }`}
                >
                  <Heart
                    size={14}
                    fill={devotional.liked?.length ? "currentColor" : "none"}
                  />
                  {devotional.likes?.length}
                </button>

                <button
                  onClick={() => handleShareDevotional(devotional)}
                  className="flex items-center cursor-pointer  gap-1 px-2 py-1 rounded bg-muted hover:bg-muted/80 text-foreground text-xs transition ml-auto"
                >
                  <Share2 size={12} /> Shares : {devotional.shares?.length}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const tabs = [
    { id: "sermons", label: "Sermons", content: sermonsContent },
    { id: "quotes", label: "Gospel Quotes", content: quotesContent },
    { id: "devotionals", label: "Word of Day", content: devotionalsContent },
  ];

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background">
        {/* Page Header */}
        <section className="bg-linear-to-b from-primary/10 to-transparent py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
              Spiritual Resources
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Explore our collection of sermons, Scripture verses, and daily
              devotionals to deepen your faith and grow spiritually.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4">
            <Tabs tabs={tabs} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
