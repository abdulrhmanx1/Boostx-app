"use client";

import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, ShieldCheck, ChevronLeft, LogOut, Camera, Star, Award, BadgeCheck, X, FileText, CheckCircle, RefreshCw } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useState } from "react";

export default function ProfileScreen({ onClose }: { onClose: () => void }) {
  const { user, setGuestMode } = useAuthStore();
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleLogout = () => {
    setGuestMode(false);
    onClose();
  };

  const handleVerifyRequest = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      className="fixed inset-0 z-[130] bg-zinc-50 flex flex-col"
      dir="rtl"
    >
      {/* 🔮 Profile Header */}
      <header className="purple-glass pt-16 pb-12 px-6 rounded-b-[3rem] relative shadow-2xl">
        <button onClick={onClose} className="absolute top-12 left-4 p-2 bg-white/10 rounded-full text-white"><ChevronLeft className="w-6 h-6 rtl:-scale-x-100" /></button>
        
        <div className="flex flex-col items-center">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full border-4 border-white/30 p-1 shadow-2xl overflow-hidden relative">
              <img src={user?.user_metadata?.avatar_url || "https://i.pravatar.cc/150?img=11"} className="w-full h-full rounded-full object-cover" />
            </div>
            <button className="absolute bottom-1 right-1 p-2 bg-white text-primary rounded-full shadow-lg border border-zinc-100"><Camera className="w-4 h-4" /></button>
          </div>
          <h2 className="text-2xl font-black text-white mt-4">{user?.user_metadata?.full_name || "زائر بوست"}</h2>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-white/60 text-xs font-bold">{user?.user_metadata?.account_type || "CLIENT"}</p>
            <BadgeCheck className="w-4 h-4 text-accent" />
          </div>
        </div>
      </header>

      {/* 📊 Verification Status Banner */}
      <div className="px-6 -mt-6 relative z-30">
        <motion.div 
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowVerifyModal(true)}
          className="bg-white rounded-3xl p-5 shadow-xl border border-zinc-100 flex items-center justify-between cursor-pointer group overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1 bg-accent h-full group-hover:w-full group-hover:opacity-5 transition-all duration-500"></div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-sm font-black text-zinc-800">توثيق الحساب (Verified)</h4>
              <p className="text-[10px] font-bold text-muted-foreground mt-0.5">احصل على شارة الثقة لرفع مبيعاتك.</p>
            </div>
          </div>
          <ChevronLeft className="w-5 h-5 text-zinc-300 rtl:-scale-x-100 relative z-10" />
        </motion.div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8 no-scrollbar flex flex-col gap-6">
        {/* Profile Details */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-zinc-100 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400"><User className="w-5 h-5" /></div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-zinc-400 uppercase">الاسم الكامل</p>
              <p className="text-sm font-black text-zinc-800">{user?.user_metadata?.full_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-400"><Mail className="w-5 h-5" /></div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-zinc-400 uppercase">البريد الإلكتروني</p>
              <p className="text-sm font-black text-zinc-800">{user?.email}</p>
            </div>
          </div>
        </div>

        <button onClick={handleLogout} className="w-full py-4 bg-red-50 text-red-500 rounded-2xl font-black text-sm flex items-center justify-center gap-2 mt-auto">
          <LogOut className="w-5 h-5" /> تسجيل الخروج
        </button>
      </div>

      {/* ✅ Verification Request Modal */}
      <AnimatePresence>
        {showVerifyModal && (
          <div className="fixed inset-0 z-[150] bg-black/80 flex items-center justify-center p-6 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm relative text-center">
              <button onClick={() => setShowVerifyModal(false)} className="absolute top-6 left-6 p-2 bg-zinc-50 rounded-full text-zinc-400"><X className="w-4 h-4" /></button>
              
              {!isSubmitted ? (
                <>
                  <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black mb-1">اطلب توثيق هويتك</h3>
                  <p className="text-[10px] text-zinc-400 font-bold mb-8 px-4 leading-relaxed">للحصول على شارة التوثيق، يرجى إرفاق صورة الهوية الوطنية أو السجل التجاري للوكالة.</p>

                  <div className="flex flex-col gap-4 text-right mb-8">
                    <div className="p-6 border-2 border-dashed border-zinc-200 rounded-2xl bg-zinc-50 text-center flex flex-col items-center gap-2 cursor-pointer hover:border-accent transition-colors">
                      <FileText className="w-8 h-8 text-zinc-400" />
                      <span className="text-[10px] font-black text-zinc-500">رفع صورة الهوية / السجل</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleVerifyRequest}
                    disabled={isSubmitting}
                    className="w-full py-4 bg-accent text-white rounded-2xl font-black shadow-xl shadow-accent/20 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <RefreshCw className="w-5 h-5 animate-spin" /> : "تقديم الطلب للمراجعة"}
                  </button>
                </>
              ) : (
                <div className="py-6">
                  <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/30">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black mb-1">تم التقديم بنجاح!</h3>
                  <p className="text-[10px] text-zinc-400 font-bold mb-8 leading-relaxed">طلبك قيد المراجعة حالياً من قبل الإدارة. سيصلك إشعار فور الموافقة.</p>
                  <button onClick={() => setShowVerifyModal(false)} className="w-full py-4 bg-primary text-white rounded-2xl font-black shadow-xl">فهمت ذلك</button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
