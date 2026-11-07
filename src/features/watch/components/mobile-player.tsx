"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Hls from "hls.js";
import { useRouter, useParams } from "next/navigation";
import { 
  ChevronDown, Pause, Play, Maximize,
  SkipBack, SkipForward, Settings, ListVideo, X,
  ThumbsUp, Share2
} from "lucide-react";
import { MobileVideoMeta } from "./mobile-video-meta";
import { MobileSettingsDrawer } from "./mobile-settings-drawer";

interface MobilePlayerProps {
  videoUrl: string;
  videoData: {
    title: string;
    views: number;
    description?: string;
    created_at?: string;
  } | null;
  activeTab: "upnext" | "comments";
  isMobileInputFocused: boolean;
  isPlaying: boolean;
  setIsPlaying: (val: boolean) => void;
  isLiked: boolean;
  setIsLiked: (val: boolean) => void;
}

export function MobilePlayer({
  videoUrl,
  videoData,
  activeTab,
  isMobileInputFocused,
  isPlaying,
  setIsPlaying,
  isLiked,
  setIsLiked
}: MobilePlayerProps) {
  const router = useRouter();
  const params = useParams();
  const videoId = params?.id as string;
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTime, setDragTime] = useState(0);
  const dragTimeRef = useRef(0);
  const [lastSeekPoint, setLastSeekPoint] = useState<number | null>(null);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ⚙️ More Settings States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsView, setSettingsView] = useState<"main" | "quality" | "speed" | "sleep" | "captions">("main");
  const [quality, setQuality] = useState("1080p");
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [sleepTimer, setSleepTimer] = useState("Off");
  const [captions, setCaptions] = useState("Off");
  const [isLooping, setIsLooping] = useState(false);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const sleepTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 🌟 Fullscreen Cinema Split View States
  const [isUpNextOpen, setIsUpNextOpen] = useState(false);
  const [upNextVideos, setUpNextVideos] = useState<Array<{
    id: string;
    title: string;
    thumbnail_url: string;
    views: number;
  }>>([]);

  useEffect(() => {
    if (isFullscreen) {
      fetch("https://backend-tester-3glc.onrender.com/videos")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setUpNextVideos(data);
          }
        })
        .catch(() => {});
    } else {
      setIsUpNextOpen(false);
    }
  }, [isFullscreen]);

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setSettingsView("main");
  };

  const handleSleepTimerChange = (val: string) => {
    setSleepTimer(val);
    if (sleepTimeoutRef.current) clearTimeout(sleepTimeoutRef.current);
    if (val === "15 minutes") {
      sleepTimeoutRef.current = setTimeout(() => {
        if (videoRef.current) videoRef.current.pause();
        setIsPlaying(false);
      }, 15 * 60 * 1000);
    } else if (val === "30 minutes") {
      sleepTimeoutRef.current = setTimeout(() => {
        if (videoRef.current) videoRef.current.pause();
        setIsPlaying(false);
      }, 30 * 60 * 1000);
    } else if (val === "45 minutes") {
      sleepTimeoutRef.current = setTimeout(() => {
        if (videoRef.current) videoRef.current.pause();
        setIsPlaying(false);
      }, 45 * 60 * 1000);
    }
    setSettingsView("main");
  };

  const resetControlsTimer = () => {
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3500);
    }
  };

  const toggleControls = () => {
    setShowControls((prev) => {
      const next = !prev;
      if (next && isPlaying) {
        resetControlsTimer();
      } else {
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      }
      return next;
    });
  };

  // 📱 Mobile 30% Sides (Seek Accumulation) & 40% Center (Play/Pause) Double Tap Logic
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [doubleTapDirection, setDoubleTapDirection] = useState<"backward" | "forward" | null>(null);
  const [seekAmount, setSeekAmount] = useState(0);
  const doubleTapDirectionRef = useRef<"backward" | "forward" | null>(null);
  const seekAmountRef = useRef(0);
  const doubleTapFeedbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerDoubleTapFeedback = (direction: "backward" | "forward") => {
    if (doubleTapFeedbackTimerRef.current) clearTimeout(doubleTapFeedbackTimerRef.current);
    
    // Tap ဆက်တိုက်တောက်လျှင် စက္ကန့်များ ဆက်တိုးသွားမည် (10 -> 20 -> 30)
    if (doubleTapDirectionRef.current !== direction) {
      seekAmountRef.current = 10;
    } else {
      seekAmountRef.current += 10;
    }
    
    doubleTapDirectionRef.current = direction;
    setDoubleTapDirection(direction);
    setSeekAmount(seekAmountRef.current);

    doubleTapFeedbackTimerRef.current = setTimeout(() => {
      setDoubleTapDirection(null);
      setSeekAmount(0);
      doubleTapDirectionRef.current = null;
      seekAmountRef.current = 0;
    }, 800); // 800ms ငြိမ်သွားမှသာ UI ကို ဖျောက်မည်
  };

  const handleScreenTap = (e: React.MouseEvent<HTMLVideoElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));

    // UI ပွင့်နေစဉ် ထပ်တောက်ပါက Double Tap စောင့်စရာမလိုဘဲ ချက်ချင်း +10s ထပ်တိုးမည်
    if (doubleTapDirectionRef.current === "backward" && ratio < 0.3) {
      if (videoRef.current) {
        videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
        setCurrentTime(videoRef.current.currentTime);
      }
      triggerDoubleTapFeedback("backward");
      return;
    }
    if (doubleTapDirectionRef.current === "forward" && ratio > 0.7) {
      if (videoRef.current && duration) {
        videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 10);
        setCurrentTime(videoRef.current.currentTime);
      }
      triggerDoubleTapFeedback("forward");
      return;
    }

    if (tapTimerRef.current) {
      // ၂၅၀ မီလီစက္ကန့်အတွင်း ၂ ချက်မြောက် အသစ်စတင်တောက်ခြင်း (Controls ပေါ်နေချိန်ရော ပျောက်နေချိန်ပါ အလုပ်လုပ်မည်)
      clearTimeout(tapTimerRef.current);
      tapTimerRef.current = null;

      if (ratio < 0.3) {
        if (videoRef.current) {
          videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
          setCurrentTime(videoRef.current.currentTime);
        }
        triggerDoubleTapFeedback("backward");
      } else if (ratio > 0.7) {
        if (videoRef.current && duration) {
          videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 10);
          setCurrentTime(videoRef.current.currentTime);
        }
        triggerDoubleTapFeedback("forward");
      } else {
        if (videoRef.current) {
          if (videoRef.current.paused) {
            videoRef.current.play().catch(() => {});
            setIsPlaying(true);
          } else {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        } else {
          setIsPlaying(!isPlaying);
        }
      }
    } else {
      // ၁ ချက်မြောက် ထိခြင်း (နောက်ထပ် ၂ ချက်မြောက် လာမလား ၂၅၀ms စောင့်ကြည့်မည်)
      tapTimerRef.current = setTimeout(() => {
        tapTimerRef.current = null;
        toggleControls();
      }, 250);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      resetControlsTimer();
    } else {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    }
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const m = Math.floor(time / 60).toString().padStart(2, "0");
    const s = Math.floor(time % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.touches[0].clientX;
    const clickX = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const newTime = (clickX / rect.width) * duration;
    dragTimeRef.current = newTime;
    setDragTime(newTime);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.touches[0].clientX;
    const clickX = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const newTime = (clickX / rect.width) * duration;
    dragTimeRef.current = newTime;
    setDragTime(newTime);
  };

  const handleTouchEnd = () => {
    if (videoRef.current) {
      const targetTime = dragTimeRef.current;
      if (Math.abs(targetTime - currentTime) > 2) {
        setLastSeekPoint(currentTime);
      }
      videoRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
    setIsDragging(false);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const newTime = (clickX / rect.width) * duration;
    if (videoRef.current) {
      if (Math.abs(newTime - currentTime) > 2) {
        setLastSeekPoint(currentTime);
      }
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    if (videoUrl.includes(".m3u8")) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(videoUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => setIsPlaying(false));
        });
        return () => hls.destroy();
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = videoUrl;
      }
    } else {
      video.src = videoUrl;
    }
  }, [videoUrl]);

  // Play/Pause ကို React State ဖြင့် ချိတ်ဆက်ခြင်း
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying && video.paused) {
      video.play().catch(() => setIsPlaying(false));
    } else if (!isPlaying && !video.paused) {
      video.pause();
    }
  }, [isPlaying, setIsPlaying]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFS = !!document.fullscreenElement;
      setIsFullscreen(isFS);
      if (isFS && screen.orientation && screen.orientation.lock) {
        screen.orientation.lock("landscape").catch(() => {});
      } else if (!isFS && screen.orientation && screen.orientation.unlock) {
        screen.orientation.unlock();
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullScreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (playerContainerRef.current?.requestFullscreen) {
          await playerContainerRef.current.requestFullscreen();
        } else if ((videoRef.current as any)?.webkitEnterFullscreen) {
          (videoRef.current as any).webkitEnterFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (error) {
      console.error("Fullscreen failed", error);
    }
  };

  // တကယ့် Native OS PiP ကို ခေါ်မည့် Function
  const togglePiP = async () => {
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (videoRef.current && document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (error) {
      console.error("PiP failed", error);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.onleavepictureinpicture = () => {
      setTimeout(() => {
        if (video) {
          setIsPlaying(!video.paused);
          // 🌟 'Back to tab' ခလုတ်နှိပ်လျှင် video က ဆက် play နေပါမည် (paused = false)
          // ထိုအချိန်တွင် အခြား Page ရောက်နေပါက Watch Page သို့ အလိုအလျောက် ပြန်ခေါ်သွားပါမည်
          if (!video.paused && window.location.pathname !== `/watch/${videoId}`) {
            router.push(`/watch/${videoId}`);
          }
        }
      }, 50);
    };
  }, [setIsPlaying, router, videoId]);

  return (
    <>
      {/* Sticky Video Player (၁၆:၉ Widescreen အချိုးဖြင့် သဘာဝကျစွာ ပြသခြင်း) */}
      <div 
        ref={playerContainerRef} 
        className={`w-full bg-black overflow-hidden shadow-2xl group/player touch-none flex ${isFullscreen ? "fixed inset-0 z-[99999] w-screen h-screen rounded-none flex-row items-center justify-between" : `aspect-video z-30 items-center justify-center ${activeTab === "comments" && isMobileInputFocused ? "relative" : "sticky top-0"}`}`}
      >
        
        {/* 🌟 Left Video Stage (၆၅% သို့ ချောမွေ့စွာ ကျုံ့သွားမည့် အပိုင်း) */}
        <div className={`relative h-full transition-all duration-300 ease-in-out flex items-center justify-center bg-black overflow-hidden ${isFullscreen && isUpNextOpen ? "w-[65%]" : "w-full"}`}>

        {/* 🎬 တကယ့် အစစ်အမှန် Video HTML5 Element */}
        <video
          ref={videoRef}
          src={videoUrl || undefined}
          className="absolute inset-0 w-full h-full bg-black object-contain"
          playsInline
          loop={isLooping}
          onClick={handleScreenTap}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={() => { if (videoRef.current) setCurrentTime(videoRef.current.currentTime); }}
          onLoadedMetadata={() => { if (videoRef.current) setDuration(videoRef.current.duration); }}
        />

        {/* ◀◀◀ Compose Code ၏ DoubleTapSeekTriangles Animation CSS အတိအကျ */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes animTri1 {
            0%, 100% { opacity: 0; }
            16.6%, 50% { opacity: 1; }
            66.6% { opacity: 0; }
          }
          @keyframes animTri2 {
            0%, 16.6%, 100% { opacity: 0; }
            33.3%, 66.6% { opacity: 1; }
            83.3% { opacity: 0; }
          }
          @keyframes animTri3 {
            0%, 33.3%, 100% { opacity: 0; }
            50%, 83.3% { opacity: 1; }
            100% { opacity: 0; }
          }
          .tri-1 { animation: animTri1 0.9s infinite linear; }
          .tri-2 { animation: animTri2 0.9s infinite linear; }
          .tri-3 { animation: animTri3 0.9s infinite linear; }
        `}} />

        {doubleTapDirection === "backward" && (
          <div className="absolute left-[15%] top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none select-none flex flex-col items-center gap-2">
            <div className="flex items-center rotate-180">
              <svg viewBox="0 0 16 20" className="w-5 h-6 fill-white tri-1"><path d="M2 3.5 L14 10 L2 16.5 Z" /></svg>
              <svg viewBox="0 0 16 20" className="w-5 h-6 fill-white tri-2 -ml-1.5"><path d="M2 3.5 L14 10 L2 16.5 Z" /></svg>
              <svg viewBox="0 0 16 20" className="w-5 h-6 fill-white tri-3 -ml-1.5"><path d="M2 3.5 L14 10 L2 16.5 Z" /></svg>
            </div>
            <span className="text-xs font-medium text-white">{seekAmount} seconds</span>
          </div>
        )}

        {doubleTapDirection === "forward" && (
          <div className="absolute right-[15%] top-1/2 translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none select-none flex flex-col items-center gap-2">
            <div className="flex items-center">
              <svg viewBox="0 0 16 20" className="w-5 h-6 fill-white tri-1"><path d="M2 3.5 L14 10 L2 16.5 Z" /></svg>
              <svg viewBox="0 0 16 20" className="w-5 h-6 fill-white tri-2 -ml-1.5"><path d="M2 3.5 L14 10 L2 16.5 Z" /></svg>
              <svg viewBox="0 0 16 20" className="w-5 h-6 fill-white tri-3 -ml-1.5"><path d="M2 3.5 L14 10 L2 16.5 Z" /></svg>
            </div>
            <span className="text-xs font-medium text-white">{seekAmount} seconds</span>
          </div>
        )}

        {/* အပေါ်ဘား Controls (Back button & Settings Button) */}
        <div className={`absolute top-3 left-3 right-3 flex items-center justify-between z-20 transition-all duration-300 ${showControls ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none invisible"}`}>
          <button
            onClick={() => isFullscreen ? toggleFullScreen() : (window.history.length > 1 ? router.back() : router.push('/'))}
            className="w-9 h-9 rounded-full bg-black/70 border border-white/15 flex items-center justify-center text-white active:scale-90 transition-transform cursor-pointer shadow-lg"
            title={isFullscreen ? "Exit Fullscreen" : "Back"}
          >
            <ChevronDown className="w-5 h-5" />
          </button>

          {/* ⚙️ More Settings ခလုတ် */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsSettingsOpen(true);
              setSettingsView("main");
            }}
            className="w-9 h-9 rounded-full bg-black/70 border border-white/15 flex items-center justify-center text-white active:scale-90 transition-transform cursor-pointer shadow-lg"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* 🎬 စခရင်အလယ်ဗဟို Controls: [⏮️ Prev] [⏯️ Play/Pause] [⏭️ Next] (YouTube/Netflix စတိုင်) */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center gap-7 transition-all duration-300 select-none ${showControls ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none invisible"}`}>
          {/* Previous Video Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              resetControlsTimer();
              if (videoRef.current) videoRef.current.currentTime = 0;
            }}
            className="w-11 h-11 rounded-full bg-black/70 border border-white/15 flex items-center justify-center text-white active:scale-90 transition-transform cursor-pointer shadow-lg pointer-events-auto"
            title="Previous"
          >
            <SkipBack className="w-5 h-5 fill-white" />
          </button>

          {/* Center Main Play / Pause Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (videoRef.current) {
                if (videoRef.current.paused) {
                  videoRef.current.play().catch(() => {});
                } else {
                  videoRef.current.pause();
                }
              }
              resetControlsTimer();
            }}
            className="w-15 h-15 rounded-full bg-black/80 border border-white/20 flex items-center justify-center text-white active:scale-90 transition-transform cursor-pointer shadow-2xl pointer-events-auto"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 fill-white" />
            ) : (
              <Play className="w-7 h-7 fill-white ml-0.5" />
            )}
          </button>

          {/* Next Video Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              resetControlsTimer();
              if (videoRef.current && duration) videoRef.current.currentTime = duration;
            }}
            className="w-11 h-11 rounded-full bg-black/70 border border-white/15 flex items-center justify-center text-white active:scale-90 transition-transform cursor-pointer shadow-lg pointer-events-auto"
            title="Next"
          >
            <SkipForward className="w-5 h-5 fill-white" />
          </button>
        </div>

        {/* 🎛️ Mobile Player Controls (အပိတ်/အဖွင့် ချိတ်ဆက်ထားသော အောက်ဘား UI) */}
        <div className={`absolute bottom-0 left-0 right-0 pt-6 pb-2.5 px-3 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col gap-2 transition-all duration-300 ${showControls || isDragging ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none invisible"}`}>
          
          {/* Row 1: Live Badge & Actions (ဘယ်ဘက်) နှင့် Up Next, Maximize ခလုတ်များ (ညာဘက်) */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="px-2 py-0.5 bg-red-600 rounded text-white font-extrabold text-[9px] uppercase flex items-center gap-1 tracking-wider shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> LIVE
              </div>

              {isFullscreen && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLiked(!isLiked);
                    }}
                    className={`h-8 px-3 rounded-full flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
                      isLiked 
                        ? "bg-[#8c1cff] text-white shadow-md shadow-[#8c1cff]/40" 
                        : "bg-white/10 hover:bg-white/20 text-white"
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? "fill-white" : ""}`} />
                    <span>47K</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (navigator.share) {
                        navigator.share({
                          title: videoData?.title || "Khit Video",
                          url: window.location.href,
                        }).catch(() => {});
                      }
                    }}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white active:scale-95 transition-transform cursor-pointer"
                    title="Share"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              {isFullscreen && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsUpNextOpen(!isUpNextOpen);
                  }}
                  className={`h-8 px-2.5 rounded-full flex items-center gap-1.5 text-xs font-bold text-white active:scale-95 transition-all cursor-pointer ${
                    isUpNextOpen ? "bg-[#8c1cff] shadow-md shadow-[#8c1cff]/40" : "bg-white/10 hover:bg-white/20"
                  }`}
                  title="Up Next Videos"
                >
                  <ListVideo className="w-3.5 h-3.5" />
                  <span>Up Next</span>
                </button>
              )}
              <button 
                onClick={toggleFullScreen}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white active:scale-95 transition-transform cursor-pointer"
                title="Fullscreen"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Row 2: Time Bar ဘေးဝဲယာတွင် အချိန်များထားရှိခြင်း (Phone Gesture Back မငြိစေရန်) */}
          <div className="flex items-center gap-2.5 w-full">
            {/* လက်ရှိအချိန် (ဘယ်ဘက်စွန်း) */}
            <span className="text-[11px] font-mono font-medium text-white/90 shrink-0 min-w-[34px] text-center select-none">
              {formatTime(isDragging ? dragTime : currentTime)}
            </span>

            {/* အလယ်က Seeking Bar */}
            <div 
              className="flex-1 h-5 flex items-center cursor-pointer group/seek relative touch-none select-none"
              onClick={handleClick}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* ⏱️ လက်ဖြင့်ဆွဲနေစဉ် ခလုတ်အပေါ်တွင် လိုက်ပါပြသမည့် Floating Mini Time Bubble */}
              {isDragging && (
                <div 
                  className="absolute -top-7 -translate-x-1/2 px-2 py-0.5 rounded-md bg-[#181628] border border-white/20 text-[10px] font-mono font-bold text-white shadow-2xl pointer-events-none z-30"
                  style={{ left: `${((isDragging ? dragTime : currentTime) / (duration || 1)) * 100}%` }}
                >
                  {formatTime(dragTime)}
                </div>
              )}

              {/* 📍 ကိုယ်ကျော်ခဲ့မိသည့် အရင်နေရာသို့ ပြန်သွားနိုင်သော Previous Point Dot (၁ စက်သာ အများဆုံး ပေါ်မည်) */}
              {lastSeekPoint !== null && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    if (videoRef.current) {
                      videoRef.current.currentTime = lastSeekPoint;
                      setCurrentTime(lastSeekPoint);
                      setLastSeekPoint(null);
                    }
                  }}
                  className="absolute top-1/2 -translate-y-1/2 -ml-3 w-6 h-6 flex items-center justify-center z-20 cursor-pointer pointer-events-auto"
                  style={{ left: `${(lastSeekPoint / (duration || 1)) * 100}%` }}
                  title="Tap to return to previous point"
                >
                  <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)] border border-black/80 animate-pulse" />
                </div>
              )}

              <div className="w-full h-1 bg-white/30 rounded-full relative overflow-visible pointer-events-none">
                <div 
                  className="h-full bg-[#8c1cff] rounded-l-full relative shadow-[0_0_8px_#8c1cff]" 
                  style={{ width: `${((isDragging ? dragTime : currentTime) / (duration || 1)) * 100}%` }}
                />
                <div 
                  className={`w-3.5 h-3.5 rounded-full absolute top-1/2 -translate-y-1/2 -ml-1.5 shadow-md transition-transform ${isDragging ? "scale-150 bg-[#8c1cff] ring-2 ring-white" : "scale-100 bg-white"}`} 
                  style={{ left: `${((isDragging ? dragTime : currentTime) / (duration || 1)) * 100}%` }} 
                />
              </div>
            </div>

            {/* စုစုပေါင်းကြာချိန် (ညာဘက်စွန်း) */}
            <span className="text-[11px] font-mono font-medium text-zinc-400 shrink-0 min-w-[34px] text-center select-none">
              {formatTime(duration)}
            </span>
          </div>
        </div>
        </div>

        {/* 🌟 ညာဘက် ၃၅% Up Next Vertical Drawer (Cinema Split View) */}
        {isFullscreen && isUpNextOpen && (
          <div className="w-[35%] h-full bg-[#121214] border-l border-white/10 flex flex-col z-30 animate-in slide-in-from-right duration-300 select-none">
            {/* Drawer Header */}
            <div className="p-3 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#161618]">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <ListVideo className="w-3.5 h-3.5 text-[#8c1cff]" />
                Up Next
              </span>
              <button
                type="button"
                onClick={() => setIsUpNextOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Videos List */}
            <div className="flex-1 overflow-y-auto p-2.5 space-y-2 scrollbar-none">
              {upNextVideos.filter((v) => String(v.id) !== String(videoId)).length === 0 ? (
                <div className="py-12 text-center text-[11px] text-zinc-500">
                  ဗီဒီယို မရှိသေးပါ
                </div>
              ) : (
                upNextVideos
                  .filter((v) => String(v.id) !== String(videoId))
                  .map((v) => (
                    <div
                      key={v.id}
                      onClick={() => {
                        setIsUpNextOpen(false);
                        router.push(`/watch/${v.id}`);
                      }}
                      className="flex gap-2.5 p-1.5 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors cursor-pointer group"
                    >
                      <div className="relative w-24 aspect-video rounded-lg bg-zinc-900 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center shadow">
                        <img
                          src={v.thumbnail_url || "https://images.unsplash.com/photo-1611162617474-5b21e879e113"}
                          alt={v.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="w-5 h-5 rounded-full bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity absolute">
                          <Play className="w-2.5 h-2.5 fill-white ml-0.2" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h4 className="text-[11px] font-bold text-white line-clamp-2 leading-snug group-hover:text-[#8c1cff] transition-colors">
                          {v.title}
                        </h4>
                        <span className="text-[9px] text-zinc-500 mt-1">
                          {v.views} views
                        </span>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* 📱 Mobile Info & Clean Actions Architecture */}
      <MobileVideoMeta videoData={videoData} isLiked={isLiked} setIsLiked={setIsLiked} />

      {/* ⚙️ More Settings Mobile Gesture Drawer */}
      <MobileSettingsDrawer
        isSettingsOpen={isSettingsOpen}
        setIsSettingsOpen={setIsSettingsOpen}
        settingsView={settingsView}
        setSettingsView={setSettingsView}
        quality={quality}
        setQuality={setQuality}
        playbackSpeed={playbackSpeed}
        handleSpeedChange={handleSpeedChange}
        sleepTimer={sleepTimer}
        handleSleepTimerChange={handleSleepTimerChange}
        captions={captions}
        setCaptions={setCaptions}
        isLooping={isLooping}
        setIsLooping={setIsLooping}
        isAutoplay={isAutoplay}
        setIsAutoplay={setIsAutoplay}
      />

    </>
  );
}