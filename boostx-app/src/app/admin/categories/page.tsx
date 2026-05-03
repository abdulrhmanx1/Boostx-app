"use client";

import { motion } from "framer-motion";
import { Plus, Edit2, Trash2 } from "lucide-react";

export default function CategoriesManagementPage() {
  const categories = [
    { id: 1, name: "التسويق الرقمي", servicesCount: 145, status: "مفعل" },
    { id: 2, name: "التصميم والجرافيك", servicesCount: 230, status: "مفعل" },
    { id: 3, name: "المطبوعات والكلادينج", servicesCount: 85, status: "مفعل" },
    { id: 4, name: "تصميم داخلي 3D", servicesCount: 42, status: "مفعل" },
    { id: 5, name: "خدمات التوصيل", servicesCount: 0, status: "مسودة" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-primary mb-2">إدارة التصنيفات والخدمات</h1>
          <p className="text-muted-foreground">أضف أو عدل أقسام المنصة لتنظيم عرض الخدمات</p>
        </div>
        <button className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:opacity-90 shadow-lg shadow-primary/30 transition-all">
          <Plus className="w-5 h-5" />
          إضافة تصنيف جديد
        </button>
      </div>

      <div className="bg-background rounded-3xl border border-border overflow-hidden shadow-sm">
        <table className="w-full text-right">
          <thead className="bg-muted border-b border-border text-primary">
            <tr>
              <th className="p-6 font-bold">اسم التصنيف</th>
              <th className="p-6 font-bold">عدد الخدمات المرتبطة</th>
              <th className="p-6 font-bold">الحالة</th>
              <th className="p-6 font-bold text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, i) => (
              <motion.tr 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={cat.id} 
                className="border-b border-border hover:bg-muted/50 transition-colors"
              >
                <td className="p-6 font-bold text-primary">{cat.name}</td>
                <td className="p-6 text-muted-foreground">{cat.servicesCount} خدمة</td>
                <td className="p-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    cat.status === 'مفعل' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {cat.status}
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex justify-center gap-3">
                    <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
