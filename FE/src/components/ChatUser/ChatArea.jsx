import React, { useState, useEffect, useRef } from "react";
import { Send, User, Bot, Loader2 } from "lucide-react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const ChatArea = ({ sessionId, onSessionCreated }) => {
  const [messages, setMessages] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const messagesEndRef = useRef(null);
  const location = useLocation();

  // Track state to detect actual changes
  const previousSessionRef = useRef(null);
  const handledNewChatRef = useRef(null); // Track which newChat timestamp we've handled
  const sessionCreatedRef = useRef(false); // Track if we just created a session

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Handle session changes - prioritize location.state, then props
  useEffect(() => {
    const stateSessionId = location.state?.sessionId;
    const newChatTimestamp = location.state?.newChat;

    // If this is a new chat request we haven't handled yet
    if (newChatTimestamp && newChatTimestamp !== handledNewChatRef.current) {
      handledNewChatRef.current = newChatTimestamp;
      sessionCreatedRef.current = false; // Reset the created flag
      previousSessionRef.current = null;
      setMessages([]);
      setCurrentSessionId(null);
      return;
    }

    // If we just created a session, don't reset (ignore stale newChat state)
    if (sessionCreatedRef.current && !stateSessionId) {
      return;
    }

    // Determine which session ID to use
    let targetSessionId = stateSessionId || sessionId || null;

    // Only act if the session actually changed
    if (targetSessionId && targetSessionId !== previousSessionRef.current) {
      previousSessionRef.current = targetSessionId;
      loadSession(targetSessionId);
    }
  }, [location.state?.sessionId, location.state?.newChat, sessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const loadSession = async (sessId) => {
    setIsLoadingSession(true);
    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/api/student/session/${sessId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (res.data.msg === "success") {
        setCurrentSessionId(sessId);
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.error("Error loading session:", err);
      // Reset on error
      setMessages([]);
      setCurrentSessionId(null);
    } finally {
      setIsLoadingSession(false);
    }
  };

  const handleSend = async (customText = null) => {
    const textToSend = typeof customText === "string" ? customText : input;

    if (!textToSend.trim()) return;

    const userMsg = { from: "user", text: textToSend };
    setMessages((prev) => [...prev, userMsg]);

    setInput("");
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const res = await axios.post(
        "http://127.0.0.1:5000/api/student/chat",
        {
          message: textToSend,
          session_id: currentSessionId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      // Update session ID if a new one was created
      if (res.data.session_id && !currentSessionId) {
        const newSessionId = res.data.session_id;
        setCurrentSessionId(newSessionId);
        previousSessionRef.current = newSessionId;
        sessionCreatedRef.current = true; // Mark that we just created a session
        if (onSessionCreated) {
          onSessionCreated(newSessionId);
        }
      }

      const botMsg = {
        from: "bot",
        text: res.data.response,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Error saat chat:", error);
      const errorMsg = {
        from: "bot",
        text: "Maaf, sepertinya ada gangguan pada server. Coba lagi nanti ya.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (text) => {
    handleSend(text);
  };

  return (
    <div className="flex flex-col h-full">
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

      {/* Loading Session Overlay */}
      {isLoadingSession && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
          <Loader2 size={32} className="text-blue-600 animate-spin" />
        </div>
      )}

      {/* Welcome Screen */}
      {messages.length === 0 && !isLoadingSession && (
        <div className="flex flex-col items-center justify-center flex-grow text-center p-8 opacity-80">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <Bot size={40} className="text-blue-600" />
          </div>
          <h1 className="font-bold text-4xl text-blue-900 mb-2 tracking-tight">
            B I M A
          </h1>
          <p className="text-gray-500 text-lg">
            Asisten Bimbingan Mahasiswa Cerdas
          </p>
          <div className="mt-8 grid grid-cols-2 gap-3 max-w-lg">
            <span
              onClick={() => handleSuggestionClick("Siapa Pembuat Anda?")}
              className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm text-gray-600 border cursor-pointer hover:bg-gray-50 hover:text-blue-600 transition-colors"
            >
              "Siapa Pembuat Anda?"
            </span>
            <span
              onClick={() =>
                handleSuggestionClick("Cara melakukan bimbingan dengan dosen")
              }
              className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm text-gray-600 border cursor-pointer hover:bg-gray-50 hover:text-blue-600 transition-colors"
            >
              "Cara bimbingan dengan dosen"
            </span>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div
        className={`flex-grow overflow-y-auto p-6 space-y-4 no-scrollbar ${
          messages.length === 0 ? "hidden" : "block"
        }`}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex w-full animate-pop-in ${
              msg.from === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.from === "bot" && (
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                <Bot size={18} className="text-blue-600" />
              </div>
            )}

            <div
              className={`px-4 py-3 max-w-[70%] shadow-sm text-[15px] leading-relaxed ${
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

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex w-full justify-start animate-pop-in">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
              <Loader2 size={18} className="text-blue-600 animate-spin" />
            </div>
            <div className="bg-white border border-gray-100 px-4 py-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center space-x-1">
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/80 backdrop-blur-md border-t border-gray-200">
        <div className="max-w-4xl mx-auto relative flex items-center gap-3">
          <input
            type="text"
            placeholder="Ketik pesan Anda di sini..."
            value={input}
            disabled={isLoading || isLoadingSession}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSend()}
            className="flex-grow bg-gray-100 text-gray-800 placeholder-gray-500 border-none rounded-full py-4 px-6 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-inner text-[16px] outline-none disabled:opacity-50"
          />

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading || isLoadingSession}
            className={`p-4 rounded-full transition-all duration-200 shadow-md flex items-center justify-center 
              ${
                !input.trim() || isLoading || isLoadingSession
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
