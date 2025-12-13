import Sidebar from "../components/SideBar";
import React from "react";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../components/Logout";
import LoadingChat from "../components/LoadingChat";
import Navbar from "../components/Navbar";

const AdminLayout = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsModalOpen(false);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      navigate("/");
    }, 2000);
  };


  return (
    <div className="h-full flex">
      <Sidebar />
        <Logout
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleLogout}
      />
        <LoadingChat
        isLoading={isLoading}
        message="Sedang keluar dari akun, tunggu sebentar..."
      />

       <div className=" w-full">
        <Navbar  onLogoutClick={() => setIsModalOpen(true)} />
        <div className="">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
