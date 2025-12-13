import React, { useState } from "react";
import { Edit2, Mail, Phone, CheckCircle, X, Save, User } from "lucide-react";

const AdminProfile = () => {
  const [admin, setAdmin] = useState({
    nama: "Bima Alexander",
    email: "bima.alexander@unikadelasalle.ac.id",
    wa: "085211234567",
    status: "Aktif",
    role: "Super Admin",
    joinDate: "15 Januari 2024"
  });

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(admin);

  const handleSave = () => {
    setAdmin(editData);
    setShowModal(false);
  };

  const getInitials = (name) => {
    const parts = name.split(" ");
    return parts.length > 1 
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : parts[0][0].toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-800">Profil Admin</h1>
          <p className="text-slate-600 mt-1">Kelola informasi akun administrator Anda</p>
        </div>

        {/* Main Card - Landscape Layout */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header dengan Background Gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-32 relative">
            <button
              onClick={() => setShowModal(true)}
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 p-2.5 rounded-lg transition-all duration-200 group"
              title="Edit Profil"
            >
              <Edit2 size={18} className="text-white" />
            </button>
          </div>

          {/* Profile Content */}
          <div className="px-8 pb-8">
            {/* Avatar & Basic Info - Landscape */}
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16 relative">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold shadow-xl border-4 border-white">
                  {getInitials(admin.nama)}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-2 border-4 border-white shadow-lg">
                  <CheckCircle size={20} className="text-white" />
                </div>
              </div>

              {/* Info & Stats */}
              <div className="flex-1 md:mb-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-800">{admin.nama}</h2>
                    <p className="text-slate-600 mt-1 flex items-center gap-2">
                      <User size={16} />
                      {admin.role}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2 text-center">
                      <p className="text-xs text-blue-600 font-medium">Bergabung Sejak</p>
                      <p className="text-sm font-bold text-blue-700">{admin.joinDate}</p>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 text-center">
                      <p className="text-xs text-emerald-600 font-medium">Status</p>
                      <p className="text-sm font-bold text-emerald-700">{admin.status}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="my-8 border-t border-slate-200"></div>

            {/* Contact Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email Card */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 hover:border-blue-300 transition-all duration-200 group">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <Mail size={24} className="text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-600 mb-1">Email Kampus</p>
                    <p className="text-base font-semibold text-slate-800 break-all">{admin.email}</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Card */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 hover:border-emerald-300 transition-all duration-200 group">
                <div className="flex items-start gap-4">
                  <div className="bg-emerald-100 p-3 rounded-lg group-hover:bg-emerald-200 transition-colors">
                    <Phone size={24} className="text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-600 mb-1">No WhatsApp</p>
                    <p className="text-base font-semibold text-slate-800">{admin.wa}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info Section */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-6 border border-blue-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Informasi Akun</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-slate-600 mb-1">Nama Lengkap</p>
                  <p className="text-sm font-semibold text-slate-800">{admin.nama}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 mb-1">Role</p>
                  <p className="text-sm font-semibold text-slate-800">{admin.role}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 mb-1">Status Akun</p>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                    <CheckCircle size={14} />
                    {admin.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL - Improved */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl transform transition-all">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-5 rounded-t-2xl flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Edit Profil Admin</h2>
                <p className="text-blue-100 text-sm mt-1">Perbarui informasi akun Anda</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
              >
                <X size={20} className="text-white" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="flex flex-col gap-4">
                {/* Nama */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={editData.nama}
                    onChange={(e) => setEditData({ ...editData, nama: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Kampus
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="email@unikadelasalle.ac.id"
                    />
                  </div>
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    No WhatsApp
                  </label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={editData.wa}
                      onChange={(e) => setEditData({ ...editData, wa: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="08xxxxxxxxxx"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-100 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;