"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Play, Send, CheckCircle2, Star, Flame, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

interface ChatMessage {
  id: number;
  user: string;
  online: boolean;
  check: boolean;
  avatar: string;
  text: string;
}

interface MobileTabsProps {
  activeTab: "upnext" | "description" | "comments";
  setActiveTab: (val: "upnext" | "description" | "comments") => void;
  isMobileInputFocused: boolean;
  videoData?: any; // NewPipe description ပြရန်
  setIsMobileInputFocused: (val: boolean) => void;
  showFAB: boolean;
  chatMessages: ChatMessage[];
  inputMessage: string;
  setInputMessage: (val: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
}

export function MobileTabs({
  activeTab,
  setActiveTab,
  isMobileInputFocused,
  setIsMobileInputFocused,
  showFAB,
  chatMessages,
  inputMessage,
  setInputMessage,
  handleSendMessage,
  videoData,
}: MobileTabsProps) {
  const t = useTranslations("Watch");
  const params = useParams();
  const [serverVideos, setServerVideos] = React.useState<Array<{
    id: string;
    title: string;
    thumbnail_url: string;
    views: number;
    created_at: string;
  }>>([]);
  const [isLoadingVideos, setIsLoadingVideos] = React.useState(true);

  React.useEffect(() => {
    fetch("https://backend-tester-3glc.onrender.com/videos")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setServerVideos(data);
        }
        setIsLoadingVideos(false);
      })
      .catch((err) => {
        console.error("Failed to load up next videos:", err);
        setIsLoadingVideos(false);
      });
  }, []);

  return (
    <>
      {/* Sticky Mobile Tabs Bar (NewPipe Style) */}
      <div className={`bg-[#131224] -mx-4 px-3 pt-3 pb-2.5 border-b border-white/10 flex items-center justify-between gap-1 sticky transition-all ${activeTab === "comments" && isMobileInputFocused ? "z-40 top-0 shadow-lg" : "z-20 top-[56.25vw]"}`}>
        
        {/* 1. Up Next Tab */}
        <button
          onClick={() => setActiveTab("upnext")}
          className={`min-w-0 flex-1 px-1.5 text-center text-xs sm:text-sm font-bold transition-all relative pb-1 cursor-pointer ${
            activeTab === "upnext" ? "text-white" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <span className="block truncate py-0.5 leading-normal">
            {t("upNext")}
          </span>
          {activeTab === "upnext" && (
            <span className="absolute -bottom-2.5 left-1 right-1 h-0.5 bg-red-600 rounded-full" />
          )}
        </button>

        {/* 2. Comments Tab */}
        <button
          onClick={() => setActiveTab("comments")}
          className={`min-w-0 flex-1 px-1.5 text-center text-xs sm:text-sm font-bold transition-all relative pb-1 cursor-pointer ${
            activeTab === "comments" ? "text-white" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <span className="block truncate py-0.5 leading-normal">
            {t("comments")} ({chatMessages.length})
          </span>
          {activeTab === "comments" && (
            <span className="absolute -bottom-2.5 left-1 right-1 h-0.5 bg-red-600 rounded-full" />
          )}
        </button>

        {/* 3. Description Tab */}
        <button
          onClick={() => setActiveTab("description")}
          className={`min-w-0 flex-1 px-1.5 text-center text-xs sm:text-sm font-bold transition-all relative pb-1 cursor-pointer ${
            activeTab === "description" ? "text-white" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <span className="block truncate">
            Description
          </span>
          {activeTab === "description" && (
            <span className="absolute -bottom-2.5 left-1 right-1 h-0.5 bg-red-600 rounded-full" />
          )}
        </button>

      </div>

      {/* Mobile Tab Content */}
      <div className="mt-4 space-y-3">
        
        {/* 📝 DESCRIPTION TAB (NewPipe Style) */}
        {activeTab === "description" && (
          <div className="space-y-6 pb-8 animate-in fade-in duration-200">
            {/* Published Date */}
            <h3 className="text-sm font-bold text-white">
              Published on {videoData?.created_at ? new Date(videoData.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "31 Oct 2026"}
            </h3>

            {/* Full Description */}
            <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {videoData?.description || "ဖော်ပြချက် ထည့်သွင်းထားခြင်း မရှိသေးပါ။"}
            </p>

            {/* Metadata Grid (CATEGORY, LICENCE, PRIVACY) */}
            <div className="grid grid-cols-[100px_1fr] gap-y-4 text-[13px] pt-4 border-t border-white/5">
              <span className="font-bold text-zinc-400 tracking-wider">CATEGORY</span>
              <span className="text-zinc-100">Entertainment</span>

              <span className="font-bold text-zinc-400 tracking-wider">LICENCE</span>
              <span className="text-zinc-100">Standard Khit Licence</span>

              <span className="font-bold text-zinc-400 tracking-wider">PRIVACY</span>
              <span className="text-zinc-100">Public</span>

              <span className="font-bold text-zinc-400 tracking-wider">THUMBNAILS</span>
              <span className="text-zinc-100 underline decoration-white/20 underline-offset-4 cursor-pointer">1280x720</span>
            </div>

            {/* TAGS */}
            <div className="pt-2">
              <span className="block font-bold text-zinc-400 tracking-wider text-[13px] mb-3 text-center sm:text-left">TAGS</span>
              <div className="flex flex-wrap items-center gap-2">
                {["khit", "streaming", "myanmar", "entertainment", "video"].map((tag, i) => (
                  <span key={i} className="px-3 py-1.5 bg-[#201d32] border border-white/5 rounded-full text-xs text-zinc-300 hover:text-white hover:bg-[#2c2842] transition-colors cursor-pointer">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "upnext" && (
          <div className="space-y-4 pt-1 animate-in fade-in duration-200">
            {isLoadingVideos ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex gap-3.5 py-1 animate-pulse">
                    <div className="w-44 sm:w-52 aspect-[16/9] rounded-xl bg-[#1c1a27] border border-white/5 shrink-0" />
                    <div className="flex-1 flex flex-col justify-start py-1 space-y-2">
                      <div className="h-4 bg-[#1c1a27] rounded-md w-full" />
                      <div className="h-3 bg-[#1c1a27]/60 rounded-md w-1/2 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            ) : serverVideos.filter((v) => String(v.id) !== String(params?.id || "")).length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-500">
                {t("noVideos")}
              </div>
            ) : (
              serverVideos.filter((v) => String(v.id) !== String(params?.id || "")).map((v) => (
                <Link
                  key={v.id}
                  href={`/watch/${v.id}`}
                  className="flex gap-3.5 py-1 rounded-xl transition-colors group cursor-pointer active:opacity-75"
                >
                  <div className="relative w-44 sm:w-52 aspect-[16/9] rounded-xl bg-zinc-900 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center shadow-md">
                    <img
                      src={v.thumbnail_url || "https://images.unsplash.com/photo-1611162617474-5b21e879e113"}
                      alt={v.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity absolute">
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-start py-0.5 overflow-hidden">
                    <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-[#a042ff] transition-colors line-clamp-2 leading-snug">
                      {v.title}
                    </h4>
                    <p className="text-[11px] text-zinc-400 mt-1 font-medium truncate">Khit Creator</p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">{v.views} views • {new Date(v.created_at).toLocaleDateString()}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {/* 💬 COMMENTS TAB */}
        {activeTab === "comments" && (
          <div className="space-y-4 pb-16 animate-in fade-in duration-200">
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-400 uppercase tracking-wider pt-1">
              <span>{t("starShoutouts")}</span>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[#181622] border border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.08)] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-amber-400 text-zinc-950 font-black text-xs flex items-center justify-center shrink-0">
                      KP
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-amber-200">Ko Thet Paing</h4>
                      <span className="text-[10px] text-zinc-400">1 hour ago</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full border border-amber-500/50 bg-amber-500/10 text-amber-400 text-[11px] font-black flex items-center gap-1">
                    ★ ★ 500 Stars
                  </span>
                </div>
                <p className="text-xs text-zinc-200 leading-relaxed font-medium">
                  ★ Sent 500 Stars! Burma Frontier does the most courageous reporting on the ground. Thank you tobm for building a fair creator compensation model that works inside Myanmar without bank restrictions!
                </p>
              </div>
            </div>

            {/* Mobile Comments Feed */}
            <div className="space-y-5 pt-4">
              {chatMessages.map((user) => (
                <div key={user.id} className="flex gap-3">
                  <div className="relative shrink-0">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${user.avatar} font-bold text-xs flex items-center justify-center text-white border border-[#1e1c2a]`}>
                      {user.user.charAt(0)}
                    </div>
                    {user.check && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 w-3 h-3 rounded-full flex items-center justify-center border-2 border-[#131224]">
                        <CheckCircle2 className="w-2 h-2 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                      {user.user} 
                      {user.online ? <div className="w-1.5 h-1.5 bg-[#1bc285] rounded-full" /> : <div className="w-1.5 h-1.5 bg-[#fc5b69] rounded-full" />}
                    </div>
                    <p className="text-[11px] leading-relaxed text-zinc-300">{user.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Scroll to Top FAB */}
            <button
              type="button"
              onClick={() => {
                const scrollArea = document.getElementById("main-scroll-area") || window;
                scrollArea.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`fixed bottom-[72px] right-4 z-40 w-11 h-11 rounded-full bg-[#232130] border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white shadow-[0_4px_12px_rgba(0,0,0,0.5)] active:scale-95 transition-all duration-300 cursor-pointer ${showFAB ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"}`}
            >
              <ChevronDown className="w-5 h-5 rotate-180" />
            </button>

            {/* Fixed Bottom Comment Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#131224] border-t border-white/10 px-4 py-2.5 flex items-center gap-3">
              <Link 
                href="/stars"
                className="w-10 h-10 rounded-full bg-[#242132] border border-amber-500/40 flex items-center justify-center text-amber-400 hover:scale-105 active:scale-95 transition-transform shrink-0"
              >
                <Star className="w-4 h-4 fill-amber-400" />
              </Link>

              <form onSubmit={handleSendMessage} className="flex-1 flex items-center relative">
                <input 
                  type="text" 
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onFocus={() => setIsMobileInputFocused(true)}
                  onBlur={() => setIsMobileInputFocused(false)}
                  placeholder={t("addComment")} 
                  className="w-full h-10 rounded-full bg-[#201e2c] border border-white/10 pl-4 pr-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                />
              </form>

              <button 
                onClick={handleSendMessage}
                onPointerDown={(e) => e.preventDefault()}
                className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center text-white shrink-0 active:scale-95 transition-transform cursor-pointer shadow-md shadow-red-600/30"
              >
                <Send className="w-4 h-4 fill-white ml-0.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}