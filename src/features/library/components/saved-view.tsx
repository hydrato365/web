"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Bookmark, 
  BookmarkCheck, 
  Play, 
  Shuffle, 
  Trash2, 
  Clock, 
  Lock, 
  Sparkles, 
  Eye, 
  CheckCircle2, 
  Share2, 
  SlidersHorizontal,
  Layers,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { initialAlbums, initialSavedVideos } from "../data/mock-saved";
import { useTranslations } from "next-intl";

export function SavedView() {
  const t = useTranslations("Saved");
  const [savedVideos, setSavedVideos] = useState(initialSavedVideos);
  const [searchQuery, setSearchQuery] = useState("");
  const [albums, setAlbums] = useState(initialAlbums);
  const [selectedAlbumId, setSelectedAlbumId] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newAlbumTitle, setNewAlbumTitle] = useState("");

  // Remove video from saved list
  const handleRemoveSaved = (id: number) => {
    setSavedVideos(savedVideos.filter((v) => v.id !== id));
  };

  // Clear all saved videos
  const handleClearAll = () => {
    setSavedVideos([]);
  };

  const filteredVideos = savedVideos.filter((v) => {
    const matchesSearch =
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.creator.toLowerCase().includes(searchQuery.toLowerCase());

    const activeAlbum = albums.find((a) => a.id === selectedAlbumId);
    if (!activeAlbum || activeAlbum.id === "all") return matchesSearch;
    return matchesSearch && v.category === activeAlbum.category;
  });

  return (
    <div className="px-4 sm:px-8 pb-4 pt-4 max-w-[1400px] mx-auto space-y-8 relative z-10">
      
      {/* ================= ၁။ SAVED PLAYLIST HERO SUMMARY ================= */}
      <div className="rounded-3xl bg-gradient-to-r from-[#1c1a27] via-[#181624] to-[#14121d] border border-white/5 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 blur-[90px] rounded-full pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          
          {/* Left: Info */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/10 border border-red-600/20 text-[#fc5b69] text-xs font-bold uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" />
              <span>{t("privatePlaylist")}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
              <Bookmark className="w-8 h-8 text-[#fc5b69] fill-[#fc5b69]" />
              {t("title")}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[#797a8e] font-medium">
              <span className="text-zinc-200 font-bold">{savedVideos.length} {t("videosCount")}</span>
              <span>•</span>
              <span>{t("updatedRecently")}</span>
              <span>•</span>
              <span>{t("onlyVisibleToYou")}</span>
            </div>
          </div>

          {/* Right: Actions (Play All, Shuffle, Clear) */}
          {savedVideos.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {/* Play All Link */}
              <Link
                href={`/watch/${savedVideos[0]?.id || 1}`}
                className="h-11 px-6 bg-[#fc5b69] hover:bg-[#ff6976] text-white font-black text-xs sm:text-sm rounded-2xl flex items-center gap-2 shadow-[0_5px_20px_rgba(252,91,105,0.3)] transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{t("playAll")}</span>
              </Link>

              {/* Shuffle Button */}
              <button
                title="Shuffle playlist"
                className="h-11 w-11 rounded-2xl bg-[#1c1a27] hover:bg-zinc-800 border border-white/5 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <Shuffle className="w-4 h-4" />
              </button>

              {/* Clear All Button */}
              <button
                onClick={handleClearAll}
                title="Clear all saved videos"
                className="h-11 px-4 rounded-2xl bg-red-600/10 hover:bg-red-600/20 border border-red-600/30 text-red-400 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t("clear")}</span>
              </button>
            </div>
          )}

        </div>
      </div>

      {/* ================= ၂။ 3D STACKED CARD ALBUMS CAROUSEL ================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#fc5b69]" />
            <span>{t("albumsTitle")} ({albums.length})</span>
          </h2>
          <span className="text-[11px] text-zinc-500 font-medium">{t("selectAlbum")}</span>
        </div>

        {/* Horizontal Edge-to-Edge Stacked Albums Carousel */}
        <div className="flex items-start gap-5 overflow-x-auto scrollbar-none pt-3 pb-2 -mx-4 px-4 sm:-mx-8 sm:px-8">
          
          {/* ➕ Create New Album Card */}
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="w-36 sm:w-44 shrink-0 flex flex-col items-center justify-center aspect-[16/11] rounded-2xl border-2 border-dashed border-white/10 hover:border-[#fc5b69]/50 hover:bg-white/5 transition-all text-zinc-400 hover:text-white cursor-pointer group space-y-1.5"
          >
            <div className="w-9 h-9 rounded-full bg-[#1c1a27] border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform text-zinc-300">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold">{t("newAlbum")}</span>
          </button>

          {/* 🎴 Stacked Album Cards */}
          {albums.map((album) => {
            const isSelected = selectedAlbumId === album.id;
            return (
              <div
                key={album.id}
                onClick={() => setSelectedAlbumId(album.id)}
                className="w-40 sm:w-48 shrink-0 flex flex-col space-y-2 cursor-pointer group select-none"
              >
                {/* 3D Stacked Layers Wrapper */}
                <div className="relative pt-2.5">
                  {/* Back Layer 2 (အနောက်ဆုံးကတ်ပြား) */}
                  <div className="absolute top-0 inset-x-4 h-6 rounded-xl bg-white/5 border border-white/5 transform -translate-y-1 scale-90 transition-transform group-hover:-translate-y-2" />

                  {/* Back Layer 1 (အလယ်ကတ်ပြား) */}
                  <div className="absolute top-1.5 inset-x-2 h-6 rounded-xl bg-white/10 border border-white/10 transform -translate-y-0.5 scale-95 transition-transform group-hover:-translate-y-1" />

                  {/* Front Main Cover Card (အရှေ့ဆုံး ပင်မ အဖုံးကတ်ပြား) */}
                  <div className={`relative aspect-[16/10] rounded-2xl bg-gradient-to-tr ${album.thumbBg} border overflow-hidden shadow-xl flex flex-col justify-between p-2.5 transition-all group-hover:scale-102 ${
                    isSelected
                      ? "border-[#fc5b69] ring-2 ring-[#fc5b69]/40 shadow-[0_0_15px_rgba(252,91,105,0.25)]"
                      : "border-white/15 group-hover:border-white/30"
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-zinc-300 border border-white/10">
                        {album.count} {t("videos")}
                      </span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-[#fc5b69] animate-pulse" />
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-zinc-400 font-medium truncate">
                        {album.category}
                      </span>
                      <div className="w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-3 h-3 fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Album Title & Meta */}
                <div className="space-y-0.5 px-0.5">
                  <h4 className={`text-xs sm:text-sm font-bold truncate transition-colors ${
                    isSelected ? "text-[#fc5b69]" : "text-white group-hover:text-zinc-200"
                  }`}>
                    {album.title}
                  </h4>
                  <p className="text-[10px] text-zinc-500 font-medium">
                    {album.updated}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= ၃။ FILTER & SEARCH BAR ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/5 pt-4">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 bg-[#1c1a27] border border-white/5 rounded-2xl px-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#fc5b69]/50 transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <span>
            {t("showing")} <b className="text-white">{filteredVideos.length}</b> {t("videosCount")}
            {selectedAlbumId !== "all" && (
              <> {t("in")} <b className="text-[#fc5b69]">{albums.find(a => a.id === selectedAlbumId)?.title}</b></>
            )}
          </span>
          {selectedAlbumId !== "all" && (
            <button
              type="button"
              onClick={() => setSelectedAlbumId("all")}
              className="text-[#fc5b69] hover:underline font-bold text-[11px] cursor-pointer"
            >
              {t("resetToAll")}
            </button>
          )}
        </div>
      </div>

      {/* 📁 Create New Album Modal Popup */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            onClick={() => setIsCreateModalOpen(false)} 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
          />
          <div className="relative w-full max-w-sm bg-[#181628] border border-white/10 rounded-3xl p-6 shadow-2xl z-10 space-y-4 text-white animate-in fade-in zoom-in-95">
            <h3 className="text-base font-bold">{t("modalTitle")}</h3>
            <p className="text-xs text-zinc-400">{t("modalSubtitle")}</p>
            <input
              type="text"
              value={newAlbumTitle}
              onChange={(e) => setNewAlbumTitle(e.target.value)}
              placeholder={t("modalPlaceholder")}
              className="w-full h-11 bg-[#12111d] border border-white/10 rounded-2xl px-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#fc5b69]"
              autoFocus
            />
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="flex-1 h-10 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-zinc-300 cursor-pointer"
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!newAlbumTitle.trim()) return;
                  const newAlb = {
                    id: `album-${Date.now()}`,
                    title: newAlbumTitle.trim(),
                    count: 0,
                    updated: "Just created",
                    thumbBg: "from-blue-950/80 via-zinc-900 to-zinc-950",
                    category: "Custom",
                  };
                  setAlbums([...albums, newAlb]);
                  setSelectedAlbumId(newAlb.id);
                  setNewAlbumTitle("");
                  setIsCreateModalOpen(false);
                }}
                className="flex-1 h-10 rounded-xl bg-[#fc5b69] hover:bg-[#ff6976] text-xs font-bold text-white shadow-lg cursor-pointer"
              >
                {t("create")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ၃။ SAVED VIDEOS LIST ================= */}
      {savedVideos.length === 0 ? (
        /* Empty State */
        <div className="py-24 text-center rounded-3xl bg-[#1c1a27]/50 border border-white/5 space-y-3">
          <Bookmark className="w-12 h-12 text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-white">{t("noSaved")}</h3>
          <p className="text-xs text-[#797a8e] max-w-sm mx-auto leading-relaxed">
            {t("noSavedSub")}
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg transition-colors"
            >
              {t("exploreVideos")}
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredVideos.map((video, index) => (
            <div
              key={video.id}
              className="group flex gap-3 sm:gap-4 items-start py-2.5 border-b border-white/5 last:border-b-0 transition-colors"
            >
              {/* Index Number (PC တွင်သာ ပေါ်မည်) */}
              <span className="text-xs font-bold text-zinc-500 self-center hidden sm:block w-5 text-center shrink-0">
                {index + 1}
              </span>

              {/* Thumbnail */}
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
              </Link>

              {/* Details & Top-right BookmarkCheck */}
              <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
                
                {/* Title နှင့် Bookmark ခလုတ်ကို ထိပ်ဆုံးတွင် အတူတကွ နေရာချထားခြင်း */}
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/watch/${video.id}`} className="min-w-0 flex-1">
                    <h3 className="text-xs sm:text-sm md:text-base font-bold text-white group-hover:text-[#fc5b69] transition-colors line-clamp-2 leading-snug cursor-pointer">
                      {video.title}
                    </h3>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleRemoveSaved(video.id)}
                    title="Remove from Saved"
                    className="p-1 -mr-1 -mt-0.5 text-zinc-500 hover:text-red-400 hover:bg-white/5 rounded-lg shrink-0 cursor-pointer transition-colors"
                  >
                    <BookmarkCheck className="w-4 h-4 text-[#fc5b69]" />
                  </button>
                </div>

                {/* Creator */}
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-1">
                  <Link
                    href={`/channel/${video.handle}`}
                    className="font-semibold text-zinc-300 hover:text-white transition-colors truncate"
                  >
                    {video.creator}
                  </Link>
                </div>

                {/* Views, Date & Category (စာကြောင်းမကျိုးဘဲ သေသပ်စွာ တန်းစီခြင်း) */}
                <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-[#797a8e] font-medium pt-1 whitespace-nowrap overflow-hidden">
                  <span className="shrink-0">{video.views} {t("views")}</span>
                  <span className="shrink-0 text-zinc-600">•</span>
                  <span className="shrink-0 text-zinc-400 font-semibold truncate">{video.addedDate}</span>
                  <span className="shrink-0 text-zinc-600 hidden xs:inline">•</span>
                  <span className="hidden xs:inline text-[9px] bg-white/5 px-1.5 py-0.5 rounded text-zinc-400 truncate">
                    {video.category}
                  </span>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}