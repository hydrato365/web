"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import Hls from "hls.js";
import { 
  Volume2, Volume1, VolumeX, Maximize, PictureInPicture,
  Play, Pause, Gauge
} from "lucide-react";
import { useKeyboardControls } from "../hooks/use-keyboard-controls";
import { DesktopVideoInfo } from "./desktop-video-info";
import { DesktopComments } from "./desktop-comments";
import { DesktopSettingsMenu } from "./desktop-settings-menu";
import { DesktopUpNext } from "./desktop-up-next";

interface ChatMessage {
  id: number;
  user: string;
  online: boolean;
  check: boolean;
  avatar: string;
  text: string;
}

interface VideoMetaInfo {
  title: string;
  video_url: string;
  views: number;
  description?: string;
  created_at?: string;
}

interface DesktopViewProps {
  videoUrl: string;
  videoData: VideoMetaInfo | null;
  isPlaying: boolean;
  setIsPlaying: (val: boolean) => void;
  isDownloadOpen: boolean;
  setIsDownloadOpen: (val: boolean) => void;
  downloadProgress: string | null;
  handleDownload: (quality: string) => void;
  isLiked: boolean;
  setIsLiked: (val: boolean) => void;
  chatMessages: ChatMessage[];
  inputMessage: string;
  setInputMessage: (val: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
}

export function DesktopView({
  videoUrl,
  videoData,
  isPlaying,
  setIsPlaying,
  isDownloadOpen,
  setIsDownloadOpen,
  downloadProgress,
  handleDownload,
  isLiked,
  setIsLiked,
  chatMessages,
  inputMessage,
  setInputMessage,
  handleSendMessage
}: DesktopViewProps) {
  const router = useRouter();
  const params = useParams();
  const videoId = params?.id as string;
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isWideMode, setIsWideMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // ⚙️ PC Settings States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsView, setSettingsView] = useState<"main" | "quality" | "speed" | "sleep" | "captions">("main");
  const [quality, setQuality] = useState("1080p");
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [speedNotification, setSpeedNotification] = useState<string | null>(null);
  const speedNotificationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [sleepTimer, setSleepTimer] = useState("Off");
  const [captions, setCaptions] = useState("Off");
  const [isLooping, setIsLooping] = useState(false);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const settingsRef = useRef<HTMLDivElement>(null);
  const sleepTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ⚡ Space Hold Speed Boost States
  const [holdSpeed, setHoldSpeed] = useState(2);
  const [isSpeedBoostActive, setIsSpeedBoostActive] = useState(false);

  const showSpeedToast = (speed: number) => {
    if (speedNotificationTimerRef.current) clearTimeout(speedNotificationTimerRef.current);
    setSpeedNotification(`${speed === 1 ? "Normal" : `${speed}x`} Speed`);
    speedNotificationTimerRef.current = setTimeout(() => {
      setSpeedNotification(null);
    }, 1200);
  };

  const handleSpeedChange = (speed: number) => {
    const clamped = Math.max(0.25, Math.min(2, Math.round(speed * 100) / 100));
    setPlaybackSpeed(clamped);
    if (videoRef.current) {
      videoRef.current.playbackRate = clamped;
      videoRef.current.defaultPlaybackRate = clamped;
    }
    showSpeedToast(clamped);
    setSettingsView("main");
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
      videoRef.current.defaultPlaybackRate = playbackSpeed;
    }
  }, [playbackSpeed, isPlaying]);

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setIsSettingsOpen(false);
        setSettingsView("main");
      }
    };
    if (isSettingsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSettingsOpen]);

  const [isTimeDragging, setIsTimeDragging] = useState(false);
  const [dragTime, setDragTime] = useState(0);
  const dragTimeRef = useRef(0);
  const [lastSeekPoint, setLastSeekPoint] = useState<number | null>(null);
  const timeBarRef = useRef<HTMLDivElement>(null);

  // 🎬 Center Play/Pause Snappy Feedback
  const [playPauseFeedback, setPlayPauseFeedback] = useState<"play" | "pause" | null>(null);
  const feedbackTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstMountRef = useRef(true);

  useEffect(() => {
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      return;
    }
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    setPlayPauseFeedback(isPlaying ? "play" : "pause");
    feedbackTimerRef.current = setTimeout(() => {
      setPlayPauseFeedback(null);
    }, 380);
    return () => {
      if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    };
  }, [isPlaying]);

  // 🔊 Center Volume Circular HUD Feedback
  const [showVolumeHUD, setShowVolumeHUD] = useState(false);
  const volumeHUDTimerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerVolumeHUD = () => {
    setShowVolumeHUD(true);
    if (volumeHUDTimerRef.current) clearTimeout(volumeHUDTimerRef.current);
    volumeHUDTimerRef.current = setTimeout(() => {
      setShowVolumeHUD(false);
    }, 800);
  };

  useEffect(() => {
    return () => {
      if (volumeHUDTimerRef.current) clearTimeout(volumeHUDTimerRef.current);
    };
  }, []);

  // 🎞️ Time Bar Hover Video Preview & Marker States (Lag-free 0ms Optimization)
  const [isHoveringTimeBar, setIsHoveringTimeBar] = useState(false);
  const [hoverTime, setHoverTime] = useState(0);
  const [hoverPos, setHoverPos] = useState(0);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const pendingSeekTimeRef = useRef<number | null>(null);

  const applyPreviewSeek = (targetTime: number) => {
    const previewVid = previewVideoRef.current;
    if (!previewVid) return;

    if (previewVid.seeking) {
      pendingSeekTimeRef.current = targetTime;
      return;
    }

    if ("fastSeek" in previewVid && typeof (previewVid as any).fastSeek === "function") {
      (previewVid as any).fastSeek(targetTime);
    } else {
      previewVid.currentTime = targetTime;
    }
  };

  const handlePreviewSeeked = () => {
    if (pendingSeekTimeRef.current !== null) {
      const nextTime = pendingSeekTimeRef.current;
      pendingSeekTimeRef.current = null;
      applyPreviewSeek(nextTime);
    }
  };

  const handleTimeBarMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timeBarRef.current) return;
    const rect = timeBarRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = clickX / rect.width;
    const targetTime = percentage * duration;
    setHoverPos(percentage * 100);
    setHoverTime(targetTime);
    applyPreviewSeek(targetTime);
  };

  const [isVolDragging, setIsVolDragging] = useState(false);
  const volumeBarRef = useRef<HTMLDivElement>(null);

  // 🖱️ Mouse Hover Controls Visibility Logic
  const [showControls, setShowControls] = useState(true);
  const controlsTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetControlsTimer = () => {
    setShowControls(true);
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    if (isPlaying && !isSettingsOpen && !isTimeDragging && !isVolDragging) {
      controlsTimerRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  };

  const handleMouseEnter = () => {
    resetControlsTimer();
  };

  const handleMouseMove = () => {
    resetControlsTimer();
  };

  const handleMouseLeave = () => {
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    if (!isSettingsOpen && !isTimeDragging && !isVolDragging) {
      setShowControls(false);
    }
  };

  useEffect(() => {
    if (isSettingsOpen || isTimeDragging || isVolDragging) {
      setShowControls(true);
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    } else if (isPlaying) {
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
      if (showControls) {
        controlsTimerRef.current = setTimeout(() => {
          setShowControls(false);
        }, 2500);
      }
    } else {
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    }
    return () => {
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    };
  }, [isPlaying, isSettingsOpen, isTimeDragging, isVolDragging, showControls]);

  const handleVolumeChange = (newVol: number) => {
    const clamped = Math.max(0, Math.min(1, Math.round(newVol * 100) / 100));
    setVolume(clamped);
    if (videoRef.current) {
      videoRef.current.volume = clamped;
      if (clamped === 0) {
        videoRef.current.muted = true;
        setIsMuted(true);
      } else {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
    }
  };

  const updateVolumeFromPointer = (clientY: number) => {
    if (!volumeBarRef.current) return;
    const rect = volumeBarRef.current.getBoundingClientRect();
    const clickY = Math.max(0, Math.min(clientY - rect.top, rect.height));
    const percentage = 1 - (clickY / rect.height);
    handleVolumeChange(percentage);
  };

  const handleVolPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    setIsVolDragging(true);
    updateVolumeFromPointer(e.clientY);
  };

  const handleVolPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isVolDragging) {
      updateVolumeFromPointer(e.clientY);
    }
  };

  const handleVolPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isVolDragging) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
      setIsVolDragging(false);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
      if (!nextMuted && videoRef.current.volume === 0) {
        videoRef.current.volume = 0.5;
        setVolume(0.5);
      }
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const m = Math.floor(time / 60).toString().padStart(2, "0");
    const s = Math.floor(time % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const updateTimeFromPointer = (clientX: number) => {
    if (!timeBarRef.current) return;
    const rect = timeBarRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    dragTimeRef.current = newTime;
    setDragTime(newTime);
    setHoverPos(percentage * 100);
    setHoverTime(newTime);
    applyPreviewSeek(newTime);
  };

  const handleTimePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    setIsTimeDragging(true);
    updateTimeFromPointer(e.clientX);
  };

  const handleTimePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isTimeDragging) {
      updateTimeFromPointer(e.clientX);
    }
  };

  const handleTimePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isTimeDragging) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
      const targetTime = dragTimeRef.current;
      if (videoRef.current) {
        if (Math.abs(targetTime - currentTime) > 2) {
          setLastSeekPoint(currentTime);
        }
        videoRef.current.currentTime = targetTime;
        setCurrentTime(targetTime);
      }
      setIsTimeDragging(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
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

  // 🖱️ Single Click = Play/Pause, Double Click = Fullscreen Toggle
  const videoClickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const handleVideoClick = () => {
    if (videoClickTimerRef.current) {
      clearTimeout(videoClickTimerRef.current);
      videoClickTimerRef.current = null;
      toggleFullScreen();
    } else {
      videoClickTimerRef.current = setTimeout(() => {
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
        videoClickTimerRef.current = null;
      }, 220);
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
          if (isPlaying) video.play().catch(() => setIsPlaying(false));
        });
        return () => hls.destroy();
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = videoUrl;
      }
    } else {
      video.src = videoUrl;
    }
  }, [videoUrl]);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => setIsPlaying(false));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, setIsPlaying]);

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

  useKeyboardControls({
    videoRef,
    isPlaying,
    setIsPlaying,
    playbackSpeed,
    handleSpeedChange,
    holdSpeed,
    setIsSpeedBoostActive,
    toggleFullScreen,
    setIsWideMode,
    toggleMute,
    triggerVolumeHUD,
    togglePiP,
    setVolume,
    setIsMuted,
  });

  return (
    <div className="hidden lg:grid pl-4 sm:pl-6 pr-3 sm:pr-4 pb-16 pt-3 w-full grid-cols-1 lg:grid-cols-12 gap-6 items-start relative z-10">
      
      {/* ============ LEFT COLUMN: VIDEO + METADATA + COMMENTS (Wide Mode တွင် 12 Cols ဖြစ်မည်) ============ */}
      <div className={`flex flex-col space-y-4 transition-all duration-300 ${isWideMode ? "lg:col-span-12" : "lg:col-span-8"}`}>
        
        {/* 🎬 Video Player (Wide Mode တွင် အမြင့်နှင့် အကျယ် အချိုးကျ ထိန်းညှိပေးထားသည်) */}
        <div 
          ref={playerContainerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={`w-full bg-black overflow-hidden relative group flex items-center justify-center transition-all ${
            isFullscreen 
              ? "h-screen rounded-none border-none" 
              : isWideMode 
              ? "aspect-video max-h-[82vh] rounded-2xl border border-zinc-800 shadow-2xl" 
              : "aspect-[16/9] rounded-2xl border border-zinc-800"
          } ${!showControls ? "cursor-none" : ""}`}
        >
          {/* ⚡ Speed Change Toast */}
          {speedNotification && !isSpeedBoostActive && (
            <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-xs font-medium text-white shadow-lg pointer-events-none select-none flex items-center gap-1.5 animate-in fade-in zoom-in-95">
              <Gauge className="w-3.5 h-3.5 text-[#8c1cff]" />
              <span>{speedNotification}</span>
            </div>
          )}

          {/* 🎬 Center Play/Pause Quick Flash Feedback (ခဏလေးသာ အလယ်တွင် ဖြတ်ခနဲ ပေါ်မည့် Icon) */}
          {playPauseFeedback && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none select-none">
              <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl animate-in fade-in zoom-in-50 duration-150">
                {playPauseFeedback === "play" ? (
                  <Play className="w-8 h-8 fill-white ml-1" />
                ) : (
                  <Pause className="w-8 h-8 fill-white" />
                )}
              </div>
            </div>
          )}

          {/* 🔊 Center Volume Circular HUD Feedback (Premium Clockwise Ring + Crossed Speaker) */}
          {showVolumeHUD && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none select-none animate-in fade-in zoom-in-75 duration-150">
              <div className="relative w-24 h-24 rounded-full bg-black/60 backdrop-blur-3xl border border-white/20 flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.8)]">
                <svg className="w-20 h-20 absolute inset-2" viewBox="0 0 80 80">
                  <defs>
                    <linearGradient id="volHudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00F2FE" />
                      <stop offset="100%" stopColor="#8c1cff" />
                    </linearGradient>
                  </defs>
                  {/* Background Track Circle */}
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="rgba(255, 255, 255, 0.15)"
                    strokeWidth="4"
                    fill="none"
                  />
                  {/* Clockwise Progress Ring starting strictly at 12 o'clock */}
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke={isMuted || volume === 0 ? "#ef4444" : "url(#volHudGrad)"}
                    strokeWidth="4.5"
                    fill="none"
                    strokeLinecap="round"
                    transform="rotate(-90 40 40)"
                    strokeDasharray={`${(isMuted ? 0 : volume) * 201.06} 201.06`}
                    strokeDashoffset="0"
                    className="transition-[stroke-dasharray] duration-150 ease-out"
                    style={{
                      filter: isMuted || volume === 0 
                        ? "drop-shadow(0 0 6px rgba(239, 68, 68, 0.6))" 
                        : "drop-shadow(0 0 6px rgba(140, 28, 255, 0.7))",
                    }}
                  />
                </svg>
                <div className="relative z-10 flex items-center justify-center">
                  {isMuted || volume === 0 ? (
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" className="stroke-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
                      <line x1="3" y1="3" x2="21" y2="21" className="stroke-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                    </svg>
                  ) : volume < 0.5 ? (
                    <Volume1 className="w-8 h-8 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" />
                  ) : (
                    <Volume2 className="w-8 h-8 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 🚀 Space Hold Speed Indicator (Minimalist YouTube Style) */}
          {isSpeedBoostActive && (
            <div className="absolute top-5 left-1/2 -translate-x-1/2 z-30 px-3.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-xs font-bold text-white shadow-lg pointer-events-none select-none flex items-center gap-1.5 animate-in fade-in zoom-in-95">
              <span>{holdSpeed}x</span>
              <span className="text-[10px] text-zinc-400 font-normal">⏩</span>
            </div>
          )}
          
          {/* 🎬 တကယ့် အစစ်အမှန် Video HTML5 Element */}
          <video
            ref={videoRef}
            src={videoUrl || undefined}
            className="absolute inset-0 w-full h-full bg-black object-contain"
            playsInline
            loop={isLooping}
            onClick={handleVideoClick}
            onTimeUpdate={() => { if (videoRef.current) setCurrentTime(videoRef.current.currentTime); }}
            onLoadedMetadata={() => { if (videoRef.current) setDuration(videoRef.current.duration); }}
          />

          {/* Player Bottom Control Bar (Mouse ရှိနေမှသာ ပေါ်မည့် စနစ်) */}
          <div className={`absolute bottom-0 left-0 right-0 pt-6 pb-2.5 px-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col gap-2 transition-opacity duration-300 ${showControls ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
            
            {/* Row 1: Controls Left & Right (နေရာကျယ်ဝန်းစွာ ခွဲထားခြင်း) */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white active:scale-95 transition-all cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                </button>

                <span className="text-xs font-mono font-medium text-white/90">
                  {formatTime(isTimeDragging ? dragTime : currentTime)} / {formatTime(duration)}
                </span>

                {/* 🔊 Volume Button & Drag Slider */}
                <div className="relative group/vol flex items-center justify-center">
                  {/* Floating Volume Slider (Mouse တင်လျှင် သို့မဟုတ် Drag ဆွဲနေစဉ် ပေါ်နေမည်) */}
                  <div className={`absolute bottom-full left-1/2 -translate-x-1/2 pb-2.5 ${isVolDragging ? "flex" : "hidden group-hover/vol:flex"} flex-col items-center z-50`}>
                    <div className="bg-[#181628]/95 border border-white/10 p-2.5 rounded-2xl shadow-2xl backdrop-blur-md flex flex-col items-center gap-1.5 animate-in fade-in slide-in-from-bottom-2 duration-150 select-none">
                      <span className="text-[10px] font-mono font-bold text-zinc-300">
                        {Math.round((isMuted ? 0 : volume) * 100)}%
                      </span>
                      <div 
                        ref={volumeBarRef}
                        onPointerDown={handleVolPointerDown}
                        onPointerMove={handleVolPointerMove}
                        onPointerUp={handleVolPointerUp}
                        className="w-2 h-20 bg-white/20 rounded-full relative cursor-pointer flex flex-col justify-end touch-none"
                      >
                        {/* Drag ဆွဲနေစဉ်တွင် transition ကို ဖြုတ်ထားမည်ဖြစ်သဖြင့် မောက်စ်နောက်သို့ 0ms delay ဖြင့် ချက်ချင်းကပ်ပါမည် */}
                        <div 
                          className={`w-full bg-[#8c1cff] rounded-full pointer-events-none ${isVolDragging ? "transition-none" : "transition-all duration-150"}`} 
                          style={{ height: `${(isMuted ? 0 : volume) * 100}%` }}
                        />
                        <div 
                          className={`w-3.5 h-3.5 bg-white rounded-full absolute left-1/2 -translate-x-1/2 shadow-md pointer-events-none ${isVolDragging ? "transition-none" : "transition-all duration-150"}`}
                          style={{ bottom: `calc(${(isMuted ? 0 : volume) * 100}% - 7px)` }}
                        />
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={toggleMute}
                    title={isMuted ? "Unmute (m)" : "Mute (m)"}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4 text-red-400" />
                    ) : volume < 0.5 ? (
                      <Volume1 className="w-4 h-4 text-zinc-200" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-zinc-200" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* ⚙️ Settings Popover Menu */}
                <DesktopSettingsMenu
                  isSettingsOpen={isSettingsOpen}
                  setIsSettingsOpen={setIsSettingsOpen}
                  settingsView={settingsView}
                  setSettingsView={setSettingsView}
                  quality={quality}
                  setQuality={setQuality}
                  playbackSpeed={playbackSpeed}
                  handleSpeedChange={handleSpeedChange}
                  holdSpeed={holdSpeed}
                  setHoldSpeed={setHoldSpeed}
                  sleepTimer={sleepTimer}
                  handleSleepTimerChange={handleSleepTimerChange}
                  captions={captions}
                  setCaptions={setCaptions}
                  isLooping={isLooping}
                  setIsLooping={setIsLooping}
                  isAutoplay={isAutoplay}
                  setIsAutoplay={setIsAutoplay}
                  settingsRef={settingsRef}
                />

                {/* 🪟 Smart Wide Mode Button */}
                  <button
                    type="button"
                    onClick={() => setIsWideMode(!isWideMode)}
                    className={`w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white active:scale-95 transition-all cursor-pointer ${isWideMode ? "text-[#8c1cff] bg-white/25" : ""}`}
                    title={isWideMode ? "Default view (t)" : "Wide view (t)"}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                    </svg>
                  </button>

                  <button 
                    onClick={togglePiP} 
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white active:scale-95 transition-transform cursor-pointer" 
                    title="Picture-in-Picture"
                  >
                    <PictureInPicture className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={toggleFullScreen} 
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white active:scale-95 transition-transform cursor-pointer" 
                    title="Fullscreen"
                  >
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>
            </div>

            {/* Row 2: Full-width Seeking Bar (Mouse ဖြင့် အလွတ်သဘော Drag ဆွဲနိုင်သော သီးသန့် Time Bar) */}
            <div 
              ref={timeBarRef}
              onPointerDown={handleTimePointerDown}
              onPointerMove={handleTimePointerMove}
              onPointerUp={handleTimePointerUp}
              onMouseMove={handleTimeBarMouseMove}
              onMouseEnter={() => setIsHoveringTimeBar(true)}
              onMouseLeave={() => setIsHoveringTimeBar(false)}
              className="w-full h-4 flex items-center cursor-pointer group/seek relative select-none touch-none"
            >
              {/* 🎞️ Video Thumbnail Preview Window (Hover စဉ်ရော Mouse ဖိဆွဲနေစဉ်ပါ မောက်စ်နောက် လိုက်ပြမည့် စနစ်) */}
              {(isHoveringTimeBar || isTimeDragging) && (
                <div 
                  className="absolute bottom-6 -translate-x-1/2 z-40 pointer-events-none flex flex-col items-center animate-in fade-in zoom-in-95 duration-100"
                  style={{ left: `clamp(84px, ${((isTimeDragging ? dragTime : hoverTime) / (duration || 1)) * 100}%, calc(100% - 84px))` }}
                >
                  <div className="w-40 aspect-video rounded-xl bg-black border border-white/20 shadow-[0_10px_25px_rgba(0,0,0,0.8)] overflow-hidden relative flex items-center justify-center">
                    <video
                      ref={previewVideoRef}
                      src={videoUrl || undefined}
                      className="w-full h-full object-contain pointer-events-none"
                      muted
                      playsInline
                      preload="auto"
                      onSeeked={handlePreviewSeeked}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute bottom-1.5 px-2 py-0.5 rounded-md bg-black/85 text-[10px] font-mono font-bold text-white border border-white/10 shadow-sm">
                      {formatTime(isTimeDragging ? dragTime : hoverTime)}
                    </span>
                  </div>
                  <div className="w-2.5 h-2.5 bg-black border-r border-b border-white/20 rotate-45 -mt-1.5 shadow" />
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
                  title="Click to return to previous point"
                >
                  <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)] border border-black/80 animate-pulse" />
                </div>
              )}

              <div className="w-full h-1 group-hover/seek:h-1.5 bg-white/20 rounded-full relative transition-all overflow-visible pointer-events-none">
                {/* 🌟 Khit Distinctive Hover Trail (0ms တုံ့ပြန်မှုဖြင့် မောက်စ်နောက် တန်းလိုက်မည့် Trail) */}
                {isHoveringTimeBar && (
                  <div 
                    className="h-full bg-gradient-to-r from-transparent via-[#8c1cff]/40 to-[#00F2FE]/50 rounded-l-full absolute top-0 left-0"
                    style={{ width: `${hoverPos}%` }}
                  />
                )}

                {/* 🔷 Khit Cyan Laser Pin Marker (0ms တုံ့ပြန်မှုဖြင့် မောက်စ်နောက် ကပ်လိုက်မည့် အလင်းတန်း) */}
                {isHoveringTimeBar && (
                  <div 
                    className="w-1 h-3.5 bg-[#00F2FE] rounded-full absolute top-1/2 -translate-y-1/2 -ml-0.5 shadow-[0_0_8px_#00F2FE] z-10"
                    style={{ left: `${hoverPos}%` }}
                  />
                )}

                <div 
                  className="h-full bg-[#8c1cff] rounded-l-full relative shadow-[0_0_8px_#8c1cff]" 
                  style={{ width: `${((isTimeDragging ? dragTime : currentTime) / (duration || 1)) * 100}%` }} 
                />
                <div 
                  className={`w-3.5 h-3.5 bg-white rounded-full absolute top-1/2 -translate-y-1/2 -ml-1.5 shadow-md transition-transform ${isTimeDragging ? "scale-125 bg-[#8c1cff] ring-2 ring-white" : "scale-0 group-hover/seek:scale-100"}`} 
                  style={{ left: `${((isTimeDragging ? dragTime : currentTime) / (duration || 1)) * 100}%` }} 
                />
              </div>
            </div>

          </div>
        </div>

        <DesktopVideoInfo
          videoData={videoData}
          isLiked={isLiked}
          setIsLiked={setIsLiked}
          isDownloadOpen={isDownloadOpen}
          setIsDownloadOpen={setIsDownloadOpen}
          downloadProgress={downloadProgress}
        />

        <DesktopComments
          chatMessages={chatMessages}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
        />

      </div>

      {/* ============ RIGHT COLUMN: RELATED VIDEOS ============ */}
      <DesktopUpNext isWideMode={isWideMode} />

    </div>
  );
}