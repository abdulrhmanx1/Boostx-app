"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Wallet, ArrowUpRight, ArrowDownLeft, Plus, History, ChevronLeft, CreditCard, X, Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function WalletScreen({ onClose }: { onClose: () => void }) {
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("100");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleTopUp = () => {
    setIsProcessing(true);
    // Simulate payment gateway delay
    setTimeout(() => {
      setIsProcessing(false);
      setShowTopUp(false);
      setShowSuccess(true);
    }, 2000);
  };

  const transactions = [
    { id: 1, type: 'IN', title: 'شحن رصيد محفظة', amount: '+500', date: '20 مايو، 2024', status: 'مكتمل' },
    { id: 2, type: 'OUT', title: 'شراء خدمة: تصميم شعار', amount: '-150', date: '18 مايو، 2024', status: 'مكتمل' },
    { id: 3, type: 'IN', title: 'أرباح طلب #1024', amount: '+450', date: '15 مايو، 2024', status: 'مكتمل' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      className="fixed inset-0 z-[130] bg-zinc-50 flex flex-col"
      dir="rtl"
    >
      {/* 🔮 Header Card */}
      <header className="bg-primary pt-16 pb-12 px-6 rounded-b-[3rem] relative overflow-hidden shadow-2xl shadow-primary/20">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <button onClick={onClose} className="absolute top-12 left-4 p-2 bg-white/10 rounded-full text-white"><ChevronLeft className="w-6 h-6 rtl:-scale-x-100" /></button>
        
        <div className="relative z-10 text-center">
          <p className="text-white/70 font-black text-xs uppercase tracking-widest mb-2">الرصيد الكلي</p>
          <h1 className="text-4xl font-black text-white mb-8">2,450.00 <span className="text-lg opacity-60">ر.س</span></h1>
          
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => setShowTopUp(true)}
              className="flex-1 max-w-[140px] py-4 bg-white text-primary rounded-2xl font-black text-xs shadow-xl flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> شحن الرصيد
            </button>
            <button className="flex-1 max-w-[140px] py-4 bg-primary-foreground/10 border border-white/20 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2">
              <ArrowUpRight className="w-4 h-4" /> سحب الأموال
            </button>
          </div>
        </div>
      </header>

      {/* 📊 Transactions */}
      <div className="flex-1 overflow-y-auto px-6 py-8 no-scrollbar">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-black text-zinc-800 flex items-center gap-2"><History className="w-5 h-5 text-primary" /> السجل المالي</h3>
          <button className="text-[10px] font-black text-muted-foreground uppercase">فلترة</button>
        </div>

        <div className="flex flex-col gap-4 pb-24">
          {transactions.map((t) => (
            <div key={t.id} className="bg-white p-5 rounded-3xl border border-zinc-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${t.type === 'IN' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  {t.type === 'IN' ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                </div>
                <div>
                  <h4 className="text-sm font-black text-zinc-800">{t.title}</h4>
                  <p className="text-[10px] font-bold text-zinc-400 mt-0.5">{t.date} • {t.status}</p>
                </div>
              </div>
              <span className={`text-sm font-black ${t.type === 'IN' ? 'text-green-500' : 'text-zinc-800'}`}>{t.amount} ر.س</span>
            </div>
          ))}
        </div>
      </div>

      {/* 💳 Top Up Modal */}
      <AnimatePresence>
        {showTopUp && (
          <div className="fixed inset-0 z-[150] bg-black/80 flex items-center justify-center p-6 backdrop-blur-md">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm relative">
              <button onClick={() => setShowTopUp(false)} className="absolute top-6 left-6 p-2 bg-zinc-50 rounded-full text-zinc-400"><X className="w-4 h-4" /></button>
              
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black">شحن المحفظة</h3>
                <p className="text-[10px] text-zinc-400 font-bold mt-1">اشحن رصيدك لتبدأ بشراء الخدمات فوراً.</p>
              </div>

              <div className="flex flex-col gap-6 text-right">
                <div>
                  <label className="text-[10px] font-black text-zinc-400 block mb-2 px-1">المبلغ المطلوب (ر.س)</label>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {['100', '500', '1000'].map(amt => (
                      <button 
                        key={amt} 
                        onClick={() => setTopUpAmount(amt)}
                        className={`py-2 rounded-xl text-xs font-black border-2 transition-all ${topUpAmount === amt ? 'bg-primary text-white border-primary shadow-lg' : 'bg-zinc-50 border-transparent text-zinc-500'}`}
                      >{amt}</button>
                    ))}
                  </div>
                  <input 
                    type="number" 
                    value={topUpAmount}
                    onChange={e => setTopUpAmount(e.target.value)}
                    className="w-full bg-zinc-50 border-none p-4 rounded-2xl text-center font-black text-primary text-lg outline-none" 
                  />
                </div>

                <div className="space-y-4">
                  <div className="bg-zinc-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-8">
                        <CreditCard className="w-8 h-8 text-white/50" />
                        <span className="text-[8px] font-black uppercase opacity-50 tracking-widest">BoostX Pay</span>
                      </div>
                      <p className="text-lg font-black tracking-[0.2em] mb-4">**** **** **** 4452</p>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[8px] opacity-40 uppercase font-black">Holder Name</p>
                          <p className="text-[10px] font-black uppercase">Abdulaziz Al-Saud</p>
                        </div>
                        <p className="text-[10px] font-black">12/26</p>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleTopUp}
                  disabled={isProcessing}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/30 flex items-center justify-center gap-2 mt-2"
                >
                  {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : `دفع ${topUpAmount} ر.س الآن`}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🎉 Success Celebration */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-[160] bg-black/90 flex items-center justify-center p-6 backdrop-blur-xl text-center">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2.5rem] p-8 max-w-sm">
              <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/40">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black mb-2">تم الشحن بنجاح!</h3>
              <p className="text-sm text-muted-foreground font-bold mb-8 leading-relaxed">رصيدك الجديد هو 3,450.00 ر.س. يمكنك الآن الاستمتاع بخدمات المنصة.</p>
              <button onClick={() => setShowSuccess(false)} className="w-full py-4 bg-primary text-white rounded-2xl font-black shadow-xl">موافق</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
