"use client";

import React, { useState } from "react";
import { CheckCircle2, Bell, Share2, Star } from "lucide-react";
import { useTranslations } from "next-intl";

export function ChannelHeader() {
  const t = useTranslations("Channel");
  const [isSubscribed, setIsSubscribed] = useState(false);

  return (
    <>
      {/* ================= ၁။ CHANNEL BANNER ================= */}
      <div className="w-full h-48 sm:h-64 md:h-72 bg-zinc-900 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#14121d] via-[#14121d]/40 to-transparent" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/30 blur-[100px] rounded-full" />
      </div>

      {/* ================= ၂။ CREATOR HEADER INFO ================= */}
      <div className="max-w-[1500px] mx-auto px-6 sm:px-10 -mt-16 sm:-mt-20 relative z-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          
          {/* Avatar & Info */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-5">
            <div className="relative shrink-0 w-fit">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-amber-600 to-red-600 border-4 border-[#14121d] shadow-2xl flex items-center justify-center font-bold text-4xl text-white">
                M
              </div>
              <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-blue-500 rounded-full w-7 h-7 border-[3px] border-[#14121d] flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="space-y-2 mb-2">
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Min Mahar
              </h1>
              <div className="flex items-center gap-3 text-sm text-[#797a8e] font-medium">
                <span className="text-zinc-300">@minmahar_recap</span>
                <span>•</span>
                <span>128K {t("tuned")}</span>
                <span>•</span>
                <span>42 {t("videos")}</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl line-clamp-2 leading-relaxed pt-1">
                မြန်မာလို ရှင်းလင်းပြတ်သားတဲ့ ရုပ်ရှင်ဇာတ်လမ်း သုံးသပ်ချက်များ၊ စိတ်ဝင်စားဖွယ် သမိုင်းကြောင်းများနှင့် Knowledge Sharing Content များကို အပတ်စဉ် ပုံမှန် တင်ဆက်ပေးနေသော ချန်နယ် ဖြစ်ပါတယ်။
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 md:mb-4 shrink-0">
            <button className="h-11 px-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 text-amber-400 text-sm font-bold flex items-center gap-2 transition-all shadow-sm">
              <Star className="w-4 h-4 fill-amber-400" /> {t("support")}
            </button>

            <button className="h-11 w-11 rounded-2xl bg-[#1c1a27] hover:bg-[#232031] border border-white/5 text-zinc-300 flex items-center justify-center transition-all shadow-sm">
              <Share2 className="w-4 h-4" />
            </button>

            <div className="flex items-center">
              <button 
                onClick={() => setIsSubscribed(!isSubscribed)}
                className={`h-11 px-6 font-black text-sm transition-all flex items-center gap-2 ${
                  isSubscribed 
                    ? "rounded-l-2xl bg-[#1c1a27] text-white border border-white/10 border-r-0" 
                    : "rounded-2xl bg-[#8c1cff] hover:bg-[#9d3eff] text-white shadow-[0_5px_20px_rgba(140,28,255,0.35)]"
                }`}
              >
                {isSubscribed ? t("tunedBtn") : t("tuneBtn")}
              </button>
              {isSubscribed && (
                <button className="h-11 px-3 rounded-r-2xl bg-[#1c1a27] border border-white/10 border-l-0 text-zinc-300 hover:text-white transition-colors">
                  <Bell className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}