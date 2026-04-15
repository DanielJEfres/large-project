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
      <div className="font-inter px-20 pb-20">
        <div className="flex mt-10 mb-8 justify-between items-center">
          <h1 className="text-5xl font-bebas min-w-fit">YOUR ORGANIZATIONS</h1>

          <Link to="/create-org">
            <button className="cursor-pointer rounded-2xl bg-black hover:bg-zinc-800 transition-colors text-white px-6 py-2.5 font-league font-bold flex text-md items-center gap-2">
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
          <div className="flex flex-col gap-6">
            {orgs.map((org) => (
              <Link
                key={org.id}
                to={`/organization/${org.id}`}
                className="rounded-2xl  bg-[#f5f5f76e] transition-all overflow-hidden flex h-50"
              >
                {/* Image */}
                <div className="w-70 bg-gray/30 flex items-center justify-center shrink-0">
                  {org.logo ? (
                    <img
                      src={org.logo}
                      alt={org.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image size={40} className="text-gray/70" />
                  )}
                </div>

                {/* The Content (Right Side) */}
                <div className="p-6 w-2/3 flex flex-col justify-between">
                  <div>
                    <h2 className="text-2xl font-bebas line-clamp-1">
                      {org.name}
                    </h2>
                    <p className="text-brand tracking-wider font-bebas mb-2">
                      {org.role}
                    </p>
                    <p className="text-gray text-sm mb-4 line-clamp-3">
                      {org.description || "No description provided."}
                    </p>
                  </div>

                  {/* Tags / Category */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {org.category && (
                      <span className="flex items-center gap-1 px-3 py-1 bg-brand/40 text-xs font-bold uppercase tracking-wider text-black">
                        {org.category}
                      </span>
                    )}
                  </div>
                </div>

                {/* Buttons Section */}
                <div className="flex items-center pr-10">
                  {org.role === "admin" ? (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigate(`/manage/org/${org.id}`);
                      }}
                      className="cursor-pointer font-league self-center h-fit flex items-center gap-2 px-6 py-3 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-all font-bold"
                    >
                      <span>Manage</span>
                      <ArrowRightIcon size={16} />
                    </button>
                  ) : (
                    <div className="relative">
                      <button
                        onClick={(e) => toggleMenu(e, org.id)}
                        className="hover:cursor-pointer flex items-center gap-2 px-8 py-2.5 bg-lightgray text-black rounded-2xl font-league font-bold hover:bg-gray-200 transition-all active:scale-95"
                      >
                        Joined{" "}
                        <ChevronDown
                          size={20}
                          className={`transition-transform ${openMenuId === org.id ? "rotate-180" : ""}`}
                        />
                      </button>

                      {openMenuId === org.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl border border-gray-200 z-50 overflow-hidden">
                          <button
                            onClick={(e) => handleLeaveOrg(e, org.id)}
                            className="hover:cursor-pointer w-full flex items-center gap-2 px-5 py-4 text-sm  hover:bg-gray-50 font-bold font-league transition-colors"
                          >
                            <LogOut size={16} /> Leave
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
