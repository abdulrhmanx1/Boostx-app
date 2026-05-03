"use client";

import { motion } from "framer-motion";
import { Filter, Star, Search } from "lucide-react";
import { useState } from "react";

export default function ExploreScreen({ onOpenService }: { onOpenService?: () => void }) {
  const [activeFilter, setActiveFilter] = useState("الكل");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col gap-6"
    >
      {/* 🟢 Search & Filters */}
      <div className="flex gap-2 px-4 mt-2">
        <button className="w-12 h-12 rounded-xl purple-glass flex justify-center items-center shadow-lg border border-accent/30">
          <Filter className="w-5 h-5 text-accent" />
        </button>
        <div className="flex-1 bg-white rounded-xl flex items-center px-4 h-12 shadow-sm border border-border">
          <input 
            type="text" 
            placeholder="بحث متقدم..." 
            className="w-full bg-transparent border-none outline-none text-primary placeholder:text-muted-foreground font-medium text-sm text-right"
            dir="rtl"
          />
          <Search className="text-muted-foreground w-5 h-5 ml-3" />
        </div>
      </div>

      {/* ➖ Filter Chips */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 px-4 pb-2" dir="rtl">
        {["الكل", "تصميم واجهات", "برمجة تطبيقات", "تسويق رقمي", "موشن جرافيك"].map((filter) => (
          <button 
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`whitespace-nowrap px-4 py-2 rounded-full font-bold text-xs transition-all ${
              activeFilter === filter 
                ? "purple-glass text-white border border-accent" 
                : "bg-white text-primary border border-border"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* 📦 Services Grid */}
      <div className="grid grid-cols-2 gap-4 px-4 pb-20">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <motion.div key={item} onClick={onOpenService} whileTap={{ scale: 0.97 }} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border/50 flex flex-col cursor-pointer">
            {/* Image Placeholder */}
            <div className="w-full aspect-[4/3] bg-muted relative">
              <img src={`https://picsum.photos/400/300?random=${item + 50}`} alt="Service" className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                <span className="text-[10px] font-black text-primary">4.9</span>
              </div>
            </div>
            
            <div className="p-3 flex flex-col flex-1 justify-between">
              <div>
                <h4 className="text-xs font-extrabold text-foreground line-clamp-2 mb-1">تصميم هوية بصرية كاملة للشركات الناشئة</h4>
                <p className="text-[10px] text-muted-foreground">بواسطة: أحمد حسن</p>
              </div>
              <div className="flex justify-between items-center mt-3 pt-2 border-t border-border/50">
                <span className="text-sm font-black text-primary">150 <span className="text-[9px] font-bold">ر.س</span></span>
                <button className="bg-gradient-to-r from-primary to-accent text-white p-1.5 rounded-lg shadow-sm">
                  <span className="text-[10px] font-bold px-2">اطلب</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
