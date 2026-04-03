import { useAuth } from "../context/AuthContext.tsx";
import { Link } from "react-router";
import { Bell, Plus } from "lucide-react";
import UserMenu from "./UseMenu.tsx";

export default function Navbar() {
  const { isLoggedIn } = useAuth();

  return (
    <>
      {/* Nav */}
      <div className="[&_*]:cursor-pointer flex justify-between items-center py-3 px-20">
        <div className="flex gap-12">
          <Link to="/events">
            <p className="font-league">Events</p>
          </Link>
          <Link to="/organizations">
            <p className="font-league">Organizations</p>
          </Link>

          <Link to="/tickets">
            <p className="font-league">Tickets</p>
          </Link>
        </div>
        {isLoggedIn ? (
          <div className="flex gap-5 items-center">
            <Link to="/create">
              <button className="rounded-[20px] bg-[#F6F6F6] text-black px-4 py-2 font-inter font-medium flex items-center gap-2">
                <Plus size={18} />
                Create Event
              </button>
            </Link>
            <Bell size={22} />

            {/* JUST PLUG IT IN HERE */}
            <UserMenu />
          </div>
        ) : (
          <div className="flex gap-5">
            <Link to="/signup">
              <button className="rounded-[20px] font-league bg-gray-100 px-4 py-2">
                Sign up
              </button>
            </Link>
            <Link to="/login">
              <button className="rounded-[20px] font-league bg-black text-white px-4 py-2">
                Log in
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
