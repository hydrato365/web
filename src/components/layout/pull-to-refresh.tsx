"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { layoutConfig } from "@/lib/layout-config";

export function PullToRefresh({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMobileHeaderHidden = layoutConfig.shouldHide(pathname, layoutConfig.hideMobileHeaderRoutes);

  return (
    <main
      id="main-scroll-area"
      className={`flex-1 ${isMobileHeaderHidden ? "pt-0" : "pt-16"} md:pt-0 pb-16 md:pb-0 relative w-full`}
    >
      <div className="min-h-full">
        {children}
      </div>
    </main>
  );
}