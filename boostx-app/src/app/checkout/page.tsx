"use client";

import { motion } from "framer-motion";
import { CreditCard, CheckCircle2, ArrowRight, ShieldCheck, FileText } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CheckoutPage() {
  const [step, setStep] = useState(1);

  return (
    <main className="min-h-screen bg-muted rtl py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/services" className="inline-flex items-center gap-2 text-primary hover:text-accent font-bold mb-8 transition-colors">
          <ArrowRight className="w-5 h-5" /> العودة للخدمات
        </Link>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Main Checkout Area */}
          <div className="flex-1 space-y-6">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8 relative">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-border -z-10 -translate-y-1/2 rounded-full"></div>
              <div className={`w-1/2 h-1 absolute top-1/2 right-0 bg-primary -z-10 -translate-y-1/2 rounded-full transition-all ${step === 2 ? 'w-full' : ''}`}></div>
              
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 ${step >= 1 ? 'bg-primary text-primary-foreground border-primary/20' : 'bg-background text-muted-foreground border-border'}`}>1</div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 ${step >= 2 ? 'bg-primary text-primary-foreground border-primary/20' : 'bg-background text-muted-foreground border-border'}`}>2</div>
            </div>

            {step === 1 ? (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-background rounded-3xl p-8 border border-border shadow-sm">
                <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2"><FileText /> تفاصيل الطلب</h2>
                <p className="text-muted-foreground mb-6">يرجى كتابة كافة التفاصيل التي يحتاجها مقدم الخدمة للبدء في التنفيذ.</p>
                <textarea 
                  rows={6}
                  placeholder="وصف تفصيلي لما تحتاجه (مثال: أحتاج تصميم لوجو بألوان زاهية لمطعم وجبات سريعة...)" 
                  className="w-full bg-muted border border-border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none mb-6"
                />
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center text-muted-foreground hover:border-primary/50 transition-colors cursor-pointer mb-8">
                  قم بسحب وإفلات الملفات المرفقة هنا (صور، مستندات، أمثلة)
                </div>
                <button onClick={() => setStep(2)} className="w-full bg-primary text-primary-foreground py-4 rounded-full font-bold text-lg hover:opacity-90 shadow-lg shadow-primary/30 transition-all">
                  متابعة للدفع
                </button>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-background rounded-3xl p-8 border border-border shadow-sm">
                <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2"><CreditCard /> طريقة الدفع</h2>
                <div className="space-y-4 mb-8">
                  <label className="flex items-center gap-4 p-4 border border-accent bg-accent/5 rounded-xl cursor-pointer">
                    <input type="radio" name="payment" defaultChecked className="w-5 h-5 accent-primary" />
                    <span className="font-bold text-primary">البطاقة الائتمانية (Tap Payments)</span>
                  </label>
                  <label className="flex items-center gap-4 p-4 border border-border hover:border-primary/30 rounded-xl cursor-pointer transition-colors">
                    <input type="radio" name="payment" className="w-5 h-5 accent-primary" />
                    <span className="font-bold text-primary">فودافون كاش (Vodafone Cash)</span>
                  </label>
                </div>
                
                <div className="bg-muted p-4 rounded-xl flex items-start gap-3 mb-8">
                  <ShieldCheck className="w-6 h-6 text-accent shrink-0" />
                  <p className="text-sm text-muted-foreground">مدفوعاتك آمنة بنسبة 100٪. لن يتم تحويل المبلغ لمقدم الخدمة إلا بعد استلامك للعمل كاملاً والموافقة عليه.</p>
                </div>

                <button className="w-full bg-primary text-primary-foreground py-4 rounded-full font-bold text-lg hover:opacity-90 shadow-lg shadow-primary/30 transition-all">
                  تأكيد الدفع (1500 ريال)
                </button>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <aside className="w-full md:w-80">
            <div className="bg-background rounded-3xl p-6 border border-border shadow-sm sticky top-8">
              <h3 className="text-lg font-bold text-primary mb-4 border-b border-border pb-4">ملخص الطلب</h3>
              <div className="flex gap-4 mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-xl"></div>
                <div>
                  <h4 className="font-bold text-primary text-sm line-clamp-2">حملة تسويقية شاملة على تيك توك</h4>
                  <p className="text-xs text-muted-foreground mt-1">وكالة الإبداع</p>
                </div>
              </div>
              <div className="space-y-3 text-sm mb-6 border-b border-border pb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">سعر الخدمة</span>
                  <span className="font-bold text-primary">1500 ريال</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">رسوم المنصة</span>
                  <span className="font-bold text-primary">0 ريال</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-lg">
                <span className="font-bold text-primary">الإجمالي</span>
                <span className="font-extrabold text-accent">1500 ريال</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
