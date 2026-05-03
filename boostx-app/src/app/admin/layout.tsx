"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, Settings, LogOut, DollarSign, List, Rss, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // In a real app, verify if role is ADMIN
  }, [isAuthenticated, router]);

  if (!isMounted) return null;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const menuLinks = [
    { icon: <LayoutDashboard />, label: "الرئيسية المالية", href: "/admin" },
    { icon: <List />, label: "إدارة الخدمات والتصنيفات", href: "/admin/categories" },
    { icon: <DollarSign />, label: "الخطط والاشتراكات", href: "/admin/plans" },
    { icon: <Rss />, label: "الأخبار والمدونات", href: "/admin/news" },
    { icon: <ShieldAlert />, label: "الدعم الفني والرقابة", href: "/admin/support" },
  ];

  return (
    <div className="flex h-screen bg-muted overflow-hidden rtl">
      {/* Admin Sidebar */}
      <motion.aside 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 bg-primary text-primary-foreground flex flex-col shadow-xl z-20"
      >
        <div className="p-6">
          <div className="text-2xl font-extrabold text-white">
            Boost<span className="text-accent">x</span> <span className="text-sm bg-accent text-accent-foreground px-2 py-0.5 rounded-full ml-2">الإدارة</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuLinks.map((link, i) => (
            <Link 
              key={i} 
              href={link.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors font-medium text-white/90 hover:text-white"
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-300 hover:bg-red-500 hover:text-white transition-colors font-medium"
          >
            <LogOut />
            تسجيل الخروج
          </button>
        </div>
      </motion.aside>

      {/* Admin Main Content */}
      <main className="flex-1 flex flex-col relative overflow-y-auto">
        <header className="h-20 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-primary">لوحة تحكم النظام</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-bold text-muted-foreground">النظام مستقر</span>
            </div>
          </div>
        </header>
        
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
