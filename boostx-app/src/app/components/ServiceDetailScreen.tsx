"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Star, Heart, Share2, CheckCircle2, MessageCircle, ShoppingCart, Banknote, X, ShieldCheck, Clock, ShoppingBag, CheckCircle, RefreshCw } from "lucide-react";
import { useState } from "react";
import { createClient } from "../../utils/supabase/client";
import { useAuthStore } from "../../store/useAuthStore";

export default function ServiceDetailScreen({ onClose, onOpenChat }: { onClose: () => void, onOpenChat: () => void }) {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("تفاصيل");
  const [showNegotiate, setShowNegotiate] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleOrderService = async () => {
    if (!user) {
      alert("يجب تسجيل الدخول أولاً لإتمام عملية الشراء");
      return;
    }

    setIsOrdering(true);
    const supabase = createClient();

    // 1. Create Order
    const { data: order, error: orderError } = await supabase.from('orders').insert({
      client_id: user.id,
      service_id: '550e8400-e29b-41d4-a716-446655440000', // Mock service ID for prototype
      amount: 1200,
      status: 'PENDING'
    }).select().single();

    if (orderError) {
      alert("خطأ في إنشاء الطلب: " + orderError.message);
      setIsOrdering(false);
      return;
    }

    // 2. Create Escrow Transaction
    const { error: escrowError } = await supabase.from('escrow_transactions').insert({
      order_id: order.id,
      amount: 1200,
      status: 'HELD'
    });

    setIsOrdering(false);
    if (escrowError) {
      alert("خطأ في نظام الضمان: " + escrowError.message);
    } else {
      setOrderSuccess(true);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="fixed inset-0 z-[80] bg-background flex flex-col overflow-y-auto pb-24"
      dir="rtl"
    >
      {/* 🖼️ Cover Image & Header Actions */}
      <div className="relative w-full h-72 bg-muted">
        <img src="https://picsum.photos/800/600?random=1" alt="Cover" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/50" />
        
        {/* Top Bar Actions */}
        <div className="absolute top-12 w-full px-4 flex justify-between items-center z-10">
          <button onClick={onClose} className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors">
            <ArrowRight className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            <button className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 📋 Details Section */}
      <div className="px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-3xl p-5 shadow-lg border border-border">
          <div className="flex justify-between items-start mb-3">
            <h1 className="text-lg font-black text-foreground leading-tight">تصميم هوية بصرية كاملة للشركات الناشئة والمؤسسات</h1>
          </div>
          
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <div className="w-10 h-10 rounded-full border-2 border-[var(--toggle-active)] overflow-hidden">
              <img src="https://i.pravatar.cc/150?img=12" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-foreground">أحمد مصمم واجهات</h3>
              <p className="text-[10px] text-accent font-black flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" /> بائع موثوق
              </p>
            </div>
            <div className="mr-auto flex items-center gap-1 bg-yellow-50 text-yellow-600 px-2 py-1 rounded-lg">
              <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
              <span className="text-xs font-black">4.9</span>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <span className="text-sm font-bold text-muted-foreground">سعر الخدمة يبدأ من</span>
            <span className="text-2xl font-black text-primary">150 <span className="text-xs font-bold text-muted-foreground">ر.س</span></span>
          </div>
        </div>
      </div>

      {/* ➖ Tabs */}
      <div className="px-4 mt-6 flex gap-4 border-b border-border">
        {["تفاصيل", "أعمال سابقة", "تقييمات"].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 font-bold text-sm relative transition-colors ${
              activeTab === tab ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="serviceTab" className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--toggle-active)] rounded-t-full shadow-[0_0_10px_var(--toggle-active)]" />
            )}
          </button>
        ))}
      </div>

      {/* 📄 Tab Content */}
      <div className="p-4">
        {activeTab === "تفاصيل" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-medium text-muted-foreground leading-loose">
            أقدم لك خدمة تصميم الهوية البصرية المتكاملة التي تعكس رؤية شركتك وقيمها.
            <br/><br/>
            ماذا تتضمن الخدمة؟<br/>
            - تصميم الشعار (Logo) بـ 3 نماذج مختلفة.<br/>
            - تصميم الورق الرسمي والمظاريف.<br/>
            - تصميم بطاقات العمل (Business Cards).<br/>
            - دليل استخدام الهوية (Brand Guidelines).<br/><br/>
            التسليم سيكون بصيغ مفتوحة المصدر (AI, PSD) وبصيغ العرض (PNG, PDF).
          </motion.div>
        )}
        {activeTab === "أعمال سابقة" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-border">
                <img src={`https://picsum.photos/300/300?random=${i+20}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* 💳 Sticky Bottom Actions */}
      <div className="p-6 bg-white border-t border-border flex gap-3 pb-10">
        <button onClick={() => setShowNegotiate(true)} className="flex-1 py-4 rounded-2xl bg-muted text-foreground font-black text-sm hover:bg-border transition-colors">تفاوض / سوم</button>
        <button 
          onClick={handleOrderService}
          disabled={isOrdering}
          className="flex-[2] py-4 rounded-2xl bg-primary text-white font-black text-sm shadow-lg shadow-primary/30 flex justify-center items-center gap-2 hover:scale-[0.98] active:scale-95 transition-all"
        >
          {isOrdering ? <RefreshCw className="w-5 h-5 animate-spin" /> : <><ShoppingBag className="w-5 h-5" /> اطلب الخدمة الآن</>}
        </button>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {orderSuccess && (
          <div className="fixed inset-0 z-[120] bg-black/80 flex items-center justify-center p-6 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm text-center">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-xl font-black mb-2">تم حجز المبلغ بأمان!</h3>
              <p className="text-sm text-muted-foreground font-bold mb-8">المبلغ الآن في نظام "الضمان" وسيبقى محفوظاً حتى تستلم الخدمة وتؤكد رضاك.</p>
              <button onClick={() => setOrderSuccess(false)} className="w-full py-4 bg-primary text-white rounded-2xl font-black shadow-lg">حسناً، متابعة الطلب</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🤝 Negotiation Modal */}
      {showNegotiate && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ y: "100%" }} 
            animate={{ y: 0 }} 
            exit={{ y: "100%" }} 
            className="w-full bg-white rounded-t-3xl p-6 pb-safe relative"
          >
            <button onClick={() => setShowNegotiate(false)} className="absolute top-4 left-4 p-2 bg-muted rounded-full text-foreground"><X className="w-4 h-4" /></button>
            <h3 className="text-lg font-black text-foreground mb-1">تقديم عرض سعر (سوم)</h3>
            <p className="text-xs font-bold text-muted-foreground mb-6">أرسل عرضك للمستقل، وسيكون لديه 24 ساعة للقبول أو الرفض.</p>
            
            <div className="bg-muted p-4 rounded-2xl mb-4 border border-border">
              <label className="text-xs font-black text-foreground block mb-2">السعر المقترح (ر.س)</label>
              <input 
                type="number" 
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                placeholder="أدخل السعر الذي تراه مناسباً..." 
                className="w-full bg-white p-3 rounded-xl border border-border outline-none font-bold text-primary focus:border-[var(--toggle-active)]"
              />
            </div>
            
            <button 
              onClick={() => {
                alert("تم إرسال السوم للمستقل! سيصلك إشعار عند الرد.");
                setShowNegotiate(false);
              }}
              className="w-full py-4 rounded-2xl bg-black text-white font-black text-lg flex items-center justify-center gap-2 hover:scale-[0.98] transition-transform"
            >
              إرسال العرض
            </button>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
