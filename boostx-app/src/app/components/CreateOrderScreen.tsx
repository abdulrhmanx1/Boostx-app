"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Upload, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function CreateOrderScreen({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);

  return (
    <motion.div 
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[90] bg-background flex flex-col"
      dir="rtl"
    >
      {/* 🔮 Header */}
      <header className="purple-glass pt-12 pb-4 px-4 flex items-center gap-3 rounded-b-3xl shadow-lg z-20">
        <button onClick={onClose} className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors">
          <ArrowRight className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-black text-white leading-tight">طلب خدمة جديدة</h2>
          <p className="text-[10px] text-[var(--toggle-active)] font-bold mt-0.5">تصميم هوية بصرية كاملة</p>
        </div>
      </header>

      {/* 🟢 Stepper */}
      <div className="px-6 py-6 flex justify-between relative">
        <div className="absolute top-1/2 left-8 right-8 h-1 bg-muted -translate-y-1/2 z-0" />
        <div className="absolute top-1/2 right-8 h-1 bg-accent transition-all duration-500 z-0" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }} />
        
        {[1, 2, 3].map((s) => (
          <div key={s} className={`w-8 h-8 rounded-full flex justify-center items-center font-black text-sm z-10 transition-colors duration-500 ${step >= s ? 'bg-accent text-primary shadow-[0_0_15px_rgba(110,231,183,0.5)]' : 'bg-muted text-muted-foreground border-2 border-border'}`}>
            {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-5">
              <div>
                <label className="text-sm font-black text-foreground mb-2 block">وصف الطلب بالتفصيل</label>
                <textarea rows={5} placeholder="اكتب كل التفاصيل التي تريدها من المستقل..." className="w-full bg-white border border-border rounded-2xl p-4 outline-none focus:border-[var(--toggle-active)] transition-colors text-sm font-medium" />
              </div>
              
              <div>
                <label className="text-sm font-black text-foreground mb-2 block">المرفقات (اختياري)</label>
                <div className="w-full h-24 rounded-2xl border-2 border-dashed border-[var(--toggle-active)]/50 bg-[var(--toggle-active)]/5 flex flex-col items-center justify-center cursor-pointer hover:bg-[var(--toggle-active)]/10 transition-colors text-[var(--toggle-active)]">
                  <Upload className="w-6 h-6 mb-2" />
                  <span className="text-xs font-bold">اضغط لرفع الملفات والصور</span>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-4">
              <h3 className="text-sm font-black text-foreground text-center mb-2">اختر باقة التطوير</h3>
              {[
                { title: "الأساسية", price: "150", desc: "تصميم شعار فقط + تعديل واحد" },
                { title: "المتقدمة", price: "300", desc: "شعار + ورق رسمي + 3 تعديلات", recommended: true },
                { title: "الاحترافية", price: "600", desc: "هوية بصرية كاملة + مفتوح المصدر" }
              ].map((pack, i) => (
                <div key={i} className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${pack.recommended ? 'border-[var(--toggle-active)] bg-[var(--toggle-active)]/5 shadow-sm relative' : 'border-border bg-white hover:border-[var(--toggle-active)]/50'}`}>
                  {pack.recommended && <span className="absolute -top-3 left-4 bg-[var(--toggle-active)] text-white text-[10px] font-black px-2 py-1 rounded-md">نوصي بها</span>}
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-black text-primary">{pack.title}</h4>
                    <span className="font-black text-primary">{pack.price} <span className="text-[10px]">ر.س</span></span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">{pack.desc}</p>
                </div>
              ))}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6">
              <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10 text-center flex flex-col items-center">
                <ShieldCheck className="w-12 h-12 text-accent mb-3" />
                <h3 className="text-lg font-black text-foreground mb-1">الدفع الآمن (Escrow)</h3>
                <p className="text-xs font-bold text-muted-foreground leading-relaxed">أموالك ستعلق في نظام المنصة ولن يتم تسليمها للمستقل إلا بعد استلامك للطلب والموافقة عليه بالكامل.</p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-border shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-bold text-muted-foreground">قيمة الباقة (المتقدمة)</span>
                  <span className="font-black text-primary">300 ر.س</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-bold text-muted-foreground">رسوم المنصة (5%)</span>
                  <span className="font-black text-primary">15 ر.س</span>
                </div>
                <div className="w-full h-[1px] bg-border my-3" />
                <div className="flex justify-between items-center">
                  <span className="text-base font-black text-foreground">الإجمالي</span>
                  <span className="text-xl font-black text-[var(--toggle-active)]">315 ر.س</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 💳 Bottom Action */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-border p-4 pb-safe z-50">
        <button 
          onClick={() => step < 3 ? setStep(step + 1) : onClose()}
          className="w-full rounded-2xl bg-gradient-to-r from-primary to-[var(--toggle-active)] text-white py-4 font-black text-lg flex items-center justify-center shadow-[0_10px_25px_rgba(217,70,239,0.3)] hover:scale-[0.98] transition-transform"
        >
          {step === 1 ? "اختيار الباقة" : step === 2 ? "المتابعة للدفع" : "دفع وإرسال الطلب"}
        </button>
      </div>
    </motion.div>
  );
}
