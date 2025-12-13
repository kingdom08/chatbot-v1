import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/SideBar";
import Logout from "../components/Logout";
import LoadingChat from "../components/LoadingChat";
import Navbar from "../components/Navbar";
const LayoutUser = () => {
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
    <div className="flex h-screen w-full">
      <Sidebar onLogoutClick={() => setIsModalOpen(true)} />
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

export default LayoutUser;
