"use client";

import React, { useState } from "react";
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Eye, 
  EyeOff,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/layout/brand-logo";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // UI demo အတွက် ပိတ်လိုက်ပါမည်
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 
        🌟 ၁။ အနောက်ခံ: App အပြင် ထွက်မသွားသလို ခံစားရစေရန် အမှောင်နှင့် Blur ကိုသာ အဓိကထားသည် 
      */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
      />

      {/* 
        🌟 ၂။ DIALOG CARD: Glass (အကြည်) လုံးဝ မသုံးဘဲ တည်ငြိမ်သော အပိတ်စစ်စစ် (Solid #181624)
      */}
      <div className="relative w-full max-w-md bg-[#181624] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/90 z-10 animate-in fade-in zoom-in-95 duration-200 text-zinc-100">
        
        {/* Close Button (X) */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="space-y-1.5 mb-6">
          <div className="mb-4">
            <BrandLogo />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {mode === "signin" ? "Welcome back" : "Create an account"}
          </h2>
          <p className="text-xs text-[#797a8e] leading-relaxed">
            {mode === "signin" 
              ? "Sign in to like, comment, and support creators with stars." 
              : "Join Khit to follow your favorite creators and customize your experience."}
          </p>
        </div>

        {/* Quick Google Sign In (Solid Button) */}
        <button
          type="button"
          onClick={onClose}
          className="w-full h-12 bg-[#201e2e] hover:bg-[#28263a] border border-white/5 rounded-2xl flex items-center justify-center gap-3 text-xs sm:text-sm font-bold text-white transition-all cursor-pointer shadow-sm active:scale-98"
        >
          {/* Google SVG Logo */}
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="relative my-5 flex items-center justify-center">
          <div className="w-full border-t border-white/5" />
          <span className="absolute bg-[#181624] px-3 text-[11px] font-semibold text-[#797a8e] uppercase tracking-wider">
            or with email
          </span>
        </div>

        {/* Form Inputs (Solid High-Contrast) */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === "signup" && (
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  required
                  placeholder="Min Mahar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 bg-[#12111b] border border-white/10 rounded-2xl pl-11 pr-4 text-xs sm:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#fc5b69] transition-colors"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 bg-[#12111b] border border-white/10 rounded-2xl pl-11 pr-4 text-xs sm:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#fc5b69] transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                Password
              </label>
              {mode === "signin" && (
                <button type="button" className="text-[11px] font-semibold text-[#a042ff] hover:underline">
                  Forgot?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 bg-[#12111b] border border-white/10 rounded-2xl pl-11 pr-11 text-xs sm:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#fc5b69] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 bg-[#8c1cff] hover:bg-[#9d3eff] text-white font-black text-xs sm:text-sm rounded-2xl shadow-[0_5px_20px_rgba(140,28,255,0.35)] transition-all cursor-pointer mt-2"
          >
            <span>{mode === "signin" ? "Sign In" : "Create Account"}</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </form>

        {/* Switch mode footer */}
        <div className="mt-5 pt-4 border-t border-white/5 text-center text-xs text-[#797a8e]">
          {mode === "signin" ? (
            <span>
              Don't have an account?{" "}
              <button 
                onClick={() => setMode("signup")} 
                className="text-white font-bold hover:underline ml-1"
              >
                Sign Up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{" "}
              <button 
                onClick={() => setMode("signin")} 
                className="text-white font-bold hover:underline ml-1"
              >
                Sign In
              </button>
            </span>
          )}
        </div>

      </div>
    </div>
  );
}