import { ChevronRight, Image, Search } from "lucide-react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { LOCAL_IP, SERVER_IP } from "../config";
import type { Organization } from "../types/Organizations";
import { useAuth } from "../context/AuthContext";
import { useMembership } from "../hooks/useMembership";

export default function Organizations() {
  const { isOrgMember, toggleOrgMembership } = useMembership();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { joinedOrgIds } = useAuth();

  const fetchOrganizations = async (name = "") => {
    try {
      setLoading(true);
      // Using your backend route: GET /api/organizations?name=...
      const url = name
        ? `${SERVER_IP}/api/organizations?name=${encodeURIComponent(name)}`
        : `${SERVER_IP}/api/organizations`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.Organizations) {
        setOrganizations(data.Organizations);
      }
    } catch (err) {
      console.error("Failed to fetch organizations:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all on mount
  useEffect(() => {
    fetchOrganizations();
  }, []);

  // Handle search with a simple trigger (or you could debounce this)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    fetchOrganizations(value);
  };

  return (
    <>
      <Navbar />
      <div className="font-inter px-4 md:px-20 pb-20">
        <h1 className="text-4xl md:text-5xl font-bebas mt-10 mb-8">
          Organizations
        </h1>

        <div className="relative w-full mb-8 md:mb-12 text-gray">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search size={20} />
          </div>
          <input
            className="font-league w-full rounded-2xl bg-lightgray py-3 pl-12 pr-4 outline-none text-black"
            placeholder="Search Organizations"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <div className="grid grid-row-1 gap-4 md:gap-6">
          {loading && organizations.length === 0 ? (
            <div className="font-league p-10">Loading organizations...</div>
          ) : (
            organizations.map((org) => {
              const isMember = isOrgMember(org._id);

              return (
                <div
                  key={org._id}
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      navigate(`/organization/${org._id}`);
                    }
                  }}
                  className="rounded-2xl bg-[#f5f5f76e] transition-all overflow-hidden flex flex-row h-32 md:h-50 border border-transparent cursor-pointer md:cursor-default"
                >
                  <div className="w-32 md:w-70 h-full bg-gray/30 flex items-center justify-center shrink-0">
                    {org.logo ? (
                      <img
                        src={org.logo}
                        alt={org.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image size={30} className="text-gray/70 md:hidden" />
                    )}
                    {!org.logo && (
                      <Image
                        size={40}
                        className="hidden md:block text-gray/70"
                      />
                    )}
                  </div>

                  <div className="p-3 md:p-6 flex-1 flex flex-col md:flex-row justify-between min-w-0">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg md:text-2xl font-bebas mb-1 md:mb-2 truncate">
                        {org.name}
                      </h2>
                      <p className="text-gray text-xs md:text-sm mb-2 line-clamp-2 md:line-clamp-3">
                        {org.description || "No description provided."}
                      </p>

                      <div className="hidden md:flex flex-wrap gap-2 pt-2">
                        {org.category && (
                          <span className="flex items-center gap-1 px-3 py-1 bg-brand/40 text-xs font-bold uppercase tracking-wider text-black">
                            {org.category}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex md:ml-auto md:pl-10 items-end">
                      <div className="flex flex-row gap-3 md:gap-5 items-center w-full justify-end">
                        {/* More Events Button - Hidden on mobile, original styles on desktop */}
                        <Link
                          className="hidden md:flex font-semibold py-2 font-league items-center min-w-fit"
                          to={`/organization/${org._id}`}
                        >
                          <button className="flex cursor-pointer gap-2 items-center">
                            More Events
                            <ChevronRight width={17} />
                          </button>
                        </Link>

                        {/* Button shows "join" or "leave" depending if theyre a member or not */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card click on mobile when joining
                            toggleOrgMembership(org._id);
                          }}
                          className={`font-bold min-w-[70px] md:min-w-[120px] px-4 md:px-9 py-1.5 md:py-2 rounded-4xl font-league text-xs md:text-base cursor-pointer active:scale-95 transition-all duration-100 ${
                            isMember
                              ? "bg-lightgray text-black border-2 border-[#f0f0f0]"
                              : "bg-black text-white hover:bg-zinc-800"
                          }`}
                        >
                          {isMember ? "Leave" : "Join"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {!loading && organizations.length === 0 && (
            <div className="font-league p-10 text-gray-400">
              No organizations found.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
