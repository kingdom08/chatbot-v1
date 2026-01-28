import React, { useState, useCallback, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/SideBar";
import Logout from "../components/Logout";
import LoadingChat from "../components/LoadingChat";
import Navbar from "../components/Navbar";

const LayoutUser = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  const handleLogout = () => {
    setIsModalOpen(false);
    setIsLoading(true);

    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("nim");
    localStorage.removeItem("nama");
    localStorage.removeItem("email");
    localStorage.removeItem("role");

    setTimeout(() => {
      setIsLoading(false);
      navigate("/");
    }, 1500);
  };

  const handleSessionSelect = useCallback((sessionId) => {
    setActiveSessionId(sessionId);
  }, []);

  const handleNewChat = useCallback(() => {
    setActiveSessionId(null);
  }, []);

  const handleSessionCreated = useCallback((sessionId) => {
    setActiveSessionId(sessionId);
    // Refresh sidebar sessions list
    if (sidebarRef.current?.refreshSessions) {
      sidebarRef.current.refreshSessions();
    }
  }, []);

  return (
    <div className="flex h-screen w-full">
      <Sidebar
        ref={sidebarRef}
        activeSessionId={activeSessionId}
        onSessionSelect={handleSessionSelect}
        onNewChat={handleNewChat}
      />
      <Logout
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleLogout}
      />

      <LoadingChat
        isLoading={isLoading}
        message="Sedang keluar dari akun, tunggu sebentar..."
      />
      <div className="flex-1">
        <Navbar onLogoutClick={() => setIsModalOpen(true)} />
        <div className="ml-64 pt-16 h-screen">
          <Outlet context={{ activeSessionId, handleSessionCreated }} />
        </div>
      </div>
    </div>
  );
};

export default LayoutUser;
