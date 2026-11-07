"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

interface ChatHeaderProps {
  creator: {
    name: string;
    handle: string;
    avatar: string;
    verified: boolean;
  };
}

export function ChatHeader({ creator }: ChatHeaderProps) {
  return (
    <div className="p-3.5 sm:p-4 border-b border-white/5 flex items-center justify-between bg-[#151322] shrink-0">
      <div className="flex items-center gap-3">
        <Link
          href="/messages"
          className="p-1.5 rounded-xl hover:bg-white/5 text-zinc-400 hover:text-white transition-colors"
          title="Back to Messages"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className={`w-9 h-9 rounded-full bg-gradient-to-tr ${creator.avatar} font-bold text-xs flex items-center justify-center text-white shrink-0`}>
          {creator.name.charAt(0)}
        </div>

        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            {creator.name}
            {creator.verified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-blue-500 text-[#181628]" />}
          </h3>
          <span className="text-[10px] text-zinc-400">@{creator.handle}</span>
        </div>
      </div>

      <Link
        href={`/channel/${creator.handle}`}
        className="text-xs font-bold text-[#8c1cff] hover:underline"
      >
        View Channel ➔
      </Link>
    </div>
  );
}