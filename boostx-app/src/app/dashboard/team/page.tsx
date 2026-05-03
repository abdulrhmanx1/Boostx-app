"use client";

import { motion } from "framer-motion";
import { Plus, Users, Shield, MoreVertical } from "lucide-react";
import { useState } from "react";

export default function TeamManagementPage() {
  const [showAddModal, setShowAddModal] = useState(false);

  const team = [
    { id: 1, name: "محمد أحمد", role: "UI/UX Designer", email: "mohamed@agency.com", status: "نشط" },
    { id: 2, name: "سارة خالد", role: "Content Creator", email: "sara@agency.com", status: "نشط" },
    { id: 3, name: "عمر عبدالله", role: "Video Editor", email: "omar@agency.com", status: "غير نشط" },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-primary mb-2">إدارة فريق العمل</h1>
          <p className="text-muted-foreground">أضف موظفيك وامنحهم صلاحيات مخصصة لإدارة المشاريع</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:opacity-90 shadow-lg shadow-primary/30 transition-all"
        >
          <Plus className="w-5 h-5" />
          إضافة موظف جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-background p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="p-4 bg-primary/10 rounded-xl text-primary"><Users /></div>
          <div><div className="text-2xl font-extrabold text-primary">3</div><div className="text-sm text-muted-foreground">إجمالي الموظفين</div></div>
        </div>
        <div className="bg-background p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="p-4 bg-accent/10 rounded-xl text-accent"><Shield /></div>
          <div><div className="text-2xl font-extrabold text-primary">2</div><div className="text-sm text-muted-foreground">موظفين نشطين</div></div>
        </div>
      </div>

      <div className="bg-background rounded-3xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="p-6 font-bold text-primary">الموظف</th>
                <th className="p-6 font-bold text-primary">الدور الوظيفي</th>
                <th className="p-6 font-bold text-primary">البريد الإلكتروني</th>
                <th className="p-6 font-bold text-primary">الحالة</th>
                <th className="p-6 font-bold text-primary text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {team.map((member, i) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={member.id} 
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {member.name.charAt(0)}
                      </div>
                      <span className="font-bold text-primary">{member.name}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="bg-primary/5 text-primary px-3 py-1 rounded-full text-sm font-bold border border-primary/10">
                      {member.role}
                    </span>
                  </td>
                  <td className="p-6 text-muted-foreground">{member.email}</td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      member.status === 'نشط' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="p-6 text-center">
                    <button className="text-muted-foreground hover:text-primary transition-colors">
                      <MoreVertical className="w-5 h-5 mx-auto" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-background rounded-3xl p-8 max-w-md w-full shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-primary mb-6">إضافة موظف جديد</h2>
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-bold text-primary mb-2">اسم الموظف</label>
                <input type="text" className="w-full bg-muted border border-border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-2">البريد الإلكتروني للوصول</label>
                <input type="email" className="w-full bg-muted border border-border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div>
                <label className="block text-sm font-bold text-primary mb-2">الصلاحية / الدور الوظيفي</label>
                <select className="w-full bg-muted border border-border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option>مصمم (Designer)</option>
                  <option>كاتب محتوى (Content Creator)</option>
                  <option>محرر فيديو (Video Editor)</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 rounded-full font-bold bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
              >
                إلغاء
              </button>
              <button className="flex-1 py-3 rounded-full font-bold bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                حفظ وإرسال دعوة
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
