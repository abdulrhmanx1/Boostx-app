"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, MessageSquare, ShoppingBag, ChevronRight, ChevronLeft } from "lucide-react";
import { useState } from "react";

export default function StoryViewer({ stories, initialIndex, onClose }: { stories: any[], initialIndex: number, onClose: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLiked, setIsLiked] = useState(false);

  const currentStory = stories[currentIndex];

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center"
    >
      {/* Progress Bars */}
      <div className="absolute top-12 left-0 w-full px-4 flex gap-1.5 z-50">
        {stories.map((_, i) => (
          <div key={i} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: i < currentIndex ? "100%" : i === currentIndex ? "100%" : "0%" }}
              transition={{ duration: i === currentIndex ? 5 : 0 }}
              onAnimationComplete={() => i === currentIndex && handleNext()}
              className="h-full bg-white"
            />
          </div>
        ))}
      </div>

      {/* Header Info */}
      <div className="absolute top-16 left-0 w-full px-6 flex justify-between items-center z-50" dir="rtl">
        <div className="flex items-center gap-3">
          <img src={currentStory.avatar} className="w-10 h-10 rounded-full border-2 border-white" />
          <div>
            <h4 className="text-white text-sm font-black shadow-sm">{currentStory.name}</h4>
            <p className="text-white/60 text-[10px] font-bold">إعلان ممول</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 bg-white/10 rounded-full text-white backdrop-blur-md"><X className="w-6 h-6" /></button>
      </div>

      {/* Main Content */}
      <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
        <img src={currentStory.image} className="w-full h-full object-cover" />
        
        {/* Navigation Areas */}
        <div className="absolute inset-0 flex">
          <div className="flex-1" onClick={handlePrev} />
          <div className="flex-1" onClick={handleNext} />
        </div>
      </div>

      {/* Footer Action */}
      <div className="absolute bottom-12 left-0 w-full px-6 flex flex-col gap-4 z-50" dir="rtl">
        <div className="flex items-center gap-4">
          <input 
            type="text" 
            placeholder="رد سريع..." 
            className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl py-3 px-4 text-white text-xs font-bold outline-none placeholder:text-white/50"
          />
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className={`p-3 rounded-2xl transition-colors ${isLiked ? 'bg-red-500 text-white' : 'bg-white/10 text-white backdrop-blur-md border border-white/20'}`}
          >
            <Heart className={`w-6 h-6 ${isLiked ? 'fill-white' : ''}`} />
          </button>
        </div>
        <button className="w-full py-4 bg-primary text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl">
          <ShoppingBag className="w-5 h-5" /> تصفح خدمات المعلن
        </button>
      </div>
    </motion.div>
  );
}
