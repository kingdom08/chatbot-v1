import React from "react";
import { LogOut, User } from "lucide-react";
import { FaPlus, FaUserCircle } from "react-icons/fa";
import { IoChatbubbleOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { MdManageAccounts } from "react-icons/md";

const Sidebar = ({ onLogoutClick }) => {
  // Ambil semua data dari localStorage
  const storedRole = localStorage.getItem("role"); // Tetap ambil jika ada
  const nim = localStorage.getItem("nim"); // Hanya Mahasiswa yang punya NIM

  // --- LOGIKA BARU UNTUK MENENTUKAN STATUS ---
  // Cek apakah user adalah Mahasiswa (Memiliki NIM)
  const isMahasiswa = !!nim;

  // Cek apakah user adalah Admin (Tidak punya NIM, dan role ada atau token ada)
  // Kita gunakan storedRole untuk menentukan tampilan NavLink.
  const isAdmin = storedRole?.toLowerCase() === "admin";
  // ------------------------------------------

  // Gunakan role yang sudah diset di localStorage, atau tentukan dari NIM/isAdmin
  const role = isMahasiswa ? "mahasiswa" : isAdmin ? "admin" : storedRole;
  const email = localStorage.getItem("email");

  const nama = localStorage.getItem("nama") || "Tidak diketahui";

  // ... (linkStyle tetap sama)

  const linkStyle = ({ isActive }) =>
    `flex items-center p-3 rounded-lg transition-colors ${
      isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <div className="fixed top-0 left-0 flex flex-col w-64 h-screen bg-gray-50 border-r border-gray-200 p-4">
      <div className="flex justify-between items-center mb-6">
        <span className="font-bold text-xl text-blue-700">B I M A</span>
      </div>

      {/* GANTI KONDISI: role === "mahasiswa" MENJADI isMahasiswa */}
      {isMahasiswa && (
        <button className="flex items-center text-white justify-center p-2 mb-4 bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm">
          <FaPlus size={20} className="mr-2" />
          <span>Chat Baru</span>
        </button>
      )}

      <nav className="flex-grow space-y-2">
        {/* GANTI KONDISI: role === "mahasiswa" MENJADI isMahasiswa */}
        {isMahasiswa && (
          <NavLink to="/user/chat" className={linkStyle}>
            <IoChatbubbleOutline size={20} className="mr-3" />
            <span>Chat</span>
          </NavLink>
        )}

        <NavLink
          // Tetap gunakan role yang ada untuk NavLink Profile
          to={role === "admin" ? "/admin/profiladmin" : "/user/profil"}
          className={linkStyle}
        >
          <User size={20} className="mr-3" />
          <span>Profil</span>
        </NavLink>

        {/* Kondisi Admin tetap menggunakan role yang disimpan (atau yang sudah diconvert) */}
        {role === "admin" && (
          <NavLink to="/admin/dasbor" className={linkStyle}>
            <MdManageAccounts size={20} className="mr-3" />
            <span>Kelola Akun</span>
          </NavLink>
        )}
      </nav>

      {/* BAGIAN PROFIL BAWAH OTOMATIS */}
      <div className="flex justify-start gap-5 mt-5 p-3 bg-white  rounded-xl shadow">
        <FaUserCircle size={40} className="text-gray-500" />
        <div>
          <p className="font-semibold">{nama}</p>

          {/* Tampilkan NIM jika isMahasiswa */}
          {isMahasiswa && (
            <span className="text-[13px] text-gray-600">{nim}</span>
          )}

          {/* Tampilkan role jika role === "admin" */}
          {role === "admin" && (
            <span className="text-[13px] text-gray-600">{email}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
