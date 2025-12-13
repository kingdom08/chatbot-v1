import React, { useState, useEffect, useRef } from "react";
import { Send, User, Bot, Loader2 } from "lucide-react";
import axios from "axios";

const ChatArea = () => {
  // --- State & Refs ---
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // --- Auto Scroll Function ---
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // --- Handlers ---
  const handleSend = async () => {
    if (!input.trim()) return;

    // 1. Pesan User
    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    
    const currentInput = input;
    setInput(""); 
    setIsLoading(true);

    try {
      // 2. Simulasi Delay UX
      await new Promise(resolve => setTimeout(resolve, 800)); 

      const res = await axios.post(
        "http://localhost:5000/api/student/chat",
        { message: currentInput }
      );

      const botMsg = {
        from: "bot",
        text: res.data.response
      };
      setMessages((prev) => [...prev, botMsg]);

    } catch (error) {
      const errorMsg = {
        from: "bot",
        text: "Maaf, sepertinya ada gangguan pada server. Coba lagi nanti ya."
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (

    <div className="flex flex-col h-screen mt-30 relative ml-[480px]"> 
      
      <style>{`
        @keyframes popIn {
          0% { opacity: 0; transform: translateY(10px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-pop-in {
          animation: popIn 0.3s ease-out forwards;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* --- KOSONG STATE (Belum ada chat) --- */}
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center flex-grow text-center p-8 opacity-60">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <Bot size={40} className="text-blue-600" />
          </div>
          <h1 className="font-bold text-4xl text-blue-900 mb-2 tracking-tight">B I M A</h1>
          <p className="text-gray-500 text-lg">Asisten Bimbingan Mahasiswa Cerdas</p>
          <div className="mt-8 grid grid-cols-2 gap-3 max-w-lg">
             <span className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm text-gray-600 border cursor-pointer hover:bg-gray-50">
               "Bagaimana cara daftar sidang?"
             </span>
             <span className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm text-gray-600 border cursor-pointer hover:bg-gray-50">
               "Cek status pengajuan saya"
             </span>
          </div>
        </div>
      )}

      {/* --- AREA PESAN --- */}
      <div className={`flex-grow overflow-y-auto p-6 space-y-6 no-scrollbar ${messages.length === 0 ? 'hidden' : 'block'}`}>
        
        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={`flex w-full animate-pop-in ${msg.from === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.from === "bot" && (
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                <Bot size={18} className="text-blue-600" />
              </div>
            )}

            <div
              className={`px-5 py-3.5 max-w-[75%] shadow-sm text-[15px] leading-relaxed relative ${
                msg.from === "user"
                  ? "bg-blue-600 text-white rounded-2xl rounded-tr-sm"
                  : "bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-tl-sm"
              }`}
            >
              {msg.text}
            </div>

            {msg.from === "user" && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center ml-3 flex-shrink-0 mt-1">
                <User size={18} className="text-gray-600" />
              </div>
            )}
          </div>
        ))}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex w-full justify-start animate-pop-in">
             <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                <Loader2 size={18} className="text-blue-600 animate-spin" />
              </div>
            <div className="bg-white border border-gray-100 px-4 py-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* --- INPUT AREA --- */}
      <div className="p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 sticky bottom-0 z-10">
        <div className="max-w-4xl mx-auto relative flex items-center gap-3">
          <input
            type="text"
            placeholder="Ketik pesan Anda di sini..."
            value={input}
            disabled={isLoading}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend()}
            className="flex-grow bg-gray-100 text-gray-800 placeholder-gray-500 border-none rounded-full py-4 px-6 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-inner text-[16px] outline-none disabled:opacity-50"
          />
          
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`p-4 rounded-full transition-all duration-200 shadow-md flex items-center justify-center 
              ${!input.trim() || isLoading 
                ? "bg-gray-300 cursor-not-allowed text-gray-500" 
                : "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 active:scale-95"
              }`}
          >
            <Send size={20} className={isLoading ? "hidden" : "block"} />
            {isLoading && <Loader2 size={20} className="animate-spin" />}
          </button>
        </div>
      </div>

    </div>
  );
};

export default ChatArea;