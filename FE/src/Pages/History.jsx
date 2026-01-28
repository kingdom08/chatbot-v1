import React, { useState, useEffect } from "react";
import {
  History as HistoryIcon,
  Trash2,
  MessageCircle,
  Bot,
  Clock,
  Loader2,
} from "lucide-react";
import axios from "axios";

const History = () => {
  const [histories, setHistories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://127.0.0.1:5000/api/student/history", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.msg === "success") {
        setHistories(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching history:", err);
      setError("Gagal memuat riwayat chat. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus riwayat ini?")) return;

    try {
      await axios.delete(`http://127.0.0.1:5000/api/student/history/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setHistories(histories.filter((h) => h.id !== id));
    } catch (err) {
      console.error("Error deleting history:", err);
      alert("Gagal menghapus riwayat.");
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen ml-64">
        <Loader2 size={48} className="text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500">Memuat riwayat chat...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen ml-64">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchHistory}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="ml-64 p-8 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <HistoryIcon size={24} className="text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Riwayat Chat</h1>
          <p className="text-gray-500">
            {histories.length} percakapan tersimpan
          </p>
        </div>
      </div>

      {/* Empty State */}
      {histories.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <MessageCircle size={40} className="text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Belum ada riwayat chat
          </h2>
          <p className="text-gray-500">
            Mulai percakapan dengan BIMA untuk melihat riwayat di sini.
          </p>
        </div>
      )}

      {/* History List */}
      <div className="space-y-4">
        {histories.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Header Card */}
            <div
              className="p-4 cursor-pointer"
              onClick={() => toggleExpand(item.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Kategori Badge */}
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full mb-2">
                    {item.kategori}
                  </span>

                  {/* Pertanyaan */}
                  <p className="text-gray-800 font-medium line-clamp-2">
                    {item.pertanyaan}
                  </p>

                  {/* Waktu */}
                  <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                    <Clock size={14} />
                    <span>{formatDate(item.waktu)}</span>
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedId === item.id && (
              <div className="px-4 pb-4 border-t border-gray-100 pt-4 animate-fadeIn">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot size={16} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Jawaban BIMA:
                    </p>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {item.jawaban}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        Tingkat keyakinan: {item.keyakinan}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Styling untuk animasi */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default History;
