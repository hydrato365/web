"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ThumbsUp, Star, Share2, Bookmark, Download, Flag, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

interface MobileVideoMetaProps {
  videoData: {
    title: string;
    views: number;
    description?: string;
    created_at?: string;
  } | null;
  isLiked: boolean;
  setIsLiked: (val: boolean) => void;
}

export function MobileVideoMeta({ videoData, isLiked, setIsLiked }: MobileVideoMetaProps) {
  const t = useTranslations("Watch");

  // 🌟 Data မရောက်လာသေးခင် Home ကဲ့သို့ Skeleton အပြည့်ပြသမည့်အပိုင်း
  if (!videoData) {
    return (
      <div className="flex flex-col px-4 pt-4 pb-1 gap-4 animate-pulse">
        <div className="space-y-2">
          <div className="h-6 bg-[#1c1a27] rounded-lg w-full" />
          <div className="h-6 bg-[#1c1a27] rounded-lg w-3/4" />
        </div>
        <div className="flex items-center justify-between gap-3 mt-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1c1a27] shrink-0" />
            <div className="space-y-1.5">
              <div className="h-4 w-24 bg-[#1c1a27] rounded-md" />
              <div className="h-3 w-16 bg-[#1c1a27]/60 rounded-md" />
            </div>
          </div>
          <div className="h-9 w-20 bg-[#1c1a27] rounded-full shrink-0" />
        </div>
        <div className="flex items-center gap-2 overflow-hidden pb-1 -mx-4 px-4 mt-2">
          <div className="h-9 w-24 bg-[#1c1a27] rounded-full shrink-0" />
          <div className="w-9 h-9 bg-[#1c1a27] rounded-full shrink-0" />
          <div className="w-9 h-9 bg-[#1c1a27] rounded-full shrink-0" />
          <div className="w-9 h-9 bg-[#1c1a27] rounded-full shrink-0" />
          <div className="w-9 h-9 bg-[#1c1a27] rounded-full shrink-0" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-4 pt-4 pb-1 gap-3.5">
      
      {/* 🌟 1. Video Title (သီးသန့်ခေါင်းစဉ်) */}
      <h1 className="text-base sm:text-lg font-bold leading-snug text-white">
        {videoData.title}
      </h1>

      {/* 🌟 Views & Upload Date (YouTube Mobile စတိုင်) */}
      <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium -mt-1.5">
        <span>{(videoData?.views || 0).toLocaleString()} {t("views")}</span>
        <span>•</span>
        <span>{videoData?.created_at ? new Date(videoData.created_at).toLocaleDateString() : t("recentlyUploaded")}</span>
      </div>

      {/* 🌟 2. Channel Info & Subscribe Button (ချန်နယ် အချက်အလက်များကို ရှင်းလင်းစွာပြသခြင်း) */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <Link href="/channel/minmahar" className="flex items-center gap-3 min-w-0 flex-1 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-amber-900 border border-white/10 flex items-center justify-center font-bold text-white text-sm shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            M
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-white truncate group-hover:text-[#fc5b69] transition-colors">
                Min Mahar
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500 text-[#131224] shrink-0" />
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-medium">
              <span>@minmahar</span>
              <span>•</span>
              <span>128K {t("tuned")}</span>
            </div>
          </div>
        </Link>

        <button className="h-9 px-4 bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-bold rounded-full shrink-0 active:scale-95 transition-transform shadow-sm cursor-pointer">
          {t("tune")}
        </button>
      </div>

      {/* 🌟 3. Action Buttons Row (Horizontal Scroll) */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 -mx-4 px-4">
        {/* Like (Icon + Count) */}
        <button 
          onClick={() => setIsLiked(!isLiked)} 
          className={`h-9 px-4 shrink-0 rounded-full flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
            isLiked 
              ? "bg-[#8c1cff] text-white shadow-md shadow-[#8c1cff]/30" 
              : "bg-white/10 text-zinc-100 hover:bg-white/20"
          }`}
        >
          <ThumbsUp className={`w-4 h-4 ${isLiked ? "fill-white" : ""}`} /> 
          <span>47K</span>
        </button>

        {/* Star */}
        <Link 
          href="/stars" 
          title="Send Star"
          className="w-9 h-9 shrink-0 bg-amber-500/15 border border-amber-500/20 text-amber-400 hover:bg-amber-500/30 rounded-full flex items-center justify-center transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <Star className="w-4 h-4 fill-amber-400" /> 
        </Link>

        {/* Download */}
        <button title="Download" className="w-9 h-9 shrink-0 bg-white/10 hover:bg-white/20 text-zinc-200 rounded-full flex items-center justify-center transition-colors active:scale-95 cursor-pointer">
          <Download className="w-4 h-4" />
        </button>

        {/* Save */}
        <button title="Save" className="w-9 h-9 shrink-0 bg-white/10 hover:bg-white/20 text-zinc-200 rounded-full flex items-center justify-center transition-colors active:scale-95 cursor-pointer">
          <Bookmark className="w-4 h-4" /> 
        </button>

        {/* Share */}
        <button title="Share" className="w-9 h-9 shrink-0 bg-white/10 hover:bg-white/20 text-zinc-200 rounded-full flex items-center justify-center transition-colors active:scale-95 cursor-pointer">
          <Share2 className="w-4 h-4" /> 
        </button>

        {/* Report */}
        <button title="Report" className="w-9 h-9 shrink-0 bg-white/10 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 rounded-full flex items-center justify-center transition-colors active:scale-95 cursor-pointer">
          <Flag className="w-4 h-4" /> 
        </button>
      </div>

      </div>
  );
}