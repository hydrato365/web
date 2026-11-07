"use client";

import React from "react";

interface ChatMessage {
  id: number;
  user: string;
  online: boolean;
  check: boolean;
  avatar: string;
  text: string;
}

interface DesktopCommentsProps {
  chatMessages: ChatMessage[];
  inputMessage: string;
  setInputMessage: (val: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
}

export function DesktopComments({
  chatMessages,
  inputMessage,
  setInputMessage,
  handleSendMessage,
}: DesktopCommentsProps) {
  return (
    <div className="pt-4 border-t border-zinc-800/80 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span>Comments</span>
          <span className="text-xs text-zinc-400 font-mono">({chatMessages.length})</span>
        </h3>
        <span className="text-xs font-semibold text-zinc-400">Sort by: Top comments</span>
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-3 items-start">
        <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center font-bold text-sm text-white shrink-0">
          T
        </div>
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Add a comment on this recap..."
            className="flex-1 h-10 bg-[#141320] border border-zinc-800 rounded-xl px-4 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 transition-colors"
          />
          <button
            type="submit"
            className="h-10 px-5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            Comment
          </button>
        </div>
      </form>

      <div className="p-3.5 bg-[#141320] border border-zinc-800 rounded-xl text-xs space-y-2">
        <div className="flex items-center gap-2 text-zinc-400 text-[11px] font-semibold">
          <span className="text-amber-400">📌</span>
          <span className="text-zinc-300">Pinned by Min Mahar</span>
        </div>
        <div className="flex gap-3 items-start">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-700 to-amber-900 border border-zinc-700 flex items-center justify-center font-bold text-white text-xs shrink-0">
            M
          </div>
          <div className="space-y-1">
            <span className="font-bold text-white text-xs">Min Mahar</span>
            <p className="text-zinc-300 leading-relaxed">
              နောက်ထပ် Christopher Nolan ရဲ့ ရုပ်ရှင်တွေထဲက ဘယ်ဇာတ်ကားကို Recap အရင်ကြည့်ချင်လဲခင်ဗျာ? Comments မှာ ရေးပေးခဲ့ကြပါဦး။
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-1">
        {chatMessages.map((user) => (
          <div key={user.id} className="flex gap-3 items-start">
            <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${user.avatar} font-bold text-xs flex items-center justify-center text-white shrink-0 border border-zinc-800`}>
              {user.user.charAt(0)}
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-white">{user.user}</span>
                <span className="text-[10px] text-zinc-500">2 hours ago</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">{user.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}