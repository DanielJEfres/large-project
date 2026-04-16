import { useState } from "react";
import { useAuth } from "../context/AuthContext.tsx";
import { Link } from "react-router";
import { Bell, Plus, Menu, X } from "lucide-react";
import UserMenu from "./UseMenu.tsx";

export default function Navbar() {
  const { isLoggedIn } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="[&_button]:cursor-pointer relative">
      <div className="flex justify-between items-center py-3 px-6 md:px-20 bg-white border-b border-gray-100">
        {/* Mobile Menu Toggle*/}
        <button
          className="md:hidden p-2 z-[60] relative"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex gap-12 items-center">
          <Link to="/events" className="font-league hover:opacity-70">
            Events
          </Link>
          <Link to="/organizations" className="font-league hover:opacity-70">
            Organizations
          </Link>
          <Link to="/tickets" className="font-league hover:opacity-70">
            My Events
          </Link>
        </div>

        {/* Action Icons that is visible on all screens */}
        <div className="flex gap-4 md:gap-5 items-center">
          {isLoggedIn ? (
            <>
              <Link to="/create" className="hidden sm:block">
                <button className="rounded-[20px] bg-[#F6F6F6] text-black px-4 py-2 font-league font-medium flex text-lg items-center gap-2">
                  <Plus width={18} />
                  Create Event
                </button>
              </Link>
              {/* <Bell size={22} className="cursor-pointer" /> */}
              <UserMenu />
            </>
          ) : (
            <div className="flex gap-3 md:gap-5">
              <Link to="/signup" className="hidden sm:block">
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
      </div>

      {/* Mobile Side Drawer*/}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 md:hidden ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Overlay Background */}
        <div className="absolute inset-0 bg-black/50" onClick={toggleMenu} />

        <div
          className={`absolute top-0 left-0 h-full w-full bg-white pl-9 pt-20 shadow-xl transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col gap-8 mt-10">
            <Link
              to="/events"
              onClick={toggleMenu}
              className="text-xl font-league pb-2"
            >
              Events
            </Link>
            <Link
              to="/organizations"
              onClick={toggleMenu}
              className="text-xl font-league  pb-2"
            >
              Organizations
            </Link>
            <Link
              to="/tickets"
              onClick={toggleMenu}
              className="text-xl font-league pb-2"
            >
              My Events
            </Link>

            {/* Mobile-only,if user logged in */}

            {isLoggedIn && (
              <>
                <Link to="/me" className="text-xl font-league pb-2">
                  Profile
                </Link>
              </>
            )}
            {isLoggedIn && (
              <>
                <Link to="/create" onClick={toggleMenu}>
                  <button className="w-[98%] justify-center rounded-[20px] bg-black text-white px-4 py-3 font-inter font-medium flex items-center gap-2">
                    <Plus size={18} />
                    Create Event
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
