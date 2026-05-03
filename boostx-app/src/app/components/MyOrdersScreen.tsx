"use client";

import { motion } from "framer-motion";
import { Package, Clock, CheckCircle2, AlertCircle, ChevronLeft, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "../../utils/supabase/client";
import { useAuthStore } from "../../store/useAuthStore";

export default function MyOrdersScreen({ onClose }: { onClose: () => void }) {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const fetchOrders = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('orders')
      .select('*, service:services(title)')
      .eq('client_id', user?.id)
      .order('created_at', { ascending: false });
    
    if (data) setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleConfirmReceipt = async (orderId: string) => {
    setIsProcessing(true);
    const supabase = createClient();
    
    const { error } = await supabase
      .from('orders')
      .update({ status: 'COMPLETED' })
      .eq('id', orderId);

    if (error) {
      alert("Error: " + error.message);
    } else {
      setShowSuccess(true);
      fetchOrders();
    }
    setIsProcessing(false);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PENDING': return { text: 'قيد التنفيذ', color: 'text-blue-500', bg: 'bg-blue-500/10' };
      case 'DELIVERED': return { text: 'تم التسليم', color: 'text-yellow-500', bg: 'bg-yellow-500/10' };
      case 'COMPLETED': return { text: 'مكتمل', color: 'text-green-500', bg: 'bg-green-500/10' };
      default: return { text: 'ملغي', color: 'text-red-500', bg: 'bg-red-500/10' };
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      className="fixed inset-0 z-[115] bg-background flex flex-col"
      dir="rtl"
    >
      {/* Header */}
      <div className="p-6 flex items-center gap-4 border-b border-border">
        <button onClick={onClose} className="p-2 bg-muted rounded-full"><ChevronLeft className="w-5 h-5 rtl:-scale-x-100" /></button>
        <h2 className="text-xl font-black text-foreground">طلباتي النشطة</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-muted rounded-3xl animate-pulse" />)}
          </div>
        ) : orders.length > 0 ? (
          <div className="flex flex-col gap-4">
            {orders.map((order) => {
              const style = getStatusStyle(order.status);
              return (
                <motion.div 
                  key={order.id}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white rounded-3xl p-5 border border-border shadow-sm flex flex-col gap-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Package className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-foreground">{order.service?.title || "طلب خدمة"}</h4>
                        <p className="text-[10px] font-bold text-muted-foreground">رقم الطلب: #{order.id.slice(0, 8)}</p>
                      </div>
                    </div>
                    <div className={`${style.bg} ${style.color} px-3 py-1.5 rounded-xl`}>
                      <span className="text-[10px] font-black">{style.text}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs font-bold text-muted-foreground">بانتظار التسليم</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2.5 bg-muted text-foreground rounded-xl"><MessageCircle className="w-5 h-5" /></button>
                      {order.status === 'DELIVERED' && (
                        <button 
                          onClick={() => handleConfirmReceipt(order.id)}
                          disabled={isProcessing}
                          className="px-4 py-2 bg-green-500 text-white rounded-xl text-xs font-black shadow-lg shadow-green-500/20 flex items-center gap-2"
                        >
                          {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : "تأكيد الاستلام وفك الضمان"}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-50">
            <AlertCircle className="w-12 h-12 mb-2" />
            <p className="font-bold">لا توجد طلبات حالياً</p>
          </div>
        )}
      </div>

      {/* Celebration Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-[160] bg-black/80 flex items-center justify-center p-6 backdrop-blur-md text-center">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2.5rem] p-8 max-w-sm">
              <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/40">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black mb-2">تم إنهاء الطلب بنجاح!</h3>
              <p className="text-sm text-muted-foreground font-bold mb-8 leading-relaxed">شكراً لثقتك في بوست. تم تحويل المبلغ الآن للمستقل رسمياً. نتطلع لخدمتك مرة أخرى!</p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => { setShowSuccess(false); setShowRating(true); }}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20"
                >
                  تقييم الخدمة (هام)
                </button>
                <button onClick={() => setShowSuccess(false)} className="w-full py-4 bg-muted text-foreground rounded-2xl font-black">إغلاق</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ⭐ Rating Modal */}
      <AnimatePresence>
        {showRating && (
          <div className="fixed inset-0 z-[170] bg-black/80 flex items-center justify-center p-6 backdrop-blur-md text-center">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full">
              <h3 className="text-xl font-black mb-2">كيف كانت تجربتك؟</h3>
              <p className="text-xs text-muted-foreground font-bold mb-6">تقييمك يساعد الآخرين في اختيار المحترف المناسب.</p>
              
              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star} 
                    onClick={() => setRating(star)}
                    className={`text-3xl transition-transform ${star <= rating ? 'text-yellow-400 scale-110' : 'text-zinc-200'}`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <textarea 
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                placeholder="اكتب رأيك هنا (اختياري)..." 
                className="w-full bg-muted rounded-2xl p-4 text-xs font-bold outline-none resize-none h-24 mb-6"
              />

              <button 
                onClick={() => {
                  alert("شكراً لك! تم حفظ تقييمك بنجاح.");
                  setShowRating(false);
                  setFeedback("");
                }}
                className="w-full py-4 bg-primary text-white rounded-2xl font-black shadow-xl"
              >
                إرسال التقييم
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
