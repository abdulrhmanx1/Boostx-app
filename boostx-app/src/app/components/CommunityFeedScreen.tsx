"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, Share2, MoreHorizontal, ShoppingCart, Image as ImageIcon, Briefcase, Star, BadgeCheck, Send, UserPlus, HelpCircle, X, Check } from "lucide-react";
import { useState } from "react";

export default function CommunityFeedScreen() {
  const [activeSubTab, setActiveSubTab] = useState("feed"); // feed or qa
  const [showComments, setShowComments] = useState<number | null>(null);
  const [showHireModal, setShowHireModal] = useState<any | null>(null);

  const posts = [
    {
      id: 1,
      author: "خالد التصميم الرقمي",
      role: "وكالة إبداعية",
      avatar: "https://i.pravatar.cc/150?img=11",
      time: "منذ ساعتين",
      content: "أنهينا اليوم مشروع ضخم لتصميم هوية بصرية وتطبيق لشركة عقارية في الرياض. استغرق العمل 14 يوماً من البحث والتصميم. ما رأيكم في النتيجة النهائية؟",
      image: "https://picsum.photos/600/400?random=1",
      likes: 124,
      comments: 18,
      serviceLink: "تصميم هوية بصرية متكاملة"
    },
    {
      id: 2,
      author: "أحمد المبرمج",
      role: "مطور تطبيقات",
      avatar: "https://i.pravatar.cc/150?img=59",
      time: "أمس",
      content: "لكل من يبحث عن تطبيق سريع باستخدام Next.js، قمت للتو بتحديث خدمتي لتدعم أحدث تقنيات الـ Server Components لسرعة صاروخية! 🚀",
      image: null,
      likes: 85,
      comments: 5,
      serviceLink: "برمجة تطبيقات Next.js"
    }
  ];

  return (
    <div className="flex flex-col gap-6 px-4 pb-24" dir="rtl">
      
      {/* 🚀 Top Admin Slider for Community */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 relative overflow-hidden shadow-lg border border-indigo-400 mb-2">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
        <div className="relative z-10 w-2/3">
          <span className="bg-white/20 text-white text-[10px] font-black px-2 py-1 rounded-md mb-2 inline-block">إعلان ممول (Sponsored)</span>
          <h2 className="text-xl font-black text-white leading-tight mb-2">أفضل 10 أعمال<br/>لشهر مايو</h2>
          <p className="text-xs text-white/80 font-bold mb-4">اكتشف إبداعات الوكالات والمستقلين.</p>
        </div>
      </div>

      {/* ➖ Sub-Tabs (Feed vs Q&A) */}
      <div className="flex gap-4 border-b border-border mb-4">
        <button 
          onClick={() => setActiveSubTab("feed")}
          className={`pb-2 text-xs font-black transition-all ${activeSubTab === "feed" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}
        >
          آخر الأعمال (Feed)
        </button>
        <button 
          onClick={() => setActiveSubTab("qa")}
          className={`pb-2 text-xs font-black transition-all ${activeSubTab === "qa" ? "text-primary border-b-2 border-primary" : "text-muted-foreground"}`}
        >
          أسئلة ونقاشات (Q&A)
        </button>
      </div>

      {activeSubTab === "feed" ? (
        <>
          {/* 📝 Create Post Input */}
          <div className="bg-white rounded-2xl p-4 border border-border shadow-sm flex items-center gap-3">
            <img src="https://i.pravatar.cc/150?img=11" className="w-10 h-10 rounded-full object-cover border border-border" />
            <input type="text" placeholder="انشر عملاً جديداً في معرضك..." className="flex-1 bg-muted rounded-xl p-3 text-[10px] outline-none font-bold text-foreground" />
            <button className="p-2.5 bg-primary/10 text-primary rounded-xl"><ImageIcon className="w-4 h-4" /></button>
          </div>

          {/* 📱 Posts Feed */}
          <div className="flex flex-col gap-6 mt-4">
            {posts.map((post) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                key={post.id} 
                className="bg-white rounded-3xl p-5 border border-border shadow-sm relative"
              >
                {/* Post Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img src={post.avatar} className="w-12 h-12 rounded-full object-cover border border-[var(--toggle-active)]" />
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full"><BadgeCheck className="w-5 h-5 text-blue-500" /></div>
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-foreground flex items-center gap-1">{post.author}</h3>
                      <p className="text-[10px] font-bold text-muted-foreground">{post.role} • {post.time}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowHireModal(post)}
                      className="bg-primary/10 text-primary px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1 hover:bg-primary hover:text-white transition-all"
                    >
                      <UserPlus className="w-3.5 h-3.5" /> توظيف
                    </button>
                    <button className="text-muted-foreground"><MoreHorizontal className="w-5 h-5" /></button>
                  </div>
                </div>

                {/* Post Content */}
                <p className="text-xs font-bold text-foreground leading-relaxed mb-4">{post.content}</p>

                {/* Post Image */}
                {post.image && (
                  <div className="w-full h-48 rounded-2xl overflow-hidden mb-4 border border-border">
                    <img src={post.image} className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Interaction Bar */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex gap-4">
                    <button className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-red-500 transition-colors">
                      <Heart className="w-4 h-4" /> {post.likes}
                    </button>
                    <button 
                      onClick={() => setShowComments(showComments === post.id ? null : post.id)}
                      className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-blue-500 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" /> {post.comments}
                    </button>
                  </div>
                  <button className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-green-500 transition-colors">
                    <Share2 className="w-4 h-4" /> مشاركة
                  </button>
                </div>

                {/* Comments Section (Expandable) */}
                <AnimatePresence>
                  {showComments === post.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-4 pt-4 border-t border-muted overflow-hidden">
                      <div className="flex flex-col gap-3 mb-4">
                        <div className="flex gap-2 items-start">
                          <img src="https://i.pravatar.cc/150?img=3" className="w-7 h-7 rounded-full object-cover" />
                          <div className="bg-muted p-3 rounded-2xl flex-1">
                            <p className="text-[10px] font-black">سارة العمري</p>
                            <p className="text-[10px] font-bold text-foreground/70 mt-1">ما شاء الله تبارك الله، عمل جبار جداً!</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <input type="text" placeholder="اكتب تعليقك..." className="flex-1 bg-muted rounded-xl p-2.5 text-[10px] outline-none font-bold" />
                        <button className="p-2.5 bg-primary text-white rounded-xl"><Send className="w-4 h-4" /></button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-3xl p-6 border border-border shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-primary font-black text-sm">
              <HelpCircle className="w-5 h-5" /> اسأل الخبراء
            </div>
            <textarea placeholder="ما هو سؤالك التقني؟ سارح سؤالك وسيجيب عليه المحترفون..." className="w-full bg-muted rounded-2xl p-4 text-xs font-bold outline-none resize-none h-32" />
            <button className="w-full py-3 bg-primary text-white rounded-xl font-black text-xs mt-4 shadow-lg">نشر السؤال</button>
          </div>
          
          <div className="flex flex-col gap-4 mt-2">
            {[1, 2].map(i => (
              <div key={i} className="bg-white p-4 rounded-2xl border border-border flex flex-col gap-2 shadow-sm">
                <span className="text-[10px] font-black text-blue-500 bg-blue-500/10 self-start px-2 py-0.5 rounded-md">سؤال تقني</span>
                <h4 className="text-xs font-black">كيف يمكنني ربط نظام الدفع في تطبيقات Flutter؟</h4>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex -space-x-2 rtl:space-x-reverse">
                    {[1,2,3].map(j => <img key={j} src={`https://i.pravatar.cc/150?img=${j+10}`} className="w-6 h-6 rounded-full border-2 border-white object-cover" />)}
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground">أجاب عليه 3 خبراء</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🤝 Hire Request Modal */}
      <AnimatePresence>
        {showHireModal && (
          <div className="fixed inset-0 z-[150] bg-black/60 flex items-center justify-center p-6 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm relative">
              <button onClick={() => setShowHireModal(null)} className="absolute top-6 left-6 p-2 bg-muted rounded-full"><X className="w-4 h-4" /></button>
              
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full border-4 border-primary/20 p-1 mx-auto mb-4">
                  <img src={showHireModal.avatar} className="w-full h-full rounded-full object-cover" />
                </div>
                <h3 className="text-lg font-black">طلب توظيف / تعاقد</h3>
                <p className="text-[10px] font-bold text-muted-foreground mt-1">أنت الآن ترسل طلباً لـ {showHireModal.author}</p>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-[10px] font-black text-muted-foreground block mb-2 px-1">نوع التعاقد</label>
                  <select className="w-full bg-muted border-none p-3 rounded-xl text-xs font-bold outline-none">
                    <option>انضمام لفريق وكالة (عن بعد)</option>
                    <option>مشروع خاص محدود</option>
                    <option>دوام كامل</option>
                  </select>
                </div>
                <textarea placeholder="اكتب تفاصيل العرض والراتب/الميزانية المتوقعة..." className="w-full bg-muted rounded-2xl p-4 text-xs font-bold outline-none resize-none h-32" />
                <button 
                  onClick={() => { alert("تم إرسال طلب التوظيف بنجاح! سيصلك تنبيه في حال القبول."); setShowHireModal(null); }}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-black text-sm shadow-xl flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> إرسال العرض الآن
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
