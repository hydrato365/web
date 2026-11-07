"use client";

import React from "react";
import { 
  Settings, 
  ChevronRight, 
  Check, 
  ArrowLeft, 
  Sliders, 
  Gauge, 
  Moon, 
  Subtitles, 
  Repeat, 
  SkipForward 
} from "lucide-react";

interface DesktopSettingsMenuProps {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (val: boolean) => void;
  settingsView: "main" | "quality" | "speed" | "sleep" | "captions";
  setSettingsView: (val: "main" | "quality" | "speed" | "sleep" | "captions") => void;
  quality: string;
  setQuality: (val: string) => void;
  playbackSpeed: number;
  handleSpeedChange: (speed: number) => void;
  holdSpeed: number;
  setHoldSpeed: (speed: number) => void;
  sleepTimer: string;
  handleSleepTimerChange: (val: string) => void;
  captions: string;
  setCaptions: (val: string) => void;
  isLooping: boolean;
  setIsLooping: (val: boolean) => void;
  isAutoplay: boolean;
  setIsAutoplay: (val: boolean) => void;
  settingsRef: React.RefObject<HTMLDivElement | null>;
}

export function DesktopSettingsMenu({
  isSettingsOpen,
  setIsSettingsOpen,
  settingsView,
  setSettingsView,
  quality,
  setQuality,
  playbackSpeed,
  handleSpeedChange,
  holdSpeed,
  setHoldSpeed,
  sleepTimer,
  handleSleepTimerChange,
  captions,
  setCaptions,
  isLooping,
  setIsLooping,
  isAutoplay,
  setIsAutoplay,
  settingsRef,
}: DesktopSettingsMenuProps) {
  return (
    <div className="relative" ref={settingsRef}>
      {isSettingsOpen && (
        <div className="absolute bottom-full right-0 mb-3 w-64 bg-[#181628]/95 border border-white/10 rounded-2xl p-2.5 shadow-2xl backdrop-blur-md z-50 animate-in fade-in zoom-in-95 duration-150 text-white select-none">
          {settingsView === "main" && (
            <div className="space-y-0.5">
              <button
                type="button"
                onClick={() => setSettingsView("quality")}
                className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Sliders className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-xs font-semibold text-zinc-200">Quality</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-[#8c1cff] font-bold">
                  <span>{quality}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSettingsView("speed")}
                className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Gauge className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-xs font-semibold text-zinc-200">Playback speed</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-[#8c1cff] font-bold">
                  <span>{playbackSpeed === 1 ? "Normal" : `${playbackSpeed}x`}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSettingsView("sleep")}
                className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Moon className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-xs font-semibold text-zinc-200">Sleep timer</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-[#8c1cff] font-bold">
                  <span>{sleepTimer}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSettingsView("captions")}
                className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Subtitles className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-xs font-semibold text-zinc-200">Captions</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-[#8c1cff] font-bold">
                  <span>{captions}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />
                </div>
              </button>

              <div className="border-t border-white/5 my-1" />

              <div className="flex items-center justify-between p-2 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <Repeat className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-xs font-semibold text-zinc-200">Loop video</span>
                </div>
                <div 
                  onClick={() => setIsLooping(!isLooping)}
                  className={`w-9 h-5 rounded-full p-0.5 cursor-pointer transition-colors ${isLooping ? "bg-[#8c1cff]" : "bg-zinc-700"}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isLooping ? "translate-x-4" : "translate-x-0"}`} />
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <SkipForward className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-xs font-semibold text-zinc-200">Autoplay next</span>
                </div>
                <div 
                  onClick={() => setIsAutoplay(!isAutoplay)}
                  className={`w-9 h-5 rounded-full p-0.5 cursor-pointer transition-colors ${isAutoplay ? "bg-[#8c1cff]" : "bg-zinc-700"}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isAutoplay ? "translate-x-4" : "translate-x-0"}`} />
                </div>
              </div>
            </div>
          )}

          {settingsView === "quality" && (
            <div className="space-y-1">
              <button 
                type="button"
                onClick={() => setSettingsView("main")} 
                className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white p-1 mb-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <div className="divide-y divide-white/5">
                {["Auto", "1080p", "720p", "480p", "360p"].map((q) => {
                  const isSelected = quality === q;
                  return (
                    <button
                      key={q}
                      type="button"
                      onClick={() => { setQuality(q); setSettingsView("main"); }}
                      className="w-full flex items-center justify-between py-2 px-2 text-xs font-semibold hover:bg-white/5 rounded-lg cursor-pointer"
                    >
                      <span className={isSelected ? "text-[#8c1cff] font-bold" : "text-zinc-200"}>{q}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#8c1cff]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {settingsView === "speed" && (
            <div className="space-y-2">
              <button 
                type="button"
                onClick={() => setSettingsView("main")} 
                className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white p-1 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Playback speed</span>
              </button>

              <div className="space-y-0.5">
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => {
                  const isSelected = playbackSpeed === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleSpeedChange(s)}
                      className="w-full flex items-center justify-between py-1.5 px-2.5 text-xs font-medium hover:bg-white/5 rounded-lg cursor-pointer transition-colors"
                    >
                      <span className={isSelected ? "text-[#8c1cff] font-bold" : "text-zinc-200"}>
                        {s === 1 ? "Normal" : `${s}x`}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#8c1cff]" />}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-white/5 space-y-1.5 px-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-medium text-zinc-400">Space Hold</span>
                  <span className="font-bold text-[#8c1cff]">{holdSpeed}x</span>
                </div>
                <div className="grid grid-cols-4 bg-[#12111d] p-0.5 rounded-lg border border-white/5">
                  {[1.5, 2, 2.5, 3].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setHoldSpeed(val)}
                      className={`py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer text-center ${
                        holdSpeed === val
                          ? "bg-[#8c1cff] text-white shadow-sm"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {val}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {settingsView === "sleep" && (
            <div className="space-y-1">
              <button 
                type="button"
                onClick={() => setSettingsView("main")} 
                className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white p-1 mb-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <div className="divide-y divide-white/5">
                {["Off", "15 minutes", "30 minutes", "45 minutes", "End of video"].map((t) => {
                  const isSelected = sleepTimer === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleSleepTimerChange(t)}
                      className="w-full flex items-center justify-between py-2 px-2 text-xs font-semibold hover:bg-white/5 rounded-lg cursor-pointer"
                    >
                      <span className={isSelected ? "text-[#8c1cff] font-bold" : "text-zinc-200"}>{t}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#8c1cff]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {settingsView === "captions" && (
            <div className="space-y-1">
              <button 
                type="button"
                onClick={() => setSettingsView("main")} 
                className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white p-1 mb-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <div className="divide-y divide-white/5">
                {["Off", "မြန်မာစာ", "English"].map((c) => {
                  const isSelected = captions === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => { setCaptions(c); setSettingsView("main"); }}
                      className="w-full flex items-center justify-between py-2 px-2 text-xs font-semibold hover:bg-white/5 rounded-lg cursor-pointer"
                    >
                      <span className={isSelected ? "text-[#8c1cff] font-bold" : "text-zinc-200"}>{c}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#8c1cff]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <button 
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsSettingsOpen(!isSettingsOpen);
          setSettingsView("main");
        }} 
        className={`w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white active:scale-95 transition-all cursor-pointer ${isSettingsOpen ? "bg-white/25 text-[#8c1cff]" : ""}`}
        title="Settings"
      >
        <Settings className="w-4 h-4" />
      </button>
    </div>
  );
}