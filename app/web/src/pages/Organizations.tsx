import { ChevronRight, Image, Search } from "lucide-react";
import Navbar from "../components/Navbar";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { LOCAL_IP, SERVER_IP } from "../config";
import type { Organization } from "../types/Organizations";
import { useAuth } from "../context/AuthContext";

export default function Organizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const { token, isLoggedIn } = useAuth();

  const handleJoin = async (orgName: string) => {
    if (!isLoggedIn) {
      alert("Please log in to join organizations!");
      return;
    }

    try {
      const response = await fetch(`${LOCAL_IP}/api/organizations/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orgName }), // backend wants a { orgName } = req.body
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Successfully joined ${orgName}!`);

        //this refreshes the list.
        fetchOrganizations(searchQuery);
      } else {
        alert(data.message || "Failed to join");
      }
    } catch (err) {
      console.error("Join error:", err);
      alert("A server error occurred.");
    }
  };

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
      <div className="font-inter px-20 pb-20">
        <h1 className="text-5xl font-bebas mt-10 mb-8">Organizations</h1>

        {/* Searchbar */}
        <div className="relative w-full mb-12 text-gray">
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

        {/* The Grid Layout */}
        <div className="grid grid-row-1 gap-6">
          {loading && organizations.length === 0 ? (
            <div className="font-league p-10">Loading organizations...</div>
          ) : (
            organizations.map((org) => (
              <div
                key={org._id}
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
                    <h2 className="text-2xl font-bebas mb-2 line-clamp-1">
                      {org.name}
                    </h2>
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

                {/* Buttons */}
                <div className="flex ml-auto mr-10">
                  <div className="flex mt-auto gap-5">
                    <Link
                      className="font-semibold rounded-4xl my-3 py-2 font-league flex min-w-fit "
                      to={`/organization/${org._id}`}
                    >
                      <button className="flex cursor-pointer gap-2 ">
                        More Events
                        <ChevronRight width={17} />
                      </button>
                    </Link>
                    <button
                      //User joins this particular org.
                      onClick={() => handleJoin(org.name)}
                      className="font-bold px-9 rounded-4xl text-white bg-black my-3 mr-3 font-league cursor-pointer active:scale-95 transition-all hover:bg-brand duration-100 "
                    >
                      Join
                    </button>
                  </div>
                </div>
              </div>
            ))
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
