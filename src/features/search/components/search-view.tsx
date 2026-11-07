"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Search, 
  CheckCircle2, 
  Play, 
  Eye, 
  Star,
  SlidersHorizontal,
  X,
  ArrowLeft
} from "lucide-react";
import { mockVideos } from "@/lib/data";
import { useTranslations } from "next-intl";

function SearchContent() {
  const t = useTranslations("Header");
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") || "").trim();
  const [searchInput, setSearchInput] = useState(query);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  // 🌟 Query အစစ်အမှန် ပါရှိမှသာ Filter ပြုလုပ်မည် (ဘာမှမရှာထားပါက ဗလာဖြစ်နေမည်)
  const filteredVideos = query
    ? mockVideos.filter((video) =>
        video.title.toLowerCase().includes(query.toLowerCase()) ||
        video.creator.toLowerCase().includes(query.toLowerCase()) ||
        video.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="px-4 sm:px-8 pb-16 pt-4 max-w-[1200px] mx-auto space-y-6 relative z-10">
      
      {/* 🔍 Search Input Bar (Mobile တွင် Back Arrow ခလုတ်ပါဝင်သော သီးသန့် Search ဘား) */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-2 -ml-2 text-zinc-400 hover:text-white rounded-xl md:hidden cursor-pointer shrink-0"
          title="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full h-11 bg-[#1c1a27] border border-white/10 rounded-2xl pl-11 pr-10 text-base sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#8c1cff]"
            autoFocus
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>
      </div>

      {/* 🌟 စာသားအမှန်တကယ် ရိုက်ရှာထားမှသာ Results Title နှင့် Filters ကို ပြသမည် */}
      {query ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-3">
            <Search className="w-6 h-6 text-[#8c1cff]" />
            {t("searchResults")} "{query}"
          </h1>
          
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1c1a27] border border-white/5 hover:border-white/10 text-sm font-bold text-zinc-300 transition-colors">
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>
      ) : null}

      {/* MATCHING CREATOR CARD (Top Result) */}
      {query && query.toLowerCase().includes("min") && (
        <div className="py-6 border-b border-white/5 flex flex-col sm:flex-row items-center gap-6 mb-8">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-amber-600 to-red-600 flex items-center justify-center font-bold text-4xl text-white shrink-0 border-4 border-[#14121d] shadow-lg relative">
            M
            <div className="absolute bottom-1 right-1 bg-blue-500 rounded-full w-6 h-6 border-[3px] border-[#14121d] flex items-center justify-center">
              <CheckCircle2 className="w-3 h-3 text-white" />
            </div>
          </div>
          <div className="text-center sm:text-left flex-1 space-y-2">
            <h2 className="text-2xl font-black text-white">Min Mahar</h2>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm text-[#797a8e] font-medium">
              <span>@minmahar_recap</span>
              <span>•</span>
              <span>128K Subscribers</span>
              <span>•</span>
              <span>42 Videos</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2 leading-relaxed">
              မြန်မာလို ရှင်းလင်းပြတ်သားတဲ့ ရုပ်ရှင်ဇာတ်လမ်း သုံးသပ်ချက်များ၊ စိတ်ဝင်စားဖွယ် သမိုင်းကြောင်းများနှင့် Knowledge Sharing Content များကို အပတ်စဉ် ပုံမှန် တင်ဆက်ပေးနေသော ချန်နယ် ဖြစ်ပါတယ်။
            </p>
          </div>
          <div className="shrink-0">
            <Link 
              href="/channel/minmahar"
              className="h-11 px-6 bg-[#8c1cff] hover:bg-[#9d3eff] text-white font-black text-sm rounded-2xl flex items-center justify-center shadow-[0_5px_20px_rgba(140,28,255,0.35)] transition-colors"
            >
              Visit Channel
            </Link>
          </div>
        </div>
      )}

      {/* 🌟 Query မရှိပါက Trending Tags ပြသမည်၊ Query ရှိပြီး ရှာမတွေ့ပါက Empty State ပြသမည် */}
      {!query ? (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500">
            <Search className="w-6 h-6" />
          </div>
          <p className="text-sm text-zinc-400 font-medium">ရှာဖွေလိုသော ရုပ်ရှင်၊ ဗီဒီယို သို့မဟုတ် ဖန်တီးရှင် အမည်ကို ရိုက်ထည့်ပါ</p>
          <div className="flex flex-wrap justify-center gap-2 max-w-md pt-2">
            {["Movie Recaps", "Solo Leveling", "Myanmar Info", "Knowledge", "Audiobooks"].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setSearchInput(tag);
                  router.push(`/search?q=${encodeURIComponent(tag)}`);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#1c1a27] border border-white/5 text-xs text-zinc-300 hover:text-white hover:border-[#8c1cff]/40 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="py-20 text-center space-y-2">
          <p className="text-sm font-bold text-zinc-300">"{query}" အတွက် မည်သည့် ဗီဒီယိုမှ ရှာမတွေ့ပါ</p>
          <p className="text-xs text-zinc-500">စာလုံးပေါင်း မှန်ကန်မှု ရှိ/မရှိ ပြန်လည်စစ်ဆေးပါ</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Videos ({filteredVideos.length})</h3>
          
          {filteredVideos.map((video) => (
            <Link 
              key={video.id} 
              href={`/watch/${video.id}`}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 py-2 transition-all group"
            >
            {/* Horizontal Thumbnail */}
            <div className={`relative w-full sm:w-80 lg:w-96 aspect-[16/9] rounded-xl bg-gradient-to-tr ${video.thumbnailBg} shrink-0 overflow-hidden`}>
              <span className="absolute bottom-3 right-3 bg-black/85 font-mono text-xs font-bold text-zinc-200 px-2 py-0.5 rounded-md backdrop-blur-sm">
                {video.duration}
              </span>
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-amber-300 text-xs font-black flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400" /> +{video.stars.toLocaleString()}
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-[#8c1cff] text-white flex items-center justify-center shadow-lg transform group-hover:scale-110">
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </div>
              </div>
            </div>

            {/* Video Details */}
            <div className="flex-1 py-1 space-y-2">
              <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#a042ff] transition-colors line-clamp-2 leading-snug">
                {video.title}
              </h3>
              
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#797a8e] font-medium">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-zinc-500" />
                  {video.views} views
                </span>
                <span>•</span>
                <span>{video.time}</span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <div className={`w-6 h-6 rounded-full bg-gradient-to-tr ${video.avatar} flex items-center justify-center font-bold text-[10px] text-white`}>
                  {video.creator.charAt(0)}
                </div>
                <span className="text-xs font-semibold text-zinc-300">{video.creator}</span>
                {video.verified && <CheckCircle2 className="w-3 h-3 text-[#2a87ff] fill-[#2a87ff] text-[#1c1a27]" />}
              </div>

              <p className="text-xs text-zinc-500 pt-1 line-clamp-2 leading-relaxed max-w-2xl">
                Detailed storyline walkthrough, Christopher Nolan direction notes, and ethical dilemmas of J. Robert Oppenheimer decoded in Burmese.
              </p>
            </div>
          </Link>
        ))}
      </div>
      )}

    </div>
  );
}

// Next.js 15 တွင် useSearchParams ကိုသုံးပါက Suspense ဖြင့် အုပ်ပေးရန် လိုအပ်ပါသည်
export function SearchView() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-white">Loading search results...</div>}>
      <SearchContent />
    </Suspense>
  );
}