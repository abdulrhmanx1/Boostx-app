"use client";

import { motion } from "framer-motion";
import { Bell, Heart, MessageCircle, UserPlus, ShoppingBag, CheckCircle, ChevronLeft, Trash2 } from "lucide-react";

export default function NotificationsScreen({ onClose }: { onClose: () => void }) {
  const notifications = [
    { 
      id: 1, 
      type: 'HIRE', 
      title: 'طلب توظيف جديد', 
      content: 'وكالة "كريتيف ديزاين" ترغب في التعاقد معك في فريقها.', 
      time: 'منذ 5 دقائق',
      icon: <UserPlus className="w-5 h-5 text-blue-500" />,
      bg: 'bg-blue-500/10'
    },
    { 
      id: 2, 
      type: 'LIKE', 
      title: 'إعجاب جديد', 
      content: 'قام أحمد المبرمج بالإعجاب بمنشورك الأخير في المجتمع.', 
      time: 'منذ ساعة',
      icon: <Heart className="w-5 h-5 text-red-500" />,
      bg: 'bg-red-500/10'
    },
    { 
      id: 3, 
      type: 'ORDER', 
      title: 'طلب خدمة قيد التنفيذ', 
      content: 'قام عميل بشراء خدمتك "تصميم هوية بصرية". ابدأ العمل الآن!', 
      time: 'منذ ساعتين',
      icon: <ShoppingBag className="w-5 h-5 text-primary" />,
      bg: 'bg-primary/10'
    },
    { 
      id: 4, 
      type: 'DELIVERY', 
      title: 'تم تسليم الطلب', 
      content: 'قام المستقل بتسليم طلبك رقم #12345. يرجى المراجعة والتأكيد.', 
      time: 'منذ 5 ساعات',
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      bg: 'bg-green-500/10'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      className="fixed inset-0 z-[130] bg-background flex flex-col"
      dir="rtl"
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 bg-muted rounded-full"><ChevronLeft className="w-5 h-5 rtl:-scale-x-100" /></button>
          <h2 className="text-xl font-black text-foreground">التنبيهات</h2>
        </div>
        <button className="p-2 text-muted-foreground hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {notifications.map((notif) => (
          <motion.div 
            key={notif.id}
            whileTap={{ scale: 0.98 }}
            className="p-4 bg-white rounded-3xl border border-border shadow-sm flex gap-4 items-start relative group"
          >
            <div className={`w-12 h-12 rounded-2xl ${notif.bg} flex items-center justify-center shrink-0`}>
              {notif.icon}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-sm font-black text-foreground">{notif.title}</h4>
                <span className="text-[10px] font-bold text-muted-foreground">{notif.time}</span>
              </div>
              <p className="text-[11px] font-bold text-muted-foreground leading-relaxed">{notif.content}</p>
            </div>
            <div className="absolute top-4 left-4 w-2 h-2 bg-primary rounded-full" />
          </motion.div>
        ))}

        {notifications.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-40 py-20">
            <Bell className="w-16 h-16 mb-4" />
            <p className="font-black text-lg">لا توجد تنبيهات جديدة</p>
          </div>
        )}
      </div>

      {/* Footer Branding */}
      <div className="p-8 text-center border-t border-border bg-muted/30">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">فريق بوست يرحب بك دائماً ✨</p>
      </div>
    </motion.div>
  );
}
