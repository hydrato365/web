"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Users, 
  Sparkles, 
  Play, 
  Star, 
  Eye, 
  CheckCircle2, 
  Heart,
  MessageSquare,
  BarChart2,
  Quote
} from "lucide-react";
import { subscribedCreators, subscriptionFeed } from "../data/mock-subscriptions";
import { useTranslations } from "next-intl";

export function SubscriptionsView() {
  const t = useTranslations("Subscriptions");
  const [filter, setFilter] = useState<"all" | "videos" | "posts" | "live">("all");
  const [selectedCreator, setSelectedCreator] = useState<string | null>(null);
  
  // Post များ၏ "See more" အဖွင့်/အပိတ် အခြေအနေကို မှတ်သားထားမည့် State
  const [expandedPosts, setExpandedPosts] = useState<number[]>([]);

  const toggleExpand = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    setExpandedPosts(prev => prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]);
  };

  const filteredItems = subscriptionFeed.filter((item) => {
    const matchesCreator = selectedCreator ? item.handle === selectedCreator : true;
    if (filter === "videos") return matchesCreator && item.type === "video";
    if (filter === "posts") return matchesCreator && item.type === "post";
    if (filter === "live") return matchesCreator && item.type === "video" && item.isLive;
    return matchesCreator;
  });

  return (
    <div className="px-4 sm:px-8 pb-4 pt-4 max-w-[1700px] mx-auto space-y-8 relative z-10">
      
      {/* ================= ၁။ FOLLOWED CREATORS STORIES BAR ================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-red-500" />
            <span>{t("tunedChannels")} ({subscribedCreators.length})</span>
          </h2>
          <Link
            href="/channel/minmahar"
            className="text-xs font-bold text-zinc-400 hover:text-white transition-colors"
          >
            {t("manage")}
          </Link>
        </div>

        {/* Horizontal Creator Avatars Carousel (Edge-to-edge scroll view) */}
        <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none pt-1 -mx-4 px-4 sm:-mx-8 sm:px-8">
          {/* All Creators Reset Button */}
          <button
            onClick={() => setSelectedCreator(null)}
            className={`flex flex-col items-center gap-2 shrink-0 cursor-pointer group`}
          >
            <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all ${
              selectedCreator === null 
                ? "border-red-600 bg-red-600/10 text-white shadow-[0_0_15px_rgba(220,38,38,0.3)]" 
                : "border-white/10 bg-[#1c1a27] text-zinc-400 group-hover:border-zinc-600"
            }`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-zinc-300">{t("all")}</span>
          </button>

          {/* Creators List */}
          {subscribedCreators.map((creator) => {
            const isSelected = selectedCreator === creator.handle;
            return (
              <button
                key={creator.id}
                onClick={() => setSelectedCreator(isSelected ? null : creator.handle)}
                className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group"
              >
                <div className="relative">
                  {/* Avatar with Ring (Live or New Upload indicator) */}
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-tr ${creator.avatar} flex items-center justify-center font-bold text-white text-sm border-2 transition-all group-hover:scale-105 ${
                    isSelected 
                      ? "border-[#8c1cff] shadow-[0_0_15px_rgba(140,28,255,0.5)]" 
                      : creator.isLive 
                        ? "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse" 
                        : creator.hasNew 
                          ? "border-[#8c1cff]" 
                          : "border-white/10"
                  }`}>
                    {creator.name.charAt(0)}
                  </div>

                  {/* Live Badge */}
                  {creator.isLive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full bg-red-600 text-[9px] font-black uppercase text-white shadow-md">
                      Live
                    </span>
                  )}

                  {/* New Upload Dot */}
                  {!creator.isLive && creator.hasNew && (
                    <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-[#fc5b69] border-2 border-[#14121d]" />
                  )}
                </div>

                <span className={`text-[11px] font-semibold truncate max-w-[70px] ${
                  isSelected ? "text-white font-bold" : "text-zinc-400 group-hover:text-zinc-200"
                }`}>
                  {creator.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= ၂။ FILTER TABS & FEED HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/5 pt-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <span>{selectedCreator ? `@${selectedCreator}'s Feed` : t("feedTitle")}</span>
          </h1>
          <p className="text-xs text-[#797a8e] mt-1">
            {t("feedSubtitle")}
          </p>
        </div>

        {/* Quick Filter Pills (Edge-to-edge scroll view on mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 self-start sm:self-auto">
          {[
            { id: "all", label: t("filterAll") },
            { id: "videos", label: t("filterVideos") },
            { id: "posts", label: t("filterPosts") },
            { id: "live", label: t("filterLive") },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as typeof filter)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-colors border cursor-pointer whitespace-nowrap ${
                filter === tab.id
                  ? "bg-[#8c1cff] text-white border-[#8c1cff]"
                  : "bg-[#1c1a27] border-white/5 text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ================= ၃။ SUBSCRIPTION FEED GRID (Videos + Compact Posts) ================= */}
      {filteredItems.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-[#1c1a27]/50 border border-white/5 space-y-2">
          <Users className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-white">{t("noUpdates")}</h3>
          <p className="text-xs text-[#797a8e]">
            {t("noUpdatesSub")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
          {filteredItems.map((item) => {
            // ၁။ Visual Community Post Card (ပုံပါက ၂ ကော်လံ၊ ပုံမပါက ၁ ကော်လံ Aesthetic Quote Card)
            if (item.type === "post") {
              // (က) ပုံပါသော Post ဖြစ်လျှင် -> ကော်လံ ၂ ခုစာ ဘယ်ညာယှဉ်ပြမည်
              if (item.image) {
                return (
                  <div 
                    key={item.id} 
                    className="sm:col-span-2 p-4 rounded-2xl bg-[#181628] border border-white/5 shadow-md hover:border-white/10 transition-colors flex flex-col sm:flex-row sm:gap-4 sm:items-stretch justify-between"
                  >
                    {/* ဘယ်ဘက်ခြမ်း ဓာတ်ပုံ (Blurred Background + Object Contain စနစ်) */}
                    <div className="relative w-full sm:w-[45%] lg:w-[48%] aspect-[16/9] sm:aspect-auto rounded-xl overflow-hidden border border-white/5 bg-black shrink-0 group/img min-h-[160px] cursor-pointer" title="Click to view full image">
                      {/* ဝါးနေသော အနောက်ခံ (Blurred Background) */}
                      <div 
                        className="absolute inset-0 bg-cover bg-center opacity-40 blur-xl scale-125 transition-transform duration-500 group-hover/img:scale-150"
                        style={{ backgroundImage: `url('${item.image}')` }}
                      />
                      {/* မူလအချိုးအစားမပျက်သော ဓာတ်ပုံအစစ် (Object Contain) */}
                      <img 
                        src={item.image} 
                        alt="Post attachment" 
                        className="absolute inset-0 w-full h-full object-contain z-10 group-hover/img:scale-105 transition-transform duration-500" 
                        loading="lazy"
                      />
                    </div>

                    {/* ညာဘက်ခြမ်း စာသားနှင့် မဲပေးရန်အကွက် */}
                    <div className="flex-1 flex flex-col justify-between mt-3 sm:mt-0 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <Link href={`/channel/${item.handle}`} className="flex items-center gap-2.5 group cursor-pointer">
                          <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${item.avatar} flex items-center justify-center font-bold text-xs text-white`}>
                            {item.creator.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white group-hover:text-[#a042ff] transition-colors flex items-center gap-1">
                              {item.creator}
                              {item.verified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500 text-[#181628]" />}
                            </h4>
                            <span className="text-[10px] text-zinc-500">{item.time}</span>
                          </div>
                        </Link>
                        <span className="text-[10px] font-bold text-[#a042ff] bg-[#8c1cff]/10 px-2 py-0.5 rounded-full border border-[#8c1cff]/20">
                        {item.poll ? "📊 Poll" : item.image ? "📷 Photo" : "💬 Post"}
                      </span>
                    </div>

                    {/* Post Text Content (Expandable) */}
                    <div className="space-y-1">
                      <p className={`text-xs text-zinc-200 leading-relaxed font-normal ${expandedPosts.includes(item.id) ? "" : "line-clamp-3"}`}>
                        {item.content}
                      </p>
                      {item.content.length > 100 && (
                        <button 
                          onClick={(e) => toggleExpand(e, item.id)}
                          className="text-[11px] font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        >
                          {expandedPosts.includes(item.id) ? "Show less" : "... See more"}
                        </button>
                      )}
                    </div>

                    {/* 🖼️ Attached Image (Mobile တွင် အပေါ်/အလယ်၊ Desktop တွင် ဘယ်ဘက်ခြမ်း) */}

                      {item.poll && (
                        <div className="space-y-1.5 pt-0.5">
                          {item.poll.options.map((opt) => (
                            <div 
                              key={opt.id} 
                              className="relative overflow-hidden rounded-xl bg-[#131224] border border-white/5 px-2.5 py-1.5 flex items-center justify-between text-xs cursor-pointer hover:border-[#8c1cff]/40 transition-colors"
                            >
                              <div 
                                className="absolute left-0 top-0 bottom-0 bg-[#8c1cff]/15 rounded-l-xl pointer-events-none"
                                style={{ width: `${Math.round((opt.votes / item.poll!.totalVotes) * 100)}%` }}
                              />
                              <span className="relative z-10 font-medium text-zinc-300 text-[11px] truncate">{opt.text}</span>
                              <span className="relative z-10 font-bold text-[#a042ff] text-[10px] ml-2 shrink-0">
                                {Math.round((opt.votes / item.poll!.totalVotes) * 100)}%
                              </span>
                            </div>
                          ))}
                          <span className="text-[9px] text-zinc-500 block">{item.poll.totalVotes.toLocaleString()} votes</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-zinc-400 text-xs mt-auto">
                        <div className="flex items-center gap-4">
                          <button className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                            <Heart className="w-3.5 h-3.5 text-zinc-500" />
                            <span className="text-[11px] font-medium">{item.likes}</span>
                          </button>
                          <button className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                            <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
                            <span className="text-[11px] font-medium">{item.commentsCount}</span>
                          </button>
                        </div>
                        <Link 
                          href="/stars" 
                          className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-bold text-[11px] bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20 cursor-pointer"
                        >
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>Star</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              }

              // (ခ) ပုံမပါသော Post ဖြစ်လျှင် -> ၁ ကော်လံစာ Aesthetic Quote/Status Card အဖြစ် အချိုးကျ ပြသမည်
              return (
                <div 
                  key={item.id} 
                  className="p-5 rounded-2xl bg-gradient-to-br from-[#201c38] via-[#181628] to-[#131122] border border-white/10 shadow-md hover:border-white/20 transition-all flex flex-col justify-between relative overflow-hidden min-h-[260px] group"
                >
                  {/* အနောက်ခံ Quote အရိပ်သင်္ကေတ */}
                  <Quote className="absolute -bottom-3 -right-3 w-28 h-28 text-white/[0.04] -rotate-12 pointer-events-none group-hover:scale-105 transition-transform" />

                  <div className="space-y-3 relative z-10">
                    <div className="flex items-center justify-between">
                      <Link href={`/channel/${item.handle}`} className="flex items-center gap-2.5 group/creator cursor-pointer">
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${item.avatar} flex items-center justify-center font-bold text-xs text-white`}>
                          {item.creator.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white group-hover/creator:text-[#a042ff] transition-colors flex items-center gap-1">
                            {item.creator}
                            {item.verified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500 text-[#181628]" />}
                          </h4>
                          <span className="text-[10px] text-zinc-500">{item.time}</span>
                        </div>
                      </Link>
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                        {item.poll ? "📊 Poll" : "✍️ Status"}
                      </span>
                    </div>

                    {/* ထင်ရှားသော စာသားဒီဇိုင်း (Expandable) */}
                    <div className="space-y-1 relative z-10 pt-1">
                      <p className={`text-sm font-medium text-zinc-100 leading-relaxed ${expandedPosts.includes(item.id) ? "" : "line-clamp-4"}`}>
                        {item.content}
                      </p>
                      {item.content.length > 100 && (
                        <button 
                          onClick={(e) => toggleExpand(e, item.id)}
                          className="text-[11px] font-bold text-[#a042ff] hover:text-white transition-colors cursor-pointer"
                        >
                          {expandedPosts.includes(item.id) ? "Show less" : "... See more"}
                        </button>
                      )}
                    </div>

                    {item.poll && (
                      <div className="space-y-1.5 pt-1">
                        {item.poll.options.map((opt) => (
                          <div 
                            key={opt.id} 
                            className="relative overflow-hidden rounded-xl bg-[#131224] border border-white/5 px-2.5 py-1.5 flex items-center justify-between text-xs cursor-pointer hover:border-[#8c1cff]/40 transition-colors"
                          >
                            <div 
                              className="absolute left-0 top-0 bottom-0 bg-[#8c1cff]/15 rounded-l-xl pointer-events-none"
                              style={{ width: `${Math.round((opt.votes / item.poll!.totalVotes) * 100)}%` }}
                            />
                            <span className="relative z-10 font-medium text-zinc-300 text-[11px] truncate">{opt.text}</span>
                            <span className="relative z-10 font-bold text-[#a042ff] text-[10px] ml-2 shrink-0">
                              {Math.round((opt.votes / item.poll!.totalVotes) * 100)}%
                            </span>
                          </div>
                        ))}
                        <span className="text-[9px] text-zinc-500 block">{item.poll.totalVotes.toLocaleString()} votes</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/10 text-zinc-400 text-xs relative z-10 mt-auto">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                        <Heart className="w-3.5 h-3.5 text-zinc-500" />
                        <span className="text-[11px] font-medium">{item.likes}</span>
                      </button>
                      <button className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                        <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
                        <span className="text-[11px] font-medium">{item.commentsCount}</span>
                      </button>
                    </div>
                    <Link 
                      href="/stars" 
                      className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-bold text-[11px] bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20 cursor-pointer"
                    >
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>Star</span>
                    </Link>
                  </div>
                </div>
              );
            }

            // ၂။ Standard Video Card
            return (
              <div
                key={`video-${item.id}`}
                className="group cursor-pointer flex flex-col gap-2.5"
              >
                {/* Thumbnail */}
                <Link 
                  href={`/watch/${item.id}`}
                  className={`relative w-full aspect-[16/9] rounded-xl bg-gradient-to-tr ${item.thumbnailBg} border border-zinc-800/80 overflow-hidden flex items-center justify-center cursor-pointer`}
                >
                  {item.isLive ? (
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-lg bg-red-600 text-white font-black text-[10px] uppercase flex items-center gap-1 tracking-wider shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> LIVE
                    </div>
                  ) : (
                    <span className="absolute bottom-3 right-3 bg-black/85 font-mono text-[11px] font-bold text-zinc-200 px-2 py-0.5 rounded-md backdrop-blur-sm">
                      {item.duration}
                    </span>
                  )}

                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-amber-300 text-[10px] font-black flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>+{item.stars.toLocaleString()}</span>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-[#8c1cff] text-white flex items-center justify-center shadow-lg shadow-[#8c1cff]/40 transform group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>
                </Link>

                {/* Avatar & Details */}
                <div className="flex items-start gap-3 px-0.5">
                  <Link href={`/channel/${item.handle}`} className="relative shrink-0 z-10 rounded-full hover:scale-105 transition-transform mt-0.5">
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${item.avatar} flex items-center justify-center font-bold text-xs text-white shadow-sm`}>
                      {item.creator.charAt(0)}
                    </div>
                  </Link>

                  <div className="flex-1 overflow-hidden space-y-1">
                    <Link href={`/watch/${item.id}`}>
                      <h3 className="text-sm font-bold text-white group-hover:text-[#fc5b69] transition-colors line-clamp-2 leading-snug cursor-pointer">
                        {item.title}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-1">
                      <Link 
                        href={`/channel/${item.handle}`}
                        className="font-semibold text-zinc-300 hover:text-white transition-colors z-10"
                      >
                        {item.creator}
                      </Link>
                      {item.verified && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500 text-[#131224]" />
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-[#797a8e] font-medium">
                      <span>{item.views} views</span>
                      <span>•</span>
                      <span className="text-[#fc5b69] font-bold">{item.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}