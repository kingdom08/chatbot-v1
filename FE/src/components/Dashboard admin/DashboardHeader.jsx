
import React, { useState } from "react";
import { Search, Filter, Download, UserCheck, UserX, Clock } from "lucide-react";

// ==================== DashboardHeader.jsx ====================
const DashboardHeader = ({ searchTerm, setSearchTerm, filterStatus, setFilterStatus }) => {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Manajemen Akun Mahasiswa</h1>
        <p className="text-slate-600">Kelola dan monitor akun mahasiswa Unika De La Salle</p>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama, NIM, atau email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer"
              >
                <option>Semua</option>
                <option>Aktif</option>
                <option>Menunggu</option>
                <option>Nonaktif</option>
                <option>Ditolak</option>
              </select>
            </div>

            <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              <Download className="w-5 h-5" />
              <span className="hidden md:inline">Export</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardHeader;
