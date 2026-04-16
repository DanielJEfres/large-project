import { useState } from "react";
import { useAuth } from "../context/AuthContext.tsx";
import { Link, useNavigate } from "react-router";
import { ChevronRight, LogOut, Ticket, User as UserIcon } from "lucide-react";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  return (
    <div className="relative">
      {/* The Avatar Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center overflow-hidden border border-gray-200 hover:ring-2 hover:ring-brand/20 transition-all"
      >
        {user?.pfp ? (
          <img
            src={user.pfp}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-bold text-sm">
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </span>
        )}
      </button>

      {/* The Dropdown Menu */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 animate-in fade-in zoom-in-95 duration-100">
            <Link
              to="/me"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                {user?.pfp ? (
                  <img src={user.pfp} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={20} className="text-gray-400" />
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <ChevronRight
                size={16}
                className="ml-auto text-gray-300 group-hover:text-black transition-colors"
              />
            </Link>

            <div className="py-1">
              <Link
                to="/manage"
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                <Ticket size={16} /> Manage Events
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} /> Log off
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
