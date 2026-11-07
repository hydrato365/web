"use client";

import React from "react";
import Link from "next/link";
import { 
  History, Bookmark, Download, Settings, 
  HelpCircle, LogOut, Crown, Ticket, ArrowUpRight, Tv, Globe, LayoutDashboard
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { switchLocale } from "@/actions/locale";

export function ProfileView() {
  const t = useTranslations("Profile");
  const locale = useLocale();
  const [isPending, startTransition] = React.useTransition();

  return (
    <div className="px-4 pb-4 pt-4 max-w-[800px] mx-auto space-y-6 relative z-10 md:hidden">
      
      {/* User Info Header */}
      <div className="flex items-center gap-4 pt-2">
        <div className="relative w-16 h-16 rounded-full bg-red-600 flex items-center justify-center font-bold text-2xl text-white shadow-sm ring-2 ring-amber-400/80">
          T
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-[10px] text-zinc-950 font-black shadow">
            👑
          </span>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">Thomas Viewer</span>
            <span className="text-[10px] font-black uppercase bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 px-1.5 py-0.5 rounded font-mono shadow-sm">
              {t("premium")}
            </span>
          </div>
          <span className="text-sm text-zinc-400">@thomas_viewer</span>
        </div>
      </div>

      {/* VIP Card */}
      <Link
        href="/pass"
        className="block p-4 rounded-3xl bg-gradient-to-r from-amber-500/15 via-[#8c1cff]/10 to-amber-500/10 border border-amber-500/30 flex flex-col gap-2 transition-all active:scale-[0.98]"
      >
        <div className="flex items-center justify-between">
          <span className="text-base font-black text-amber-300 flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-400 fill-amber-400" />
            {t("khitPremium")}
          </span>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">{t("active")}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 text-zinc-400">
            <Ticket className="w-4 h-4 text-amber-400" /> {t("perks")}
          </span>
          <span className="text-amber-400 font-bold">{t("pool")}</span>
        </div>
      </Link>

      {/* Main Tools (Grid) */}
      <div className="grid grid-cols-3 gap-3">
        <Link href="/history" className="flex flex-col items-center justify-center gap-2 p-4 rounded-3xl bg-[#1c1a27] border border-white/5 text-zinc-300 hover:text-white hover:bg-white/5 transition-colors">
          <History className="w-6 h-6 text-[#fc5b69]" />
          <span className="text-xs font-bold">{t("history")}</span>
        </Link>
        <Link href="/saved" className="flex flex-col items-center justify-center gap-2 p-4 rounded-3xl bg-[#1c1a27] border border-white/5 text-zinc-300 hover:text-white hover:bg-white/5 transition-colors">
          <Bookmark className="w-6 h-6 text-[#8c1cff]" />
          <span className="text-xs font-bold">{t("saved")}</span>
        </Link>
        <Link href="/downloads" className="flex flex-col items-center justify-center gap-2 p-4 rounded-3xl bg-[#1c1a27] border border-white/5 text-zinc-300 hover:text-white hover:bg-white/5 transition-colors">
          <Download className="w-6 h-6 text-emerald-400" />
          <span className="text-xs font-bold">{t("downloads")}</span>
        </Link>
      </div>

      {/* Other Actions List */}
      <div className="bg-[#1c1a27] border border-white/5 rounded-3xl overflow-hidden">
        <button 
          type="button"
          onClick={() => {
            if (window.location.hostname === "localhost") {
              window.location.href = "http://localhost:3001";
            } else {
              window.location.href = process.env.NEXT_PUBLIC_STUDIO_URL || "https://base.khit.to";
            }
          }}
          className="w-full flex items-center justify-between p-4 border-b border-white/5 text-sm font-semibold text-zinc-300 hover:bg-white/5 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-5 h-5 text-[#8c1cff]" />
            <span>Creator Studio</span>
          </div>
          <span className="text-[10px] font-bold text-[#8c1cff] bg-[#8c1cff]/10 px-2 py-0.5 rounded-md">Studio ➔</span>
        </button>
        <Link href="/channel/minmahar" className="flex items-center justify-between p-4 border-b border-white/5 text-sm font-semibold text-zinc-300 hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-3"><Tv className="w-5 h-5 text-zinc-400" /> {t("myChannelHub")}</div>
          <ArrowUpRight className="w-4 h-4 text-zinc-500" />
        </Link>
        <Link href="/settings" className="w-full flex items-center justify-between p-4 border-b border-white/5 text-sm font-semibold text-zinc-300 hover:bg-white/5 transition-colors text-left">
          <div className="flex items-center gap-3"><Settings className="w-5 h-5 text-zinc-400" /> {t("settings")}</div>
        </Link>
        <button 
          onClick={() => {
            startTransition(async () => {
              const newLocale = locale === 'en' ? 'my' : 'en';
              await switchLocale(newLocale);
            });
          }} 
          disabled={isPending} 
          className="w-full flex items-center justify-between p-4 border-b border-white/5 text-sm font-semibold text-zinc-300 hover:bg-white/5 transition-colors text-left cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-zinc-400" />
            <span>{t("language")}</span>
          </div>
          <span className="text-xs text-[#8c1cff] font-bold">
            {locale === 'en' ? 'မြန်မာစာ' : 'English'}
          </span>
        </button>
        <Link href="/settings" className="w-full flex items-center justify-between p-4 border-b border-white/5 text-sm font-semibold text-zinc-300 hover:bg-white/5 transition-colors text-left">
          <div className="flex items-center gap-3"><HelpCircle className="w-5 h-5 text-zinc-400" /> {t("help")}</div>
        </Link>
        <button className="w-full flex items-center justify-between p-4 text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors text-left cursor-pointer">
          <div className="flex items-center gap-3"><LogOut className="w-5 h-5" /> {t("signOut")}</div>
        </button>
      </div>
    </div>
  );
}