"use client";

import { motion } from "framer-motion";
import { MessageCircle, ThumbsUp, ArrowRight, PenSquare, Search } from "lucide-react";
import Link from "next/link";

export default function CommunityPage() {
  const posts = [
    {
      author: "وكالة الإبداع الرقمي",
      role: "وكالة",
      time: "منذ ساعتين",
      content: "نبحث عن مصمم واجهات (UI/UX) محترف للانضمام لفريقنا بنظام العمل عن بعد. لدينا مشاريع كبرى في السوق السعودي ونحتاج لخبرات مميزة.",
      tags: ["توظيف", "UI/UX", "عمل_عن_بعد"],
      likes: 45,
      comments: 12
    },
    {
      author: "أحمد محمد",
      role: "مستقل",
      time: "منذ 5 ساعات",
      content: "أنهيت للتو كورس متقدم في التسويق الرقمي وتحديثات خوارزميات جوجل لعام 2026. كتبت مقالاً يلخص أهم النقاط، ما رأيكم في التغييرات الجديدة؟",
      tags: ["تسويق_رقمي", "SEO", "نقاش"],
      likes: 120,
      comments: 34
    }
  ];

  return (
    <main className="min-h-screen bg-muted rtl pb-20">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-primary hover:text-accent transition-colors">
              <ArrowRight className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-extrabold text-primary">المجتمع والمدونات</h1>
          </div>
          <button className="bg-primary text-primary-foreground px-5 py-2 rounded-full font-bold flex items-center gap-2 hover:opacity-90">
            <PenSquare className="w-4 h-4" /> كتابة منشور
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 mt-8 flex flex-col md:flex-row gap-8">
        {/* Main Feed */}
        <div className="flex-1 space-y-6">
          {posts.map((post, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="bg-background rounded-3xl p-6 border border-border shadow-sm"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-primary">{post.author}</h3>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="bg-accent/10 text-accent px-2 py-0.5 rounded-full text-xs font-bold">{post.role}</span>
                    <span>•</span>
                    <span>{post.time}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-foreground text-lg leading-relaxed mb-4">{post.content}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag, j) => (
                  <span key={j} className="text-sm text-primary bg-primary/5 px-3 py-1 rounded-full font-medium cursor-pointer hover:bg-primary/10">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-6 pt-4 border-t border-border">
                <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold">
                  <ThumbsUp className="w-5 h-5" /> {post.likes} إعجاب
                </button>
                <button className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold">
                  <MessageCircle className="w-5 h-5" /> {post.comments} تعليق
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sidebar */}
        <aside className="w-full md:w-80 space-y-6">
          <div className="bg-background rounded-3xl p-6 border border-border">
            <div className="relative">
              <input 
                type="text" 
                placeholder="ابحث في المجتمع..." 
                className="w-full bg-muted border-none rounded-xl py-3 pr-12 pl-4 focus:ring-2 focus:ring-primary outline-none"
              />
              <Search className="w-5 h-5 text-muted-foreground absolute right-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="bg-background rounded-3xl p-6 border border-border">
            <h3 className="font-bold text-primary mb-4 text-lg">أكثر المواضيع تداولاً</h3>
            <ul className="space-y-3">
              {["التسويق في السعودية", "مستقبل الـ UI/UX", "طرق زيادة المبيعات", "توظيف مستقلين"].map((topic, i) => (
                <li key={i} className="text-muted-foreground hover:text-accent cursor-pointer transition-colors font-medium">
                  # {topic}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
