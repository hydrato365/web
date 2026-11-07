"use client";

import React, { useId } from "react";

export function BrandLogo({ className = "" }: { className?: string }) {
  // SVG ID များ မထပ်စေရန် (Mobile တွင် ပျောက်မသွားစေရန်) Unique ID တည်ဆောက်ခြင်း
  const rawId = useId();
  const id = rawId.replace(/:/g, ""); 
  const gradId = `brandPrimaryGrad-${id}`;
  const glowId = `brandGlow-${id}`;

  return (
    <div className={`flex items-center gap-0.5 shrink-0 ${className}`}>
      <svg className="w-8 h-8 shrink-0" viewBox="125 120 285 270" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F2FE"/>
            <stop offset="50%" stopColor="#4FACFE"/>
            <stop offset="100%" stopColor="#7F00FF"/>
          </linearGradient>
          <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="10" floodColor="#00F2FE" floodOpacity="0.4"/>
          </filter>
        </defs>
        <g filter={`url(#${glowId})`}>
          <rect x="140" y="136" width="52" height="240" rx="18" fill={`url(#${gradId})`}/>
          <path d="M 230 256 L 360 160 C 375 148 395 158 395 178 L 395 334 C 395 354 375 364 360 352 Z" fill={`url(#${gradId})`}/>
          <circle cx="218" cy="256" r="14" fill="#131224"/>
        </g>
      </svg>
      <span className="text-xl font-black tracking-tight text-white leading-none">
        hit
      </span>
    </div>
  );
}