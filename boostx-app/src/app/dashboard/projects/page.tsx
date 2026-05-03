"use client";

import { motion } from "framer-motion";
import { Plus, Image as ImageIcon, Heart, MessageSquare } from "lucide-react";

export default function ProjectsPage() {
  const projects = [
    { title: "تصميم هوية بصرية كاملة - مطعم", likes: 124, comments: 12, category: "تصميم جرافيك" },
    { title: "حملة إعلانية للسوق السعودي", likes: 89, comments: 5, category: "تسويق" },
    { title: "لوحات حروف بارزة - واجهة متجر", likes: 210, comments: 34, category: "مطبوعات و كلادينج" },
    { title: "تصميم داخلي ثلاثي الأبعاد - مكتب", likes: 156, comments: 22, category: "تصميم داخلي" },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-primary mb-2">معرض الأعمال والمشاريع</h1>
          <p className="text-muted-foreground">أضف أعمالك السابقة لتبني ثقة مع عملائك</p>
        </div>
        <button className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:opacity-90 shadow-lg shadow-primary/30 transition-all">
          <Plus className="w-5 h-5" />
          إضافة مشروع جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, i) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            key={i}
            className="group cursor-pointer"
          >
            <div className="w-full aspect-[4/3] bg-muted rounded-3xl mb-4 relative overflow-hidden border border-border group-hover:border-primary/30 transition-colors flex items-center justify-center">
              <ImageIcon className="w-16 h-16 text-muted-foreground/30" />
              <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                <div className="text-white font-bold flex items-center gap-2">
                  <Heart className="fill-current w-5 h-5" /> {project.likes}
                </div>
                <div className="text-white font-bold flex items-center gap-2">
                  <MessageSquare className="fill-current w-5 h-5" /> {project.comments}
                </div>
              </div>
            </div>
            <h3 className="text-lg font-bold text-primary truncate">{project.title}</h3>
            <p className="text-sm text-accent font-bold mt-1">{project.category}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
