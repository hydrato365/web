"use client";

import React from "react";
import { ShieldCheck, X } from "lucide-react";

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
}

export function RulesModal({ isOpen, onClose, onAgree }: RulesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
      />
      
      <div className="relative w-full max-w-lg bg-[#181628] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 space-y-5 text-white max-h-[85vh] overflow-y-auto scrollbar-none animate-in fade-in zoom-in-95">
        
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="text-base sm:text-lg font-black">Khit Pass စည်းမျဉ်းနှင့် မူဝါဒများ</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs text-zinc-300 leading-relaxed">
          
          <div className="p-3.5 rounded-2xl bg-[#131224] border border-white/5 space-y-1">
            <h4 className="font-bold text-white text-xs">၁။ ကျေးဇူးတုံ့ပြန်ဆု မူဝါဒ (Loyalty Reward)</h4>
            <p className="text-zinc-400">Khit Pass သည် ဖန်တီးရှင်များကို ထောက်ပံ့ကြည့်ရှုသည့် Membership ဝန်ဆောင်မှုဖြစ်ပြီး ၁၀% ဆုငွေသည် လောင်းကစား/ထီ သီးသန့်မဟုတ်ဘဲ အားပေးသူများအား ကျေးဇူးတုံ့ပြန်သည့် ပရိုမိုးရှင်းဆု ဖြစ်ပါသည်။</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#131224] border border-white/5 space-y-1">
            <h4 className="font-bold text-white text-xs">၂။ အကောင့်သတ်မှတ်ချက် (Anti-Abuse)</h4>
            <p className="text-zinc-400">KPay/WavePay အကောင့်တစ်ခုလျှင် Pass ၁ ခုသာ အကျုံးဝင်မည်ဖြစ်ပြီး မဲဖောက်သည့်နေ့တွင် Active ဖြစ်နေသော အဖွဲ့ဝင်များသာ ကံစမ်းခွင့်ရရှိပါမည်။</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#131224] border border-white/5 space-y-1">
            <h4 className="font-bold text-white text-xs">၃။ ငွေပြန်အမ်းမှု မရှိခြင်း (Non-Refundable)</h4>
            <p className="text-zinc-400">လစဉ်ကြေး၏ ၈၀% ကို Creator များထံ ချက်ချင်း ခွဲဝေပေးအပ်ထားပြီး ဖြစ်သဖြင့် မည်သည့်အကြောင်းနှင့်မျှ ငွေပြန်အမ်းပေးမည် မဟုတ်ပါ။</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#131224] border border-white/5 space-y-1">
            <h4 className="font-bold text-white text-xs">၄။ ဆုငွေထုတ်ယူခြင်းနှင့် သက်တမ်း (Rollover)</h4>
            <p className="text-zinc-400">ကံထူးရှင်များကို ၃ ရက်အတွင်း တိုက်ရိုက်လွှဲပေးမည်ဖြစ်ပြီး ၇ ရက်အတွင်း ဆက်သွယ်အတည်မပြုနိုင်ပါက အဆိုပါငွေကို နောက်လဆုကြေးထဲ ထည့်ပေါင်းသွားပါမည်။</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#131224] border border-white/5 space-y-1">
            <h4 className="font-bold text-white text-xs">၅။ လုံခြုံရေးနှင့် အဆုံးအဖြတ် (Fair Play)</h4>
            <p className="text-zinc-400">ကံထူးရှင်များ၏ လုံခြုံရေးအတွက် အချက်အလက်များကို Public တွင် လုံးဝမထုတ်ပြန်ဘဲ လျှို့ဝှက်လွှဲအပ်ပြီး ပလက်ဖောင်း၏ အဆုံးအဖြတ်သာ အတည်ဖြစ်ပါသည်။</p>
          </div>

        </div>

        <div className="pt-2 border-t border-white/5 flex gap-3">
          <button
            type="button"
            onClick={onAgree}
            className="w-full h-11 bg-[#8c1cff] hover:bg-[#9d3eff] text-white font-black text-xs rounded-xl shadow-lg cursor-pointer transition-colors"
          >
            ဖတ်ရှုနားလည်ပြီး သဘောတူပါသည်
          </button>
        </div>

      </div>
    </div>
  );
}