"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, Lock, Star, Users, Building, ShieldCheck, Mail } from "lucide-react";
import { createClient } from "../../utils/supabase/client";

export default function OnboardingScreen({ onComplete, onGuest }: { onComplete: () => void, onGuest?: () => void }) {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<string | null>(null);
  
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const onboardingData = [
    {
      title: "كل خدماتك في مكان واحد",
      desc: "تصميم، برمجة، تسويق والمزيد.. ابحث عن أفضل المستقلين والوكالات لتنفيذ مشاريعك باحترافية.",
      icon: "🚀"
    },
    {
      title: "تواصل آمن ومحمي",
      desc: "نضمن حقوقك بالكامل! تواصل مباشر داخل التطبيق مع نظام ذكي يمنع تبادل الأرقام لضمان الجودة.",
      icon: "🔐"
    },
    {
      title: "نظام دفع موثوق",
      desc: "أموالك في أمان تام حتى تستلم مشروعك كما طلبت، مع نظام تعليق الأموال (Escrow) الذكي.",
      icon: "💎"
    }
  ];

  const nextStep = () => {
    if (step < 2) setStep(step + 1);
    else setStep(3); // Go to Role Selection
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center overflow-hidden" dir="rtl">
      {/* Dynamic Background Glow */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--toggle-active)] blur-[100px] rounded-full opacity-30 mix-blend-screen pointer-events-none" 
      />
      
      <AnimatePresence mode="wait">
        {step < 3 ? (
          <motion.div 
            key="onboarding"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex flex-col items-center justify-between h-full w-full px-6 py-20 z-10"
          >
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <motion.div 
                key={step}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-48 h-48 rounded-full purple-glass flex justify-center items-center text-8xl mb-12 shadow-[0_0_50px_rgba(217,70,239,0.3)] border border-[var(--toggle-active)]"
              >
                {onboardingData[step].icon}
              </motion.div>
              <h2 className="text-3xl font-black text-foreground mb-4">{onboardingData[step].title}</h2>
              <p className="text-sm font-bold text-muted-foreground leading-relaxed px-4">{onboardingData[step].desc}</p>
            </div>

            <div className="w-full flex flex-col items-center gap-8">
              {/* Pagination Dots */}
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className={`h-2 rounded-full transition-all duration-300 ${step === i ? 'w-8 bg-[var(--toggle-active)] shadow-[0_0_10px_var(--toggle-active)]' : 'w-2 bg-muted-foreground/30'}`} />
                ))}
              </div>

              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={nextStep}
                className="w-full py-4 rounded-2xl bg-primary text-white font-black text-lg shadow-[0_10px_30px_rgba(59,7,100,0.5)] border border-[var(--toggle-active)]/50"
              >
                {step === 2 ? "ابدأ الآن 🚀" : "التالي"}
              </motion.button>
            </div>
          </motion.div>
        ) : step === 3 ? (
          <motion.div 
            key="roles"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center w-full px-6 py-20 z-10 h-full overflow-y-auto"
          >
            <h2 className="text-2xl font-black text-foreground mb-2 text-center">اختر نوع حسابك</h2>
            <p className="text-xs font-bold text-muted-foreground mb-8 text-center">انضم إلى مجتمع BoostX وحدد مسارك</p>

            <div className="w-full flex flex-col gap-4">
              {/* Role 1: Client */}
              <motion.div 
                whileTap={{ scale: 0.98 }}
                onClick={() => setRole("client")}
                className={`p-5 rounded-3xl border-2 transition-all cursor-pointer ${role === 'client' ? 'purple-glass border-[var(--toggle-active)]' : 'bg-white border-border shadow-sm'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${role === 'client' ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
                    <Star className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`font-black text-lg ${role === 'client' ? 'text-white' : 'text-foreground'}`}>عميل</h3>
                    <p className={`text-xs font-bold mt-1 ${role === 'client' ? 'text-white/80' : 'text-muted-foreground'}`}>اطلب خدمات ومشاريع بكل سهولة</p>
                  </div>
                </div>
              </motion.div>

              {/* Role 2: Freelancer */}
              <motion.div 
                whileTap={{ scale: 0.98 }}
                onClick={() => setRole("freelancer")}
                className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col gap-4 ${role === 'freelancer' ? 'purple-glass border-[var(--toggle-active)]' : 'bg-white border-border shadow-sm'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${role === 'freelancer' ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`font-black text-lg ${role === 'freelancer' ? 'text-white' : 'text-foreground'}`}>مستقل (فريلانسر)</h3>
                    <p className={`text-xs font-bold mt-1 ${role === 'freelancer' ? 'text-white/80' : 'text-muted-foreground'}`}>قدم خدماتك واربح من مهاراتك</p>
                  </div>
                </div>
                {role === 'freelancer' && (
                  <motion.select 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="w-full bg-white/10 text-white border border-white/20 rounded-xl p-3 outline-none text-sm font-bold mt-2"
                  >
                    <option className="text-primary" value="">اختر تخصصك الأساسي...</option>
                    <option className="text-primary" value="design">تصميم جرافيك</option>
                    <option className="text-primary" value="dev">برمجة وتطوير</option>
                    <option className="text-primary" value="marketing">تسويق رقمي</option>
                  </motion.select>
                )}
              </motion.div>

              {/* Role 3: Agency */}
              <motion.div 
                whileTap={{ scale: 0.98 }}
                onClick={() => setRole("agency")}
                className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col gap-4 ${role === 'agency' ? 'purple-glass border-[var(--toggle-active)]' : 'bg-white border-border shadow-sm'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${role === 'agency' ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`font-black text-lg ${role === 'agency' ? 'text-white' : 'text-foreground'}`}>وكالة رقمية</h3>
                    <p className={`text-xs font-bold mt-1 ${role === 'agency' ? 'text-white/80' : 'text-muted-foreground'}`}>أدر فريقك ونفذ مشاريع ضخمة</p>
                  </div>
                </div>
                {role === 'agency' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2"
                  >
                    <input 
                      type="number" 
                      placeholder="عدد الموظفين في الوكالة" 
                      className="w-full bg-white/10 text-white placeholder:text-white/50 border border-white/20 rounded-xl p-3 outline-none text-sm font-bold"
                    />
                  </motion.div>
                )}
              </motion.div>
            </div>

            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={() => role && setStep(4)}
              disabled={!role}
              className={`w-full py-4 rounded-2xl mt-8 font-black text-lg transition-all ${role ? 'bg-primary text-white shadow-[0_10px_30px_rgba(59,7,100,0.5)] border border-[var(--toggle-active)]/50' : 'bg-muted text-muted-foreground'}`}
            >
              متابعة
            </motion.button>
          </motion.div>
        ) : (
          <motion.div 
            key="login"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center w-full px-6 py-20 z-10 h-full"
          >
            <div className="w-20 h-20 rounded-2xl bg-primary flex justify-center items-center mb-8 shadow-xl border border-[var(--toggle-active)]/50">
              <ShieldCheck className="w-10 h-10 text-accent" />
            </div>
            <h2 className="text-3xl font-black text-foreground mb-2">تسجيل الدخول</h2>
            <p className="text-sm font-bold text-muted-foreground mb-12 text-center">سجل دخولك الآن للبدء في تلقي الخدمات وإدارتها</p>

            {showEmailForm ? (
              <div className="w-full flex flex-col gap-4">
                <input 
                  type="text" 
                  placeholder="الاسم الكامل" 
                  value={fullName} 
                  onChange={e => setFullName(e.target.value)} 
                  className="w-full p-4 rounded-2xl bg-white border border-border outline-none focus:border-[var(--toggle-active)] text-sm font-bold text-foreground shadow-sm" 
                />
                <input 
                  type="email" 
                  placeholder="البريد الإلكتروني" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  className="w-full p-4 rounded-2xl bg-white border border-border outline-none focus:border-[var(--toggle-active)] text-sm font-bold text-foreground shadow-sm" 
                />
                <input 
                  type="password" 
                  placeholder="الرقم السري" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="w-full p-4 rounded-2xl bg-white border border-border outline-none focus:border-[var(--toggle-active)] text-sm font-bold text-foreground shadow-sm" 
                />
                <button 
                  onClick={async () => {
                    if (!email || !password || !fullName) return alert("يرجى إكمال جميع الحقول");
                    setLoading(true);
                    const supabase = createClient();
                    const { data, error } = await supabase.auth.signUp({
                      email,
                      password,
                      options: {
                        data: {
                          full_name: fullName,
                          account_type: role === "client" ? "CLIENT" : role === "freelancer" ? "FREELANCER" : "AGENCY_OWNER"
                        }
                      }
                    });
                    setLoading(false);
                    if (error) {
                      alert("حدث خطأ: " + error.message);
                    } else {
                      // Successfully signed up!
                      onComplete();
                    }
                  }}
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-[var(--toggle-active)] text-white font-black text-lg mt-2 shadow-[0_10px_25px_rgba(217,70,239,0.3)] hover:scale-[0.98] transition-transform disabled:opacity-50"
                >
                  {loading ? "جاري التسجيل..." : "إنشاء حساب"}
                </button>
                <button onClick={() => setShowEmailForm(false)} className="text-xs font-bold text-muted-foreground mt-2 underline text-center w-full">رجوع للخيارات السابقة</button>
              </div>
            ) : (
              <div className="w-full flex flex-col gap-4">
                <button onClick={onComplete} className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-white border border-border shadow-sm font-bold text-foreground hover:bg-muted transition-colors">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                  الدخول بواسطة Google
                </button>
                
                <button onClick={onComplete} className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-black border border-black shadow-sm font-bold text-white hover:bg-zinc-800 transition-colors">
                  <img src="https://www.svgrepo.com/show/511330/apple-173.svg" className="w-5 h-5 filter invert" alt="Apple" />
                  الدخول بواسطة Apple
                </button>
                
                <div className="relative flex items-center py-4">
                  <div className="flex-grow border-t border-border"></div>
                  <span className="flex-shrink-0 mx-4 text-xs font-bold text-muted-foreground">أو</span>
                  <div className="flex-grow border-t border-border"></div>
                </div>

                <button onClick={() => setShowEmailForm(true)} className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-muted border border-border shadow-sm font-bold text-foreground hover:bg-border transition-colors">
                  <Mail className="w-5 h-5 text-primary" />
                  الاستمرار بالبريد الإلكتروني
                </button>

                {onGuest && (
                  <button onClick={onGuest} className="mt-4 text-xs font-bold text-muted-foreground hover:text-primary transition-colors underline">
                    الدخول كزائر (تصفح فقط)
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
