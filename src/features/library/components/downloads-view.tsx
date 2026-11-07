"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Download, 
  Trash2, 
  Play, 
  HardDrive, 
  CheckCircle2, 
  Sparkles,
  ArrowDownToLine
} from "lucide-react";
import { useTranslations } from "next-intl";

// Mock Downloaded Videos Data
const initialDownloads = [
  {
    id: 1,
    title: "Oppenheimer Full Movie Recap - The Father of the Atomic Bomb",
    creator: "Min Mahar",
    handle: "minmahar",
    duration: "38:20",
    quality: "1080p (FHD)",
    size: "480 MB",
    downloadDate: "Downloaded yesterday",
    thumbBg: "from-amber-950/40 via-zinc-900 to-zinc-950",
  },
  {
    id: 2,
    title: "Myanmar Digital Banking Reform & Currency Value Analysis 2026",
    creator: "Fintech MM",
    handle: "fintech_mm",
    duration: "22:15",
    quality: "720p (HD)",
    size: "220 MB",
    downloadDate: "Downloaded 3 days ago",
    thumbBg: "from-blue-950/40 via-zinc-900 to-zinc-950",
  },
  {
    id: 3,
    title: "Solo Leveling: Ragnarok Episodes 1 to 15 (Motion Comic Recap)",
    creator: "Comic Hub",
    handle: "comic_hub",
    duration: "29:40",
    quality: "1080p (FHD)",
    size: "510 MB",
    downloadDate: "Downloaded 1 week ago",
    thumbBg: "from-emerald-950/40 via-zinc-900 to-zinc-950",
  },
];

export function DownloadsView() {
  const t = useTranslations("Downloads");
  const [downloads, setDownloads] = useState(initialDownloads);

  const handleDelete = (id: number) => {
    setDownloads(downloads.filter((v) => v.id !== id));
  };

  const handleClearAll = () => {
    setDownloads([]);
  };

  return (
    <div className="px-4 sm:px-8 pb-16 pt-4 max-w-[1400px] mx-auto space-y-7 relative z-10">
      
      {/* ================= ၁။ HEADER & STORAGE BAR ================= */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <Download className="w-8 h-8 text-[#fc5b69]" />
            {t("title")}
          </h1>
          <p className="text-xs sm:text-sm text-[#797a8e] mt-1.5">
            {t("subtitle")}
          </p>
        </div>

        {downloads.length > 0 && (
          <div className="flex items-center gap-4 self-start md:self-auto shrink-0">
            {/* Storage Usage Info */}
            <div className="flex items-center gap-3 bg-[#181820] border border-white/5 px-4 py-2 rounded-2xl text-xs">
              <HardDrive className="w-4 h-4 text-zinc-400" />
              <div>
                <p className="font-bold text-white">1.21 GB {t("used")}</p>
                <p className="text-[10px] text-zinc-500">58.4 GB {t("freeSpace")}</p>
              </div>
            </div>

            <button
              onClick={handleClearAll}
              className="h-10 px-4 rounded-xl bg-red-600/10 hover:bg-red-600/20 border border-red-600/30 text-red-400 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t("deleteAll")}</span>
            </button>
          </div>
        )}
      </div>

      {/* ================= ၂။ DOWNLOADS LIST (ဘောင်မပါသော FLAT စတိုင်) ================= */}
      {downloads.length === 0 ? (
        <div className="py-24 text-center rounded-3xl bg-[#181820]/40 border border-white/5 space-y-3">
          <ArrowDownToLine className="w-12 h-12 text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-white">{t("noDownloads")}</h3>
          <p className="text-xs text-[#797a8e] max-w-sm mx-auto leading-relaxed">
            {t("noDownloadsSub")}
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
        <div className="space-y-2">
          {downloads.map((video) => (
            <div
              key={video.id}
              className="group flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between py-3 border-b border-white/5 last:border-b-0 transition-colors"
            >
              {/* Left Side: Thumbnail & Details */}
              <div className="flex gap-4 items-start flex-1 overflow-hidden">
                
                {/* Thumbnail */}
                <Link
                  href={`/watch/${video.id}`}
                  className={`relative w-44 sm:w-56 aspect-[16/9] rounded-xl bg-gradient-to-tr ${video.thumbBg} border border-zinc-800/80 shrink-0 overflow-hidden flex items-center justify-center cursor-pointer`}
                >
                  <span className="absolute bottom-2 right-2 bg-black/90 font-mono text-[10px] font-semibold text-zinc-300 px-1.5 py-0.5 rounded">
                    {video.duration}
                  </span>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                    <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    </div>
                  </div>
                </Link>

                {/* Metadata */}
                <div className="space-y-1.5 overflow-hidden flex-1 py-1">
                  <Link href={`/watch/${video.id}`}>
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#fc5b69] transition-colors line-clamp-2 leading-snug cursor-pointer">
                      {video.title}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <Link
                      href={`/channel/${video.handle}`}
                      className="font-semibold text-zinc-300 hover:text-white transition-colors"
                    >
                      {video.creator}
                    </Link>
                  </div>

                  {/* Quality, Size & Offline Ready Status */}
                  <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#797a8e] pt-0.5">
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {t("readyOffline")}
                    </span>
                    <span className="text-[11px] font-semibold text-zinc-300 bg-white/5 px-2 py-0.5 rounded-md">
                      {video.quality}
                    </span>
                    <span>•</span>
                    <span className="text-zinc-400 font-medium">{video.size}</span>
                    <span>•</span>
                    <span className="text-zinc-500">{video.downloadDate}</span>
                  </div>
                </div>

              </div>

              {/* Right Side: Delete Button */}
              <button
                onClick={() => handleDelete(video.id)}
                title="Delete download"
                className="p-2.5 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer self-end sm:self-center shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}