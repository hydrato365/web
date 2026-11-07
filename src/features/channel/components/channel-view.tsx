"use client";

import React from "react";
import { ChannelHeader } from "@/features/channel/components/channel-header";
import { ChannelTabs } from "@/features/channel/components/channel-tabs";

export function ChannelView() {
  return (
    <div className="min-h-screen relative z-10 animate-in fade-in duration-300 pb-16">
      <ChannelHeader />
      <ChannelTabs />
    </div>
  );
}