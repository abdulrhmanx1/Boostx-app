"use client";

import { motion } from "framer-motion";
import { Check, Edit2, Zap } from "lucide-react";

export default function PlansManagementPage() {
  const plans = [
    {
      name: "الأساسية (مستقل)",
      price: "مجاناً",
      users: 5420,
      features: ["إضافة 3 خدمات بحد أقصى", "عمولة منصة 15%", "دعم فني عادي"],
      recommended: false
    },
    {
      name: "الاحترافية (وكالة)",
      price: "490 ريال / سنوياً",
      users: 1250,
      features: ["خدمات غير محدودة", "عمولة منصة 10%", "إضافة 5 موظفين", "دعم فني أولوية"],
      recommended: true
    },
    {
      name: "الأعمال (شركات كبرى)",
      price: "1200 ريال / سنوياً",
      users: 310,
      features: ["كل مميزات الاحترافية", "عمولة منصة 5%", "موظفين غير محدودين", "مدير حساب مخصص"],
      recommended: false
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-primary mb-2">إدارة الخطط والاشتراكات</h1>
        <p className="text-muted-foreground">تعديل باقات الاشتراك السنوية وأسعارها ومميزاتها</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
        {plans.map((plan, i) => (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            key={i}
            className={`relative bg-background rounded-3xl p-8 border-2 ${
              plan.recommended ? "border-accent shadow-2xl shadow-accent/10" : "border-border"
            }`}
          >
            {plan.recommended && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                <Zap className="w-4 h-4" /> الباقة الأكثر طلباً
              </div>
            )}
            
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-primary">{plan.name}</h2>
              <button className="text-muted-foreground hover:text-primary transition-colors">
                <Edit2 className="w-5 h-5" />
              </button>
            </div>
            
            <div className="text-3xl font-extrabold text-primary mb-2">{plan.price}</div>
            <div className="text-sm text-muted-foreground mb-8">عدد المشتركين: <span className="font-bold text-primary">{plan.users}</span></div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, j) => (
                <li key={j} className="flex items-center gap-3 text-muted-foreground font-medium">
                  <div className="p-1 bg-accent/20 text-accent rounded-full">
                    <Check className="w-4 h-4" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            <button className="w-full py-4 rounded-xl border border-primary/20 text-primary font-bold hover:bg-primary/5 transition-colors">
              تعديل تفاصيل الباقة
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
