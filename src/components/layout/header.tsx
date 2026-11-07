"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { 
  Search, 
  ChevronDown, 
  CheckCircle2, 
  Play, 
  X, 
  TrendingUp, 
  Settings, 
  User, 
  LogOut, 
  ExternalLink, 
  Star, 
  Globe, 
  HelpCircle, 
  LayoutDashboard, 
  Keyboard, 
  Tv, 
  ArrowUpRight, 
  Crown, 
  Ticket,
  Download,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/features/auth/components/auth-modal";
import { layoutConfig } from "@/lib/layout-config";
import { BrandLogo } from "@/components/layout/brand-logo";
import { useTranslations, useLocale } from "next-intl";
import { switchLocale } from "@/actions/locale";

const allCreators = [
  { name: "Min Mahar", handle: "minmahar", verified: true, avatar: "from-amber-600 to-amber-900" },
  { name: "Cartoon Hub", handle: "cartoon", verified: false, avatar: "from-blue-500 to-cyan-500" },
];

const allVideos = [
  { id: 1, title: "Oppenheimer Full Movie Recap - The Father of the Atomic Bomb", creator: "Min Mahar", category: "Movie Recap", views: "124K", duration: "38:20", thumb: "from-amber-950/60 to-zinc-950" },
  { id: 2, title: "Myanmar Digital Banking Reform & Currency Value Analysis", creator: "Fintech MM", category: "News & Politics", views: "48K", duration: "22:15", thumb: "from-blue-950/60 to-zinc-950" },
  { id: 3, title: "Solo Leveling: Ragnarok Episodes 1 to 15 (Motion Comic Recap)", creator: "Comic Hub", category: "Comic & Manga", views: "89K", duration: "29:40", thumb: "from-emerald-950/60 to-zinc-950" },
  { id: 4, title: "Tom and Jerry Best Classic Cartoon Episodes Myanmar Dubbed", creator: "Cartoon Hub", category: "Cartoon", views: "200K", duration: "15:20", thumb: "from-blue-950/60 to-zinc-950" },
];

export function Header() {
  const t = useTranslations("Header");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const isMobileHeaderHidden = layoutConfig.shouldHide(pathname, layoutConfig.hideMobileHeaderRoutes);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // 🌟 Profile Dropdown & Auth Modal State
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // 🌟 User Data Loading State (Skeletons ပြသရန်)
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY <= 15) {
        setIsScrollingDown(false);
        lastScrollY.current = currentScrollY;
        return;
      }
      if (Math.abs(currentScrollY - lastScrollY.current) < 10) return;
      setIsScrollingDown(currentScrollY > lastScrollY.current);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHeaderHidden = isScrollingDown && !isSearchOpen && !isProfileOpen;

  useEffect(() => {
    // ၂ စက္ကန့်အကြာမှ Data တက်လာသယောင် Fake လုပ်မည်
    const timer = setTimeout(() => setIsLoadingUserData(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Header အား pull-to-refresh က layoutConfig ဖြင့် တိုက်ရိုက် စစ်ဆေးပြီးဖြစ်၍ လှုပ်ခါမှုကို ကာကွယ်ထားသည်

  const matchedCreators = allCreators.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.handle.toLowerCase().includes(searchQuery.toLowerCase().replace("@", ""))
  ).slice(0, 2); 

  const matchedVideos = allVideos.filter(v => 
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.category.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 3);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim().length > 0) {
      setIsSearchOpen(false);
      setIsMobileSearchOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className={`md:hidden fixed top-0 left-0 right-0 h-16 w-full shrink-0 ${isMobileHeaderHidden ? "hidden" : "flex"} items-center justify-between px-4 z-40 bg-[#131224]/90 backdrop-blur-xl transition-transform duration-300 ease-in-out ${isHeaderHidden ? "-translate-y-full" : "translate-y-0"}`}>
        
        {/* 📱 Mobile Logo (Refactored Brand Logo) */}
        <Link href="/" className="md:hidden hover:scale-105 transition-transform shrink-0">
          <BrandLogo />
        </Link>

        {/* 💻 Desktop Search Bar (Hidden on Mobile) */}
        <div className="hidden md:block relative w-full max-w-[520px]" ref={searchRef}>
          <div className={`relative flex items-center w-full h-11 bg-[#1c1a27] border ${isSearchOpen ? "border-[#8c1cff]/50 shadow-[0_0_15px_rgba(140,28,255,0.2)]" : "border-transparent"} rounded-2xl transition-all z-50`}>
            <Search className={`absolute left-4 w-4 h-4 transition-colors ${isSearchOpen ? "text-[#a042ff]" : "text-zinc-500"}`} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(e.target.value.trim().length > 0);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => { if (searchQuery.trim().length > 0) setIsSearchOpen(true); }}
              placeholder={t("searchPlaceholder")} 
              className="w-full h-full bg-transparent pl-11 pr-10 text-base font-medium text-white placeholder-zinc-500 focus:outline-none"
            />
            {searchQuery && (
              <button 
                onClick={() => { setSearchQuery(""); setIsSearchOpen(false); }}
                className="absolute right-3 p-1 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Dropdown */}
          {isSearchOpen && (
            <div className="absolute top-14 left-0 right-0 bg-[#1c1a27] border border-white/5 rounded-3xl p-4 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200 z-40 overflow-hidden">
              <div className="mb-3 px-2">
                <Link 
                  href={`/search?q=${searchQuery}`}
                  onClick={() => setIsSearchOpen(false)}
                  className="flex items-center gap-2 text-xs font-bold text-white hover:text-[#a042ff] transition-colors"
                >
                  <Search className="w-3.5 h-3.5 text-zinc-500" />
                  Search for "<span className="text-[#a042ff]">{searchQuery}</span>"
                </Link>
              </div>

              {matchedCreators.length > 0 && (
                <div className="mb-4 pt-3 border-t border-white/5">
                  <h3 className="text-[10px] font-bold text-[#797a8e] uppercase tracking-wider mb-2 px-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-[#1bc285]" /> Channels
                  </h3>
                  <div className="space-y-1">
                    {matchedCreators.map((creator, i) => (
                      <Link 
                        key={i} 
                        href={`/channel/${creator.handle}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center justify-between p-2 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${creator.avatar} flex items-center justify-center font-bold text-white text-sm shrink-0 border border-white/10`}>
                            {creator.name.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-white group-hover:text-[#fc5b69] transition-colors flex items-center gap-1.5">
                              {creator.name}
                              {creator.verified && <CheckCircle2 className="w-3 h-3 text-[#2a87ff] fill-[#2a87ff] text-[#1c1a27]" />}
                            </span>
                            <span className="text-[11px] text-zinc-500">@{creator.handle}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {matchedVideos.length > 0 && (
                <div className="pt-3 border-t border-white/5">
                  <h3 className="text-[10px] font-bold text-[#797a8e] uppercase tracking-wider mb-2 px-2 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-[#fc5b69]" /> Top Videos
                  </h3>
                  <div className="space-y-1">
                    {matchedVideos.map((video, i) => (
                      <Link 
                        key={i} 
                        href={`/watch/${video.id}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex gap-3 p-2 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group"
                      >
                        <div className={`w-24 h-14 rounded-xl bg-gradient-to-tr ${video.thumb} relative shrink-0 flex items-center justify-center overflow-hidden border border-white/5`}>
                          <span className="absolute bottom-1 right-1 bg-black/80 text-[8px] font-bold text-white px-1 rounded">
                            {video.duration}
                          </span>
                          <Play className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex flex-col justify-center overflow-hidden pr-2">
                          <h4 className="text-xs font-bold text-zinc-200 line-clamp-2 leading-snug group-hover:text-[#fc5b69] transition-colors">
                            {video.title}
                          </h4>
                          <p className="text-[10px] text-zinc-500 mt-1 truncate">
                            {video.creator} • {video.views} views
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 🌟 Right Side Actions (Mobile & Desktop App Style Layout) */}
        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          
          {isLoadingUserData ? (
            /* Loading Skeleton */
            <div className="w-24 h-9 rounded-full bg-[#1c1a30] animate-pulse border border-white/5" />
          ) : (
            /* Combined Profile & Stars Pill (App Layout) */
            <div className="flex items-center bg-transparent md:bg-[#1c1a28] md:border md:border-white/10 rounded-full md:p-1 md:pr-3.5 gap-2.5 md:shadow-sm animate-in fade-in duration-500">
              
              {/* Profile Avatar & Dropdown Container (Hidden on Mobile) */}
              <div className="relative hidden md:block" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  title="Account Profile"
                  className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center text-white shadow-sm hover:scale-105 active:scale-95 transition-transform border border-white/10 cursor-pointer"
                >
                  <User className="w-4 h-4" />
                </button>

                {/* 🌟 In-Place Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 top-10 w-64 bg-[#181628] border border-white/10 rounded-2xl p-2 shadow-2xl shadow-black/90 z-50 animate-in fade-in zoom-in-95 duration-150 text-white">
                    
                    {/* ၁။ User Identity Card */}
                    <div className="flex items-center gap-3 p-2.5 pb-2.5 border-b border-white/5">
                      <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-sm">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-bold text-white truncate">Thomas Viewer</span>
                        <span className="text-xs text-zinc-400 truncate">@thomas_viewer</span>
                      </div>
                    </div>

                    {/* 👑 Khit Pass (10% Community Lottery Status Card) */}
                    <div className="py-2 border-b border-white/5">
                      <Link
                        href="/pass"
                        onClick={() => setIsProfileOpen(false)}
                        className="p-2.5 rounded-xl bg-gradient-to-r from-[#8c1cff]/15 to-amber-500/10 border border-[#8c1cff]/30 hover:border-[#8c1cff]/60 flex flex-col gap-1.5 transition-all group cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-white flex items-center gap-1.5">
                            <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            Khit Pass (VIP)
                          </span>
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            Active
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="flex items-center gap-1 text-zinc-400">
                            <Ticket className="w-3 h-3 text-amber-400" /> 1 Lottery Ticket
                          </span>
                          <span className="text-[#a042ff] font-bold group-hover:underline">10% Pool ➔</span>
                        </div>
                      </Link>
                    </div>

                    {/* ၂။ Channel Hub & Creator Studio & Offline Downloads */}
                    <div className="py-1.5 border-b border-white/5 space-y-0.5">
                      <Link
                        href="/channel/minmahar"
                        onClick={() => setIsProfileOpen(false)}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer group ${pathname.startsWith("/channel") ? "bg-white/10 text-white" : "text-zinc-300 hover:text-white hover:bg-white/5"}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Tv className={`w-4 h-4 ${pathname.startsWith("/channel") ? "text-white" : "text-[#8c1cff]"}`} />
                          <span>My Channel Hub</span>
                        </div>
                        <ArrowUpRight className={`w-3.5 h-3.5 ${pathname.startsWith("/channel") ? "text-white" : "text-zinc-500 group-hover:text-white"}`} />
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
                        className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer group text-left"
                      >
                        <div className="flex items-center gap-2.5">
                          <LayoutDashboard className="w-4 h-4 text-[#8c1cff]" />
                          <span>Creator Studio</span>
                        </div>
                        <span className="text-[10px] font-bold text-[#8c1cff] bg-[#8c1cff]/10 px-2 py-0.5 rounded-md">Studio ➔</span>
                      </button>
                      </div>

                    {/* ၃။ Settings, Language, Shortcuts & Help */}
                    <div className="py-1.5 border-b border-white/5 space-y-0.5">
                      <Link 
                        href="/settings" 
                        onClick={() => setIsProfileOpen(false)} 
                        className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${pathname === "/settings" ? "bg-white/10 text-white" : "text-zinc-300 hover:text-white hover:bg-white/5"}`}
                      >
                        <Settings className={`w-4 h-4 ${pathname === "/settings" ? "text-white" : "text-zinc-400"}`} />
                        <span>Settings</span>
                      </Link>
                      <button onClick={() => {
                    startTransition(async () => {
                      const newLocale = locale === 'en' ? 'my' : 'en';
                      await switchLocale(newLocale);
                      setIsProfileOpen(false);
                    });
                  }} disabled={isPending} className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer ${isPending ? "opacity-50" : ""}`}>
                    <div className="flex items-center gap-2.5">
                      <Globe className="w-4 h-4 text-zinc-400" />
                      <span>Language</span>
                    </div>
                    <span className="text-[11px] text-[#8c1cff] font-bold">
                      {locale === 'en' ? 'မြန်မာစာ ပြောင်းရန်' : 'Switch to English'}
                    </span>
                  </button>
                      <button onClick={() => setIsProfileOpen(false)} className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                        <Keyboard className="w-4 h-4 text-zinc-400" />
                        <span>Keyboard shortcuts</span>
                      </button>
                      <Link href="/settings" onClick={() => setIsProfileOpen(false)} className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                        <HelpCircle className="w-4 h-4 text-zinc-400" />
                        <span>Help & Feedback</span>
                      </Link>
                    </div>

                    {/* ၄။ Sign Out */}
                    <div className="pt-1.5">
                      <button onClick={() => { setIsProfileOpen(false); setIsAuthOpen(true); }} className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer">
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>

                  </div>
                )}
              </div>

              {/* Stars Balance Link */}
              <Link
                href="/stars"
                title="Stars Wallet"
                className="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer"
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-white">4,250</span>
              </Link>
            </div>
          )}
        </div>

      </header>

      {/* 🌟 Auth Modal Popup ကို ဒီနေရာတွင် ချိတ်ဆက်ထားပါသည် */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}