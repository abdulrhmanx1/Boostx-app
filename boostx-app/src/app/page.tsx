"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, ShieldCheck, Star, Package, Plus, MoreHorizontal, LayoutGrid, Sparkles, Bell, MessageCircle, Settings, Wallet, ShieldAlert, Layers } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "../utils/supabase/client";
import { useAuthStore } from "../store/useAuthStore";

// Import components
import OnboardingScreen from "./components/OnboardingScreen";
import StoryViewer from "./components/StoryViewer";
import ServiceDetailScreen from "./components/ServiceDetailScreen";
import ProviderDashboard from "./components/ProviderDashboard";
import WalletScreen from "./components/WalletScreen";
import AdminDashboardScreen from "./components/AdminDashboardScreen";
import CommunityFeedScreen from "./components/CommunityFeedScreen";
import PostLeadScreen from "./components/PostLeadScreen";
import MyOrdersScreen from "./components/MyOrdersScreen";
import ProfileScreen from "./components/ProfileScreen";
import NotificationsScreen from "./components/NotificationsScreen";
import LeadsExplorerScreen from "./components/LeadsExplorerScreen";
import { ChevronLeft } from "lucide-react";

export default function AppHome() {
  const { user, isLoading, initialize, isGuest, setGuestMode } = useAuthStore();
  
  useEffect(() => {
    initialize();
  }, [initialize]);

  const [mainMode, setMainMode] = useState<"services" | "portfolios">("services");
  const [subTab, setSubTab] = useState("جديد");
  const [navTab, setNavTab] = useState("home");
  const [showChat, setShowChat] = useState(false);
  const [showServiceDetail, setShowServiceDetail] = useState(false);
  const [showProviderDashboard, setShowProviderDashboard] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showPostLead, setShowPostLead] = useState(false);
  const [showMyOrders, setShowMyOrders] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeStory, setActiveStory] = useState<{ stories: any[], index: number } | null>(null);
  const [hotLeads, setHotLeads] = useState<any[]>([]);
  const [showLeadsExplorer, setShowLeadsExplorer] = useState(false);

  const [categories, setCategories] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDataLoading, setIsDataLoading] = useState(true);

  const isProvider = user?.user_metadata?.account_type === 'FREELANCER' || user?.user_metadata?.account_type === 'AGENCY_OWNER';

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data: catData } = await supabase.from('service_categories').select('*').eq('is_active', true);
      if (catData) setCategories(catData);
      const { data: servData } = await supabase.from('services').select('*, provider:users(full_name)').eq('is_published', true).order('created_at', { ascending: false });
      if (servData) setServices(servData);
      
      // Fetch Hot Leads (if provider)
      const { data: leadData } = await supabase
        .from('leads')
        .select('*, client:users(full_name), category:service_categories(name)')
        .eq('status', 'OPEN')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (leadData) setHotLeads(leadData);
      
      setIsDataLoading(false);
    };
    fetchData();
  }, []);

  const filteredServices = services.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sampleStories = [
    { id: 1, name: "أحمد مصمم", avatar: "https://i.pravatar.cc/100?img=12", image: "https://picsum.photos/1080/1920?random=10" },
    { id: 2, name: "وكالة إبداع", avatar: "https://i.pravatar.cc/100?img=33", image: "https://picsum.photos/1080/1920?random=11" },
    { id: 3, name: "سارة مبرمجة", avatar: "https://i.pravatar.cc/100?img=44", image: "https://picsum.photos/1080/1920?random=12" },
    { id: 4, name: "تكنو كود", avatar: "https://i.pravatar.cc/100?img=55", image: "https://picsum.photos/1080/1920?random=13" },
  ];

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background flex-col gap-8 z-[100]">
        <img src="/logo.png" alt="BoostX Logo" className="w-48 object-contain electric-logo" />
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full border-4 border-primary border-t-accent animate-spin"></div>
          <p className="text-xs font-black text-primary/80 animate-pulse">جاري تحميل النظام...</p>
        </div>
      </div>
    );
  }

  const handleActionRequiringAuth = (action: () => void) => {
    if (!user && isGuest) {
      alert("عذراً، يجب عليك تسجيل الدخول أولاً للقيام بهذه العملية!");
      setGuestMode(false);
      return;
    }
    action();
  };

  if (!user && !isGuest) {
    return <OnboardingScreen onComplete={() => {}} onGuest={() => setGuestMode(true)} />;
  }

  return (
    <main className="w-full min-h-screen relative pb-32 bg-background overflow-x-hidden">
      
      <AnimatePresence mode="wait">
        {navTab === "home" && (
          <motion.div key="home" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            {/* Header */}
            <header className="px-4 pt-12 pb-4 flex justify-between items-center sticky top-0 bg-background/70 backdrop-blur-xl z-40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-primary overflow-hidden">
                  <img src={user?.user_metadata?.avatar_url || "https://i.pravatar.cc/150?img=11"} alt="User" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold">مرحباً بك،</p>
                  <h1 className="text-sm font-black text-foreground">{user?.user_metadata?.full_name || "زائر بوست"} 👋</h1>
                </div>
              </div>
              
              <div className="flex gap-2">
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowNotifications(true)} className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm border border-white/10 relative">
                  <Bell className="w-5 h-5 text-white" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center border-2 border-background"><span className="text-[8px] font-black text-white">4</span></div>
                </motion.button>

                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowProfile(true)} className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm border border-white/10 overflow-hidden relative">
                  <img src={user?.user_metadata?.avatar_url || "https://i.pravatar.cc/100?img=12"} alt="User" className="w-full h-full object-cover" />
                </motion.button>
                
                {isProvider && (
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowProviderDashboard(true)} className="w-10 h-10 bg-primary/10 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm border border-primary/20 relative electric-tap">
                    <Settings className="w-5 h-5 text-primary" />
                  </motion.button>
                )}
              </div>
            </header>

            {/* Search */}
            <div className="px-4 mt-2">
              <div className="w-full bg-white rounded-xl flex items-center px-4 h-12 shadow-sm border border-border">
                <div className="flex-1 relative">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="ابحث عن مبرمج، مصمم، أو خدمة..." className="w-full bg-transparent border-none outline-none text-primary placeholder:text-muted-foreground font-medium text-sm text-right pr-8" dir="rtl" />
                </div>
              </div>
            </div>

            {/* 📸 Stories Bar */}
            <div className="mt-8 px-4">
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                <div className="flex flex-col items-center gap-1.5 shrink-0">
                  <div className="w-16 h-16 rounded-full bg-muted border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                    <Plus className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <span className="text-[10px] font-black text-muted-foreground">قصتك</span>
                </div>
                {sampleStories.map((story, i) => (
                  <motion.div key={story.id} whileTap={{ scale: 0.9 }} onClick={() => setActiveStory({ stories: sampleStories, index: i })} className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer">
                    <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 via-primary to-purple-500 shadow-lg electric-logo">
                      <img src={story.avatar} alt={story.name} className="w-full h-full rounded-full object-cover border-2 border-white" />
                    </div>
                    <span className="text-[10px] font-black text-foreground truncate w-16 text-center">{story.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 🔥 Hot Leads Section (Visible only to Providers) */}
            {isProvider && hotLeads.length > 0 && (
              <section className="mt-8 px-4">
                <div className="flex justify-between items-end mb-4">
                  <h3 className="text-lg font-black text-foreground flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-500" /> اقتنص الفرصة الآن
                  </h3>
                  <button onClick={() => setShowLeadsExplorer(true)} className="text-[10px] font-black text-primary">عرض كل الطلبات</button>
                </div>
                <div className="flex flex-col gap-3">
                  {hotLeads.map((lead) => (
                    <motion.div 
                      key={lead.id} 
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowProviderDashboard(true)}
                      className="bg-primary/5 rounded-2xl p-4 border border-primary/20 flex justify-between items-center"
                    >
                      <div className="flex-1">
                        <h4 className="text-[11px] font-black text-foreground line-clamp-1">{lead.description}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">{lead.category?.name}</span>
                          <span className="text-[9px] font-bold text-muted-foreground">{lead.budget_range}</span>
                        </div>
                      </div>
                      <ChevronLeft className="w-5 h-5 text-primary rtl:-scale-x-100" />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* 🔘 Tabs */}
            <section className="px-4 mt-6 flex gap-3">
              <button onClick={() => setMainMode("services")} className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all border ${mainMode === "services" ? "bg-primary text-white border-transparent" : "bg-white text-primary border-border"}`}>
                <Sparkles className="w-5 h-5" /> خدمات جديدة
              </button>
              <button onClick={() => setMainMode("portfolios")} className={`flex-1 flex justify-center items-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all border ${mainMode === "portfolios" ? "bg-primary text-white border-transparent" : "bg-white text-primary border-border"}`}>
                <LayoutGrid className="w-5 h-5" /> معرض الأعمال
              </button>
            </section>

            {mainMode === "services" ? (
              <div className="mt-8">
                {/* Banner */}
                <div className="px-4">
                  <div className="purple-glass rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl border border-white/10">
                    <div className="relative z-10 w-2/3" dir="rtl">
                      <h2 className="text-2xl font-black text-white leading-tight mb-2">أضخم المشاريع<br/>بين يديك الآن</h2>
                      <p className="text-sm text-white/80 font-medium mb-4">بأسعار أقل من السوق المعتاد!</p>
                      <button onClick={() => setShowPostLead(true)} className="bg-accent text-primary text-xs font-black px-4 py-2 rounded-xl shadow-lg electric-tap">اطلب مشروعك الآن</button>
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <section className="mt-8">
                  <div className="flex justify-between items-end px-4 mb-4">
                    <h3 className="text-lg font-black text-foreground">الأقسام الرئيسية</h3>
                    <button className="text-xs font-bold text-primary">عرض الكل</button>
                  </div>
                  <div className="flex gap-4 overflow-x-auto px-4 no-scrollbar">
                    {categories.map((cat) => (
                      <div key={cat.id} className="flex flex-col items-center gap-2 shrink-0">
                        <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-border flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <LayoutGrid className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-black text-foreground">{cat.name}</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Services Grid */}
                <section className="mt-8 px-4">
                  <div className="flex justify-between items-end mb-4">
                    <h3 className="text-lg font-black text-foreground">{searchQuery ? `نتائج البحث عن "${searchQuery}"` : "أحدث الخدمات"}</h3>
                    {!searchQuery && <button className="text-xs font-bold text-primary">استكشف المزيد</button>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {filteredServices.map((service) => (
                      <motion.div key={service.id} onClick={() => setShowServiceDetail(true)} className="bg-white rounded-3xl overflow-hidden border border-border shadow-sm flex flex-col cursor-pointer">
                        <img src={`https://picsum.photos/300/200?random=${service.id}`} className="w-full h-32 object-cover" />
                        <div className="p-3" dir="rtl">
                          <h4 className="text-[11px] font-black text-foreground line-clamp-1">{service.title}</h4>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs font-black text-primary">{service.price} ر.س</span>
                            <div className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /><span className="text-[10px] font-black text-muted-foreground">4.9</span></div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              </div>
            ) : (
              <CommunityFeedScreen />
            )}
          </motion.div>
        )}
        
        {/* Navigation Bar */}
        <div className="fixed bottom-6 left-6 right-6 h-16 bg-white/80 backdrop-blur-xl border border-border rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center justify-around px-4 z-40">
          <button onClick={() => setNavTab("home")} className={`p-3 rounded-full transition-all ${navTab === "home" ? "bg-primary text-white shadow-lg shadow-primary/30" : "text-muted-foreground hover:bg-muted"}`}><Sparkles className="w-6 h-6" /></button>
          <button onClick={() => setShowMyOrders(true)} className={`p-3 rounded-full transition-all ${navTab === "orders" ? "bg-primary text-white shadow-lg shadow-primary/30" : "text-muted-foreground hover:bg-muted"}`}><Package className="w-6 h-6" /></button>
          <button onClick={() => setShowChat(true)} className={`p-3 rounded-full transition-all ${navTab === "chat" ? "bg-primary text-white shadow-lg shadow-primary/30" : "text-muted-foreground hover:bg-muted"}`}><MessageCircle className="w-6 h-6" /></button>
          <button onClick={() => setShowProfile(true)} className={`p-3 rounded-full transition-all ${navTab === "profile" ? "bg-primary text-white shadow-lg shadow-primary/30" : "text-muted-foreground hover:bg-muted"}`}><User className="w-6 h-6" /></button>
        </div>

        {/* Modals */}
        {showServiceDetail && <ServiceDetailScreen onClose={() => setShowServiceDetail(false)} onOpenChat={() => setShowChat(true)} />}
        {showProviderDashboard && <ProviderDashboard onClose={() => setShowProviderDashboard(false)} />}
        {showAdmin && <AdminDashboardScreen onClose={() => setShowAdmin(false)} />}
        {showWallet && <WalletScreen onClose={() => setShowWallet(false)} />}
        {showPostLead && <PostLeadScreen onClose={() => setShowPostLead(false)} />}
        {showMyOrders && <MyOrdersScreen onClose={() => setShowMyOrders(false)} />}
        {showProfile && <ProfileScreen onClose={() => setShowProfile(false)} />}
        {showNotifications && <NotificationsScreen onClose={() => setShowNotifications(false)} />}
        {showLeadsExplorer && <LeadsExplorerScreen onClose={() => setShowLeadsExplorer(false)} />}
        {activeStory && (
          <StoryViewer stories={activeStory.stories} initialIndex={activeStory.index} onClose={() => setActiveStory(null)} />
        )}
      </AnimatePresence>
    </main>
  );
}

function User(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}
