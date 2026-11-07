"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  MessageSquare, 
  Search, 
  X,
  Crown
} from "lucide-react";
import { ConversationList, type Conversation } from "@/features/messages/components/conversation-list";
import { useTranslations } from "next-intl";

const mockConversations: Conversation[] = [
  {
    id: 1,
    creator: "Min Mahar",
    handle: "minmahar",
    avatar: "from-amber-600 to-amber-900",
    verified: true,
    lastMessage: "မင်္ဂလာပါဗျာ! အခုတင်ပေးလိုက်တဲ့ recap နဲ့ ပတ်သက်ပြီး မေးခွန်းတွေ မေးလို့ရပါတယ်ခင်ဗျာ။",
    time: "2m ago",
    unreadCount: 2,
  },
  {
    id: 2,
    creator: "Fintech MM",
    handle: "fintech_mm",
    avatar: "from-blue-600 to-blue-800",
    verified: true,
    isVIPChannel: true,
    lastMessage: "📢 VIP အဖွဲ့ဝင်များအတွက် Digital Banking Analysis အသစ် တင်ပေးထားပါပြီ။",
    time: "1h ago",
    unreadCount: 1,
  },
  {
    id: 3,
    creator: "Comic Hub",
    handle: "comic_hub",
    avatar: "from-emerald-600 to-teal-800",
    verified: false,
    lastMessage: "ကျေးဇူးတင်ပါတယ်ခင်ဗျာ! Solo Leveling အပိုင်းသစ် မနက်ဖြန် လာပါမယ်။",
    time: "Yesterday",
    unreadCount: 0,
  },
];

export function MessagesView() {
  const t = useTranslations("Messages");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "vip" | "unread">("all");

  // Keyboard က မြန်မာစာလုံးပေါင်း (ကင်းစီး) ဆက်နေစဉ် ကြားခံစာလုံးများကြောင့် မမှားစေရန် ထိန်းချုပ်ခြင်း
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 120);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredConversations = mockConversations.filter((c) => {
    const query = debouncedQuery.toLowerCase();
    const matchesSearch =
      c.creator.toLowerCase().includes(query) ||
      c.handle.toLowerCase().includes(query) ||
      c.lastMessage.toLowerCase().includes(query);

    if (activeFilter === "vip") return matchesSearch && c.isVIPChannel;
    if (activeFilter === "unread") return matchesSearch && c.unreadCount > 0;
    return matchesSearch;
  });

  const totalUnread = mockConversations.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <div className="px-4 sm:px-6 pb-24 md:pb-16 max-w-[860px] mx-auto space-y-4 relative z-10">
      
      {/* 📌 Sticky Header: Messages Title နှင့် Search Box (၁ ပစ်ဇယ်မှ မလှုပ်ဘဲ အသေကပ်ထားသည်) */}
      <div className="sticky top-0 z-20 bg-[#131224]/95 backdrop-blur-md pt-3.5 pb-3 space-y-3 border-b border-white/5 -mx-4 px-4 sm:-mx-6 sm:px-6 will-change-transform">
        
        {/* ၁။ Messages Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {t("title")}
            </h1>
            {totalUnread > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#8c1cff] text-white text-xs font-black shadow-[0_0_12px_rgba(140,28,255,0.4)]">
                {totalUnread} {t("newBadge")}
              </span>
            )}
          </div>
        </div>

        {/* ၂။ Search Box */}
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-4 h-4 text-zinc-500 shrink-0 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full h-11 bg-[#1c1a2c] border border-white/5 rounded-2xl pl-11 pr-10 text-sm text-white placeholder-zinc-500 focus:placeholder-transparent focus:outline-none focus:border-[#8c1cff] transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 p-1 rounded-full text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>

      {/* 🏷️ Filter Pills (Edge-to-edge scroll view) */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-1 pb-0.5 -mx-4 px-4 sm:-mx-6 sm:px-6">
        {[
          { id: "all", label: t("allChats") },
          { id: "vip", label: t("vipBroadcasts"), icon: Crown },
          { id: "unread", label: t("unread") },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
              className={`h-8 px-4 rounded-full text-xs font-bold transition-colors border flex items-center gap-1.5 shrink-0 cursor-pointer ${
                isActive
                  ? "bg-[#8c1cff] text-white border-[#8c1cff]"
                  : "bg-[#1c1a27] text-zinc-400 hover:text-white border-white/5"
              }`}
            >
              {Icon && <Icon className="w-3 h-3 text-amber-400" />}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 💬 Modern Flat Conversations Feed (Refactored Component) */}
      <ConversationList conversations={filteredConversations} />

    </div>
  );
}