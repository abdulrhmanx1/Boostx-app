"use client";

import { motion } from "framer-motion";
import { UserPlus, Briefcase, Users, ArrowRight } from "lucide-react";
import { useAuthStore, UserRole } from "@/store/authStore";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  const handleDemoLogin = (role: UserRole) => {
    // Mock user data based on role
    const mockUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: role === 'CLIENT' ? 'عبدالرحمن العميل' : role === 'FREELANCER' ? 'أحمد المستقل' : 'وكالة الإبداع',
      email: `${role?.toLowerCase()}@boostx.com`,
      role: role,
      coins: role !== 'CLIENT' ? 100 : undefined,
    };
    
    login(mockUser);
    router.push('/dashboard');
  };

  return (
    <main className="min-h-screen w-full bg-background flex flex-col justify-center items-center relative overflow-hidden p-4">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[100px] rounded-full pointer-events-none" />

      <Link href="/" className="absolute top-8 right-8 flex items-center gap-2 text-primary font-bold hover:text-accent transition-colors">
        <ArrowRight className="w-5 h-5" />
        العودة للرئيسية
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md glass-panel p-8 rounded-3xl z-10"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-primary mb-2">تسجيل الدخول</h1>
          <p className="text-muted-foreground">اختر نوع حسابك للمتابعة (نسخة تجريبية)</p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={() => handleDemoLogin('CLIENT')}
            className="w-full p-4 rounded-2xl border-2 border-primary/10 hover:border-accent hover:bg-accent/5 transition-all flex items-center gap-4 text-right group"
          >
            <div className="p-3 bg-primary/5 rounded-xl group-hover:bg-accent/20 transition-colors">
              <UserPlus className="w-6 h-6 text-primary group-hover:text-accent" />
            </div>
            <div>
              <h3 className="font-bold text-primary text-lg">حساب عميل</h3>
              <p className="text-sm text-muted-foreground">لطلب الخدمات وتصفح الأعمال</p>
            </div>
          </button>

          <button 
            onClick={() => handleDemoLogin('FREELANCER')}
            className="w-full p-4 rounded-2xl border-2 border-primary/10 hover:border-primary hover:bg-primary/5 transition-all flex items-center gap-4 text-right group"
          >
            <div className="p-3 bg-primary/5 rounded-xl group-hover:bg-primary/20 transition-colors">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-primary text-lg">حساب مستقل</h3>
              <p className="text-sm text-muted-foreground">لتقديم الخدمات واستقبال المشاريع</p>
            </div>
          </button>

          <button 
            onClick={() => handleDemoLogin('AGENCY')}
            className="w-full p-4 rounded-2xl border-2 border-primary/10 hover:border-primary hover:bg-primary/5 transition-all flex items-center gap-4 text-right group"
          >
            <div className="p-3 bg-primary/5 rounded-xl group-hover:bg-primary/20 transition-colors">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-primary text-lg">حساب وكالة</h3>
              <p className="text-sm text-muted-foreground">لإدارة فريقك والمشاريع الكبرى</p>
            </div>
          </button>
        </div>
      </motion.div>
    </main>
  );
}
