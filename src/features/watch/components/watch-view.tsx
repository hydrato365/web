"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { MobileTabs } from "@/features/watch/components/mobile-tabs";
import { MobilePlayer } from "@/features/watch/components/mobile-player";
import { DesktopView } from "@/features/watch/components/desktop-view";

export function WatchView() {
  const router = useRouter();
  const params = useParams();
  
  const videoId = String(params?.id || "");
  const [videoData, setVideoData] = useState<{
    title: string;
    video_url: string;
    views: number;
    description?: string;
    created_at?: string;
  } | null>(null);

  useEffect(() => {
    if (!videoId) return;
    fetch(`https://backend-tester-3glc.onrender.com/videos/${videoId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.video_url) {
          setVideoData(data);
        }
      })
      .catch((err) => console.error("Error loading video details:", err));
  }, [videoId]);

  const videoUrl = videoData?.video_url || "";

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobileInputFocused, setIsMobileInputFocused] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showFAB, setShowFAB] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll ကိုစစ်ဆေးပြီး FAB အဖွင့်အပိတ်လုပ်ရန်
  useEffect(() => {
    const scrollArea = document.getElementById("main-scroll-area") || window;
    const handleScroll = () => {
      const scrollTop = (scrollArea as HTMLElement).scrollTop || window.scrollY;
      setShowFAB(scrollTop > 400); // 400px အောက်ရောက်မှ ခလုတ်ပေါ်မည်
    };
    scrollArea.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollArea.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard ဖျောက်လိုက်ချိန် (Screen Height ပြန်တက်လာချိန်) တွင် Input Focus ကို အလိုအလျောက် ဖြုတ်ပေးရန်
  useEffect(() => {
    let lastHeight = window.innerHeight;
    const handleResize = () => {
      const currentHeight = window.innerHeight;
      // မျက်နှာပြင်အမြင့် သိသိသာသာ ပြန်တက်လာလျှင် (Keyboard ပိတ်သွားလျှင်)
      if (currentHeight > lastHeight + 50) { 
        if (document.activeElement?.tagName === 'INPUT') {
          (document.activeElement as HTMLElement).blur();
        }
      }
      lastHeight = currentHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"upnext" | "description" | "comments">("upnext");
  
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: "Wijaya Abadi", online: true, check: true, avatar: "from-purple-500 to-indigo-500", text: "Duis aute irure dolor in in proident velit esse cillum dolore eu fugiat" },
    { id: 2, user: "Johny Wise", online: false, check: false, avatar: "from-blue-600 to-blue-800", text: "tempor incididunt ut labore" },
    { id: 3, user: "Budi Hakim", online: true, check: true, avatar: "from-orange-500 to-red-500", text: "Duis aute irure dolor in in proident velit esse cillum dolore eu fugiat" },
    { id: 4, user: "Thomas Hope", online: true, check: false, avatar: "from-yellow-600 to-amber-800", text: "velit esse cillum dolore eu fugiat" },
    { id: 5, user: "Kyaw Zayar", online: false, check: true, avatar: "from-teal-500 to-emerald-700", text: "အရမ်းမိုက်တယ် အကိုရေ။ နောက်ထပ်အပိုင်းတွေ မျှော်နေပါတယ်။" },
    { id: 6, user: "Su Myat", online: true, check: false, avatar: "from-pink-500 to-rose-700", text: "Thanks for the great recap! ❤️" },
    { id: 7, user: "Aung Kaung", online: true, check: true, avatar: "from-cyan-500 to-blue-700", text: "Nolan ရဲ့ ရုပ်ရှင်တွေက အမြဲတမ်း ဉီးနှောက်စားတယ်ဗျာ။ ရှင်းပြပေးတာ ကျေးဇူးပါ။" },
    { id: 8, user: "Zin Mar", online: false, check: false, avatar: "from-fuchsia-500 to-purple-700", text: "I watched this movie 3 times and still didn't get it until this recap. 😂" },
    { id: 9, user: "Ko Htet", online: true, check: true, avatar: "from-slate-600 to-slate-900", text: "Interstellar လေးပါ လုပ်ပေးပါလား အကို" },
    { id: 10, user: "May Thazin", online: true, check: false, avatar: "from-lime-500 to-green-700", text: "ဒီကားက sound design တကယ်ကြမ်းတာ။" },
    { id: 11, user: "Lin Htet", online: false, check: false, avatar: "from-red-500 to-red-800", text: "Amazing explanation! Keep up the good work." },
    { id: 12, user: "Thura Aung", online: true, check: true, avatar: "from-violet-500 to-fuchsia-700", text: "ရုပ်ရှင်မကြည့်ရသေးဘဲ စပွိုင်လာ အကုန်မိသွားပြီ 🥲" },
    { id: 13, user: "Nandar", online: true, check: false, avatar: "from-amber-400 to-orange-600", text: "Cillian Murphy ရဲ့ acting က တကယ် Oscar နဲ့ ထိုက်တန်ပါတယ်။" },
    { id: 14, user: "Phyo Min", online: false, check: true, avatar: "from-sky-400 to-indigo-600", text: "Thank you for spending time to make this quality content for us." },
    { id: 15, user: "Ye Yint", online: true, check: false, avatar: "from-stone-500 to-stone-800", text: "အသံထွက်လေးတွေပါ မှန်အောင် ရွတ်ပြတာ သဘောကျလို့ပါ။" },
    { id: 16, user: "Khin Wint", online: false, check: false, avatar: "from-rose-400 to-red-600", text: "Love from Mandalay! 🇲🇲" },
    { id: 17, user: "Myo Ko", online: true, check: true, avatar: "from-zinc-500 to-zinc-800", text: "နောက်ထပ် ဒီလို သမိုင်းနောက်ခံကားတွေ အများကြီး တင်ပေးပါဦး။" },
    { id: 18, user: "Wai Yan", online: true, check: false, avatar: "from-emerald-400 to-teal-600", text: "Christopher Nolan is a genius. No cap." },
    { id: 19, user: "Hsu Myat", online: false, check: true, avatar: "from-pink-400 to-fuchsia-600", text: "မိုက်တယ်ဗျာ အသေးစိတ်ကို ရှင်းပြထားတာ။" },
    { id: 20, user: "Zayar Lin", online: true, check: false, avatar: "from-blue-400 to-cyan-600", text: "Waiting for the next stream!" },
  ]);

  const handleDownload = (quality: string) => {
    setIsDownloadOpen(false);
    setDownloadProgress(quality);
    setTimeout(() => setDownloadProgress(null), 3000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    setChatMessages([...chatMessages, {
      id: Date.now(),
      user: "Thomas (You)",
      online: true,
      check: true,
      avatar: "from-amber-600 to-red-600",
      text: inputMessage
    }]);
    setInputMessage("");
  };

  return (
    <>
      {/* 📱 PHONE VIEW (ဖုန်းပေါ်တွင်သာ သီးသန့် အလုပ်လုပ်မည်) */}
      {isMounted && !isDesktop && (
        <div className="flex flex-col pb-20 w-full relative z-10">
          
          <MobilePlayer
            videoUrl={videoUrl}
            videoData={videoData}
            activeTab={activeTab}
            isMobileInputFocused={isMobileInputFocused}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            isLiked={isLiked}
            setIsLiked={setIsLiked}
          />

          {/* Wrapper for Tabs */}
          <div className="flex flex-col px-4">

            <MobileTabs 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isMobileInputFocused={isMobileInputFocused}
              setIsMobileInputFocused={setIsMobileInputFocused}
              showFAB={showFAB}
              chatMessages={chatMessages}
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              handleSendMessage={handleSendMessage}
              videoData={videoData}
            />
          </div>
        </div>
      )}

      {/* 💻 PC VIEW (PC ပေါ်တွင်သာ သီးသန့် အလုပ်လုပ်မည်) */}
      {isMounted && isDesktop && (
        <DesktopView 
          videoUrl={videoUrl}
          videoData={videoData}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          isDownloadOpen={isDownloadOpen}
          setIsDownloadOpen={setIsDownloadOpen}
          downloadProgress={downloadProgress}
          handleDownload={handleDownload}
          isLiked={isLiked}
          setIsLiked={setIsLiked}
          chatMessages={chatMessages}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
        />
      )}

    </>
  );
}