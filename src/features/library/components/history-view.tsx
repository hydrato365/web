"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  History as HistoryIcon, 
  Trash2, 
  PauseCircle, 
  PlayCircle, 
  Search, 
  X, 
  Play, 
  Clock, 
  Heart,
  ThumbsUp,
  Sparkles,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { initialHistoryGroups } from "../data/mock-history";
import { useTranslations } from "next-intl";

export function HistoryView() {
  const t = useTranslations("History");
  const [historyGroups, setHistoryGroups] = useState(initialHistoryGroups);
  const [searchHistory, setSearchHistory] = useState("");
  const [isPaused, setIsPaused] = useState(false);

  // 🌟 Filter State: "all" | "liked" | "unliked"
  const [filterType, setFilterType] = useState<"all" | "liked" | "unliked">("all");
  const [timeFilter, setTimeFilter] = useState<string>("all");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date(2026, 9, 1)); // October 2026

  const handleRemoveVideo = (videoId: number) => {
    setHistoryGroups(
      historyGroups
        .map((group) => ({
          ...group,
          videos: group.videos.filter((v) => v.id !== videoId),
        }))
        .filter((group) => group.videos.length > 0)
    );
  };

  const handleClearAll = () => {
    setHistoryGroups([]);
  };

  const totalVideosCount = historyGroups.reduce((acc, g) => acc + g.videos.length, 0);

  return (
    <div className="px-4 sm:px-8 pb-4 pt-4 max-w-[1400px] mx-auto space-y-7 relative z-10">
      
      {/* ================= ၁။ HEADER & CONTROLS ================= */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <HistoryIcon className="w-8 h-8 text-[#fc5b69]" />
            {t("title")}
          </h1>
          <p className="text-xs sm:text-sm text-[#797a8e] mt-1.5">
            {t("subtitle")}
          </p>
        </div>

        {totalVideosCount > 0 && (
          <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`h-10 px-4 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                isPaused
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                  : "bg-[#1c1a27] border-white/5 text-zinc-300 hover:text-white hover:bg-zinc-800"
              }`}
            >
              {isPaused ? <PlayCircle className="w-4 h-4" /> : <PauseCircle className="w-4 h-4" />}
              <span>{isPaused ? t("resume") : t("pause")}</span>
            </button>

            <button
              onClick={handleClearAll}
              className="h-10 px-4 rounded-xl bg-red-600/10 hover:bg-red-600/20 border border-red-600/30 text-red-400 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>{t("clearAll")}</span>
            </button>
          </div>
        )}
      </div>

      {/* ================= ၂။ 🎯 FILTER PILLS & SEARCH BAR ================= */}
      {totalVideosCount > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* 🌟 Filter Pills (Edge-to-edge scroll view on mobile) */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
            {[
              { id: "all", label: t("filterAll"), icon: null },
              { id: "liked", label: t("filterLiked"), icon: Heart },
              { id: "unliked", label: t("filterUnliked"), icon: null },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = filterType === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilterType(tab.id as typeof filterType)}
                  className={`h-10 px-4 rounded-2xl text-xs font-bold transition-colors border flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? "bg-[#fc5b69] text-white border-[#fc5b69]"
                      : "bg-[#1c1a27] border-white/5 text-zinc-400 hover:text-white hover:bg-[#232031]"
                  }`}
                >
                  {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? "fill-white" : ""}`} />}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search & Time Jump Controls */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-56">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    placeholder={t("searchPlaceholder")}
                    value={searchHistory}
                    onChange={(e) => setSearchHistory(e.target.value)}
                    className="w-full h-10 bg-[#1c1a27] border border-white/5 rounded-2xl pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#fc5b69]/50 transition-colors"
                  />
                </div>

                {/* 📅 Interactive Calendar DatePicker Popup */}
                <div className="relative shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    className={`h-10 px-3.5 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer ${
                      timeFilter !== "all"
                        ? "bg-[#fc5b69]/15 border-[#fc5b69]/40 text-[#fc5b69]"
                        : "bg-[#1c1a27] border-white/5 text-zinc-300 hover:text-white hover:bg-[#232031]"
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    <span>
                      {timeFilter === "all" ? t("calendar") : timeFilter === "today" ? t("today") : timeFilter === "yesterday" ? t("yesterday") : timeFilter}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 transition-transform ${isCalendarOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isCalendarOpen && (
                    <>
                      <div 
                        onClick={() => setIsCalendarOpen(false)} 
                        className="fixed inset-0 z-40" 
                      />
                      <div className="absolute right-0 top-12 w-72 bg-[#181628] border border-white/10 rounded-3xl p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 space-y-3">
                        
                        {/* Month & Navigation Header */}
                        <div className="flex items-center justify-between pb-2 border-b border-white/5">
                          <span className="text-xs font-black text-white">
                            {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
                              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 cursor-pointer"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
                              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 cursor-pointer"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Weekday Names */}
                        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-zinc-500">
                          <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                        </div>

                        {/* Calendar Days Grid */}
                        <div className="grid grid-cols-7 gap-1 text-center">
                          {Array(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay()).fill(null).map((_, i) => (
                            <div key={`blank-${i}`} className="h-7 w-7" />
                          ))}
                          {Array.from({ length: new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate() }, (_, i) => i + 1).map((day) => {
                            const isToday = day === 24 && calendarMonth.getMonth() === 9 && calendarMonth.getFullYear() === 2026;
                            const isYesterday = day === 23 && calendarMonth.getMonth() === 9 && calendarMonth.getFullYear() === 2026;
                            const isSelected = 
                              (timeFilter === "today" && isToday) ||
                              (timeFilter === "yesterday" && isYesterday) ||
                              timeFilter === `Oct ${day}`;

                            return (
                              <button
                                key={day}
                                type="button"
                                onClick={() => {
                                  if (isToday) {
                                    setTimeFilter("today");
                                  } else if (isYesterday) {
                                    setTimeFilter("yesterday");
                                  } else {
                                    setTimeFilter(`Oct ${day}`);
                                  }
                                  setIsCalendarOpen(false);
                                }}
                                className={`h-7 w-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer ${
                                  isSelected
                                    ? "bg-[#fc5b69] text-white shadow-md font-bold"
                                    : isToday
                                    ? "text-[#fc5b69] border border-[#fc5b69]/40 hover:bg-[#fc5b69]/10"
                                    : "text-zinc-300 hover:bg-white/5 hover:text-white"
                                }`}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>

                        {/* Quick Shortcuts */}
                        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px]">
                          <button
                            type="button"
                            onClick={() => {
                              setTimeFilter("all");
                              setIsCalendarOpen(false);
                            }}
                            className="text-zinc-400 hover:text-white font-medium cursor-pointer"
                          >
                            {t("allTime")}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setTimeFilter("today");
                              setIsCalendarOpen(false);
                            }}
                            className="text-[#fc5b69] hover:underline font-bold cursor-pointer"
                          >
                            {t("jumpToToday")}
                          </button>
                        </div>

                      </div>
                    </>
                  )}
                </div>
              </div>
        </div>
      )}

      {/* ================= ၃။ HISTORY LIST ================= */}
      {totalVideosCount === 0 ? (
        <div className="py-24 text-center rounded-3xl bg-[#1c1a27]/50 border border-white/5 space-y-3">
          <HistoryIcon className="w-12 h-12 text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-white">{t("noHistory")}</h3>
          <p className="text-xs text-[#797a8e] max-w-sm mx-auto leading-relaxed">
            {t("noHistorySub")}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {historyGroups.map((group) => {
            // Time Filter ဖြင့် စစ်ထုတ်ခြင်း
            if (timeFilter !== "all" && group.period.toLowerCase() !== timeFilter) {
              return null;
            }

            // Search နှင့် Liked/Unliked Filter တွဲစစ်ထုတ်ခြင်း
            const filteredGroupVideos = group.videos.filter((v) => {
              const matchesSearch =
                v.title.toLowerCase().includes(searchHistory.toLowerCase()) ||
                v.creator.toLowerCase().includes(searchHistory.toLowerCase());
              
              if (filterType === "liked") return matchesSearch && v.isLiked;
              if (filterType === "unliked") return matchesSearch && !v.isLiked;
              return matchesSearch;
            });

            if (filteredGroupVideos.length === 0) return null;

            return (
              <div key={group.period} className="space-y-4">
                <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#fc5b69]" />
                  <span>{group.period}</span>
                </h2>

                <div className="space-y-3">
                  {filteredGroupVideos.map((video) => (
                    <div
                      key={video.id}
                      className="group flex gap-3 sm:gap-4 items-start py-2.5 border-b border-white/5 last:border-b-0 transition-colors"
                    >
                      {/* Thumbnail (စခရင်နှင့် အချိုးကျ အရွယ်အစား) */}
                      <Link 
                        href={`/watch/${video.id}`}
                        className={`relative w-32 sm:w-44 md:w-52 aspect-[16/9] rounded-xl bg-gradient-to-tr ${video.thumbBg} border border-zinc-800/80 shrink-0 overflow-hidden flex items-center justify-center cursor-pointer`}
                      >
                        <span className="absolute bottom-1.5 right-1.5 bg-black/85 font-mono text-[9px] sm:text-[10px] font-bold text-zinc-200 px-1 py-0.5 rounded">
                          {video.duration}
                        </span>

                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                            <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white ml-0.5" />
                          </div>
                        </div>

                        {/* Progress Line */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-zinc-800">
                          <div 
                            className="h-full bg-red-600"
                            style={{ width: `${video.progress}%` }}
                          />
                        </div>
                      </Link>

                      {/* Details & Top-right X button */}
                      <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
                        
                        {/* Title နှင့် X ခလုတ်ကို ထိပ်ဆုံးတွင် အတူတကွ နေရာချထားခြင်း */}
                        <div className="flex items-start justify-between gap-2">
                          <Link href={`/watch/${video.id}`} className="min-w-0 flex-1">
                            <h3 className="text-xs sm:text-sm md:text-base font-bold text-white group-hover:text-[#fc5b69] transition-colors line-clamp-2 leading-snug cursor-pointer">
                              {video.title}
                            </h3>
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleRemoveVideo(video.id)}
                            title="Remove from history"
                            className="p-1 -mr-1 -mt-0.5 text-zinc-500 hover:text-red-400 hover:bg-white/5 rounded-lg shrink-0 cursor-pointer transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Creator & Liked badge */}
                        <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                          <Link 
                            href={`/channel/${video.handle}`}
                            className="font-semibold text-zinc-300 hover:text-white transition-colors truncate"
                          >
                            {video.creator}
                          </Link>
                          
                          {video.isLiked && (
                            <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-[#fc5b69] bg-[#fc5b69]/10 px-1.5 py-0.5 rounded-full shrink-0">
                              <Heart className="w-2.5 h-2.5 fill-[#fc5b69]" /> {t("likedBadge")}
                            </span>
                          )}
                        </div>

                        {/* Views • Watched Time (စာကြောင်းမကျိုးဘဲ သေသပ်စွာ တန်းစီခြင်း) */}
                        <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-[#797a8e] font-medium pt-1 whitespace-nowrap overflow-hidden">
                          <span className="shrink-0">{video.views} {t("views")}</span>
                          <span className="shrink-0 text-zinc-600">•</span>
                          <span className="shrink-0 text-zinc-400 font-semibold truncate">{video.watchedTime}</span>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}