"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { layoutConfig } from "@/lib/layout-config";
import { NavIcon } from "@/components/layout/nav-icon";

import { useTranslations } from "next-intl";

type NavItem = {
  href: string;
  key: "home" | "search" | "tuned" | "messages" | "profile";
  icon?: string;
  isAvatar?: boolean;
};

const navItems: readonly NavItem[] = [
  { href: "/", key: "home", icon: "home" },
  { href: "/search", key: "search", icon: "search" },
  { href: "/subscriptions", key: "tuned", icon: "tuned" },
  { href: "/messages", key: "messages", icon: "messages" },
  { href: "/profile", key: "profile", isAvatar: true },
];

export function MobileBottomNav() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const lastScrollY = useRef(0);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY <= 15) {
        setIsScrollingDown(false);
        lastScrollY.current = currentScrollY;
        return;
      }
      if (Math.abs(currentScrollY - lastScrollY.current) < 10) return;
      setIsScrollingDown(currentScrollY > lastScrollY.current);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const hideImmediately = () => {
      if (navRef.current) {
        navRef.current.style.transition = "none";
        navRef.current.style.display = "none";
      }
      setIsKeyboardOpen(true);
    };

    const restoreNav = () => {
      if (navRef.current) {
        navRef.current.style.display = "";
        requestAnimationFrame(() => {
          if (navRef.current) {
            navRef.current.style.transition = "";
          }
        });
      }
      setIsKeyboardOpen(false);
    };

    const handleFocusIn = (e: FocusEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) {
        hideImmediately();
      }
    };

    const handleFocusOut = () => {
      setTimeout(() => {
        const active = document.activeElement as HTMLElement | null;
        const isInput = active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.isContentEditable);
        if (!isInput) {
          restoreNav();
        }
      }, 60);
    };

    const handleViewportResize = () => {
      if (!window.visualViewport) return;
      const isKeyboard = window.visualViewport.height < window.innerHeight * 0.82;
      if (isKeyboard) {
        hideImmediately();
      } else {
        const active = document.activeElement as HTMLElement | null;
        const isInput = active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.isContentEditable);
        if (!isInput) {
          restoreNav();
        }
      }
    };

    const active = document.activeElement as HTMLElement | null;
    if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.isContentEditable)) {
      hideImmediately();
    }

    window.addEventListener("focusin", handleFocusIn);
    window.addEventListener("focusout", handleFocusOut);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleViewportResize);
    }

    return () => {
      window.removeEventListener("focusin", handleFocusIn);
      window.removeEventListener("focusout", handleFocusOut);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleViewportResize);
      }
    };
  }, []);

  if (layoutConfig.shouldHide(pathname, layoutConfig.hideMobileBottomNavRoutes)) {
    return null;
  }

  return (
    <nav 
      ref={navRef}
      style={{ transform: isScrollingDown ? "translate3d(0, 100%, 0)" : "translateZ(0)" }}
      className={`md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#131224]/95 backdrop-blur-xl ${isKeyboardOpen ? "hidden" : "flex"} items-center justify-around py-2 px-1 transition-transform duration-300 ease-in-out`}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        
        if (item.isAvatar) {
          return (
            <Link
              key="you"
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-xl transition-colors cursor-pointer ${
                isActive ? "text-[#a042ff]" : "text-zinc-400 hover:text-white"
              }`}
            >
              <div className={`w-6 h-6 rounded-full bg-red-600 flex items-center justify-center font-bold text-white text-xs transition-all ${isActive ? "border-2 border-[#a042ff] scale-110 shadow-[0_0_8px_#a042ff]" : "border border-white/20"}`}>
                T
              </div>
              <span className={`text-[10px] tracking-tight ${isActive ? "font-bold text-white" : "font-medium text-zinc-400"}`}>
                {t(item.key)}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-1 py-1 px-2.5 rounded-xl transition-colors ${
              isActive ? "text-[#a042ff]" : "text-zinc-400 hover:text-white"
            }`}
          >
            <NavIcon name={item.icon as any} isActive={isActive} className={`w-5 h-5 ${isActive ? "text-[#a042ff]" : "text-zinc-400"}`} />
            <span className={`text-[10px] tracking-tight ${isActive ? "font-bold text-white" : "font-medium text-zinc-400"}`}>
              {t(item.key)}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}