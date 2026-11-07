"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ThumbsUp, Star, Share2, Bookmark, Download, Flag, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

interface DesktopVideoInfoProps {
  videoData: {
    title: string;
    views: number;
    description?: string;
    created_at?: string;
  } | null;
  isLiked: boolean;
  setIsLiked: (val: boolean) => void;
  isDownloadOpen: boolean;
  setIsDownloadOpen: (val: boolean) => void;
  downloadProgress: string | null;
}

export function DesktopVideoInfo({
  videoData,
  isLiked,
  setIsLiked,
  isDownloadOpen,
  setIsDownloadOpen,
  downloadProgress,
}: DesktopVideoInfoProps) {
  const t = useTranslations("Watch");
  const [isExpanded, setIsExpanded] = useState(false);

  // 🌟 Data မရောက်လာသေးခင် Home ကဲ့သို့ Skeleton အပြည့်ပြသမည့်အပိုင်း
  if (!videoData) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="space-y-2.5">
          <div className="h-8 bg-[#1c1a27] rounded-lg w-[85%]" />
          <div className="h-8 bg-[#1c1a27] rounded-lg w-1/2" />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 mt-2">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-[#1c1a27] shrink-0" />
            <div className="space-y-2">
              <div className="h-5 w-32 bg-[#1c1a27] rounded-md" />
              <div className="h-4 w-24 bg-[#1c1a27]/60 rounded-md" />
            </div>
            <div className="ml-2 h-9 w-24 bg-[#1c1a27] rounded-full" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-24 bg-[#1c1a27] rounded-full" />
            <div className="w-9 h-9 bg-[#1c1a27] rounded-full" />
            <div className="w-9 h-9 bg-[#1c1a27] rounded-full" />
            <div className="w-9 h-9 bg-[#1c1a27] rounded-full" />
            <div className="w-9 h-9 bg-[#1c1a27] rounded-full" />
          </div>
        </div>
        <div className="w-full bg-[#1c1a27]/40 border border-white/5 rounded-2xl p-4 h-28 mt-2">
          <div className="h-4 w-1/3 bg-[#1c1a27] rounded-md mb-4" />
          <div className="space-y-2.5">
            <div className="h-3 w-full bg-[#1c1a27] rounded-md" />
            <div className="h-3 w-4/5 bg-[#1c1a27] rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      
      {/* 🌟 1. Video Title */}
      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
        {videoData.title}
      </h1>

      {/* 🌟 2. Channel Info & Actions Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
        
        {/* Left: Channel Info */}
        <div className="flex items-center gap-4">
          <Link href="/channel/minmahar" className="shrink-0 cursor-pointer group">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-700 to-amber-900 border border-zinc-700 flex items-center justify-center font-bold text-white text-sm group-hover:scale-105 transition-transform shadow-md">
              M
            </div>
          </Link>
          <div className="flex flex-col">
            <Link href="/channel/minmahar" className="font-bold text-white hover:text-[#fc5b69] transition-colors flex items-center gap-1.5 text-base">
              Min Mahar
              <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-500 text-[#131224]" />
            </Link>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
              <span>@minmahar</span>
              <span>•</span>
              <span>128K {t("tuned")}</span>
            </div>
          </div>
          <button className="ml-2 h-9 px-5 rounded-full bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-sm transition-colors cursor-pointer shadow-sm">
            {t("tune")}
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Like (Icon + Count) */}
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className={`h-9 px-4 rounded-full text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer ${
              isLiked 
                ? "bg-[#8c1cff] text-white shadow-md shadow-[#8c1cff]/30" 
                : "bg-white/10 text-zinc-200 hover:bg-white/20"
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${isLiked ? "fill-white" : ""}`} />
            <span>47K</span>
          </button>

          {/* Star (Icon only) */}
          <Link
            href="/stars"
            title={t("sendStar")}
            className="w-9 h-9 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/20 text-amber-400 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
          >
            <Star className="w-4 h-4 fill-amber-400" />
          </Link>

          {/* Download (Icon only) */}
          <button 
            onClick={() => setIsDownloadOpen(!isDownloadOpen)}
            title={downloadProgress ? `DL (${downloadProgress})` : t("download")}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer active:scale-95"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Save (Icon only) */}
          <button 
            title={t("save")}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer active:scale-95"
          >
            <Bookmark className="w-4 h-4" />
          </button>

          {/* Share (Icon only) */}
          <button 
            title={t("share")}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer active:scale-95"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Report (Icon only) */}
          <button 
            title="Report"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
          >
            <Flag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 🌟 3. Dedicated Expandable Description Card */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-[#1c1a27] hover:bg-[#232031] border border-white/5 rounded-2xl p-4 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2 text-sm font-bold text-white mb-2 flex-wrap">
          <span>{(videoData?.views || 0).toLocaleString()} {t("views")}</span>
          <span className="text-zinc-500">•</span>
          <span>{videoData?.created_at ? new Date(videoData.created_at).toLocaleDateString() : t("recentlyUploaded")}</span>
          {!isExpanded && <span className="text-[#8c1cff] ml-1 text-xs">{t("showMore")}</span>}
        </div>

        <p className={`text-sm text-zinc-300 leading-relaxed font-medium ${isExpanded ? "" : "line-clamp-2"}`}>
          {videoData?.description || t("noDescription")}
        </p>
      </div>

    </div>
  );
}