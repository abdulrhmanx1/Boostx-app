"use client";

import { motion } from "framer-motion";
import { Coins, MapPin, Calendar, Lock, Unlock, Phone, MessageSquare, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "../../utils/supabase/client";
import { useAuthStore } from "../../store/useAuthStore";

export default function ExploreLeadsScreen() {
  const { user } = useAuthStore();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unlockedLeads, setUnlockedLeads] = useState<string[]>([]);
  const [isUnlocking, setIsUnlocking] = useState<string | null>(null);

  useEffect(() => {
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

    fetchLeads();
  }, []);

  const handleUnlockLead = async (leadId: string, cost: number) => {
    setIsUnlocking(leadId);
    // Simulating wallet check and deduction for prototype
    // In real app, we'd update public.users.wallet_balance via RPC or trigger
    
    setTimeout(() => {
      setUnlockedLeads([...unlockedLeads, leadId]);
      setIsUnlocking(null);
      alert("تم فتح بيانات العميل! يمكنك الآن التواصل معه مباشرة.");
    }, 1500);
  };

  if (loading) return <div className="p-12 text-center"><RefreshCw className="w-10 h-10 animate-spin mx-auto text-primary" /></div>;

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      <div className="bg-primary/5 p-4 rounded-2xl flex items-center justify-between border border-primary/20">
        <div className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-yellow-500" />
          <span className="text-sm font-black text-primary">رصيد عملاتك: 120 عملة</span>
        </div>
        <button className="text-[10px] font-bold bg-primary text-white px-3 py-1.5 rounded-lg">شحن الرصيد</button>
      </div>

      <div className="flex flex-col gap-4">
        {leads.length > 0 ? leads.map((lead) => {
          const isUnlocked = unlockedLeads.includes(lead.id);
          
          return (
            <motion.div 
              key={lead.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-5 border border-border shadow-sm flex flex-col gap-4"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
                    <img src={lead.client?.avatar_url || "https://i.pravatar.cc/100"} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-foreground truncate max-w-[150px]">{lead.description.slice(0, 30)}...</h4>
                    <p className="text-[10px] font-bold text-muted-foreground">{lead.category?.name || "عام"} • {lead.city}</p>
                  </div>
                </div>
                <div className="bg-accent px-3 py-1 rounded-full">
                  <span className="text-[10px] font-black text-primary">{lead.budget_range}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs font-bold text-foreground/80 leading-relaxed bg-muted/30 p-3 rounded-xl border border-border/50">
                {lead.description}
              </p>

              {/* Action Bar */}
              <div className="flex items-center gap-3 pt-2">
                {isUnlocked ? (
                  <div className="flex-1 flex gap-2">
                    <button className="flex-1 py-3 bg-green-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2">
                      <Phone className="w-4 h-4" /> اتصل الآن
                    </button>
                    <button className="flex-1 py-3 bg-blue-500 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2">
                      <MessageSquare className="w-4 h-4" /> واتساب
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleUnlockLead(lead.id, lead.contact_unlock_price_coins)}
                    disabled={isUnlocking === lead.id}
                    className="flex-1 py-3 bg-black text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-lg hover:scale-[0.98] active:scale-95 transition-all disabled:opacity-50"
                  >
                    {isUnlocking === lead.id ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Lock className="w-4 h-4" /> 
                        فتح الطلب ({lead.contact_unlock_price_coins} عملات)
                      </>
                    )}
                  </button>
                )}
                
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold">منذ ساعة</span>
                </div>
              </div>
            </motion.div>
          );
        }) : (
          <div className="p-8 text-center text-muted-foreground font-bold">لا توجد طلبات مشاريع متاحة حالياً.</div>
        )}
      </div>
    </div>
  );
}
