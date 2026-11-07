"use client";

import React, { useState } from "react";
import { 
  Star, 
  Wallet, 
  History, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  CreditCard,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { starPackages, transactions } from "../data/mock-stars";
import { useTranslations } from "next-intl";

export function StarsView() {
  const t = useTranslations("Stars");
  const [selectedPackage, setSelectedPackage] = useState<number>(2);
  const [paymentMethod, setPaymentMethod] = useState<"kpay" | "wavepay">("kpay");

  return (
    <div className="px-4 sm:px-8 pb-16 pt-4 max-w-[1200px] mx-auto space-y-8 relative z-10 animate-in fade-in duration-300">
      
      {/* 🌟 Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <Star className="w-8 h-8 text-amber-400 fill-amber-400" />
            {t("title")}
          </h1>
          <p className="text-sm text-[#797a8e] mt-2">
            {t("subtitle")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ================= LEFT COLUMN (8 Cols): WALLET & PACKAGES ================= */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* 1. Wallet Balance Card (Premium Amber Gradient) */}
          <div className="w-full rounded-3xl bg-gradient-to-br from-amber-600 via-amber-800 to-red-900 p-1 relative overflow-hidden shadow-[0_10px_30px_rgba(217,119,6,0.2)]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[50px] rounded-full -translate-y-1/2 translate-x-1/3" />
            
            <div className="bg-[#14121d]/80 backdrop-blur-xl rounded-[22px] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <span className="text-sm font-bold text-amber-500/80 uppercase tracking-wider flex items-center gap-2">
                  <Wallet className="w-4 h-4" /> {t("availableBalance")}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-white">4,250</span>
                  <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                </div>
                <p className="text-xs text-zinc-400 font-medium pt-1">≈ 42,500 MMK Value</p>
              </div>

              <div className="flex gap-3 shrink-0">
                <button className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-sm rounded-xl transition-colors shadow-lg shadow-amber-500/20">
                  {t("topUp")}
                </button>
              </div>
            </div>
          </div>

          {/* 2. Select Package Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#8c1cff]" /> {t("selectPackage")}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {starPackages.map((pkg) => (
                <div 
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer group ${
                    selectedPackage === pkg.id 
                      ? "bg-[#1c1a27] border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.15)]" 
                      : "bg-[#1c1a27] border-white/5 hover:border-white/10"
                  }`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-600 to-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                      {t("mostPopular")}
                    </span>
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Star className={`w-6 h-6 ${selectedPackage === pkg.id ? "fill-amber-400 text-amber-400" : "fill-zinc-500 text-zinc-500 group-hover:fill-amber-400/50 transition-colors"}`} />
                      <span className={`text-xl font-black ${selectedPackage === pkg.id ? "text-amber-400" : "text-white"}`}>
                        {pkg.stars.toLocaleString()}
                      </span>
                    </div>
                    {selectedPackage === pkg.id && <CheckCircle2 className="w-5 h-5 text-amber-500 fill-amber-500/20" />}
                  </div>

                  <div className="flex items-end justify-between">
                    <span className="text-lg font-bold text-white">{pkg.price}</span>
                    {pkg.bonus > 0 && (
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                        +{pkg.bonus} {t("bonus")}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#fc5b69]" /> {t("paymentMethod")}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {/* KBZPay */}
              <div 
                onClick={() => setPaymentMethod("kpay")}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                  paymentMethod === "kpay" ? "bg-blue-600/10 border-blue-500" : "bg-[#1c1a27] border-white/5 hover:border-white/10"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-sm">
                  K
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">KBZPay</h3>
                  <p className="text-[11px] text-zinc-500">{t("instantTopUp")}</p>
                </div>
              </div>

              {/* WavePay */}
              <div 
                onClick={() => setPaymentMethod("wavepay")}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                  paymentMethod === "wavepay" ? "bg-yellow-500/10 border-yellow-500" : "bg-[#1c1a27] border-white/5 hover:border-white/10"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center font-black text-zinc-950 text-sm">
                  W
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">WavePay</h3>
                  <p className="text-[11px] text-zinc-500">{t("instantTopUp")}</p>
                </div>
              </div>
            </div>

            {/* Pay Button */}
            <button className="w-full h-14 bg-[#fc5b69] hover:bg-[#ff6976] text-white font-black text-base rounded-2xl shadow-[0_5px_20px_rgba(252,91,105,0.3)] transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer">
              {t("checkoutVia")} {paymentMethod === "kpay" ? "KBZPay" : "WavePay"}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* ================= RIGHT COLUMN (4 Cols): TRANSACTION HISTORY ================= */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#1c1a27] rounded-3xl border border-white/5 p-6 h-full shadow-xl flex flex-col">
            
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <History className="w-4 h-4 text-[#8c1cff]" /> {t("recentActivity")}
              </h3>
              <button className="text-[11px] font-bold text-[#797a8e] hover:text-white transition-colors">
                {t("viewAll")}
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto pr-1">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 cursor-pointer">
                  
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    tx.type === "deposit" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                  }`}>
                    {tx.type === "deposit" ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>

                  <div className="flex-1 overflow-hidden space-y-0.5">
                    <h4 className="text-xs font-bold text-zinc-200 truncate">{tx.title}</h4>
                    <p className="text-[10px] text-zinc-500 font-medium">{tx.date} • {tx.status}</p>
                  </div>

                  <div className={`font-black text-sm ${tx.type === "deposit" ? "text-emerald-400" : "text-zinc-300"}`}>
                    {tx.amount}
                  </div>
                </div>
              ))}
            </div>

            {/* Help Box */}
            <div className="mt-auto pt-6">
              <div className="p-4 rounded-2xl bg-gradient-to-tr from-[#1e1c2a] to-[#252236] border border-white/5 text-center">
                <p className="text-xs font-bold text-white mb-1">{t("needHelp")}</p>
                <p className="text-[10px] text-[#797a8e] mb-3">{t("havingIssues")}</p>
                <button className="text-xs font-bold text-[#8c1cff] hover:text-[#a042ff] transition-colors">
                  {t("contactSupport")}
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}