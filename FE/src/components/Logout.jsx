import React from "react";
import { X, LogOut } from "lucide-react";
import { Navigate } from "react-router-dom";

// Modal ini menerima props:
// 1. isOpen (boolean): untuk menampilkan/menyembunyikan modal
// 2. onClose (function): untuk menutup modal
// 3. onConfirm (function): fungsi yang dijalankan saat user menekan 'Ya, Keluar'

const Logout = ({ isOpen, onClose, onConfirm }) => {
  // Jika isOpen false, modal tidak dirender (atau display: none)
  if (!isOpen) {
    return null;
  }

  return (
    // === Overlay (Layar belakang gelap) ===
    <div
      className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose} // Menutup modal saat klik di luar kotak
    >
      {/* === Kotak Modal (Modal Box) === */}
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Header Modal */}
        <div className="flex justify-between items-center border-b border-gray-300 pb-3 mb-4">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            Konfirmasi Keluar
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Tutup"
          >
            <X size={20} />
          </button>
        </div>

        {/* Isi Modal */}
        <div className="text-center py-4">
          <p className="text-gray-600 mb-6">
            Apakah Anda yakin ingin keluar dari akun BIMA Anda?
          </p>
        </div>

        {/* Footer / Tombol Aksi */}
        <div className="flex justify-center space-x-3">
          {/* Tombol Batal */}
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Batal
          </button>

          {/* Tombol Konfirmasi Keluar */}
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-md"
          >
            Ya, Keluar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
