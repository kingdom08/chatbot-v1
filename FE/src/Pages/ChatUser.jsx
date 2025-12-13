import React, { useState } from "react";
import ChatArea from "../components/ChatUser/ChatArea";
import Logout from "../components/Logout";
import { useNavigate } from "react-router-dom";
import LoadingChat from "../components/LoadingChat";
import Sidebar from "../components/SideBar";
const ChatUser = () => {
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
    <div className=" h-full bg-white w-320">
       

      <ChatArea />

   
    </div>
  );
};

export default ChatUser;
