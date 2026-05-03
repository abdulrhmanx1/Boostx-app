"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, Coins, Briefcase, Settings, LogOut, Users, FileText } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isMounted || !isAuthenticated) {
    return null; // Or a loading spinner
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const getMenuLinks = () => {
    switch (user?.role) {
      case "CLIENT":
        return [
          { icon: <LayoutDashboard />, label: "لوحة التحكم", href: "/dashboard" },
          { icon: <FileText />, label: "طلباتي", href: "/dashboard/orders" },
        ];
      case "FREELANCER":
        return [
          { icon: <LayoutDashboard />, label: "لوحة التحكم", href: "/dashboard" },
          { icon: <Briefcase />, label: "مشاريعي", href: "/dashboard/projects" },
          { icon: <Coins />, label: "الكوينز والمحفظة", href: "/dashboard/wallet" },
        ];
      case "AGENCY":
        return [
          { icon: <LayoutDashboard />, label: "لوحة التحكم", href: "/dashboard" },
          { icon: <Users />, label: "إدارة الفريق", href: "/dashboard/team" },
          { icon: <Briefcase />, label: "المشاريع الكبرى", href: "/dashboard/projects" },
          { icon: <Coins />, label: "الكوينز والمحفظة", href: "/dashboard/wallet" },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="flex h-screen bg-muted overflow-hidden rtl">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 bg-background border-l border-border flex flex-col shadow-xl z-20"
      >
        <div className="p-6">
          <div className="text-2xl font-extrabold text-primary">
            Boost<span className="text-accent">x</span>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-primary">{user?.name}</div>
              <div className="text-xs text-muted-foreground">
                {user?.role === "CLIENT" ? "عميل" : user?.role === "FREELANCER" ? "مستقل" : "وكالة"}
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {getMenuLinks().map((link, i) => (
            <Link 
              key={i} 
              href={link.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-primary/5 hover:text-primary transition-colors font-medium"
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 transition-colors font-medium"
          >
            <LogOut />
            تسجيل الخروج
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-y-auto">
        {/* Topbar */}
        <header className="h-20 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-primary">نظرة عامة</h2>
          {user?.role !== "CLIENT" && (
            <div className="flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-full border border-accent/20">
              <Coins className="text-accent w-5 h-5" />
              <span className="font-bold text-primary">{user?.coins} كوينز</span>
            </div>
          )}
        </header>
        
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
