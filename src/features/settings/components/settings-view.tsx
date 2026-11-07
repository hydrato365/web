"use client";

import React, { useState } from "react";
import { 
  User, 
  CreditCard, 
  PlayCircle, 
  Shield, 
  HelpCircle, 
  Globe, 
  Smartphone, 
  Bell, 
  ChevronRight, 
  LogOut,
  Crown,
  Star,
  CheckCircle2,
  Lock
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { switchLocale } from "@/actions/locale";

export function SettingsView() {
  const t = useTranslations("Settings");
  const locale = useLocale();
  const [isPending, startTransition] = React.useTransition();
  const [activeTab, setActiveTab] = useState("account");

  const tabs = [
    { id: "account", label: t("tabAccount"), icon: User },
    { id: "billing", label: t("tabBilling"), icon: CreditCard },
    { id: "playback", label: t("tabPlayback"), icon: PlayCircle },
    { id: "privacy", label: t("tabPrivacy"), icon: Shield },
    { id: "help", label: t("tabHelp"), icon: HelpCircle },
  ];

  // Custom Toggle Switch Component
  const Toggle = ({ isOn, onToggle }: { isOn: boolean; onToggle: () => void }) => (
    <div 
      onClick={onToggle}
      className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-colors ${isOn ? "bg-[#8c1cff]" : "bg-zinc-700"}`}
    >
      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isOn ? "translate-x-5" : "translate-x-0"}`} />
    </div>
  );

  const [toggles, setToggles] = useState({
    autoplay: true,
    dataSaver: false,
    liveNotif: true,
    passNotif: true
  });

  React.useEffect(() => {
    const savedDataSaver = localStorage.getItem("khit_data_saver") === "true";
    setToggles((prev) => ({ ...prev, dataSaver: savedDataSaver }));
  }, []);

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (key === "dataSaver") {
        localStorage.setItem("khit_data_saver", String(next.dataSaver));
      }
      return next;
    });
  };

  return (
    <div className="px-4 sm:px-8 pb-16 pt-4 max-w-[1200px] mx-auto space-y-6 relative z-10">
      
      {/* Header */}
      <div className="border-b border-white/5 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {t("title")}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ================= LEFT MENU (Mobile: Horizontal, PC: Vertical Sidebar) ================= */}
        <div className="lg:col-span-3">
          {/* Mobile Tab Scroll View */}
          <div className="flex lg:hidden items-center gap-2 overflow-x-auto scrollbar-none pb-2 -mx-4 px-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors border ${
                  activeTab === tab.id
                    ? "bg-[#1c1a27] text-white border-white/10"
                    : "bg-transparent text-zinc-400 border-transparent hover:bg-white/5"
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-[#a042ff]" : ""}`} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Desktop Sidebar Menu */}
          <div className="hidden lg:flex flex-col gap-1 sticky top-24">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-colors ${
                  activeTab === tab.id
                    ? "bg-[#1c1a27] text-white shadow-sm border border-white/5"
                    : "bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-[#a042ff]" : ""}`} />
                  {tab.label}
                </div>
                {activeTab === tab.id && <ChevronRight className="w-4 h-4 text-zinc-500" />}
              </button>
            ))}
            
            <div className="mt-8 pt-4 border-t border-white/5">
              <button className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-400 hover:bg-red-500/10 w-full transition-colors">
                <LogOut className="w-4 h-4" />
                {t("signOut")}
              </button>
            </div>
          </div>
        </div>

        {/* ================= RIGHT CONTENT AREA ================= */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* 1. Account Settings */}
          {activeTab === "account" && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <h2 className="text-lg font-bold text-white">{t("accountInfo")}</h2>
              
              <div className="bg-[#181628] border border-white/5 rounded-3xl p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center font-bold text-2xl text-white shadow-md">
                    T
                  </div>
                  <div>
                    <button className="text-xs font-bold text-[#8c1cff] hover:underline bg-[#8c1cff]/10 px-3 py-1.5 rounded-lg cursor-pointer">
                      {t("changeAvatar")}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400">{t("displayName")}</label>
                    <input type="text" defaultValue="Thomas Viewer" className="w-full h-11 bg-[#131224] border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-[#8c1cff]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-zinc-400">{t("handle")}</label>
                    <input type="text" defaultValue="thomas_viewer" className="w-full h-11 bg-[#131224] border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-[#8c1cff]" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-bold text-zinc-400">{t("email")}</label>
                    <input type="email" defaultValue="thomas@example.com" disabled className="w-full h-11 bg-[#131224]/50 border border-white/5 rounded-xl px-4 text-sm text-zinc-500 cursor-not-allowed" />
                  </div>
                </div>

                <button className="h-10 px-6 bg-[#8c1cff] hover:bg-[#9d3eff] text-white text-xs font-bold rounded-xl shadow-lg transition-colors cursor-pointer">
                  {t("saveChanges")}
                </button>
              </div>

              <h2 className="text-lg font-bold text-white pt-4">{t("security")}</h2>
              <div className="bg-[#181628] border border-white/5 rounded-3xl p-2">
                <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><Lock className="w-4 h-4 text-zinc-300" /></div>
                    <div className="text-left">
                      <div className="text-sm font-bold text-white">{t("changePassword")}</div>
                      <div className="text-xs text-zinc-500">{t("changePasswordSub")}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                </button>
              </div>
            </div>
          )}

          {/* 2. Billing & Pass */}
          {activeTab === "billing" && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <h2 className="text-lg font-bold text-white">{t("subAndWallet")}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Khit Pass Card */}
                <div className="bg-gradient-to-br from-[#2a1c44] to-[#1c1a27] border border-[#8c1cff]/30 rounded-3xl p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#8c1cff]/20 blur-[40px] rounded-full" />
                  <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="flex items-center gap-2 text-sm font-black text-white">
                          <Crown className="w-5 h-5 text-amber-400 fill-amber-400" /> Khit Pass VIP
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">{t("active")}</span>
                      </div>
                      <p className="text-xs text-zinc-400">{t("khitPassDesc")}</p>
                    </div>
                    <button className="h-9 px-4 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-colors w-fit cursor-pointer">
                      {t("managePlan")}
                    </button>
                  </div>
                </div>

                {/* Stars Wallet Card */}
                <div className="bg-[#181628] border border-white/5 rounded-3xl p-6 flex flex-col justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                      <Star className="w-3.5 h-3.5" /> {t("starsBalance")}
                    </span>
                    <div className="text-3xl font-black text-white flex items-center gap-2">
                      4,250 <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-1">{t("starsDesc")}</p>
                  </div>
                  <button className="h-9 px-4 bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black rounded-xl transition-colors w-fit shadow-md shadow-amber-500/20 cursor-pointer">
                    {t("topUpStars")}
                  </button>
                </div>
              </div>

              <h2 className="text-lg font-bold text-white pt-4">{t("paymentMethods")}</h2>
              <div className="bg-[#181628] border border-white/5 rounded-3xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-sm">K</div>
                  <div>
                    <div className="text-sm font-bold text-white">KBZPay (09-45***890)</div>
                    <div className="text-xs text-zinc-500">{t("defaultMethod")}</div>
                  </div>
                </div>
                <button className="text-xs font-bold text-red-400 hover:underline cursor-pointer">{t("remove")}</button>
              </div>
            </div>
          )}

          {/* 3. Playback Preferences */}
          {activeTab === "playback" && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <h2 className="text-lg font-bold text-white">{t("appPreferences")}</h2>

              <div className="bg-[#181628] border border-white/5 rounded-3xl p-2 space-y-1">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><Globe className="w-4 h-4 text-zinc-300" /></div>
                    <div className="text-left">
                      <div className="text-sm font-bold text-white">{t("language")}</div>
                      <div className="text-xs text-zinc-500">{locale === "en" ? "English (US)" : "မြန်မာ (Myanmar)"}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      startTransition(async () => {
                        const newLocale = locale === "en" ? "my" : "en";
                        await switchLocale(newLocale);
                      });
                    }}
                    disabled={isPending}
                    className="text-xs font-bold text-[#8c1cff] hover:underline cursor-pointer"
                  >
                    {locale === "en" ? "မြန်မာစာ" : "English"}
                  </button>
                </div>

                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><Smartphone className="w-4 h-4 text-zinc-300" /></div>
                    <div className="text-left">
                      <div className="text-sm font-bold text-white">{t("dataSaver")}</div>
                      <div className="text-xs text-zinc-500">{t("dataSaverSub")}</div>
                    </div>
                  </div>
                  <Toggle isOn={toggles.dataSaver} onToggle={() => handleToggle('dataSaver')} />
                </div>

                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><PlayCircle className="w-4 h-4 text-zinc-300" /></div>
                    <div className="text-left">
                      <div className="text-sm font-bold text-white">{t("autoplay")}</div>
                      <div className="text-xs text-zinc-500">{t("autoplaySub")}</div>
                    </div>
                  </div>
                  <Toggle isOn={toggles.autoplay} onToggle={() => handleToggle('autoplay')} />
                </div>
              </div>
            </div>
          )}

          {/* 4. Privacy & Notifications */}
          {activeTab === "privacy" && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <h2 className="text-lg font-bold text-white">{t("pushNotif")}</h2>

              <div className="bg-[#181628] border border-white/5 rounded-3xl p-2 space-y-1">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><Bell className="w-4 h-4 text-red-400" /></div>
                    <div className="text-left">
                      <div className="text-sm font-bold text-white">{t("liveStreams")}</div>
                      <div className="text-xs text-zinc-500">{t("liveStreamsSub")}</div>
                    </div>
                  </div>
                  <Toggle isOn={toggles.liveNotif} onToggle={() => handleToggle('liveNotif')} />
                </div>

                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><Crown className="w-4 h-4 text-amber-400" /></div>
                    <div className="text-left">
                      <div className="text-sm font-bold text-white">{t("lotteryNotif")}</div>
                      <div className="text-xs text-zinc-500">{t("lotteryNotifSub")}</div>
                    </div>
                  </div>
                  <Toggle isOn={toggles.passNotif} onToggle={() => handleToggle('passNotif')} />
                </div>
              </div>

              <h2 className="text-lg font-bold text-white pt-4">{t("privacy")}</h2>
              <div className="bg-[#181628] border border-white/5 rounded-3xl p-2">
                <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer">
                  <div className="text-left">
                    <div className="text-sm font-bold text-white">{t("blockedUsers")}</div>
                    <div className="text-xs text-zinc-500">{t("blockedUsersSub")}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                </button>
              </div>
            </div>
          )}

          {/* 5. Help & Legal */}
          {activeTab === "help" && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <h2 className="text-lg font-bold text-white">{t("supportAndLegal")}</h2>

              <div className="bg-[#181628] border border-white/5 rounded-3xl p-2">
                <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer">
                  <div className="text-left">
                    <div className="text-sm font-bold text-white">{t("reportProblem")}</div>
                    <div className="text-xs text-zinc-500">{t("reportProblemSub")}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                </button>
                <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer">
                  <div className="text-left">
                    <div className="text-sm font-bold text-white">{t("tos")}</div>
                    <div className="text-xs text-zinc-500">{t("tosSub")}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                </button>
                <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition-colors cursor-pointer">
                  <div className="text-left">
                    <div className="text-sm font-bold text-white">{t("privacyPolicy")}</div>
                    <div className="text-xs text-zinc-500">{t("privacyPolicySub")}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                </button>
              </div>
              
              <div className="text-center pt-8">
                <p className="text-[11px] text-zinc-500 font-mono">{t("version")}</p>
                <p className="text-[11px] text-zinc-600 mt-1">{t("copyright")}</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}