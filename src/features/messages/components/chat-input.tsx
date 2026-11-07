"use client";

import React from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  inputMessage: string;
  setInputMessage: (val: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  creatorName: string;
}

export function ChatInput({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  creatorName,
}: ChatInputProps) {
  return (
    <form onSubmit={handleSendMessage} className="p-3 sm:p-4 border-t border-white/5 bg-[#151322] flex items-center gap-2.5 shrink-0">
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder={`Reply to ${creatorName}...`}
        className="flex-1 h-11 rounded-2xl bg-[#1c1a2c] border border-white/5 px-4 text-base sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#8c1cff]"
      />
      <button
        type="submit"
        onPointerDown={(e) => e.preventDefault()}
        className="w-11 h-11 rounded-2xl bg-[#8c1cff] hover:bg-[#9d3eff] text-white flex items-center justify-center shrink-0 shadow-lg cursor-pointer active:scale-95 transition-transform"
      >
        <Send className="w-4 h-4 ml-0.5" />
      </button>
    </form>
  );
}