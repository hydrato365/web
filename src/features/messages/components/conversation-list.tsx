"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export interface Conversation {
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

interface ConversationListProps {
  conversations: Conversation[];
}

import { useTranslations } from "next-intl";

export function ConversationList({ conversations }: ConversationListProps) {
  const t = useTranslations("Messages");

  if (conversations.length === 0) {
    return (
      <div className="py-20 text-center text-xs text-zinc-500 space-y-1">
        <p className="font-bold text-zinc-400">{t("noConversations")}</p>
        <p>{t("noConversationsSub")}</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-white/5 pt-1">
      {conversations.map((chat) => (
        <Link
          key={chat.id}
          href={`/messages/${chat.id}`}
          className="py-3.5 px-2 flex items-center gap-3.5 rounded-2xl hover:bg-white/5 active:bg-white/10 transition-colors cursor-pointer group"
        >
          {/* Creator Avatar with Status Indicator */}
          <div className="relative shrink-0">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-tr ${chat.avatar} font-bold text-sm flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}>
              {chat.creator.charAt(0)}
            </div>
            {chat.isVIPChannel ? (
              <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-amber-400 border-2 border-[#131224] flex items-center justify-center text-[8px] font-black text-zinc-950">
                ★
              </span>
            ) : (
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#131224]" />
            )}
          </div>

          {/* Message Details */}
          <div className="flex-1 overflow-hidden space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5 truncate group-hover:text-[#a042ff] transition-colors">
                {chat.creator}
                {chat.verified && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500 text-[#131224]" />
                )}
              </h4>
              <span className={`text-[11px] font-medium shrink-0 ${chat.unreadCount > 0 ? "text-[#a042ff] font-bold" : "text-zinc-500"}`}>
                {chat.time}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <p className={`text-xs truncate leading-relaxed ${chat.unreadCount > 0 ? "text-zinc-200 font-semibold" : "text-zinc-400"}`}>
                {chat.lastMessage}
              </p>

              {chat.unreadCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#8c1cff] text-[10px] font-black text-white flex items-center justify-center shrink-0 shadow-sm">
                  {chat.unreadCount}
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}