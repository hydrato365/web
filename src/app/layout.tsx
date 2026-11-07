import type { Metadata } from "next";
import { Inter, Noto_Sans_Myanmar } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { Header } from "@/components/layout/header";
import { PullToRefresh } from "@/components/layout/pull-to-refresh";
import { Suspense } from "react";
import NextTopLoader from "nextjs-toploader";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoSansMyanmar = Noto_Sans_Myanmar({ weight: ["400", "500", "700"], subsets: ["myanmar"], variable: "--font-myanmar" });

import type { Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
};

export const metadata: Metadata = {
  title: "KHIT.TO",
  description: "Premium Streaming Platform",
};

export const instant = false;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className="dark">
      <body className={`${inter.variable} ${notoSansMyanmar.variable} antialiased bg-[#131224] text-white`}>
        <NextIntlClientProvider messages={messages}>
          
          {/* 🌟 NextTopLoader (Page Navigation Progress Bar) */}
          <NextTopLoader
            color="#8c1cff"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 15px #8c1cff,0 0 5px #8c1cff"
            zIndex={99999}
          />

          <div className="flex min-h-screen w-full">
            {/* 
              🌟 Next.js 15 ၏ usePathname Error ကို ဖြေရှင်းရန် 
              Sidebar အား Suspense ဖြင့် အုပ်ပေးထားသည် 
            */}
            <Suspense fallback={<aside className="hidden md:flex w-20 bg-[#131224] h-screen shrink-0 z-50 sticky top-0" />}>
              <Sidebar />
            </Suspense>

            <Suspense fallback={null}>
              <MobileBottomNav />
            </Suspense>

            <div className="flex-1 flex flex-col min-h-screen relative w-full overflow-x-clip">
              {/* Header အားလည်း နောင်တစ်ချိန် Error ကင်းစေရန် Suspense ဖြင့် အုပ်ထားပါသည် */}
              <Suspense fallback={null}>
                <Header />
              </Suspense>

              {/* Dynamic Pages (Home, Watch စသည်တို့ ဤနေရာတွင် ပေါ်မည်) */}
              <PullToRefresh>
                {children}
              </PullToRefresh>
            </div>
          </div>

        </NextIntlClientProvider>
      </body>
    </html>
  );
}