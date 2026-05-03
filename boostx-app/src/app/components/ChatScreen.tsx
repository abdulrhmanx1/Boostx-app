"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Send, Image, Plus, ChevronLeft, MoreVertical, ShieldCheck, Clock, DollarSign, X, CheckCircle, Package } from "lucide-react";
import { useState } from "react";

export default function ChatScreen({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<any[]>([
    { id: 1, text: "أهلاً بك، هل يمكنك تنفيذ تصميم الهوية البصرية؟", sender: "other", time: "10:30 AM" },
    { id: 2, text: "نعم بالتأكيد، قمت بأعمال مشابهة من قبل.", sender: "me", time: "10:32 AM" },
  ]);
  const [inputText, setInputText] = useState("");
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerPrice, setOfferPrice] = useState("");
  const [offerDays, setOfferDays] = useState("");
  const [offerDesc, setOfferDesc] = useState("");

  const handleSend = () => {
    if (!inputText) return;
    setMessages([...messages, { id: Date.now(), text: inputText, sender: "me", time: "Now" }]);
    setInputText("");
  };

  const handleSendOffer = () => {
    if (!offerPrice || !offerDesc) return;
    const offerMessage = {
      id: Date.now(),
      type: "OFFER",
      price: offerPrice,
      days: offerDays,
      description: offerDesc,
      sender: "me",
      status: "PENDING",
      time: "Now"
    };
    setMessages([...messages, offerMessage]);
    setShowOfferModal(false);
    setOfferPrice("");
    setOfferDays("");
    setOfferDesc("");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-[150] bg-white flex flex-col"
      dir="rtl"
    >
      {/* 🔮 Chat Header */}
      <header className="bg-white border-b border-zinc-100 pt-12 pb-4 px-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 bg-zinc-50 rounded-full text-zinc-400"><ChevronLeft className="w-6 h-6 rtl:-scale-x-100" /></button>
          <div className="relative">
            <img src="https://i.pravatar.cc/100?img=12" className="w-10 h-10 rounded-full object-cover border border-zinc-100" />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h3 className="text-sm font-black text-zinc-800">أحمد علي</h3>
            <p className="text-[10px] font-bold text-green-500">متصل الآن</p>
          </div>
        </div>
        <button className="p-2 text-zinc-400"><MoreVertical className="w-6 h-6" /></button>
      </header>

      {/* 💬 Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 no-scrollbar">
        <div className="text-center my-4">
          <span className="text-[9px] font-black text-zinc-300 bg-zinc-50 px-3 py-1 rounded-full uppercase tracking-widest">بداية المحادثة الآمنة</span>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-start" : "justify-end"}`}>
            {msg.type === "OFFER" ? (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-[280px] bg-primary rounded-[2rem] p-6 shadow-xl shadow-primary/20 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-white/20 rounded-xl"><Package className="w-5 h-5" /></div>
                  <h4 className="text-sm font-black uppercase tracking-tight">عرض مخصص</h4>
                </div>
                <p className="text-xs font-bold opacity-90 mb-6 leading-relaxed">{msg.description}</p>
                <div className="flex justify-between items-center mb-6 bg-white/10 p-3 rounded-2xl">
                  <div>
                    <p className="text-[8px] opacity-60 font-black uppercase">السعر</p>
                    <p className="text-sm font-black">{msg.price} ر.س</p>
                  </div>
                  <div className="text-left">
                    <p className="text-[8px] opacity-60 font-black uppercase">التسليم</p>
                    <p className="text-sm font-black">{msg.days} أيام</p>
                  </div>
                </div>
                {msg.sender === "other" ? (
                  <button className="w-full py-3 bg-white text-primary rounded-xl font-black text-xs shadow-lg">قبول العرض وبدء المشروع</button>
                ) : (
                  <div className="text-center py-2 border-t border-white/10 mt-2">
                    <span className="text-[9px] font-black opacity-60 uppercase tracking-widest">بانتظار موافقة العميل</span>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className={`max-w-[80%] p-4 rounded-2xl text-xs font-bold ${msg.sender === "me" ? "bg-zinc-100 text-zinc-800 rounded-tr-none" : "bg-primary text-white rounded-tl-none"}`}>
                {msg.text}
                <p className={`text-[8px] mt-1 opacity-50 ${msg.sender === "me" ? "text-right" : "text-left"}`}>{msg.time}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ⌨️ Input Area */}
      <footer className="p-4 bg-white border-t border-zinc-100 flex items-center gap-2 pb-10">
        <button onClick={() => setShowOfferModal(true)} className="p-3 bg-zinc-50 rounded-2xl text-primary hover:bg-primary/5 transition-colors">
          <Plus className="w-6 h-6" />
        </button>
        <div className="flex-1 bg-zinc-50 rounded-2xl flex items-center px-4">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="اكتب رسالتك هنا..." 
            className="flex-1 bg-transparent border-none py-4 text-xs font-bold outline-none" 
          />
          <button className="p-2 text-zinc-300"><Image className="w-5 h-5" /></button>
        </div>
        <button onClick={handleSend} className="p-4 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20">
          <Send className="w-5 h-5 rtl:-scale-x-100" />
        </button>
      </footer>

      {/* 📝 Create Offer Modal */}
      <AnimatePresence>
        {showOfferModal && (
          <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-6 backdrop-blur-md">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm relative shadow-2xl">
              <button onClick={() => setShowOfferModal(false)} className="absolute top-6 left-6 p-2 bg-zinc-50 rounded-full text-zinc-400"><X className="w-4 h-4" /></button>
              
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black">إرسال عرض مخصص</h3>
                <p className="text-[10px] text-zinc-400 font-bold mt-1">حدد السعر والمدة لإتمام الصفقة الآن.</p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] font-black text-zinc-400 block mb-2 px-1">السعر (ر.س)</label>
                    <input type="number" value={offerPrice} onChange={e => setOfferPrice(e.target.value)} placeholder="500" className="w-full bg-zinc-50 border-none p-3.5 rounded-2xl text-xs font-black outline-none" />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-black text-zinc-400 block mb-2 px-1">الأيام</label>
                    <input type="number" value={offerDays} onChange={e => setOfferDays(e.target.value)} placeholder="3" className="w-full bg-zinc-50 border-none p-3.5 rounded-2xl text-xs font-black outline-none" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-zinc-400 block mb-2 px-1">وصف ما ستقدمه</label>
                  <textarea value={offerDesc} onChange={e => setOfferDesc(e.target.value)} placeholder="اكتب تفاصيل العمل الذي ستقوم بتسليمه..." className="w-full bg-zinc-50 rounded-2xl p-4 text-xs font-bold outline-none resize-none h-32" />
                </div>
                <button 
                  onClick={handleSendOffer}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/30 flex items-center justify-center gap-2"
                >
                  إرسال العرض في الشات
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
