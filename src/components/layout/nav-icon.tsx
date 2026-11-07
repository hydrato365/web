"use client";

import React from "react";
import { 
  Home, 
  Search,
  Users, 
  MessageSquare, 
  Bookmark, 
  History,
  User
} from "lucide-react";

export type NavIconName = "home" | "search" | "tuned" | "messages" | "saved" | "history" | "you";

interface NavIconProps {
  name: NavIconName;
  isActive: boolean;
  className?: string;
}

export function NavIcon({ name, isActive, className = "w-5 h-5" }: NavIconProps) {
  // ၁။ မနှိပ်ထားချိန် (Inactive) - ပုံမှန် မျဉ်းပါးပါး Lucide Icons
  if (!isActive) {
    switch (name) {
      case "home":
        return <Home className={className} />;
      case "search":
        return <Search className={className} />;
      case "tuned":
        return <Users className={className} />;
      case "messages":
        return <MessageSquare className={className} />;
      case "saved":
        return <Bookmark className={className} />;
      case "history":
        return <History className={className} />;
      case "you":
        return <User className={className} />;
    }
  }

  // ၂။ နှိပ်ထားချိန် (Active) - Negative Space Cutout ဖြင့် အထဲက အပေါက်မပျက်စေဘဲ အရောင်ဖြည့်ထားသော စနစ်
  switch (name) {
    case "search":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="11" r="8" fill="currentColor" />
          <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <circle cx="11" cy="11" r="3" fill="#131224" />
        </svg>
      );

    case "home":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* အိမ်အမိုးနှင့် ကိုယ်ထည် (Solid Fill) */}
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="currentColor" />
          {/* အိမ်တံခါးပေါက် ဖောက်ထွင်းချက် (Background Cutout) */}
          <path d="M9 22V12h6v10" fill="#131224" stroke="#131224" strokeWidth="1" />
        </svg>
      );

    case "tuned":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* ရှေ့လူ ဦးခေါင်းနှင့် ကိုယ်ထည် (Solid Fill) */}
          <circle cx="9" cy="7" r="4" fill="currentColor" />
          <path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2z" fill="currentColor" />
          {/* နောက်လူနှင့် ရှေ့လူကြား ကြားခံ ခြားနားချက် ဖောက်ထွင်းမှု */}
          <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case "messages":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* စကားပြော အကွက် (Solid Fill) */}
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="currentColor" />
          {/* စကားပြော အစက် ၃ စက် ဖောက်ထွင်းချက် (Background Cutout) */}
          <circle cx="8" cy="10" r="1.5" fill="#131224" />
          <circle cx="12" cy="10" r="1.5" fill="#131224" />
          <circle cx="16" cy="10" r="1.5" fill="#131224" />
        </svg>
      );

    case "saved":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Bookmark ဖဲကြိုး (Solid Ribbon) */}
          <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" fill="currentColor" />
        </svg>
      );

    case "history":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* နောက်ပြန်လှည့် မြှားခေါင်း */}
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M3 3v5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* နာရီကိုယ်ထည် (Solid Fill) */}
          <circle cx="12" cy="12" r="7" fill="currentColor" />
          {/* နာရီလက်တံ ၂ ချောင်း ဖောက်ထွင်းချက် (Background Cutout) */}
          <polyline points="12 8 12 12 15 14" stroke="#131224" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "you":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* လူခန္ဓာကိုယ် အပြည့် (Solid Fill) */}
          <circle cx="12" cy="8" r="5" fill="currentColor" />
          <path d="M20 21a8 8 0 0 0-16 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
  }
}