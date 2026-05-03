"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, DollarSign, Activity, Percent, Settings } from "lucide-react";
import { useState } from "react";

export default function AdminDashboardPage() {
  const [commission, setCommission] = useState(15); // 15% platform commission

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-primary mb-2">الرقابة المالية والإحصائيات</h1>
        <p className="text-muted-foreground">ملخص أداء المنصة المالي ونشاط المستخدمين</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "إجمالي الأرباح", value: "145,000 ريال", icon: <DollarSign />, trend: "+12%" },
          { label: "المستخدمين النشطين", value: "12,450", icon: <Users />, trend: "+5%" },
          { label: "مبيعات الكوينز", value: "34,200 ريال", icon: <Activity />, trend: "+25%" },
          { label: "الخدمات المنفذة", value: "1,890", icon: <TrendingUp />, trend: "+8%" },
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="bg-background p-6 rounded-2xl border border-border shadow-sm relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">{stat.icon}</div>
              <span className="text-sm font-bold text-accent bg-accent/10 px-2 py-1 rounded-lg">{stat.trend}</span>
            </div>
            <div className="relative z-10">
              <div className="text-2xl font-extrabold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Settings */}
        <div className="bg-background rounded-3xl p-6 border border-border shadow-sm">
          <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5" /> إعدادات النظام السريعة
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="flex justify-between text-sm font-bold text-primary mb-2">
                <span>نسبة عمولة المنصة من الخدمات</span>
                <span className="text-accent">{commission}%</span>
              </label>
              <input 
                type="range" 
                min="0" max="30" 
                value={commission}
                onChange={(e) => setCommission(Number(e.target.value))}
                className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div className="pt-4 border-t border-border">
              <h3 className="font-bold text-primary mb-3 text-sm">حالة الدخول والخروج (Live)</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm items-center">
                  <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span> تسجيل دخول جديد</span>
                  <span className="text-muted-foreground text-xs">منذ دقيقتين</span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"></span> تسجيل خروج</span>
                  <span className="text-muted-foreground text-xs">منذ 5 دقائق</span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span> تسجيل دخول جديد</span>
                  <span className="text-muted-foreground text-xs">منذ 10 دقائق</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Logs / Approvals */}
        <div className="lg:col-span-2 bg-background rounded-3xl p-6 border border-border shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-primary">طلبات تحتاج مراجعة</h2>
            <button className="text-sm font-bold text-accent">عرض السجل الكامل</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-muted text-primary font-bold">
                <tr>
                  <th className="p-4 rounded-r-xl">الطلب</th>
                  <th className="p-4">المستخدم</th>
                  <th className="p-4">التاريخ</th>
                  <th className="p-4 rounded-l-xl text-center">إجراء</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { req: "إضافة خدمة جديدة (تصميم 3D)", user: "وكالة الإبداع", date: "اليوم 10:30 ص" },
                  { req: "توثيق حساب وكالة", user: "مجموعة التسويق المحدودة", date: "اليوم 09:15 ص" },
                  { req: "سحب أرباح (5000 ريال)", user: "أحمد ديزاين", date: "أمس 04:20 م" },
                ].map((log, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="p-4 font-medium text-primary">{log.req}</td>
                    <td className="p-4 text-muted-foreground text-sm">{log.user}</td>
                    <td className="p-4 text-muted-foreground text-sm">{log.date}</td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button className="px-3 py-1 bg-green-100 text-green-700 font-bold text-xs rounded-md">قبول</button>
                        <button className="px-3 py-1 bg-red-100 text-red-700 font-bold text-xs rounded-md">رفض</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
