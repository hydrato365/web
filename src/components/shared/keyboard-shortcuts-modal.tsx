"use client";

import React from "react";
import { Keyboard, X } from "lucide-react";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcutRows = [
  {
    title: "Playback (ဗီဒီယို ထိန်းချုပ်ခြင်း)",
    items: [
      { key: "Space", label: "Play / Pause" },
      { key: "K", label: "Play / Pause" },
      { key: "J", label: "၁၀ စက္ကန့် နောက်ဆုတ်" },
      { key: "L", label: "၁၀ စက္ကန့် ရှေ့တိုး" },
      { key: "←", label: "၅ စက္ကန့် နောက်ဆုတ်" },
      { key: "→", label: "၅ စက္ကန့် ရှေ့တိုး" },
      { key: "0 - 9", label: "၀% မှ ၉၀% သို့" },
    ],
  },
  {
    title: "Audio & Display (အသံနှင့် စခရင်)",
    items: [
      { key: "F", label: "စခရင်အပြည့်" },
      { key: "M", label: "အသံပိတ် / ဖွင့်" },
      { key: "↑", label: "အသံတိုး" },
      { key: "↓", label: "အသံလျှော့" },
      { key: "I", label: "Miniplayer" },
    ],
  },
];

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-[#181628] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl z-10 space-y-5 text-white animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#8c1cff]/10 flex items-center justify-center text-[#8c1cff]">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Keyboard shortcuts</h3>
              <p className="text-[11px] text-zinc-400">YouTube Standard Presets</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Compact 1-7 Keys Per Row Layout (ဘောင်မပါ၊ စာလုံးမပြတ်၊ တကယ့် Keyboard ပုံစံ) */}
        <div className="space-y-6 pt-1">
          {shortcutRows.map((row, idx) => (
            <div key={idx} className="space-y-3">
              <span className="text-[11px] font-bold text-[#8c1cff] uppercase tracking-wider block">
                {row.title}
              </span>
              
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-y-4 gap-x-2">
                {row.items.map((item, i) => (
                  <div 
                    key={i} 
                    className="flex flex-col items-center justify-start cursor-default select-none group"
                  >
                    {/* တကယ့် Keyboard Keycap စတိုင် (လေးထောင့်ကျကျနှင့် အောက်ခံအထစ်ပါသည်) */}
                    <kbd className="h-9 min-w-[44px] px-2.5 flex items-center justify-center rounded bg-[#252238] border border-white/15 border-b-[3px] border-b-black/80 text-white font-mono font-bold text-xs shadow-md group-hover:bg-[#2e2a45] transition-colors">
                      {item.key}
                    </kbd>
                    {/* စာလုံးလုံးဝ မပြတ်တော့သော Label */}
                    <span className="text-[11px] text-zinc-300 font-medium text-center mt-2 leading-tight">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-500">
          <span>Shortcuts are active while watching videos</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold cursor-pointer transition-colors"
          >
            Got it
          </button>
        </div>

      </div>
    </div>
  );
}