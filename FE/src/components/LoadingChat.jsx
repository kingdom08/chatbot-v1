import React from "react";

const LoadingChat = ({ isLoading, message = "Memproses..." }) => {
  // Jika isLoading false, komponen tidak dirender
  if (!isLoading) {
    return null;
  }

  // CSS untuk efek titik-titik
  const loadingDots = `
        @keyframes dot-animation {
            0%, 20% { opacity: 0; }
            40% { opacity: 1; }
            100% { opacity: 0; }
        }
    `;

  return (
    // === Overlay (Layar belakang gelap) ===
    <div className="fixed inset-0 bg-gray-900/40 bg-opacity-70 flex items-center justify-center z-50">
      <style>{loadingDots}</style>

      {/* === Kotak Loading === */}
      <div className="flex flex-col items-center p-8   w-full max-w-xs">
        {/* Tiga Titik Loading */}
        <div className="flex space-x-2 text-blue-600">
          <span
            className="w-3 h-3 bg-blue-600 rounded-full"
            style={{
              animation: "dot-animation 1.2s infinite ease-in-out",
              animationDelay: "0s",
            }}
          ></span>
          <span
            className="w-3 h-3 bg-blue-600 rounded-full"
            style={{
              animation: "dot-animation 1.2s infinite ease-in-out",
              animationDelay: "0.2s",
            }}
          ></span>
          <span
            className="w-3 h-3 bg-blue-600 rounded-full"
            style={{
              animation: "dot-animation 1.2s infinite ease-in-out",
              animationDelay: "0.4s",
            }}
          ></span>
        </div>

     
      </div>
    </div>
  );
};

export default LoadingChat;
