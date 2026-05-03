"use client";

import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import { Coins, CheckCircle2, ShieldCheck, Zap } from "lucide-react";

export default function WalletPage() {
  const { user } = useAuthStore();

  const packages = [
    { coins: 50, price: 150, currency: "SAR", popular: false },
    { coins: 200, price: 500, currency: "SAR", popular: true, bonus: "+20 كوينز مجاناً" },
    { coins: 1000, price: 2000, currency: "SAR", popular: false, bonus: "+150 كوينز مجاناً" },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex justify-between items-end"
      >
        <div>
          <h1 className="text-3xl font-extrabold text-primary mb-2">المحفظة والكوينز</h1>
          <p className="text-muted-foreground">اشحن رصيدك لتتمكن من التواصل مع العملاء المباشرين</p>
        </div>
        
        <div className="bg-primary text-primary-foreground p-6 rounded-3xl shadow-xl flex items-center gap-6">
          <div className="p-4 bg-white/10 rounded-2xl">
            <Coins className="w-10 h-10 text-accent" />
          </div>
          <div>
            <p className="text-sm text-primary-foreground/80 mb-1">الرصيد الحالي</p>
            <div className="text-4xl font-extrabold flex items-center gap-2">
              {user?.coins || 0} <span className="text-xl font-normal">كوينز</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {packages.map((pkg, i) => (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            key={i}
            className={`relative bg-background rounded-3xl p-8 border-2 transition-all hover:scale-105 cursor-pointer ${
              pkg.popular ? "border-accent shadow-2xl shadow-accent/20" : "border-border hover:border-primary/50"
            }`}
          >
            {pkg.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
                <Zap className="w-4 h-4" /> الخيار الأفضل
              </div>
            )}
            
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-primary mb-2 flex justify-center items-center gap-2">
                {pkg.coins} <Coins className="w-6 h-6 text-accent" />
              </h3>
              {pkg.bonus && <p className="text-sm font-bold text-green-600 mb-4">{pkg.bonus}</p>}
              <div className="text-4xl font-extrabold text-primary">
                {pkg.price} <span className="text-lg text-muted-foreground">{pkg.currency}</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-5 h-5 text-accent" /> الوصول لمعلومات العملاء
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-5 h-5 text-accent" /> رسائل مباشرة للعملاء
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="w-5 h-5 text-accent" /> دعم فني أولوية
              </li>
            </ul>

            <button className={`w-full py-4 rounded-full font-bold transition-all ${
              pkg.popular 
                ? "bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/30" 
                : "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
            }`}>
              شراء الآن
            </button>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 bg-muted/50 rounded-3xl p-8 border border-border">
        <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
          <ShieldCheck /> بوابات الدفع المدعومة
        </h3>
        <p className="text-muted-foreground mb-6">نحن ندعم أحدث بوابات الدفع وأكثرها أماناً في المنطقة.</p>
        <div className="flex gap-4 flex-wrap">
          <div className="px-6 py-3 bg-white rounded-xl border border-border shadow-sm font-bold text-red-600">Vodafone Cash</div>
          <div className="px-6 py-3 bg-white rounded-xl border border-border shadow-sm font-bold text-[#00d1b2]">Tap Payments</div>
          <div className="px-6 py-3 bg-white rounded-xl border border-border shadow-sm font-bold text-[#635bff]">Stripe</div>
        </div>
      </div>
    </div>
  );
}
