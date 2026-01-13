import React from "react";
import { LogOut, User } from "lucide-react";
import { FaPlus, FaUserCircle } from "react-icons/fa";
import { IoChatbubbleOutline } from "react-icons/io5";
import { NavLink, useNavigate } from "react-router-dom";
import { MdManageAccounts } from "react-icons/md";

const Sidebar = ({ onLogoutClick }) => {
  const navigate = useNavigate();
  const storedRole = localStorage.getItem("role");
  const nim = localStorage.getItem("nim");

  const isMahasiswa = !!nim;
  const isAdmin = storedRole?.toLowerCase() === "admin";

  const role = isMahasiswa ? "mahasiswa" : isAdmin ? "admin" : storedRole;
  const email = localStorage.getItem("email");
  const nama = localStorage.getItem("nama") || "Tidak diketahui";

  const handleNewChat = () => {
    navigate("/user/chat", { state: { resetTrigger: Date.now() } });
  };

  const linkStyle = ({ isActive }) =>
    `flex items-center p-3 rounded-lg transition-colors ${
      isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <div className="fixed top-0 left-0 flex flex-col w-64 h-screen bg-white-100 border-r border-gray-200 p-4">
      <div className="flex justify-between items-center mb-6">
        <span className="font-bold text-xl text-blue-700">B I M A</span>
      </div>

      {isMahasiswa && (
        <button 
          onClick={handleNewChat}
          className="flex items-center text-white justify-center p-2 mb-4 bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm"
        >
          <FaPlus size={20} className="mr-2" />
          <span>Chat Baru</span>
        </button>
      )}

      <nav className="flex-grow space-y-2">
        {isMahasiswa && (
          <NavLink to="/user/chat" className={linkStyle}>
            <IoChatbubbleOutline size={20} className="mr-3" />
            <span>Chat</span>
          </NavLink>
        )}

        <NavLink
          to={role === "admin" ? "/admin/profiladmin" : "/user/profil"}
          className={linkStyle}
        >
          <User size={20} className="mr-3" />
          <span>Profil</span>
        </NavLink>

        {role === "admin" && (
          <NavLink to="/admin/dasbor" className={linkStyle}>
            <MdManageAccounts size={20} className="mr-3" />
            <span>Kelola Akun</span>
          </NavLink>
        )}
      </nav>

      <div className="flex justify-start gap-5 mt-5 p-3 bg-white  rounded-xl shadow">
        <FaUserCircle size={40} className="text-gray-500" />
        <div>
          <p className="font-semibold">{nama}</p>
          {isMahasiswa && (
            <span className="text-[13px] text-gray-600">{nim}</span>
          )}
          {role === "admin" && (
            <span className="text-[13px] text-gray-600">{email}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;