"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Play } from "lucide-react";
import { useTranslations } from "next-intl";

interface BackendVideo {
  id: string;
  title: string;
  thumbnail_url: string;
  views: number;
  created_at: string;
}

interface DesktopUpNextProps {
  isWideMode: boolean;
}

export function DesktopUpNext({ isWideMode }: DesktopUpNextProps) {
  const t = useTranslations("Watch");
  const params = useParams();
  const currentVideoId = String(params?.id || "");
  const [videos, setVideos] = useState<BackendVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("https://backend-tester-3glc.onrender.com/videos")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setVideos(data);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load up next videos:", err);
        setIsLoading(false);
      });
  }, []);

  const filteredVideos = videos.filter((video) => String(video.id) !== currentVideoId);

  return (
    <div className={`flex flex-col space-y-3 w-full transition-all duration-300 ${isWideMode ? "lg:col-span-12 pt-6 border-t border-zinc-800/60" : "lg:col-span-4"}`}>
      <div className="flex items-center justify-between pb-1 border-b border-zinc-800/80">
        <h3 className="font-bold text-sm uppercase tracking-wider text-white">{t("upNextVideos")}</h3>
        <span className="text-xs font-semibold text-zinc-500 font-mono">{t("autoplayOn")}</span>
      </div>

      {isLoading ? (
        <div className={isWideMode ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 space-y-0" : "space-y-2"}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-full flex gap-3.5 p-1.5 animate-pulse">
              <div className="w-40 sm:w-44 aspect-video bg-[#1c1a27] border border-white/5 rounded-xl shrink-0" />
              <div className="flex flex-col justify-start flex-1 min-w-0 py-1 space-y-2">
                <div className="h-4 bg-[#1c1a27] rounded-md w-full" />
                <div className="h-4 bg-[#1c1a27] rounded-md w-3/4" />
                <div className="h-3 bg-[#1c1a27]/60 rounded-md w-1/2 mt-1" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="py-8 text-center text-xs text-zinc-500">
          {t("noVideos")}
        </div>
      ) : (
        <div className={isWideMode ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 space-y-0" : "space-y-2"}>
          {filteredVideos.map((video) => (
            <Link
              key={video.id}
              href={`/watch/${video.id}`}
              className="w-full flex gap-3.5 p-1.5 hover:bg-white/5 rounded-xl transition-colors cursor-pointer group"
            >
              <div className="relative w-40 sm:w-44 aspect-video bg-zinc-900 border border-white/10 rounded-xl shrink-0 overflow-hidden flex items-center justify-center shadow-md">
                <img
                  src={video.thumbnail_url || "https://images.unsplash.com/photo-1611162617474-5b21e879e113"}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  loading="lazy"
                />
                <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity absolute">
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </div>
              </div>

              <div className="flex flex-col justify-start flex-1 min-w-0 py-0.5">
                <h4 className="text-sm font-bold text-white group-hover:text-[#a042ff] transition-colors leading-snug line-clamp-2">
                  {video.title}
                </h4>
                <p className="text-xs text-zinc-400 font-medium mt-1.5 truncate">
                  Khit Creator
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {video.views} {t("views")} • {new Date(video.created_at).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}