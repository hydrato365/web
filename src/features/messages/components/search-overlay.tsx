"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, X, CheckCircle2 } from "lucide-react";

interface Conversation {
  id: number;
  creator: string;
  handle: string;
  avatar: string;
  verified: boolean;
  isVIPChannel?: boolean;
  lastMessage: string;
  time: string;
  unreadCount: number;
}

interface MessageSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
}

export function MessageSearchOverlay({
  isOpen,
  onClose,
  conversations,
}: MessageSearchOverlayProps) {
  const [query, setQuery] = useState("");

  if (!isOpen) return null;

  const filtered = conversations.filter(
    (c) =>
      c.creator.toLowerCase().includes(query.toLowerCase()) ||
      c.handle.toLowerCase().includes(query.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#151322] animate-in fade-in duration-100">
      
      {/* Search Header */}
      <div className="p-3.5 sm:p-4 border-b border-white/5 flex items-center gap-3 bg-[#181628] shrink-0">
        <button
          type="button"
          onClick={() => {
            setQuery("");
            onClose();
          }}
          className="p-1.5 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-colors shrink-0 cursor-pointer"
          title="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="relative flex-1 flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-zinc-500 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search creators or messages..."
            className="w-full h-11 bg-[#1c1a2c] border border-white/10 rounded-2xl pl-10 pr-10 text-base sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#8c1cff]"
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 p-1 rounded-full text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filtered Results */}
      <div className="flex-1 overflow-y-auto divide-y divide-white/5">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-zinc-500">
            No creators or messages found for "{query}"
          </div>
        ) : (
          filtered.map((chat) => (
            <Link
              key={chat.id}
              href={`/messages/${chat.id}`}
              onClick={onClose}
              className="p-4 flex items-start gap-3 cursor-pointer transition-colors hover:bg-white/5"
            >
              <div className={`w-11 h-11 rounded-full bg-gradient-to-tr ${chat.avatar} font-bold text-sm flex items-center justify-center text-white shrink-0 relative`}>
                {chat.creator.charAt(0)}
                {chat.isVIPChannel && (
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center text-[9px] font-black text-zinc-950 shadow">
                    ★
                  </span>
                )}
              </div>

              <div className="flex-1 overflow-hidden space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 truncate">
                    {chat.creator}
                    {chat.verified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500 text-[#151322]" />}
                  </h4>
                  <span className="text-[10px] text-zinc-500 shrink-0">{chat.time}</span>
                </div>

                <p className="text-xs text-zinc-400 truncate leading-snug">
                  {chat.lastMessage}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>

    </div>
  );
}