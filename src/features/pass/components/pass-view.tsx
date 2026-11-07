"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Crown, 
  Ticket, 
  Sparkles, 
  CheckCircle2, 
  CreditCard, 
  Clock, 
  Trophy, 
  ChevronRight,
  ShieldCheck,
  HeartHandshake,
  AlertCircle,
  FileText
} from "lucide-react";
import { RulesModal } from "@/features/pass/components/rules-modal";
import { useTranslations } from "next-intl";

export function PassView() {
  const t = useTranslations("Pass");
  const [paymentMethod, setPaymentMethod] = useState<"kpay" | "wavepay">("kpay");
  const [isAgreed, setIsAgreed] = useState(false);
  const [showAgreementError, setShowAgreementError] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);

  const handleCheckout = () => {
    if (!isAgreed) {
      setShowAgreementError(true);
      return;
    }
    setShowAgreementError(false);
    // Checkout processing
  };

  return (
    <div className="px-4 sm:px-8 pb-16 pt-4 max-w-[1200px] mx-auto space-y-8 relative z-10 text-white">
      
      {/* ၁။ Header & Hero */}
      <div className="space-y-3 border-b border-white/5 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Crown className="w-3.5 h-3.5 fill-amber-400" />
          <span>{t("badge")}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
          {t("heroTitle")}
        </h1>
        <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
          {t("heroSubtitle")}
        </p>
      </div>

      {/* ၂။ The 80 / 10 / 10 Split Bar */}
      <div className="p-6 rounded-3xl bg-[#181628] border border-white/5 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
          <HeartHandshake className="w-4 h-4 text-[#8c1cff]" /> {t("splitTitle")}
        </h2>
        
        {/* Progress Visual Bar */}
        <div className="h-4 w-full bg-zinc-900 rounded-full overflow-hidden flex gap-1 p-0.5 border border-white/10">
          <div className="h-full bg-gradient-to-r from-violet-600 to-[#8c1cff] rounded-l-full" style={{ width: "80%" }} title="80% to Creator" />
          <div className="h-full bg-zinc-600 rounded-sm" style={{ width: "10%" }} title="10% Platform" />
          <div className="h-full bg-amber-400 rounded-r-full" style={{ width: "10%" }} title="10% Community Lottery" />
        </div>

        {/* Breakdown Text */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-3.5 rounded-2xl bg-[#131224] border border-white/5 space-y-1">
            <span className="text-xl font-black text-[#a042ff]">80%</span>
            <p className="text-xs font-bold text-white">{t("creatorRev")}</p>
            <p className="text-[11px] text-zinc-500">{t("creatorRevSub")}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#131224] border border-white/5 space-y-1">
            <span className="text-xl font-black text-zinc-300">10%</span>
            <p className="text-xs font-bold text-white">{t("platformOp")}</p>
            <p className="text-[11px] text-zinc-500">{t("platformOpSub")}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#131224] border border-amber-500/20 space-y-1">
            <span className="text-xl font-black text-amber-400">10%</span>
            <p className="text-xs font-bold text-white">{t("communityLottery")}</p>
            <p className="text-[11px] text-zinc-500">{t("communityLotterySub")}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ဘယ်ဘက်ခြမ်း (8 Cols) - Live Lottery Pool & Membership Checkout */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 🎟️ Confidential Community Reward Pool Box (ငွေစာရင်းမဖော်ပြသော လျှို့ဝှက်ဆုငွေစနစ်) */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1c1635] via-[#181628] to-[#131224] border border-amber-500/30 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[60px] rounded-full pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Ticket className="w-4 h-4" /> Monthly 10% Community Reward Pool
                </span>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  10% Revenue Cashback Draw
                </div>
                <p className="text-xs text-zinc-400 max-w-lg leading-relaxed">
                  လစဉ်ရရှိသမျှ ပလက်ဖောင်းဝင်ငွေ၏ ၁၀% ကို Paid အဖွဲ့ဝင်များအတွက် ကံစမ်းမဲဆုငွေအဖြစ် သီးသန့်ဖယ်ထားပြီး လကုန်ရက်တိုင်း လျှို့ဝှက်စွာ တိုက်ရိုက် မဲဖောက်လွှဲပြောင်းပေးပါသည်။
                </p>
              </div>

              {/* Countdown Card */}
              <div className="p-4 rounded-2xl bg-[#131224] border border-white/10 flex flex-col items-center shrink-0">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                  <Clock className="w-3.5 h-3.5 text-[#8c1cff]" /> Draw In
                </span>
                <span className="text-lg font-black text-white font-mono">06d : 14h : 22m</span>
                <span className="text-[10px] text-emerald-400 font-bold mt-1">🎟️ 1 Ticket Active</span>
              </div>
            </div>
          </div>

          {/* 💳 Membership Checkout Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#181628] border border-white/5 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#8c1cff]" /> {t("planTitle")}
                </h3>
                <p className="text-xs text-amber-400 mt-1 font-semibold">{t("priceNote")}</p>
              </div>
              <div className="text-right flex flex-col items-end">
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-white">{t("price")}</span>
                  <span className="text-xs text-zinc-400"> {t("month")}</span>
                </div>
              </div>
            </div>

            {/* Perks List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t("perk1")}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t("perk2")}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t("perk3")}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t("perk4")}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Select Payment Method</span>
              <div className="grid grid-cols-2 gap-4">
                <div 
                  onClick={() => setPaymentMethod("kpay")}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                    paymentMethod === "kpay" ? "bg-blue-600/10 border-blue-500" : "bg-[#131224] border-white/5 hover:border-white/10"
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-sm">
                    K
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs sm:text-sm">KBZPay</h4>
                    <p className="text-[10px] text-zinc-500">Instant monthly</p>
                  </div>
                </div>

                <div 
                  onClick={() => setPaymentMethod("wavepay")}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                    paymentMethod === "wavepay" ? "bg-yellow-500/10 border-yellow-500" : "bg-[#131224] border-white/5 hover:border-white/10"
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-yellow-400 flex items-center justify-center font-black text-zinc-950 text-sm">
                    W
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs sm:text-sm">WavePay</h4>
                    <p className="text-[10px] text-zinc-500">Instant monthly</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ⚠️ Agreement Checkbox (Agree မလုပ်ထားဘဲ နှိပ်ပါက အနီရောင် ပြမည့်နေရာ) */}
            <div className={`p-3.5 rounded-2xl border transition-all ${
              showAgreementError && !isAgreed 
                ? "bg-red-500/10 border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.2)]" 
                : "bg-[#131224] border-white/5"
            }`}>
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="agreeRules"
                  checked={isAgreed}
                  onChange={(e) => {
                    setIsAgreed(e.target.checked);
                    if (e.target.checked) setShowAgreementError(false);
                  }}
                  className="mt-0.5 w-4 h-4 rounded border-zinc-700 text-[#8c1cff] focus:ring-[#8c1cff] cursor-pointer"
                />
                <label htmlFor="agreeRules" className="text-xs text-zinc-300 leading-relaxed cursor-pointer select-none">
                  {t("agreePrefix")}{" "}
                  <button
                    type="button"
                    onClick={() => setIsRulesModalOpen(true)}
                    className="text-[#a042ff] hover:underline font-bold inline-flex items-center gap-1"
                  >
                    <FileText className="w-3 h-3" /> {t("rulesLink")}
                  </button>
                  {" "}{t("agreeSuffix")}
                </label>
              </div>

              {/* အနီရောင် Warning Message */}
              {showAgreementError && !isAgreed && (
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-400 mt-2 pl-6 animate-in fade-in duration-200">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{t("agreeError")}</span>
                </div>
              )}
            </div>

            {/* Checkout Action Button */}
            <button 
              onClick={handleCheckout}
              className="w-full h-12 bg-[#8c1cff] hover:bg-[#9d3eff] text-white font-black text-sm rounded-2xl shadow-[0_5px_20px_rgba(140,28,255,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <span>{t("subscribeVia")} {paymentMethod === "kpay" ? "KBZPay" : "WavePay"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* 📜 Rules & Terms Modal Popup (Refactored Component) */}
        <RulesModal
          isOpen={isRulesModalOpen}
          onClose={() => setIsRulesModalOpen(false)}
          onAgree={() => {
            setIsAgreed(true);
            setShowAgreementError(false);
            setIsRulesModalOpen(false);
          }}
        />

        {/* ညာဘက်ခြမ်း (4 Cols) - သမာသမတ်ကျသော မဲဖောက်မှုရလဒ်နှင့် လုံခြုံရေး */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* 🏆 Verified Draw Results (Masked Identity စနစ်) */}
          <div className="p-6 rounded-3xl bg-[#181628] border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" /> {t("recentResults")}
              </h3>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {t("payoutsComplete")}
              </span>
            </div>
            <p className="text-xs text-zinc-400">{t("resultsMasked")}</p>

            <div className="space-y-3 pt-1">
              
              {/* 🥇 1st Winner (Logo Cyan-to-Violet Gradient Border ဖြင့် အထူးပြုထားသောဘောင်) */}
              <div className="p-[1.5px] rounded-2xl bg-gradient-to-r from-[#00F2FE] via-[#4FACFE] to-[#8c1cff] shadow-[0_0_20px_rgba(0,242,254,0.18)]">
                <div className="bg-[#131224] rounded-[15px] p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-700 flex items-center justify-center font-black text-xs text-zinc-950 shrink-0 shadow-md">
                      1st
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-white">@ko_th***</span>
                        <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />
                      </div>
                      <p className="text-[10px] text-zinc-500 font-mono">Ticket #KP-928***</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md">
                    Claimed ✓
                  </span>
                </div>
              </div>

              {/* 🥈 2nd Winner */}
              <div className="p-3 rounded-2xl bg-[#131224] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-zinc-700 flex items-center justify-center font-black text-xs text-zinc-200 shrink-0">
                    2nd
                  </div>
                  <div>
                    <span className="text-xs font-bold text-zinc-200">@su_my***</span>
                    <p className="text-[10px] text-zinc-500 font-mono">Ticket #KP-410***</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  Claimed ✓
                </span>
              </div>

              {/* 🥉 3rd Winner */}
              <div className="p-3 rounded-2xl bg-[#131224] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-900/60 flex items-center justify-center font-black text-xs text-amber-300 shrink-0">
                    3rd
                  </div>
                  <div>
                    <span className="text-xs font-bold text-zinc-200">@aung_k***</span>
                    <p className="text-[10px] text-zinc-500 font-mono">Ticket #KP-771***</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  Claimed ✓
                </span>
              </div>

            </div>
          </div>

          {/* Privacy & Direct Transfer Guarantee */}
          <div className="p-5 rounded-3xl bg-[#181628] border border-white/5 space-y-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Confidential Payout Assurance
            </h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              ကံထူးရှင်များကို In-app မှ သီးသန့်အကြောင်းကြားပြီး KPay/WavePay သို့ တိုက်ရိုက်လွှဲပြောင်းပေးပါသည်။ အကောင့်လုံခြုံရေးအတွက် ဖုန်းနံပါတ်နှင့် ငွေပမာဏ အပြည့်အစုံကို လုံးဝ ထုတ်ဖော်မပြသပါ။
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}