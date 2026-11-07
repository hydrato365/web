"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LayoutGrid, ListVideo, Info, Play, Star, Eye } from "lucide-react";
import { mockVideos } from "@/lib/data";
import { useTranslations } from "next-intl";

export function ChannelTabs() {
  const t = useTranslations("Channel");
  const [activeTab, setActiveTab] = useState<"videos" | "playlists" | "about">("videos");
  const creatorVideos = mockVideos.slice(0, 4);

  return (
    <div className="max-w-[1500px] mx-auto px-6 sm:px-10 mt-10">
      {/* ================= TABS NAVIGATION ================= */}
      <div className="flex items-center gap-6 border-b border-white/5">
        {[
          { id: "videos", label: t("tabVideos"), icon: LayoutGrid },
          { id: "playlists", label: t("tabPlaylists"), icon: ListVideo },
          { id: "about", label: t("tabAbout"), icon: Info },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 pb-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === tab.id
                ? "border-[#8c1cff] text-white"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ================= TAB CONTENT ================= */}
      <div className="py-8">
        {/* VIDEOS TAB */}
        {activeTab === "videos" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">{t("latestUploads")}</h3>
              <button className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors bg-[#1c1a27] px-3 py-1.5 rounded-lg border border-white/5">
                {t("sortByNewest")}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {creatorVideos.map((video) => (
                <Link
                  key={video.id}
                  href={`/watch/${video.id}`}
                  className="group cursor-pointer flex flex-col gap-2.5"
                >
                  <div className={`relative w-full aspect-[16/9] rounded-xl bg-gradient-to-tr ${video.thumbnailBg} border border-zinc-800/80 overflow-hidden flex items-center justify-center`}>
                    <span className="absolute bottom-3 right-3 bg-black/85 font-mono text-xs font-bold text-zinc-200 px-2 py-0.5 rounded-md backdrop-blur-sm">
                      {video.duration}
                    </span>
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-amber-300 text-xs font-black flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>+{video.stars.toLocaleString()}</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-[#8c1cff] text-white flex items-center justify-center shadow-lg shadow-[#8c1cff]/40 transform group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-1.5 px-0.5">
                    <h3 className="text-base font-bold text-white group-hover:text-[#a042ff] transition-colors line-clamp-2 leading-relaxed">
                      {video.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-[#797a8e] font-medium pt-0.5">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-zinc-500" />
                        {video.views} {t("views")}
                      </span>
                      <span>•</span>
                      <span>{video.time}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* PLAYLISTS TAB */}
        {activeTab === "playlists" && (
          <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl bg-[#1c1a27]/50">
            <ListVideo className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-zinc-400">{t("noPlaylists")}</h3>
          </div>
        )}

        {/* ABOUT TAB */}
        {activeTab === "about" && (
          <div className="max-w-3xl bg-[#1c1a27] border border-white/5 rounded-3xl p-8 space-y-6 shadow-xl">
            <div>
              <h3 className="text-sm font-bold text-white mb-2">{t("description")}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                မြန်မာလို ရှင်းလင်းပြတ်သားတဲ့ ရုပ်ရှင်ဇာတ်လမ်း သုံးသပ်ချက်များ၊ စိတ်ဝင်စားဖွယ် သမိုင်းကြောင်းများနှင့် Knowledge Sharing Content များကို အပတ်စဉ် ပုံမှန် တင်ဆက်ပေးနေသော ချန်နယ် ဖြစ်ပါတယ်။ Business Inquiries များအတွက် အောက်ပါ Email သို့ ဆက်သွယ်နိုင်ပါသည်။
              </p>
            </div>
            <div className="pt-4 border-t border-white/5">
              <h3 className="text-sm font-bold text-white mb-3">{t("links")}</h3>
              <div className="space-y-2">
                <a href="#" className="text-sm font-semibold text-blue-400 hover:underline">Facebook Page</a><br/>
                <a href="#" className="text-sm font-semibold text-blue-400 hover:underline">Telegram Channel</a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}