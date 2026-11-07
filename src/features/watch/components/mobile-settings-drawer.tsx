"use client";

import React from "react";
import { 
  ChevronRight, 
  Check, 
  ArrowLeft, 
  Moon, 
  Gauge, 
  Sliders, 
  Repeat, 
  Subtitles, 
  SkipForward 
} from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

interface MobileSettingsDrawerProps {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (val: boolean) => void;
  settingsView: "main" | "quality" | "speed" | "sleep" | "captions";
  setSettingsView: (val: "main" | "quality" | "speed" | "sleep" | "captions") => void;
  quality: string;
  setQuality: (val: string) => void;
  playbackSpeed: number;
  handleSpeedChange: (speed: number) => void;
  sleepTimer: string;
  handleSleepTimerChange: (val: string) => void;
  captions: string;
  setCaptions: (val: string) => void;
  isLooping: boolean;
  setIsLooping: (val: boolean) => void;
  isAutoplay: boolean;
  setIsAutoplay: (val: boolean) => void;
}

export function MobileSettingsDrawer({
  isSettingsOpen,
  setIsSettingsOpen,
  settingsView,
  setSettingsView,
  quality,
  setQuality,
  playbackSpeed,
  handleSpeedChange,
  sleepTimer,
  handleSleepTimerChange,
  captions,
  setCaptions,
  isLooping,
  setIsLooping,
  isAutoplay,
  setIsAutoplay,
}: MobileSettingsDrawerProps) {
  return (
    <Drawer
      handleOnly
      open={isSettingsOpen}
      onOpenChange={(open) => {
        setIsSettingsOpen(open);
        if (!open) setSettingsView("main");
      }}
    >
      <DrawerContent className="bg-[#181628] border-t border-white/10 text-white px-5 pb-6 pt-2 max-h-[85vh] sm:max-w-md sm:mx-auto focus:outline-none z-[100] flex flex-col">
        <DrawerHeader className="p-0 pb-1 shrink-0">
          <DrawerTitle className="text-sm font-bold text-white px-2 border-b border-white/5 pb-2 text-left">
            {settingsView === "main" ? "Video Settings" : settingsView.toUpperCase()}
          </DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto overscroll-contain space-y-3 pt-1">
          {settingsView === "main" && (
            <div className="space-y-1">
              <button
                onClick={() => setSettingsView("quality")}
                className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <Sliders className="w-4 h-4 text-zinc-400" />
                  <span className="text-xs font-semibold text-zinc-200">Quality (ရုပ်ထွက်)</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#8c1cff] font-bold">
                  <span>{quality}</span>
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                </div>
              </button>

              <button
                onClick={() => setSettingsView("speed")}
                className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <Gauge className="w-4 h-4 text-zinc-400" />
                  <span className="text-xs font-semibold text-zinc-200">Playback speed (ဖွင့်နှုန်း)</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#8c1cff] font-bold">
                  <span>{playbackSpeed === 1 ? "Normal" : `${playbackSpeed}x`}</span>
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                </div>
              </button>

              <button
                onClick={() => setSettingsView("sleep")}
                className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <Moon className="w-4 h-4 text-zinc-400" />
                  <span className="text-xs font-semibold text-zinc-200">Sleep timer (အိပ်ချိန်မှတ်စက်)</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#8c1cff] font-bold">
                  <span>{sleepTimer}</span>
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                </div>
              </button>

              <button
                onClick={() => setSettingsView("captions")}
                className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <Subtitles className="w-4 h-4 text-zinc-400" />
                  <span className="text-xs font-semibold text-zinc-200">Captions (စာတန်းထိုး)</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#8c1cff] font-bold">
                  <span>{captions}</span>
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                </div>
              </button>

              <div className="flex items-center justify-between p-3 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Repeat className="w-4 h-4 text-zinc-400" />
                  <span className="text-xs font-semibold text-zinc-200">Loop video (ထပ်ခါထပ်ခါဖွင့်မည်)</span>
                </div>
                <div 
                  onClick={() => setIsLooping(!isLooping)}
                  className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-colors ${isLooping ? "bg-[#8c1cff]" : "bg-zinc-700"}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isLooping ? "translate-x-5" : "translate-x-0"}`} />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl">
                <div className="flex items-center gap-3">
                  <SkipForward className="w-4 h-4 text-zinc-400" />
                  <span className="text-xs font-semibold text-zinc-200">Autoplay next (နောက်တစ်ခု အလိုအလျောက်ဖွင့်မည်)</span>
                </div>
                <div 
                  onClick={() => setIsAutoplay(!isAutoplay)}
                  className={`w-11 h-6 rounded-full p-1 cursor-pointer transition-colors ${isAutoplay ? "bg-[#8c1cff]" : "bg-zinc-700"}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isAutoplay ? "translate-x-5" : "translate-x-0"}`} />
                </div>
              </div>
            </div>
          )}

          {settingsView === "quality" && (
            <div className="space-y-2">
              <button 
                onClick={() => setSettingsView("main")} 
                className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white mb-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <div className="divide-y divide-white/5">
                {["Auto (Recommended)", "1080p (FHD)", "720p (HD)", "480p", "360p (Data Saver)"].map((q) => {
                  const cleanQ = q.split(" ")[0];
                  const isSelected = quality === cleanQ;
                  return (
                    <button
                      key={q}
                      onClick={() => { setQuality(cleanQ); setSettingsView("main"); }}
                      className="w-full flex items-center justify-between py-3 px-2 text-xs font-semibold hover:bg-white/5 rounded-xl cursor-pointer"
                    >
                      <span className={isSelected ? "text-[#8c1cff] font-bold" : "text-zinc-200"}>{q}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#8c1cff]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {settingsView === "speed" && (
            <div className="space-y-2">
              <button 
                onClick={() => setSettingsView("main")} 
                className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white mb-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <div className="divide-y divide-white/5">
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => {
                  const isSelected = playbackSpeed === s;
                  return (
                    <button
                      key={s}
                      onClick={() => handleSpeedChange(s)}
                      className="w-full flex items-center justify-between py-3 px-2 text-xs font-semibold hover:bg-white/5 rounded-xl cursor-pointer"
                    >
                      <span className={isSelected ? "text-[#8c1cff] font-bold" : "text-zinc-200"}>
                        {s === 1 ? "Normal (1x)" : `${s}x`}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-[#8c1cff]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {settingsView === "sleep" && (
            <div className="space-y-2">
              <button 
                onClick={() => setSettingsView("main")} 
                className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white mb-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <div className="divide-y divide-white/5">
                {["Off", "15 minutes", "30 minutes", "45 minutes", "End of video"].map((t) => {
                  const isSelected = sleepTimer === t;
                  return (
                    <button
                      key={t}
                      onClick={() => handleSleepTimerChange(t)}
                      className="w-full flex items-center justify-between py-3 px-2 text-xs font-semibold hover:bg-white/5 rounded-xl cursor-pointer"
                    >
                      <span className={isSelected ? "text-[#8c1cff] font-bold" : "text-zinc-200"}>{t}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#8c1cff]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {settingsView === "captions" && (
            <div className="space-y-2">
              <button 
                onClick={() => setSettingsView("main")} 
                className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white mb-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <div className="divide-y divide-white/5">
                {["Off", "မြန်မာစာ", "English"].map((c) => {
                  const isSelected = captions === c;
                  return (
                    <button
                      key={c}
                      onClick={() => { setCaptions(c); setSettingsView("main"); }}
                      className="w-full flex items-center justify-between py-3 px-2 text-xs font-semibold hover:bg-white/5 rounded-xl cursor-pointer"
                    >
                      <span className={isSelected ? "text-[#8c1cff] font-bold" : "text-zinc-200"}>{c}</span>
                      {isSelected && <Check className="w-4 h-4 text-[#8c1cff]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}