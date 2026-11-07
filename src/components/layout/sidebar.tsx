"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Search,
  Users, 
  Bookmark, 
  MessageSquare, 
  History, 
  ChevronDown,
  Download,
  Star,
  User,
  Settings,
  HelpCircle,
  Globe,
  LogOut,
  Tv,
  Crown,
  Ticket,
  ArrowUpRight,
  LayoutDashboard,
  Keyboard,
  CheckCircle2,
  Play
} from "lucide-react";
import { layoutConfig } from "@/lib/layout-config";
import { BrandLogo } from "@/components/layout/brand-logo";
import { useLocale, useTranslations } from "next-intl";
import { switchLocale } from "@/actions/locale";
import { KeyboardShortcutsModal } from "@/components/shared/keyboard-shortcuts-modal";

const mainNavItems = [
  { href: "/", key: "home" as const, icon: Home },
  { href: "/search", key: "search" as const, icon: Search },
  { href: "/messages", key: "messages" as const, icon: MessageSquare },
];

const followedChannels = [
  { id: 1, name: "Min Mahar", handle: "minmahar", avatar: "from-amber-600 to-amber-900", isLive: true },
  { id: 2, name: "Fintech MM", handle: "fintech_mm", avatar: "from-blue-600 to-blue-800", isLive: true },
  { id: 3, name: "Comic Hub", handle: "comic_hub", avatar: "from-emerald-600 to-teal-800", isLive: false },
  { id: 4, name: "Book Tube MM", handle: "book_tube", avatar: "from-purple-600 to-indigo-800", isLive: false },
  { id: 5, name: "Khit Tech", handle: "khit_tech", avatar: "from-red-600 to-rose-900", isLive: false },
  { id: 6, name: "Gamer MM", handle: "gamer_mm", avatar: "from-orange-600 to-amber-800", isLive: false },
];

export function Sidebar() {
  const tNav = useTranslations("Nav");
  const t = useTranslations("Sidebar");
  const pathname = usePathname();
  const locale = useLocale();
  const [isPending, startTransition] = React.useTransition();
  const [isSubOpen, setIsSubOpen] = useState(true);
  const [isLoadingChannels, setIsLoadingChannels] = useState(true);
  
  // 🌟 Profile & Search Flyout States
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoadingChannels(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <aside className="hidden md:flex w-20 bg-[#131224] shrink-0 z-50 sticky top-0 h-screen select-none overflow-visible">
      <div className="absolute inset-y-0 left-0 w-[500px] overflow-y-auto overflow-x-hidden scrollbar-none pointer-events-none">
        <div className="pointer-events-auto w-20 bg-[#131224] min-h-full flex flex-col items-center py-4 justify-between transition-all">
          
          {/* ၁။ Logo */}
          <Link 
            href="/" 
            title="Khit Home"
            className="mb-4 hover:scale-105 transition-transform shrink-0"
          >
            <BrandLogo />
          </Link>

          {/* ၂။ အပေါ်ပိုင်း Main Navigation ခလုတ်များ (Home, Messages, Saved, Downloads, History) */}
          <div className="flex flex-col items-center gap-1 w-full shrink-0">
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          const label = tNav(item.key);
          const isActive = pathname === item.href || (item.key === "search" && isSearchOpen);

          // 🌟 Search ဖြစ်ပါက Route ပြောင်းမည့်အစား Flyout Dialog ကိုသာ ခေါ်မည်
          if (item.key === "search") {
            return (
              <div key={item.href} className="relative group w-full flex justify-center shrink-0 px-1" ref={searchRef}>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-r-full bg-[#8c1cff] shadow-[0_0_12px_#8c1cff]" />
                )}
                
                <button 
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  title={label}
                  className={`w-[72px] py-2 rounded-2xl transition-all duration-200 flex flex-col items-center justify-center gap-1 hover:scale-105 active:scale-95 cursor-pointer ${
                    isActive ? "text-white" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-all duration-200 ${isActive ? "text-[#a042ff]" : "text-zinc-400 group-hover:text-white group-hover:scale-110"}`} />
                  <span className="text-[11px] font-bold text-center tracking-tight leading-tight px-0.5">
                    {label}
                  </span>
                </button>

                {/* 🔍 Desktop Left-to-Right Search Flyout */}
                {isSearchOpen && (
                  <div className="absolute left-full ml-3 top-0 w-80 bg-[#181628] border border-white/10 rounded-3xl p-4 shadow-2xl shadow-black/90 z-50 animate-in fade-in zoom-in-95 duration-150 text-white flex flex-col gap-4 text-left cursor-default">
                    <div className="relative">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input 
                        type="text" 
                        autoFocus
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t("searchPlaceholder")} 
                        className="w-full h-11 bg-[#131224] border border-white/10 rounded-2xl pl-10 pr-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#8c1cff] transition-colors"
                      />
                    </div>

                    {searchQuery.trim().length > 0 ? (
                      <div className="flex flex-col gap-1 max-h-[60vh] overflow-y-auto scrollbar-none">
                        <Link href="/channel/minmahar" onClick={() => setIsSearchOpen(false)} className="flex items-center gap-3 p-2.5 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer group">
                           <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-600 to-amber-900 flex items-center justify-center font-bold text-sm shadow-md">M</div>
                           <div className="flex flex-col">
                             <span className="text-xs font-bold flex items-center gap-1 group-hover:text-[#fc5b69] transition-colors">Min Mahar <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" /></span>
                             <span className="text-[10px] text-zinc-500">@minmahar_recap</span>
                           </div>
                        </Link>
                        
                        <div className="border-t border-white/5 my-1" />
                        
                        <Link href="/watch/1" onClick={() => setIsSearchOpen(false)} className="flex gap-3 p-2 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer group">
                          <div className="w-24 aspect-video rounded-xl bg-gradient-to-tr from-amber-950/60 to-zinc-950 border border-white/10 shrink-0 relative flex items-center justify-center overflow-hidden shadow-md">
                            <span className="absolute bottom-1 right-1 bg-black/80 px-1 rounded text-[8px] font-bold">38:20</span>
                            <Play className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="flex flex-col justify-center overflow-hidden">
                             <span className="text-xs font-bold line-clamp-2 leading-snug group-hover:text-[#fc5b69] transition-colors">Oppenheimer Full Movie Recap...</span>
                             <span className="text-[10px] text-zinc-500 mt-1 truncate">Min Mahar • 125K views</span>
                          </div>
                        </Link>

                        <Link href={`/search?q=${searchQuery}`} onClick={() => setIsSearchOpen(false)} className="block w-full py-3 mt-2 bg-[#8c1cff]/10 hover:bg-[#8c1cff]/20 border border-[#8c1cff]/20 text-[#8c1cff] text-center text-xs font-bold rounded-2xl transition-colors">
                          {t("viewAllResults")} "{searchQuery}"
                        </Link>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-1">{t("trendingSearches")}</span>
                        <div className="flex flex-wrap gap-2">
                          {["Movie Recaps", "Solo Leveling", "Knowledge", "Myanmar Info"].map(tag => (
                             <button key={tag} onClick={() => setSearchQuery(tag)} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[11px] text-zinc-300 transition-colors cursor-pointer">
                               {tag}
                             </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          }

          // 🌟 ပုံမှန် Route Link များအတွက်
          return (
            <Link 
              key={item.href}
              href={item.href} 
              title={label}
              className="relative group w-full flex justify-center shrink-0 px-1"
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-r-full bg-[#8c1cff] shadow-[0_0_12px_#8c1cff]" />
              )}
              
              <div className={`w-[72px] py-2 rounded-2xl transition-all duration-200 flex flex-col items-center justify-center gap-1 hover:scale-105 active:scale-95 cursor-pointer ${
                isActive ? "text-white" : "text-zinc-400 hover:text-white"
              }`}>
                <Icon className={`w-5 h-5 transition-all duration-200 ${isActive ? "text-[#a042ff]" : "text-zinc-400 group-hover:text-white group-hover:scale-110"}`} />
                <span className="text-[11px] font-bold text-center tracking-tight leading-tight px-0.5">
                  {label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ၃။ အလယ်ပိုင်း Tuned ခလုတ်နှင့် Scroll လုပ်နိုင်သော Creator Avatars စာရင်း */}
      <div className="pt-2 flex flex-col w-full items-center shrink-0 mt-2">
        <div className="relative group w-full flex flex-col items-center shrink-0 px-1">
          {pathname === "/subscriptions" && (
            <div className="absolute left-0 top-3 w-1.5 h-6 rounded-r-full bg-[#8c1cff] shadow-[0_0_12px_#8c1cff]" />
          )}
          <Link
            href="/subscriptions"
            title="Subscriptions Feed"
            className={`w-[72px] pt-1.5 pb-0.5 rounded-t-2xl transition-all duration-200 flex flex-col items-center justify-center gap-0.5 hover:scale-105 active:scale-95 ${
              pathname === "/subscriptions" ? "text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Users className={`w-5 h-5 transition-all duration-200 ${pathname === "/subscriptions" ? "text-[#a042ff]" : "text-zinc-400 group-hover:text-white group-hover:scale-110"}`} />
            <span className="text-[11px] font-bold text-center tracking-tight leading-tight px-0.5">
              {tNav("tuned")}
            </span>
          </Link>
          <button
            onClick={() => setIsSubOpen(!isSubOpen)}
            title={isSubOpen ? "Collapse Channels" : "Expand Channels"}
            className="w-[72px] py-0.5 flex items-center justify-center text-zinc-500 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isSubOpen ? "rotate-180 text-[#a042ff]" : ""}`} />
          </button>
        </div>
      </div>

      {isSubOpen && (
        <div className="flex-1 w-full flex flex-col items-center gap-3 py-2 overflow-y-auto scrollbar-none min-h-0">
          {isLoadingChannels ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-[#1c1a30] animate-pulse border border-white/5 shrink-0" />
            ))
          ) : (
            followedChannels.map((channel, index) => (
              <Link
                key={channel.id}
                href={`/channel/${channel.handle}`}
                title={`${channel.name}${channel.isLive ? " (LIVE NOW)" : ""}`}
                className="relative group shrink-0 hover:scale-110 transition-transform animate-in fade-in zoom-in-95 duration-500"
                style={{ animationDelay: `${index * 75}ms`, animationFillMode: "both" }}
              >
                <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${channel.avatar} flex items-center justify-center font-bold text-xs text-white border transition-all ${
                  channel.isLive 
                    ? "border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" 
                    : "border-white/10 group-hover:border-white/30"
                }`}>
                  {channel.name.charAt(0)}
                </div>
                {channel.isLive && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#131224] animate-pulse" />
                )}
              </Link>
            ))
          )}
        </div>
      )}

      {/* ၄။ အောက်ခြေပိုင်း: Stars Wallet Pill နှင့် Avatar Profile Popover */}
      <div className="mt-auto pt-3 flex flex-col items-center gap-3 w-full shrink-0">
        
        {/* ⭐ Stars Balance */}
        <Link
          href="/stars"
          title="Stars Store & Wallet (4,250 Stars)"
          className="group flex flex-col items-center justify-center gap-1 py-1 w-full text-amber-400 hover:text-amber-300 transition-all hover:scale-110 active:scale-95 cursor-pointer"
        >
          <Star className="w-5 h-5 fill-amber-400 text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.4)] group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black tracking-tight font-mono leading-none text-zinc-300 group-hover:text-amber-300 transition-colors">
            4.2K
          </span>
        </Link>

        {/* 👤 Avatar & Flyout Popover Menu */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            title="Account Menu"
            className="relative w-9 h-9 rounded-full bg-red-600 flex items-center justify-center font-bold text-sm text-white shadow-md ring-2 ring-amber-400/80 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            T
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 border border-[#131224] flex items-center justify-center text-[8px] text-zinc-950 font-black shadow">
              👑
            </span>
          </button>

          {/* Desktop Left-to-Right Flyout Menu */}
          {isProfileOpen && (
            <div className="absolute left-full ml-3 bottom-0 w-64 bg-[#181628] border border-white/10 rounded-2xl p-2 shadow-2xl shadow-black/90 z-50 animate-in fade-in zoom-in-95 duration-150 text-white space-y-1">
              
              {/* User Identity Card */}
              <div className="flex items-center gap-3 p-2.5 pb-2.5 border-b border-white/5">
                <div className="relative w-9 h-9 rounded-full bg-red-600 flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-sm ring-1 ring-amber-400/60">
                  T
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 flex items-center justify-center text-[7px] text-zinc-950 font-black">
                    👑
                  </span>
                </div>
                <div className="flex flex-col overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white truncate">Thomas Viewer</span>
                    <span className="text-[8px] font-black uppercase bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 px-1 py-0.2 rounded font-mono shadow-sm">
                      PREMIUM
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 truncate">@thomas_viewer</span>
                </div>
              </div>

              {/* VIP Membership Link (Khit Premium Status) */}
              <div className="py-1 border-b border-white/5">
                <Link
                  href="/pass"
                  onClick={() => setIsProfileOpen(false)}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-[#8c1cff]/10 to-amber-500/10 border border-amber-500/30 hover:border-amber-500/50 flex flex-col gap-1 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                      <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      Khit Premium
                    </span>
                    <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded border border-emerald-500/30">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-zinc-400">
                    <span>⚡ Ad-Free • 🎟️ 1 Ticket</span>
                    <span className="text-amber-400 font-bold">10% Pool ➔</span>
                  </div>
                </Link>
              </div>

              {/* Library Links (History, Saved, Downloads) */}
              <div className="py-1 border-b border-white/5 space-y-0.5">
                <Link
                  href="/history"
                  onClick={() => setIsProfileOpen(false)}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold transition-colors ${pathname === "/history" ? "bg-white/10 text-white" : "text-zinc-300 hover:text-white hover:bg-white/5"}`}
                >
                  <History className="w-4 h-4 text-[#fc5b69]" />
                  <span>{t("history")}</span>
                </Link>

                <Link
                  href="/saved"
                  onClick={() => setIsProfileOpen(false)}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold transition-colors ${pathname === "/saved" ? "bg-white/10 text-white" : "text-zinc-300 hover:text-white hover:bg-white/5"}`}
                >
                  <Bookmark className="w-4 h-4 text-[#8c1cff]" />
                  <span>{t("saved")}</span>
                </Link>

                <Link
                  href="/downloads"
                  onClick={() => setIsProfileOpen(false)}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold transition-colors ${pathname === "/downloads" ? "bg-white/10 text-white" : "text-zinc-300 hover:text-white hover:bg-white/5"}`}
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>{t("downloads")}</span>
                </Link>
              </div>

              {/* Channel Hub & Creator Studio */}
              <div className="py-1 border-b border-white/5 space-y-0.5">
                <Link
                  href="/channel/minmahar"
                  onClick={() => setIsProfileOpen(false)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer group ${pathname.startsWith("/channel") ? "bg-white/10 text-white" : "text-zinc-300 hover:text-white hover:bg-white/5"}`}
                >
                  <div className="flex items-center gap-2.5">
                    <Tv className={`w-4 h-4 ${pathname.startsWith("/channel") ? "text-white" : "text-[#8c1cff]"}`} />
                    <span>{t("myChannel")}</span>
                  </div>
                  <ArrowUpRight className={`w-3.5 h-3.5 ${pathname.startsWith("/channel") ? "text-white" : "text-zinc-500"}`} />
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false);
                    if (window.location.hostname === "localhost") {
                      window.location.href = "http://localhost:3001";
                    } else {
                      window.location.href = process.env.NEXT_PUBLIC_STUDIO_URL || "https://base.khit.to";
                    }
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className="w-4 h-4 text-[#8c1cff]" />
                    <span>{t("studio")}</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#8c1cff] bg-[#8c1cff]/10 px-1.5 py-0.5 rounded">Studio ➔</span>
                </button>
              </div>

              {/* Settings & Language */}
              <div className="py-1 border-b border-white/5 space-y-0.5">
                <Link 
                  href="/settings" 
                  onClick={() => setIsProfileOpen(false)} 
                  className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold transition-colors ${pathname === "/settings" ? "bg-white/10 text-white" : "text-zinc-300 hover:text-white hover:bg-white/5"}`}
                >
                  <Settings className={`w-4 h-4 ${pathname === "/settings" ? "text-white" : "text-zinc-400"}`} />
                  <span>{t("settings")}</span>
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false);
                    setIsShortcutsOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <Keyboard className="w-4 h-4 text-zinc-400" />
                  <span>{t("shortcuts")}</span>
                </button>

                <button 
                  onClick={() => {
                    startTransition(async () => {
                      const newLocale = locale === 'en' ? 'my' : 'en';
                      await switchLocale(newLocale);
                      setIsProfileOpen(false);
                    });
                  }} 
                  disabled={isPending} 
                  className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-zinc-400" />
                    <span>{t("language")}</span>
                  </div>
                  <span className="text-[10px] text-[#8c1cff] font-bold">
                    {locale === 'en' ? 'မြန်မာ' : 'EN'}
                  </span>
                </button>
              </div>

              {/* Sign Out */}
              <div className="pt-1">
                <button 
                  onClick={() => setIsProfileOpen(false)} 
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t("signOut")}</span>
                </button>
              </div>

            </div>
          )}
        </div>

      </div>

      </div>
      </div>

      {/* ⌨️ Keyboard Shortcuts Cheat Sheet Modal */}
      <KeyboardShortcutsModal 
        isOpen={isShortcutsOpen} 
        onClose={() => setIsShortcutsOpen(false)} 
      />

    </aside>
  );
}