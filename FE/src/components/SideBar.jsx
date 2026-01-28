import React, {
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { User, MessageCircle, Trash2 } from "lucide-react";
import { FaPlus, FaUserCircle } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { MdManageAccounts } from "react-icons/md";
import axios from "axios";

const Sidebar = forwardRef(
  ({ activeSessionId, onSessionSelect, onNewChat }, ref) => {
    const navigate = useNavigate();
    const storedRole = localStorage.getItem("role");
    const nim = localStorage.getItem("nim");

    const isMahasiswa = !!nim;
    const isAdmin = storedRole?.toLowerCase() === "admin";

    const role = isMahasiswa ? "mahasiswa" : isAdmin ? "admin" : storedRole;
    const email = localStorage.getItem("email");
    const nama = localStorage.getItem("nama") || "Tidak diketahui";

    const [sessions, setSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [localActiveId, setLocalActiveId] = useState(activeSessionId);

    // Expose refresh method to parent
    useImperativeHandle(ref, () => ({
      refreshSessions: fetchSessions,
    }));

    // Sync local active ID with prop
    useEffect(() => {
      setLocalActiveId(activeSessionId);
    }, [activeSessionId]);

    // Fetch sessions on mount
    useEffect(() => {
      if (isMahasiswa) {
        fetchSessions();
      }
    }, [isMahasiswa]);

    const fetchSessions = useCallback(async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          "http://127.0.0.1:5000/api/student/sessions",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        if (res.data.msg === "success") {
          setSessions(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching sessions:", err);
      } finally {
        setIsLoading(false);
      }
    }, []);

    const handleNewChat = () => {
      setLocalActiveId(null);
      if (onNewChat) {
        onNewChat();
      }
      // Use replace to avoid history stack issues
      navigate("/user/chat", { state: { newChat: Date.now() }, replace: true });
    };

    const handleSessionClick = (session) => {
      // Update local state immediately for instant feedback
      setLocalActiveId(session.id);

      if (onSessionSelect) {
        onSessionSelect(session.id);
      }
      // Use replace to avoid history stack issues
      navigate("/user/chat", {
        state: { sessionId: session.id },
        replace: true,
      });
    };

    const handleDeleteSession = async (e, sessionId) => {
      e.stopPropagation();
      if (!window.confirm("Hapus percakapan ini?")) return;

      try {
        await axios.delete(
          `http://127.0.0.1:5000/api/student/session/${sessionId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));

        // If deleted the active session, start new chat
        if (localActiveId === sessionId) {
          handleNewChat();
        }
      } catch (err) {
        console.error("Error deleting session:", err);
      }
    };

    const linkStyle = ({ isActive }) =>
      `flex items-center p-3 rounded-lg transition-colors ${
        isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"
      }`;

    return (
      <div className="fixed top-0 left-0 flex flex-col w-64 h-screen bg-white border-r border-gray-200">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <span className="font-bold text-xl text-blue-700">B I M A</span>
        </div>

        {/* New Chat Button */}
        {isMahasiswa && (
          <div className="p-4">
            <button
              onClick={handleNewChat}
              className="flex items-center text-white justify-center w-full p-2 bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
            >
              <FaPlus size={16} className="mr-2" />
              <span>Chat Baru</span>
            </button>
          </div>
        )}

        {/* Session List */}
        {isMahasiswa && (
          <div className="flex-1 overflow-y-auto px-2">
            <div className="text-xs text-gray-500 px-2 py-2 font-medium">
              Percakapan
            </div>
            {isLoading ? (
              <div className="text-center text-gray-400 py-4 text-sm">
                Memuat...
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center text-gray-400 py-4 text-sm">
                Belum ada percakapan
              </div>
            ) : (
              <div className="space-y-1">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => handleSessionClick(session)}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer group transition-all duration-150 ${
                      localActiveId === session.id
                        ? "bg-blue-100 text-blue-700 border-l-4 border-blue-600"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center flex-1 min-w-0">
                      <MessageCircle size={16} className="mr-2 flex-shrink-0" />
                      <span className="truncate text-sm">
                        {session.judul || session.preview || "Chat Baru"}
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleDeleteSession(e, session.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-opacity"
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Navigation Links */}
        <nav className="p-4 border-t border-gray-200 space-y-2">
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

        {/* User Info */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <FaUserCircle size={36} className="text-gray-400" />
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{nama}</p>
              <span className="text-xs text-gray-500">
                {isMahasiswa ? nim : email}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

Sidebar.displayName = "Sidebar";

export default Sidebar;
