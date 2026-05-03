"use client";

import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Users, LayoutDashboard, Settings, Plus, Image as ImageIcon, Video, ShieldAlert, DollarSign, Edit3, Trash2, Phone, Share2, Layers, RefreshCw, Check, MessageCircle, HelpCircle } from "lucide-react";
import { useState } from "react";
import { createClient } from "../../utils/supabase/client";

export default function AdminDashboardScreen({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [newCatName, setNewCatName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    
    setIsAdding(true);
    const supabase = createClient();
    
    const slug = newCatName.trim().toLowerCase().replace(/\s+/g, '-');
    
    const { error } = await supabase.from('service_categories').insert({
      name: newCatName,
      slug: slug,
      is_active: true
    });

    setIsAdding(false);
    
    if (error) {
      alert("Error adding category: " + error.message);
    } else {
      setNewCatName("");
      alert("تمت إضافة القسم بنجاح!");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[100] bg-zinc-950 flex flex-col text-white overflow-hidden"
      dir="rtl"
    >
      {/* 🔮 Admin Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 pt-12 pb-4 px-6 relative z-20 shadow-xl">
        <button onClick={onClose} className="absolute top-12 left-4 p-2 bg-white/5 rounded-full text-white hover:bg-white/10 transition-colors">
          <ArrowRight className="w-5 h-5 rtl:-scale-x-100" />
        </button>
        <div className="flex items-center gap-3 mt-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/20">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight">إدارة BoostX العليا</h1>
            <p className="text-xs text-zinc-400 font-bold mt-0.5">صلاحيات المدير العام (Super Admin)</p>
          </div>
        </div>
      </header>

      {/* ➖ Tabs */}
      <div className="px-4 mt-6 flex gap-2 overflow-x-auto no-scrollbar border-b border-zinc-800 pb-4 shrink-0">
        {[
          { id: "overview", name: "الإحصائيات", icon: <BarChart3 className="w-4 h-4" /> },
          { id: "ui", name: "الواجهة والسلايدر", icon: <ImageIcon className="w-4 h-4" /> },
          { id: "categories", name: "إدارة الأقسام", icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: "services", name: "رقابة الخدمات", icon: <ShieldAlert className="w-4 h-4" /> },
          { id: "community", name: "رقابة المجتمع", icon: <MessageCircle className="w-4 h-4" /> },
          { id: "withdrawals", name: "طلبات السحب", icon: <DollarSign className="w-4 h-4" /> },
          { id: "stories", name: "الاستوريهات", icon: <Video className="w-4 h-4" /> },
          { id: "settings", name: "الدعم الفني", icon: <Settings className="w-4 h-4" /> },
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black transition-all whitespace-nowrap ${
              activeTab === tab.id ? "bg-white text-black shadow-lg shadow-white/10" : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800"
            }`}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </div>

      {/* 📄 Content */}
      <div className="flex-1 overflow-y-auto p-6 no-scrollbar pb-32">
        
        {/* Tab: Overview */}
        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
                <p className="text-xs text-zinc-400 mb-1 font-bold">أرباح المنصة (العمولة 20%)</p>
                <h3 className="text-2xl font-black text-green-400">12,450 <span className="text-xs">ر.س</span></h3>
              </div>
              <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
                <p className="text-xs text-zinc-400 mb-1 font-bold">الأموال المعلقة (Escrow)</p>
                <h3 className="text-2xl font-black text-blue-400">85,200 <span className="text-xs">ر.س</span></h3>
              </div>
            </div>
            
            <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
              <h3 className="text-sm font-black mb-4">أحدث العمليات</h3>
              <div className="flex justify-between items-center py-2 border-b border-zinc-800/50">
                <span className="text-xs font-bold text-zinc-300">عمولة طلب #1024</span>
                <span className="text-xs font-black text-green-400">+50 ر.س</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab: Stories Management */}
        {activeTab === "stories" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
            <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">
              <h3 className="text-sm font-black mb-4 flex items-center gap-2"><Video className="w-5 h-5 text-purple-400" /> إضافة استوري إعلاني جديد</h3>
              <div className="flex flex-col gap-4">
                <input type="text" placeholder="اسم المعلن..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm outline-none" />
                <button className="w-full py-4 bg-purple-600 text-white font-black text-sm rounded-2xl">نشر الاستوري الآن</button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-black text-zinc-400 px-2 uppercase tracking-widest">الاستوريهات النشطة</h3>
              {[1, 2].map(i => (
                <div key={i} className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={`https://i.pravatar.cc/100?img=${i+20}`} className="w-10 h-10 rounded-full object-cover border border-purple-500" />
                    <span className="text-xs font-black text-white">معلن رقم {i}</span>
                  </div>
                  <button className="p-2 bg-red-500/10 text-red-500 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tab: Categories */}
        {activeTab === "categories" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
              <h3 className="text-sm font-black mb-2">إضافة قسم جديد</h3>
              <input 
                type="text" 
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
                placeholder="اسم القسم الجديد..." 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm outline-none" 
              />
              <button onClick={handleAddCategory} className="w-full py-3 bg-white text-black rounded-xl font-black text-xs">
                {isAdding ? <RefreshCw className="w-4 h-4 animate-spin" /> : "إضافة القسم"}
              </button>
            </div>
          </motion.div>
        )}

        {/* Tab: Community Moderation */}
        {activeTab === "community" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
            <h3 className="text-sm font-black text-zinc-300">إدارة المجتمع</h3>
            <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 flex flex-col gap-3">
              <p className="text-xs font-bold">"أنهينا اليوم مشروع ضخم لتصميم هوية بصرية..."</p>
              <button className="w-full py-2 bg-red-500 text-white rounded-lg text-[10px] font-black">حذف المنشور</button>
            </div>
          </motion.div>
        )}

        {/* Tab: Withdrawals Management */}
        {activeTab === "withdrawals" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
            <h3 className="text-sm font-black text-zinc-300">طلبات سحب الأرباح المعلقة</h3>
            <div className="flex flex-col gap-4">
              {[1, 2].map(i => (
                <div key={i} className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 shadow-xl">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-black text-zinc-400">M</div>
                      <div>
                        <h4 className="text-sm font-black text-white">محمد أحمد (مستقل)</h4>
                        <p className="text-[10px] text-zinc-400 font-bold">المبلغ المطلوب: 1,500 ر.س</p>
                      </div>
                    </div>
                    <span className="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-[9px] font-black uppercase">معلق</span>
                  </div>
                  
                  <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 mb-4">
                    <p className="text-[10px] text-zinc-500 font-black uppercase mb-1">بيانات التحويل</p>
                    <p className="text-xs font-bold text-zinc-300">فودافون كاش: 01012345678</p>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 py-3 bg-green-500 text-white rounded-xl text-xs font-black shadow-lg shadow-green-500/20">موافقة وتحويل</button>
                    <button className="flex-1 py-3 bg-zinc-800 text-zinc-300 rounded-xl text-xs font-black">رفض الطلب</button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Tab: Support & Settings */}
        {activeTab === "settings" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
            <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
              <h3 className="text-sm font-black mb-4 flex items-center gap-2"><DollarSign className="w-4 h-4 text-yellow-400" /> التحكم في عمولة المنصة</h3>
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-[10px] text-zinc-400 font-bold">نسبة العمولة من كل عملية (%)</label>
                  <div className="flex gap-2 items-center mt-1">
                    <input type="number" defaultValue="20" className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm outline-none focus:border-yellow-500" />
                    <span className="text-xl font-black text-white">%</span>
                  </div>
                </div>
                <button className="w-full py-3 bg-yellow-500 text-black font-black text-xs rounded-xl shadow-lg shadow-yellow-500/20">تحديث نسبة العمولة</button>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800">
              <h3 className="text-sm font-black mb-4 flex items-center gap-2"><Phone className="w-4 h-4 text-green-400" /> أرقام الدعم</h3>
              <input type="text" defaultValue="+966500000000" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm" />
              <button className="w-full mt-4 py-3 bg-white text-black font-black text-sm rounded-xl">حفظ</button>
            </div>
          </motion.div>
        )}
        
      </div>
    </motion.div>
  );
}
