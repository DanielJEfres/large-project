import {
  Plus,
  Settings,
  ChevronDown,
  LogOut,
  Image,
  ArrowRightIcon,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { useEffect, useRef, useState } from "react";
import { SERVER_IP } from "../config";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router";

interface UserOrg {
  id: string;
  name: string;
  description: string;
  logo: string;
  category: string;
  role: string; // 'admin' or 'member'
}

export default function MyOrgs() {
  const [orgs, setOrgs] = useState<UserOrg[]>([]);
  const [loading, setLoading] = useState(true);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const { token, refreshMemberships } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const fetchMyOrgs = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await fetch(`${SERVER_IP}/api/users/me/organizations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setOrgs(data.organizations || []);
    } catch (err) {
      console.error("Error fetching my orgs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrgs();
  }, [token]);

  const handleLeaveOrg = async (e: React.MouseEvent, orgId: string) => {
    e.preventDefault();
    e.stopPropagation(); // Stop navigation to Org page

    if (!window.confirm("Are you sure you want to leave?")) return;

    try {
      const response = await fetch(`${SERVER_IP}/api/organizations/leave`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orgId }),
      });

      if (response.ok) {
        await refreshMemberships();
        fetchMyOrgs();
        setOpenMenuId(null);
      }
    } catch (err) {
      console.error("Failed to leave organization", err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="font-inter px-4 md:px-20 pb-20">
        <div className="flex flex-col md:flex-row mt-10 mb-8 justify-between md:items-center gap-4">
          <h1 className="text-4xl md:text-5xl font-bebas min-w-fit">
            YOUR ORGANIZATIONS
          </h1>

          <Link to="/create-org">
            <button className="w-full md:w-auto cursor-pointer rounded-2xl bg-black hover:bg-zinc-800 transition-colors text-white px-6 py-2.5 font-league font-bold flex text-md items-center justify-center gap-2">
              <Plus size={20} /> Create Organization
            </button>
          </Link>
        </div>

        {loading ? (
          <div className="p-20 font-league text-gray-400">
            Loading your communities...
          </div>
        ) : orgs.length === 0 ? (
          <div className="mt-10 py-20 text-center">
            <p className="text-gray-400 font-league text-xl">
              You haven't joined any organizations yet.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 md:gap-6">
            {orgs.map((org) => (
              <Link
                key={org.id}
                to={`/organization/${org.id}`}
                className="rounded-2xl bg-[#f5f5f76e] transition-all overflow-visible flex h-32 md:h-50 border border-transparent"
              >
                {/* Image Wrapper needs overflow-hidden now instead of the whole card */}
                <div className="w-32 md:w-70 h-full bg-gray/30 flex items-center justify-center shrink-0 rounded-l-2xl overflow-hidden">
                  {org.logo ? (
                    <img
                      src={org.logo}
                      alt={org.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <Image size={30} className="md:hidden text-gray/70" />
                      <Image
                        size={40}
                        className="hidden md:block text-gray/70"
                      />
                    </>
                  )}
                </div>

                {/* The Content (Right Side) */}
                <div className="p-3 md:p-6 flex-1 flex flex-col md:flex-row justify-between min-w-0 bg-[#f5f5f76e] rounded-r-2xl">
                  <div className="flex-1 flex flex-col min-w-0">
                    <h2 className="text-lg md:text-2xl font-bebas truncate">
                      {org.name}
                    </h2>
                    <p className="text-brand tracking-wider font-bebas text-xs md:text-base mb-1 md:mb-2 uppercase">
                      {org.role}
                    </p>
                    <p className="text-gray text-xs md:text-sm mb-2 line-clamp-2 ">
                      {org.description || "No description provided."}
                    </p>

                    {/* Tags / Category - Pushed to bottom with mt-auto */}
                    <div className="hidden md:flex flex-wrap gap-2 mt-auto pt-2">
                      {org.category && (
                        <span className="flex items-center gap-1 px-3 py-1 bg-brand/40 text-xs font-bold uppercase tracking-wider text-black">
                          {org.category}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Buttons Section - Centered vertically */}
                  <div className="flex md:ml-auto md:pl-10 items-center justify-end">
                    {org.role === "admin" ? (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          navigate(`/manage/org/${org.id}`);
                        }}
                        className="cursor-pointer font-league flex items-center gap-2 px-4 md:px-6 py-1.5 md:py-3 bg-gray-100 rounded-xl md:rounded-2xl hover:bg-gray-200 transition-all font-bold text-xs md:text-base"
                      >
                        <span>Manage</span>
                        <ArrowRightIcon size={16} className="hidden md:block" />
                      </button>
                    ) : (
                      <div
                        className="relative"
                        ref={openMenuId === org.id ? menuRef : null}
                      >
                        <button
                          onClick={(e) => toggleMenu(e, org.id)}
                          className="hover:cursor-pointer flex items-center gap-1 md:gap-2 px-4 md:px-8 py-1.5 md:py-2.5 bg-lightgray text-black rounded-xl md:rounded-2xl font-league font-bold hover:bg-gray-200 transition-all active:scale-95 text-xs md:text-base"
                        >
                          Joined{" "}
                          <ChevronDown
                            size={16}
                            className={`transition-transform md:w-5 md:h-5 ${openMenuId === org.id ? "rotate-180" : ""}`}
                          />
                        </button>

                        {openMenuId === org.id && (
                          <div className="absolute right-0 mt-2 w-32 md:w-48 bg-white rounded-2xl border border-gray-200 z-[100] overflow-hidden shadow-xl">
                            <button
                              onClick={(e) => handleLeaveOrg(e, org.id)}
                              className="hover:cursor-pointer w-full flex items-center gap-2 px-5 py-4 text-xs md:text-sm hover:bg-gray-50 font-bold font-league transition-colors text-black"
                            >
                              <LogOut size={16} /> Leave
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
