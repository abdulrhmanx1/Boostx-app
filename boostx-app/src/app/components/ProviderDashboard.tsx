"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, DollarSign, LayoutDashboard, Plus, Settings, MessageCircle, Star, ShoppingBag, Eye, TrendingUp, X, CheckCircle, Loader2, Link as LinkIcon, FileText, ShieldAlert, CreditCard, Edit3 } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "../../utils/supabase/client";
import { useAuthStore } from "../../store/useAuthStore";

export default function ProviderDashboard({ onClose }: { onClose?: () => void }) {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("services");
  const [isAvailable, setIsAvailable] = useState(true);
  
  // Sales/Orders State
  const [sales, setSales] = useState<any[]>([]);
  const [isFetchingSales, setIsFetchingSales] = useState(true);

  // Delivery Modal State
  const [showSubmitWork, setShowSubmitWork] = useState<any | null>(null);
  const [deliveryNote, setDeliveryNote] = useState("");
  const [deliveryLink, setDeliveryLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchOrders = async () => {
    setIsFetchingSales(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('orders')
      .select('*, client:users(full_name), service:services(title, provider_id)')
      .eq('service.provider_id', user?.id); 
    
    if (data) setSales(data);
    setIsFetchingSales(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleSubmitDelivery = async () => {
    if (!deliveryLink && !deliveryNote) return;
    setIsSubmitting(true);
    const supabase = createClient();
    
    const { error } = await supabase
      .from('orders')
      .update({ status: 'DELIVERED' })
      .eq('id', showSubmitWork.id);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("تم تسليم العمل بنجاح! بانتظار تأكيد العميل للإفراج عن المبلغ.");
      setShowSubmitWork(null);
      setDeliveryLink("");
      setDeliveryNote("");
      fetchOrders();
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-20 overflow-y-auto no-scrollbar" dir="rtl">
      {/* 🔮 Header */}
      <header className="purple-glass pt-12 pb-6 px-4 rounded-b-[2.5rem] shadow-xl relative z-20">
        {onClose && (
          <button onClick={onClose} className="absolute top-12 left-4 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full border-4 border-white/20 p-1 mb-4">
            <img src={user?.user_metadata?.avatar_url || "https://i.pravatar.cc/150?img=11"} className="w-full h-full rounded-full object-cover" />
          </div>
          <h2 className="text-xl font-black text-white">{user?.user_metadata?.full_name || "مقدم الخدمة"}</h2>
          <div className="flex items-center gap-1 mt-1">
            <p className="text-xs text-accent font-bold">بائع موثوق مستوى 2</p>
            <ShieldAlert className="w-3 h-3 text-accent" />
          </div>

          <div className="flex items-center gap-2 mt-4 bg-black/20 p-1.5 rounded-full backdrop-blur-md border border-white/10">
            <button onClick={() => setIsAvailable(true)} className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${isAvailable ? "bg-green-500 text-white shadow-lg" : "text-white/60"}`}>متاح للعمل</button>
            <button onClick={() => setIsAvailable(false)} className={`px-4 py-1.5 rounded-full text-[10px] font-black transition-all ${!isAvailable ? "bg-red-500 text-white shadow-lg" : "text-white/60"}`}>مشغول</button>
          </div>
        </div>
      </header>

      {/* 📊 Quick Stats */}
      <div className="px-4 -mt-4 relative z-30">
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-zinc-100 grid grid-cols-3 gap-2">
          <div className="text-center border-l border-zinc-100">
            <p className="text-[10px] font-black text-zinc-400 mb-1">المبيعات</p>
            <h4 className="text-lg font-black text-primary">12</h4>
          </div>
          <div className="text-center border-l border-zinc-100">
            <p className="text-[10px] font-black text-zinc-400 mb-1">الرصيد</p>
            <h4 className="text-lg font-black text-green-500">2.4k</h4>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-black text-zinc-400 mb-1">التقييم</p>
            <h4 className="text-lg font-black text-yellow-500">4.9</h4>
          </div>
        </div>
      </div>

      {/* ➖ Tabs */}
      <div className="px-4 mt-8 flex gap-2 overflow-x-auto no-scrollbar border-b border-zinc-200 pb-2">
        {[
          { id: "services", name: "خدماتي", icon: <Briefcase className="w-4 h-4" /> },
          { id: "sales", name: "المبيعات", icon: <TrendingUp className="w-4 h-4" /> },
          { id: "leads", name: "طلبات العملاء", icon: <Star className="w-4 h-4" /> },
          { id: "finance", name: "الإعدادات المالية", icon: <DollarSign className="w-4 h-4" /> },
          { id: "analytics", name: "الإحصائيات", icon: <Eye className="w-4 h-4" /> },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black transition-all whitespace-nowrap ${
              activeTab === tab.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-zinc-400 bg-white border border-zinc-100"
            }`}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </div>

      {/* 📄 Content */}
      <div className="p-4">
        {activeTab === "finance" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-primary font-black text-xs mb-1">
                <ShieldAlert className="w-4 h-4" /> تنبيه العمولة
              </div>
              <p className="text-[10px] font-bold text-muted-foreground leading-relaxed">
                يرجى العلم أن منصة BoostX تتقاضى عمولة قدرها <span className="text-primary font-black">20%</span> من قيمة كل مشروع يتم تسليمه بنجاح.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-zinc-100 shadow-sm">
              <h3 className="text-sm font-black mb-4 flex items-center gap-2"><CreditCard className="w-5 h-5 text-primary" /> بيانات استلام الأرباح</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-[10px] font-black text-zinc-400 block mb-2 px-1">طريقة السحب المفضلة</label>
                  <select className="w-full bg-zinc-50 border-none p-3.5 rounded-2xl text-xs font-bold outline-none">
                    <option>فودافون كاش (مصر)</option>
                    <option>تحويل بنكي (دولي/محلي)</option>
                    <option>STC Pay (السعودية)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-zinc-400 block mb-2 px-1">رقم المحفظة أو الآيبان (IBAN)</label>
                  <input type="text" placeholder="010XXXXXXXX or SA000..." className="w-full bg-zinc-50 border-none p-3.5 rounded-2xl text-xs font-bold outline-none" />
                </div>
                <button className="w-full py-4 bg-primary text-white rounded-2xl font-black text-sm shadow-xl shadow-primary/20">حفظ بيانات الدفع</button>
              </div>
            </div>

            {/* 🧮 Profit Calculator */}
            <div className="bg-white rounded-3xl p-6 border border-primary/20 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-full bg-primary opacity-20"></div>
              <h3 className="text-sm font-black mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" /> حاسبة الأرباح الذكية</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-[10px] font-black text-zinc-400 block mb-2 px-1">سعر المشروع المتوقع (ر.س)</label>
                  <input 
                    type="number" 
                    placeholder="أدخل ميزانية المشروع..." 
                    className="w-full bg-zinc-50 border-none p-4 rounded-2xl text-sm font-black outline-none focus:ring-2 ring-primary/20"
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      const commission = val * 0.20; // Assuming 20% for now
                      const net = val - commission;
                      const displayNet = document.getElementById('net-profit-display');
                      const displayComm = document.getElementById('comm-display');
                      if (displayNet) displayNet.innerText = net.toFixed(2) + " ر.س";
                      if (displayComm) displayComm.innerText = "- " + commission.toFixed(2) + " ر.س";
                    }}
                  />
                </div>
                <div className="flex flex-col gap-2 bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                  <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground">
                    <span>عمولة المنصة (20%)</span>
                    <span id="comm-display" className="text-red-500">0.00 ر.س</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-black text-foreground pt-2 border-t border-zinc-200">
                    <span>صافي ربحك النهائي</span>
                    <span id="net-profit-display" className="text-green-500">0.00 ر.س</span>
                  </div>
                </div>
                <p className="text-[9px] text-zinc-400 font-bold text-center leading-relaxed">
                  * هذه الأرقام تقريبية وتعتمد على النسبة الحالية للمنصة.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "services" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
            <button className="w-full py-4 bg-white border-2 border-dashed border-zinc-300 rounded-2xl flex items-center justify-center gap-2 text-zinc-500 font-black text-sm">
              <Plus className="w-5 h-5" /> إضافة خدمة جديدة
            </button>
          </motion.div>
        )}

        {activeTab === "sales" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
            <h3 className="text-sm font-black text-zinc-800 mb-2">إدارة الطلبات الواردة</h3>
            {sales.map((order) => (
              <div key={order.id} className="bg-white rounded-3xl p-5 border border-zinc-100 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center font-black text-primary text-xs">{order.client?.full_name?.charAt(0)}</div>
                    <div>
                      <h4 className="text-sm font-black text-zinc-800">{order.client?.full_name}</h4>
                      <p className="text-[10px] font-bold text-zinc-400">{order.service?.title}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black ${
                    order.status === 'PENDING' ? 'bg-blue-500/10 text-blue-500' : 
                    order.status === 'DELIVERED' ? 'bg-orange-500/10 text-orange-500' : 'bg-green-500/10 text-green-500'
                  }`}>
                    {order.status === 'PENDING' ? 'قيد التنفيذ' : order.status === 'DELIVERED' ? 'تم التسليم' : 'مكتمل'}
                  </span>
                </div>
                {order.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowSubmitWork(order)}
                      className="flex-1 py-3 bg-primary text-white rounded-xl text-xs font-black shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" /> تسليم العمل الآن
                    </button>
                    <button className="p-3 bg-zinc-50 rounded-xl text-zinc-400"><MessageCircle className="w-5 h-5" /></button>
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* 📤 Submit Work Modal */}
      <AnimatePresence>
        {showSubmitWork && (
          <div className="fixed inset-0 z-[150] bg-black/80 flex items-center justify-center p-6 backdrop-blur-md text-center">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm relative">
              <button onClick={() => setShowSubmitWork(null)} className="absolute top-6 left-6 p-2 bg-zinc-50 rounded-full text-zinc-400"><X className="w-4 h-4" /></button>
              
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <LinkIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black mb-1">تسليم المشروع</h3>
              <p className="text-[10px] text-zinc-400 font-bold mb-6">أرسل رابط العمل النهائي أو ملفاتك لإنهاء الطلب.</p>

              <div className="flex flex-col gap-4 text-right">
                <input 
                  type="text" 
                  value={deliveryLink}
                  onChange={e => setDeliveryLink(e.target.value)}
                  placeholder="رابط العمل (Drive/Behance...)" 
                  className="w-full bg-zinc-50 border-none p-4 rounded-2xl text-xs font-bold outline-none" 
                />
                <textarea 
                  value={deliveryNote}
                  onChange={e => setDeliveryNote(e.target.value)}
                  placeholder="ملاحظات للعميل..." 
                  className="w-full bg-zinc-50 rounded-2xl p-4 text-xs font-bold outline-none resize-none h-24" 
                />
                <button 
                  onClick={handleSubmitDelivery}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/30 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "إرسال العمل واعتماد التسليم"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
