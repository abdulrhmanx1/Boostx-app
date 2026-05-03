"use client";

import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import { Briefcase, CreditCard, Star, TrendingUp, Users } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuthStore();

  const renderClientDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "طلبات نشطة", value: "3", icon: <Briefcase /> },
          { label: "مشتريات سابقة", value: "12", icon: <CreditCard /> },
          { label: "التقييمات المقدمة", value: "15", icon: <Star /> },
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="bg-background p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4"
          >
            <div className="p-4 bg-primary/10 rounded-xl text-primary">
              {stat.icon}
            </div>
            <div>
              <div className="text-3xl font-extrabold text-primary">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="bg-background rounded-2xl border border-border p-6 shadow-sm">
        <h3 className="text-xl font-bold text-primary mb-4">أحدث الخدمات المقترحة لك</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="aspect-square bg-muted rounded-xl p-4 flex flex-col justify-end border border-border/50 hover:border-primary/30 transition-colors cursor-pointer">
              <div className="h-1/2 w-full bg-primary/5 rounded-lg mb-2"></div>
              <h4 className="font-bold text-primary text-sm">تصميم هوية بصرية</h4>
              <p className="text-xs text-muted-foreground">بواسطة: وكالة إبداع</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProviderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "المشاريع المنجزة", value: "45", icon: <Briefcase /> },
          { label: "التقييم العام", value: "4.9", icon: <Star className="text-yellow-500" /> },
          { label: "الزيارات للملف", value: "1,204", icon: <TrendingUp /> },
          { label: "العملاء الجدد", value: "8", icon: <Users /> },
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="bg-background p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4"
          >
            <div className="p-4 bg-primary/10 rounded-xl text-primary">
              {stat.icon}
            </div>
            <div>
              <div className="text-2xl font-extrabold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-background rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-primary">فرص جديدة (طلبات عملاء)</h3>
            <button className="text-sm text-accent font-bold">عرض الكل</button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex justify-between items-center p-4 border border-border rounded-xl hover:border-primary/30 transition-colors">
                <div>
                  <h4 className="font-bold text-primary">مطلوب تصميم تطبيق جوال</h4>
                  <p className="text-sm text-muted-foreground">ميزانية مقترحة: 5000 - 10000 ريال</p>
                </div>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-bold flex items-center gap-2 hover:opacity-90">
                  شراء بيانات العميل 
                  <span className="bg-accent text-accent-foreground px-2 py-0.5 rounded-full text-xs">10 كوينز</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-background rounded-2xl border border-border p-6 shadow-sm flex flex-col gap-4">
          <h3 className="text-xl font-bold text-primary">حالة التوفر</h3>
          <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-between">
            <span className="font-bold text-primary">متاح لاستقبال مشاريع</span>
            <div className="w-12 h-6 bg-accent rounded-full relative cursor-pointer">
              <div className="w-4 h-4 bg-background rounded-full absolute left-1 top-1"></div>
            </div>
          </div>
          {user?.role === "AGENCY" && (
            <div className="mt-4 p-4 rounded-xl border border-border">
              <h4 className="font-bold text-primary mb-2">إحصائيات الفريق</h4>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>الموظفين النشطين:</span>
                <span className="font-bold text-primary">12 / 15</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-extrabold text-primary mb-2">مرحباً بك، {user?.name} 👋</h1>
        <p className="text-muted-foreground">إليك نظرة عامة على نشاطك في منصة Boostx</p>
      </motion.div>

      {user?.role === "CLIENT" ? renderClientDashboard() : renderProviderDashboard()}
    </div>
  );
}
