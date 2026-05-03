"use client";

import { motion } from "framer-motion";
import { PackageOpen, Clock, CheckCircle2, ChevronLeft } from "lucide-react";

export default function OrdersScreen({ onOpenChat }: { onOpenChat?: () => void }) {
  const orders = [
    { id: "ORD-9482", title: "برمجة تطبيق توصيل", status: "in_progress", date: "اليوم، 10:30 ص", price: "4,500" },
    { id: "ORD-9480", title: "تصميم شعار شركة عقارات", status: "completed", date: "أمس، 04:15 م", price: "350" },
    { id: "ORD-9475", title: "كتابة محتوى تسويقي", status: "completed", date: "12 مايو 2026", price: "150" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col gap-4 px-4 mt-2 pb-24"
      dir="rtl"
    >
      <div className="flex justify-between items-end mb-2">
        <h2 className="text-2xl font-black text-foreground">طلباتي النشطة</h2>
        <span className="text-xs font-bold text-muted-foreground">3 طلبات</span>
      </div>

      {orders.map((order, i) => (
        <motion.div 
          key={i}
          whileTap={{ scale: 0.98 }}
          className="bg-white rounded-2xl p-4 shadow-sm border border-border flex flex-col gap-3 relative overflow-hidden"
        >
          {/* Status Glow Bar */}
          <div className={`absolute top-0 right-0 w-1 h-full ${order.status === 'completed' ? 'bg-accent shadow-[0_0_10px_var(--accent)]' : 'bg-[var(--toggle-active)] shadow-[0_0_10px_var(--toggle-active)]'}`} />

          <div className="flex justify-between items-start pr-2">
            <div>
              <span className="text-[10px] font-bold text-muted-foreground">{order.id}</span>
              <h3 className="text-sm font-extrabold text-primary mt-1">{order.title}</h3>
            </div>
            
            {order.status === 'completed' ? (
              <div className="bg-accent/20 text-primary border border-accent/40 px-2 py-1 rounded-md flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span className="text-[10px] font-bold">مكتمل</span>
              </div>
            ) : (
              <div className="bg-[var(--toggle-active)]/20 text-[var(--toggle-active)] border border-[var(--toggle-active)]/40 px-2 py-1 rounded-md flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span className="text-[10px] font-bold">قيد التنفيذ</span>
              </div>
            )}
          </div>

          <div className="bg-muted rounded-xl p-3 flex justify-between items-center mt-2 pr-2">
            <div className="flex items-center gap-2">
              <PackageOpen className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-[10px] text-muted-foreground">تاريخ الطلب</p>
                <p className="text-xs font-bold text-foreground">{order.date}</p>
              </div>
            </div>
            <div className="text-left">
              <p className="text-[10px] text-muted-foreground">السعر</p>
              <p className="text-sm font-black text-primary">{order.price} <span className="text-[9px]">ر.س</span></p>
            </div>
          </div>

          <button onClick={onOpenChat} className="flex justify-between items-center w-full mt-1 pt-3 border-t border-border group cursor-pointer">
            <span className="text-xs font-bold text-primary group-hover:text-accent transition-colors">عرض التفاصيل والمحادثة</span>
            <ChevronLeft className="w-4 h-4 text-primary group-hover:text-accent transition-colors" />
          </button>
        </motion.div>
      ))}
    </motion.div>
  );
}
