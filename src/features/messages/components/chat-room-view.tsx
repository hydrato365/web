"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChatHeader } from "@/features/messages/components/chat-header";
import { ChatInput } from "@/features/messages/components/chat-input";

const creatorData: Record<string, { name: string; handle: string; avatar: string; verified: boolean }> = {
  "1": { name: "Min Mahar", handle: "minmahar", avatar: "from-amber-600 to-amber-900", verified: true },
  "2": { name: "Fintech MM", handle: "fintech_mm", avatar: "from-blue-600 to-blue-800", verified: true },
  "3": { name: "Comic Hub", handle: "comic_hub", avatar: "from-emerald-600 to-teal-800", verified: false },
};

export function ChatRoomView() {
  const params = useParams();
  const id = String(params?.id || "1");
  const creator = creatorData[id] || creatorData["1"];

  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, sender: creator.name, isMe: false, text: "မင်္ဂလာပါ Thomas! Khit Pass အဖွဲ့ဝင်အဖြစ် အားပေးတဲ့အတွက် အထူးကျေးဇူးတင်ပါတယ်ခင်ဗျာ။", time: "10:14 AM" },
    { id: 2, sender: "You", isMe: true, text: "အကို့ရဲ့ Oppenheimer recap ကြည့်ပြီး အရမ်းသဘောကျလို့ပါ။ နောက်ထပ် Christopher Nolan ရဲ့ ရုပ်ရှင်တွေရော တင်ဖို့ရှိမလားဗျ?", time: "10:16 AM" },
    { id: 3, sender: creator.name, isMe: false, text: "ဟုတ်ကဲ့ Interstellar နဲ့ Inception ကိုလည်း အသေးစိတ် သုံးသပ်ပြီး မကြာခင် အပတ်စဉ် အစီအစဉ်အတိုင်း တင်ဆက်ပေးသွားပါ့မယ်ဗျာ!", time: "10:18 AM" },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    setMessages([
      ...messages,
      { id: Date.now(), sender: "You", isMe: true, text: inputMessage, time: "Just now" }
    ]);
    setInputMessage("");
  };

  return (
    <div 
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      className="fixed inset-0 z-50 md:static md:max-w-[1400px] md:mx-auto md:h-[calc(100vh-5rem)] flex flex-col bg-[#181628] md:rounded-3xl md:border md:border-white/5 md:overflow-hidden md:mt-4"
    >
      
      {/* Chat Thread Header (Refactored) */}
      <ChatHeader creator={creator} />

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.isMe ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[70%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                m.isMe
                  ? "bg-[#8c1cff] text-white rounded-tr-sm shadow-md"
                  : "bg-[#201d32] text-zinc-100 rounded-tl-sm border border-white/5"
              }`}
            >
              <p>{m.text}</p>
            </div>
            <span className="text-[10px] text-zinc-500 mt-1 px-1">{m.time}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar (Refactored) */}
      <ChatInput 
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        handleSendMessage={handleSendMessage}
        creatorName={creator.name}
      />

    </div>
  );
}