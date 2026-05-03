"use client";

import { motion } from "framer-motion";
import { X, Send, ClipboardList, MapPin, Coins, CheckCircle2, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "../../utils/supabase/client";
import { useAuthStore } from "../../store/useAuthStore";

export default function PostLeadScreen({ onClose }: { onClose: () => void }) {
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<any[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category_id: "",
    budget: "",
    city: "الرياض",
    description: ""
  });

  useEffect(() => {
    const fetchCats = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('service_categories').select('*');
      if (data) setCategories(data);
    };
    fetchCats();
  }, []);

  const handlePost = async () => {
    setIsPosting(true);
    const supabase = createClient();
    
    const { error } = await supabase.from('leads').insert({
      client_id: user?.id,
      service_category_id: formData.category_id,
      budget_range: formData.budget,
      city: formData.city,
      description: formData.description,
      contact_unlock_price_coins: 5, // Default price to unlock
      status: 'OPEN'
    });

    setIsPosting(false);
    if (error) {
      alert("Error: " + error.message);
    } else {
      setStep(3); // Success step
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      className="fixed inset-0 z-[110] bg-background flex flex-col"
      dir="rtl"
    >
      {/* Header */}
      <div className="p-6 flex justify-between items-center border-b border-border">
        <h2 className="text-xl font-black text-foreground">نشر طلب مشروع جديد</h2>
        <button onClick={onClose} className="p-2 bg-muted rounded-full text-foreground"><X className="w-5 h-5" /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
        
        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-lg flex flex-col gap-6">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-black">ماذا تحتاج أن تنجز اليوم؟</h3>
              <p className="text-xs text-muted-foreground font-bold">اشرح طلبك باختصار وسيقوم الخبراء بالرد عليك.</p>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-black text-muted-foreground block mb-2">عنوان الطلب</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  placeholder="مثال: أحتاج مبرمج تطبيقات فلاتر" 
                  className="w-full p-4 rounded-2xl bg-muted border-none outline-none font-bold" 
                />
              </div>

              <div>
                <label className="text-xs font-black text-muted-foreground block mb-2">القسم</label>
                <select 
                  value={formData.category_id}
                  onChange={e => setFormData({...formData, category_id: e.target.value})}
                  className="w-full p-4 rounded-2xl bg-muted border-none outline-none font-bold appearance-none"
                >
                  <option value="">اختر القسم المطلوب</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-muted-foreground block mb-2">الميزانية المتوقعة</label>
                  <input 
                    type="text" 
                    value={formData.budget}
                    onChange={e => setFormData({...formData, budget: e.target.value})}
                    placeholder="مثال: 500-1000 ريال" 
                    className="w-full p-4 rounded-2xl bg-muted border-none outline-none font-bold" 
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-muted-foreground block mb-2">المدينة</label>
                  <div className="relative">
                    <MapPin className="absolute right-4 top-4 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      value={formData.city}
                      onChange={e => setFormData({...formData, city: e.target.value})}
                      className="w-full p-4 pr-10 rounded-2xl bg-muted border-none outline-none font-bold" 
                    />
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setStep(2)}
                disabled={!formData.title || !formData.category_id}
                className="w-full py-4 rounded-2xl bg-primary text-white font-black shadow-lg shadow-primary/30 mt-4 disabled:opacity-50"
              >
                التالي
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="w-full max-w-lg flex flex-col gap-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-black">أضف تفاصيل إضافية</h3>
              <p className="text-xs text-muted-foreground font-bold">كلما زادت التفاصيل زادت سرعة استجابة الخبراء.</p>
            </div>

            <textarea 
              rows={8}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="اكتب تفاصيل مشروعك هنا، المتطلبات، والموعد النهائي..." 
              className="w-full p-6 rounded-3xl bg-muted border-none outline-none font-bold resize-none"
            />

            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="flex-1 py-4 rounded-2xl bg-muted text-foreground font-black">رجوع</button>
              <button 
                onClick={handlePost}
                disabled={isPosting}
                className="flex-[2] py-4 rounded-2xl bg-primary text-white font-black shadow-lg shadow-primary/30 flex justify-center items-center gap-2"
              >
                {isPosting ? <RefreshCw className="w-6 h-6 animate-spin" /> : <><Send className="w-5 h-5" /> نشر الطلب الآن</>}
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-lg flex flex-col items-center justify-center pt-12 text-center">
            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <h3 className="text-2xl font-black text-foreground mb-2">تم نشر طلبك بنجاح!</h3>
            <p className="text-sm text-muted-foreground font-bold leading-relaxed mb-8">
              سيقوم المحترفون الآن بمراجعة طلبك وإرسال عروضهم إليك عبر الشات. ترقب الإشعارات!
            </p>
            <button 
              onClick={onClose}
              className="w-full py-4 rounded-2xl bg-black text-white font-black shadow-xl"
            >
              العودة للرئيسية
            </button>
          </motion.div>
        )}

      </div>

      {/* Footer Info */}
      <div className="p-6 bg-primary/5 flex items-center gap-3">
        <Coins className="w-5 h-5 text-yellow-500" />
        <p className="text-[10px] font-bold text-primary">
          هذا الطلب متاح مجاناً لك، ولكن المحترفين سيحتاجون لعملات لفتح بيانات التواصل معك لضمان الجدية.
        </p>
      </div>
    </motion.div>
  );
}
