"use client";
import React, { useState } from "react";
import Link from "next/link";
import Hls from "hls.js";
import { Play, Star, Eye, CheckCircle2, Sparkles, Volume2, VolumeX } from "lucide-react";
import { categories } from "@/lib/data";
import { useTranslations } from "next-intl";

interface BackendVideo {
  id: string;
  creator_id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  views: number;
  is_premium: boolean;
  created_at: string;
}

function VideoCard({ 
  video, 
  t, 
  isPlayingPreview, 
  onRequestPlay, 
  onRequestStop 
}: { 
  video: BackendVideo; 
  t: any; 
  isPlayingPreview: boolean; 
  onRequestPlay: () => void; 
  onRequestStop: () => void; 
}) {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const autoStopTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    // 🌟 ဖုန်း (Touch) ဖြစ်နေပါက လုံးဝ မဖွင့်ဘဲ PC (Mouse) သာ ဖွင့်ပေးမည်
    if (typeof window !== "undefined" && !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    hoverTimeoutRef.current = setTimeout(() => {
      onRequestPlay();
    }, 800);
  };

  const handleMouseLeave = () => {
    if (typeof window !== "undefined" && !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    if (autoStopTimeoutRef.current) clearTimeout(autoStopTimeoutRef.current);
    onRequestStop();
    setIsMuted(true);
  };

  React.useEffect(() => {
    if (isPlayingPreview) {
      autoStopTimeoutRef.current = setTimeout(() => {
        onRequestStop();
        setIsMuted(true);
      }, 12000);
    }
    return () => {
      if (autoStopTimeoutRef.current) clearTimeout(autoStopTimeoutRef.current);
    };
  }, [isPlayingPreview, onRequestStop]);

  const toggleMute = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  React.useEffect(() => {
    const vid = videoRef.current;
    if (!isPlayingPreview || !vid || !video.video_url) return;

    let hlsInstance: Hls | null = null;

    if (video.video_url.includes(".m3u8")) {
      if (Hls.isSupported()) {
        const hls = new Hls({ capLevelToPlayerSize: true });
        hls.loadSource(video.video_url);
        hls.attachMedia(vid);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          vid.play().catch(() => {});
        });
        hlsInstance = hls;
      } else if (vid.canPlayType("application/vnd.apple.mpegurl")) {
        vid.src = video.video_url;
        vid.play().catch(() => {});
      }
    } else {
      vid.src = video.video_url;
      vid.play().catch(() => {});
    }

    return () => {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
      if (vid) {
        vid.pause();
        vid.removeAttribute("src");
        vid.load();
      }
    };
  }, [isPlayingPreview, video.video_url]);

  return (
    <div 
      className="group cursor-pointer flex flex-col gap-2.5"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={`/watch/${video.id}`} className="relative w-full aspect-[16/9] rounded-xl bg-zinc-900 border border-white/5 overflow-hidden flex items-center justify-center">
        <img 
          src={video.thumbnail_url || "https://images.unsplash.com/photo-1611162617474-5b21e879e113"} 
          alt={video.title} 
          className="w-full h-full object-cover group-hover:scale-105 opacity-0 transition-all duration-700 ease-in-out" 
          onLoad={(e) => e.currentTarget.classList.remove("opacity-0")}
          loading="lazy"
        />

        {isPlayingPreview && (
          <>
            <video
              ref={videoRef}
              muted={isMuted}
              playsInline
              loop
              className="absolute inset-0 w-full h-full object-cover z-20 bg-black animate-in fade-in duration-300 pointer-events-none"
            />
            <button
              type="button"
              onClick={toggleMute}
              className="absolute bottom-2.5 right-2.5 z-30 w-8 h-8 rounded-full bg-black/75 hover:bg-black border border-white/20 text-white flex items-center justify-center active:scale-90 transition-transform cursor-pointer shadow-lg"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-zinc-300" />
              ) : (
                <Volume2 className="w-4 h-4 text-white" />
              )}
            </button>
          </>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        
        {!isPlayingPreview && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 pointer-events-none">
            <div className="w-12 h-12 rounded-full bg-[#8c1cff] text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
              <Play className="w-5 h-5 fill-white ml-0.5" />
            </div>
          </div>
        )}
      </Link>

      <div className="flex items-start gap-3 px-0.5">
        <Link href={`/channel/khit_admin`} className="relative shrink-0 z-10 rounded-full hover:scale-105 transition-transform">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-800 flex items-center justify-center font-bold text-sm text-white">
            K
          </div>
        </Link>

        <div className="flex-1 space-y-1.5 overflow-hidden">
          <Link href={`/watch/${video.id}`}>
            <h3 className="text-base font-bold text-white group-hover:text-[#a042ff] transition-colors line-clamp-2 leading-relaxed">
              {video.title}
            </h3>
          </Link>
          
          <div className="flex flex-col gap-1 text-xs text-[#797a8e] font-medium pt-0.5">
                <Link href={`/channel/khit_admin`} className="flex items-center gap-1.5 text-sm text-zinc-300 hover:text-white transition-colors z-10">
                  <span className="font-semibold">Khit Creator</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500 text-[#1c1a27]" />
                </Link>
                <div className="flex items-center gap-1.5 leading-relaxed py-0.5">
                  <Eye className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                  <span>{video.views} {t("views")}</span>
                  <span>•</span>
                  <span>{new Date(video.created_at).toLocaleDateString()}</span>
                </div>
              </div>
        </div>
      </div>
    </div>
  );
}

export function HomeView() {
  const t = useTranslations("Home");
  const [activeCategory, setActiveCategory] = useState("All");
  const [videos, setVideos] = useState<BackendVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activePreviewId, setActivePreviewId] = useState<string | null>(null);

  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setActivePreviewId(null);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  React.useEffect(() => {
    fetch("https://backend-tester-3glc.onrender.com/videos")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setVideos(data);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load videos from backend:", err);
        setIsLoading(false);
      });
  }, []);

  const filteredVideos = videos;

  return (
    <div className="px-4 sm:px-8 pb-4 pt-4 space-y-4 max-w-[1700px] mx-auto">
      {/* 🌟 Categories လေးများ ဖုန်းစခရင်အစွန်းထိ ဆွဲနိုင်စေရန် -mx-4 px-4 ဖြင့် ဆန့်ထုတ်ထားသည် */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:-mx-8 sm:px-8">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4.5 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-colors border cursor-pointer ${activeCategory === cat ? "bg-[#8c1cff] text-white border-[#8c1cff]" : "bg-[#1c1a27] border-white/5 text-zinc-400 hover:text-white hover:bg-[#232031]"}`}>
            {t(`categories.${cat}` as any)}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2">
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#a042ff]" />
          <span>{activeCategory === "All" ? t("featured") : (t.has(`categories.${activeCategory}` as any) ? t(`categories.${activeCategory}` as any) : activeCategory)}</span>
        </h2>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2.5">
              {/* Thumbnail နေရာလွတ် */}
              <div className="w-full aspect-[16/9] rounded-xl bg-[#1c1a27] border border-white/5" />
              
              {/* Avatar နှင့် စာသား နေရာလွတ် (တကယ့် Card ပါ px-0.5 နှင့် space-y-1.5 ကို အတိအကျ ယူထားသည်) */}
              <div className="flex items-start gap-3 px-0.5">
                <div className="w-10 h-10 rounded-full bg-[#1c1a27] shrink-0" />
                <div className="flex-1 space-y-1.5 pt-0.5">
                  <div className="h-5 bg-[#1c1a27] rounded-md w-[85%]" />
                  <div className="h-4 bg-[#1c1a27]/60 rounded-md w-[50%] mt-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="py-20 text-center text-zinc-500 text-sm">
          {t("noVideos")}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <VideoCard 
              key={video.id} 
              video={video} 
              t={t} 
              isPlayingPreview={activePreviewId === video.id}
              onRequestPlay={() => setActivePreviewId(video.id)}
              onRequestStop={() => {
                if (activePreviewId === video.id) {
                  setActivePreviewId(null);
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}