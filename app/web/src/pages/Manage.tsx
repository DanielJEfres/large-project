import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import type { UniversityEvent } from "../types/UniversityEvent";
import { LOCAL_IP } from "../config";
import { Link } from "react-router";
import { useOrganizations } from "../hooks/useOrganization";
import { formatStackedDate } from "../utils/date";
import { Image } from "lucide-react";

export default function Manage() {
  const [activeTab, setActiveTab] = useState<"Upcoming" | "Past">("Upcoming");
  const { user, token } = useAuth();
  const [myEvents, setMyEvents] = useState<UniversityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { orgLookup, fetchOrgDetails } = useOrganizations();

  const now = new Date();

  const filteredEvents = myEvents.filter((event) => {
    const eventDate = new Date(event.startDate);
    return activeTab === "Upcoming" ? eventDate >= now : eventDate < now;
  });

  useEffect(() => {
    const fetchCreatedEvents = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(
          `${LOCAL_IP}/api/events/created-by/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await response.json();
        setMyEvents(data);
      } catch (err) {
        console.error("Failed to fetch created events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCreatedEvents();
  }, [user, token]);

  useEffect(() => {
    if (myEvents.length > 0) {
      const ids = myEvents.map((e) => e.organizationId).filter(Boolean);
      fetchOrgDetails(ids);
    }
  }, [myEvents, fetchOrgDetails]);

  //   note to self to add 3 dots to edit, and delete

  return (
    <>
      <Navbar />
      <div className="font-inter px-20 pb-20">
        <h1 className="text-5xl font-bebas mt-10 mb-8">Manage</h1>

        {/* Tab Selection */}
        <div className="flex gap-10 items-center mb-0.5 mt-3 ">
          {["Upcoming", "Past"].map((tab) => (
            <h2
              key={tab}
              onClick={() => setActiveTab(tab as "Upcoming" | "Past")}
              className={`font-bold cursor-pointer ml-0.5 transition-colors ${
                activeTab === tab ? "text-black" : "text-gray-400"
              }`}
            >
              {tab}
            </h2>
          ))}
        </div>

        {/* Indicator Line */}
        <div className="relative mb-10">
          <div
            className={`w-22 h-0.5 bg-brand absolute z-10 transition-all duration-300 ${
              activeTab === "Past" ? "translate-x-[100px]" : "translate-x-0"
            }`}
          ></div>
          <div className="w-full h-0.5 bg-gray-200 "> </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-row-1 gap-6">
          {loading ? (
            <p>Loading your events...</p>
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <Link
                to={`/event/${event._id}`}
                key={event._id}
                className="group flex "
              >
                <div className="relative w-80 h-60 bg-gray-100 rounded-2xl overflow-hidden mb-4">
                  {event.flyer ? (
                    <img
                      src={event.flyer}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Image size={48} />
                    </div>
                  )}
                </div>
                <div className="flex flex-col p-6">
                  <p className="font-bebas text-brand text-xl tracking-wide uppercase">
                    {orgLookup[event.organizationId]?.name ||
                      "this should say user's name  :p"}
                  </p>
                  <h3 className="text-lg font-bold line-clamp-1">
                    {event.title}
                  </h3>
                  <p className="text-gray-500 font-medium text-sm">
                    {formatStackedDate(event.startDate).day},{" "}
                    {formatStackedDate(event.startDate).date}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-400 italic">
              No {activeTab.toLowerCase()} events found.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
