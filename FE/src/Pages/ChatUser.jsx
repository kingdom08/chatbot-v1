import React from "react";
import ChatArea from "../components/ChatUser/ChatArea";
import { useOutletContext } from "react-router-dom";

const ChatUser = () => {
  const { activeSessionId, handleSessionCreated } = useOutletContext();

  return (
    <div className="h-full bg-gray-50">
      <ChatArea
        sessionId={activeSessionId}
        onSessionCreated={handleSessionCreated}
      />
    </div>
  );
};

export default ChatUser;
