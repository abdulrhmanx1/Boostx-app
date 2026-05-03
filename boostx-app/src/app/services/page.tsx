"use client";

import { motion } from "framer-motion";
import { Search, Filter, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ServicesCatalogPage() {
  const [activeCategory, setActiveCategory] = useState("الكل");

  const categories = ["الكل", "التسويق الرقمي", "التصميم والجرافيك", "البرمجة والتطوير", "المطبوعات", "تصميم داخلي"];
  
  const services = [
    { id: 1, title: "حملة تسويقية شاملة على تيك توك", provider: "وكالة الإبداع", rating: 4.9, price: "1500", category: "التسويق الرقمي" },
    { id: 2, title: "تصميم هوية بصرية كاملة (لوجو + مطبوعات)", provider: "أحمد ديزاين", rating: 4.8, price: "800", category: "التصميم والجرافيك" },
    { id: 3, title: "برمجة متجر إلكتروني متكامل", provider: "شركة الحلول البرمجية", rating: 5.0, price: "3500", category: "البرمجة والتطوير" },
    { id: 4, title: "تصميم وتنفيذ حروف بارزة للواجهات", provider: "خطوط للديكور", rating: 4.7, price: "2000", category: "المطبوعات" },
    { id: 5, title: "إدارة حسابات السوشيال ميديا لمدة شهر", provider: "وكالة الإبداع", rating: 4.9, price: "1200", category: "التسويق الرقمي" },
    { id: 6, title: "تصميم ديكور داخلي 3D للمحلات التجارية", provider: "مهندسة نورة", rating: 4.8, price: "2500", category: "تصميم داخلي" },
  ];

  const filteredServices = activeCategory === "الكل" ? services : services.filter(s => s.category === activeCategory);

  return (
    <main className="min-h-screen bg-muted rtl pb-20">
      <header className="bg-primary text-primary-foreground py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">تصفح آلاف الخدمات الإبداعية</h1>
          <div className="relative max-w-2xl mx-auto flex">
            <input 
              type="text" 
              placeholder="ابحث عن تصميم، تسويق، برمجة..." 
              className="w-full h-14 rounded-full px-6 pr-12 text-foreground font-medium focus:outline-none focus:ring-4 focus:ring-accent/50"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground w-6 h-6" />
            <button className="absolute left-2 top-2 bottom-2 bg-accent text-accent-foreground px-6 rounded-full font-bold hover:bg-accent/90 transition-colors">
              بحث
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex items-center gap-4 overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex items-center gap-2 text-primary font-bold ml-4">
            <Filter className="w-5 h-5" /> التصنيفات:
          </div>
          {categories.map((cat, i) => (
            <button 
              key={i}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-6 py-2 rounded-full font-bold transition-all ${
                activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-background text-primary border border-primary/20 hover:border-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {filteredServices.map((service, i) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              key={service.id}
              className="bg-background rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-xl hover:border-primary/30 transition-all cursor-pointer group flex flex-col"
            >
              <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 flex justify-center items-center">
                   <div className="w-16 h-16 rounded-full bg-primary/20 group-hover:scale-110 transition-transform"></div>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold bg-accent/20 text-accent-foreground px-3 py-1 rounded-full">{service.category}</span>
                  <div className="flex items-center gap-1 text-sm font-bold text-yellow-500">
                    <Star className="w-4 h-4 fill-current" /> {service.rating}
                  </div>
                </div>
                <h3 className="font-bold text-primary text-lg mb-2 line-clamp-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">بواسطة: {service.provider}</p>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
                  <div className="text-lg font-extrabold text-primary">
                    {service.price} <span className="text-sm text-muted-foreground font-normal">ريال</span>
                  </div>
                  <Link href="/checkout" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
                    <ShoppingCart className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
