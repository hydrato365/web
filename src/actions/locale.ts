"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function switchLocale(newLocale: string) {
  const cookieStore = await cookies();
  cookieStore.set("NEXT_LOCALE", newLocale, {
    path: "/",
    maxAge: 31536000,
    // 🌟 Subdomain တွေဖြစ်တဲ့ (e.g., dashboard.khit.to, creator.khit.to) အားလုံးမှာ Language Cookie အတူတူ အလုပ်လုပ်စေရန်
    domain: process.env.NODE_ENV === "production" ? ".khit.to" : undefined, 
  });
  
  // 🌟 ဤစာကြောင်းက အရေးအကြီးဆုံးဖြစ်ပါသည်။ (Cache အဟောင်းများကို ရှင်းလင်းပေးပါမည်)
  revalidatePath("/", "layout");
}