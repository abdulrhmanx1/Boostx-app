"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Clock, DollarSign, Send, X, ShieldCheck, User, Briefcase, ChevronLeft, Loader2, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "../../utils/supabase/client";
import { useAuthStore } from "../../store/useAuthStore";

export default function LeadsExplorerScreen({ onClose }: { onClose: () => void }) {
  const { user } = useAuthStore();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [proposalPrice, setProposalPrice] = useState("");
  const [proposalNotes, setProposalNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchLeads = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('leads')
      .select('*, client:users(full_name, avatar_url), category:service_categories(name)')
      .eq('status', 'OPEN')
      .order('created_at', { ascending: false });
    
    if (data) setLeads(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleSubmitProposal = async () => {
    if (!proposalPrice || !proposalNotes) return;
    setIsSubmitting(true);
    
    const supabase = createClient();
    // We would insert into 'negotiations' table as per schema
    const { error } = await supabase.from('negotiations').insert({
      lead_id: selectedLead.id,
      provider_id: user?.id,
      proposed_price: parseFloat(proposalPrice),
      notes: proposalNotes,
      status: 'PENDING'
    });

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("تم إرسال عرضك بنجاح! سيتم تنبيه العميل لمراجعته.");
      setSelectedLead(null);
      setProposalPrice("");
      setProposalNotes("");
    }
    setIsSubmitting(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      className="fixed inset-0 z-[140] bg-zinc-50 flex flex-col"
      dir="rtl"
    >
      {/* 🔍 Header */}
      <header className="bg-white border-b border-zinc-100 pt-12 pb-6 px-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 bg-zinc-50 rounded-full text-zinc-400"><ChevronLeft className="w-6 h-6 rtl:-scale-x-100" /></button>
          <div>
            <h2 className="text-xl font-black text-zinc-800">سوق المشاريع</h2>
            <p className="text-[10px] font-bold text-zinc-400">اكتشف أحدث طلبات العملاء وقدم عرضك</p>
          </div>
        </div>
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
          <Sparkles className="w-5 h-5" />
        </div>
      </header>

      {/* 📄 Content */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 no-scrollbar pb-32">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-40">
            <Loader2 className="w-10 h-10 animate-spin mb-2" />
            <p className="font-black text-xs uppercase tracking-widest">جاري جلب المشاريع...</p>
          </div>
        ) : leads.map((lead) => (
          <motion.div 
            key={lead.id} 
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-[2rem] p-6 border border-zinc-100 shadow-sm relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <img src={lead.client?.avatar_url || "https://i.pravatar.cc/100?img=5"} className="w-12 h-12 rounded-full object-cover border-2 border-primary/20" />
                <div>
                  <h3 className="text-sm font-black text-zinc-800">{lead.client?.full_name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md uppercase">{lead.category?.name}</span>
                    <span className="text-[9px] font-bold text-zinc-400 flex items-center gap-1"><Clock className="w-3 h-3" /> قبل ساعتين</span>
                  </div>
                </div>
              </div>
              <div className="text-left">
                <p className="text-[9px] font-black text-zinc-400 uppercase">الميزانية</p>
                <p className="text-sm font-black text-green-500">{lead.budget_range}</p>
              </div>
            </div>

            <p className="text-xs font-bold text-zinc-600 leading-relaxed mb-6 line-clamp-3">{lead.description}</p>

            <div className="flex gap-2">
              <button 
                onClick={() => setSelectedLead(lead)}
                className="flex-1 py-3.5 bg-primary text-white rounded-2xl font-black text-xs shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> قدم عرضك الآن
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 📝 Submit Proposal Modal */}
      <AnimatePresence>
        {selectedLead && (
          <div className="fixed inset-0 z-[150] bg-black/80 flex items-center justify-center p-6 backdrop-blur-md">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm relative">
              <button onClick={() => setSelectedLead(null)} className="absolute top-6 left-6 p-2 bg-zinc-50 rounded-full text-zinc-400"><X className="w-4 h-4" /></button>
              
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black">تقديم عرض مشروع</h3>
                <p className="text-[10px] text-zinc-400 font-bold mt-1">أقنع العميل بمهاراتك وسعرك المناسب.</p>
              </div>

              <div className="flex flex-col gap-4 text-right">
                <div>
                  <label className="text-[10px] font-black text-zinc-400 block mb-2 px-1">سعر العرض (ر.س)</label>
                  <input 
                    type="number" 
                    value={proposalPrice}
                    onChange={e => setProposalPrice(e.target.value)}
                    placeholder="مثال: 500" 
                    className="w-full bg-zinc-50 border-none p-4 rounded-2xl text-xs font-black outline-none focus:ring-2 ring-primary/20" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-zinc-400 block mb-2 px-1">تفاصيل عرضك</label>
                  <textarea 
                    value={proposalNotes}
                    onChange={e => setProposalNotes(e.target.value)}
                    placeholder="اشرح كيف ستنفذ المشروع والمدة المتوقعة..." 
                    className="w-full bg-zinc-50 rounded-2xl p-4 text-xs font-bold outline-none resize-none h-32" 
                  />
                </div>
                <button 
                  onClick={handleSubmitProposal}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/30 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "إرسال العرض للعميل"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
