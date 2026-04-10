import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import type { UniversityEvent } from "../types/UniversityEvent";
import { LOCAL_IP, SERVER_IP } from "../config";
import { Link } from "react-router";
import { useOrganizations } from "../hooks/useOrganization";
import { formatStackedDate } from "../utils/date";
import { Image } from "lucide-react";

export default function Tickets() {
  const [activeTab, setActiveTab] = useState<"Upcoming" | "Past">("Upcoming");

  const { user, token } = useAuth();
  const [myEvents, setMyEvents] = useState<UniversityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { orgLookup, fetchOrgDetails } = useOrganizations();

  const now = new Date();

  const filteredEvents = myEvents.filter((event) => {
    const eventDate = new Date(event.startDate);
    if (activeTab === "Upcoming") {
      return eventDate >= now;
    } else {
      return eventDate < now;
    }
  });

  useEffect(() => {
    const fetchMyEvents = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${LOCAL_IP}/api/events/user/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setMyEvents(data);
      } catch (err) {
        console.error("Failed to fetch tickets:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyEvents();
  }, [user, token]);

  useEffect(() => {
    if (myEvents.length > 0) {
      const ids = myEvents.map((e) => e.organizationId);
      fetchOrgDetails(ids);
    }
  }, [myEvents, fetchOrgDetails]);

  return (
    <>
      <Navbar />
      <div className="font-inter px-20 pb-20">
        <h1 className="text-5xl font-bebas mt-10 mb-8">My Events</h1>

        {/* events header! */}

        <div className="flex gap-4 items-center mt-3">
          <div
            onClick={() => setActiveTab("Upcoming")}
            className="relative py-2 cursor-pointer z-10"
          >
            <h2
              className={`font-bold transition-colors ${activeTab === "Upcoming" ? "text-black" : "text-gray-400"}`}
            >
              Upcoming
            </h2>
            <div
              className={`absolute bottom-0 left-0 h-0.5 bg-brand z-20 transition-all duration-200 
        ${activeTab === "Upcoming" ? "w-full opacity-100" : "w-0 opacity-0"}`}
            />
          </div>

          <div
            onClick={() => setActiveTab("Past")}
            className="relative py-2 cursor-pointer z-10 px-5"
          >
            <h2
              className={`font-bold transition-colors ${activeTab === "Past" ? "text-black" : "text-gray-400"}`}
            >
              Past
            </h2>
            <div
              className={`absolute bottom-0 left-0 h-0.5 bg-brand z-20 transition-all duration-200 
        ${activeTab === "Past" ? "w-full opacity-100" : "w-0 opacity-0"}`}
            />
          </div>
        </div>
        <div className="w-full h-0.5 bg-gray-200 -mt-0.5 relative z-0"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {loading ? (
            <p className="text-gray-400 font-league">Loading...</p>
          ) : myEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <Link
                to={`/event/${event._id}`}
                key={event._id}
                className=" relative rounded-xl max-w-90 "
              >
                <div className="-z-10 w-full h-80 bg-gray-100 flex items-center justify-center rounded-2xl overflow-hidden group-hover:brightness-95 transition-all">
                  {event.flyer ? (
                    <img
                      src={event.flyer}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image size={40} className="text-gray/70" />
                  )}
                </div>
                <div className=" w-full flex flex-col p-2">
                  <p className="font-bebas text-lg uppercase tracking-wider text-brand">
                    {event.isRSO
                      ? orgLookup[event.organizationId]?.name || "Loading..."
                      : `${event.createdBy.firstName} ${event.createdBy.lastName}`}
                  </p>
                  <p className="font-semibold text-lg leading-tight mt-1 line-clamp-2">
                    {event.title}
                  </p>
                  <span className="text-sm text-gray">
                    <span>
                      {formatStackedDate(event.startDate).day +
                        ", " +
                        formatStackedDate(event.startDate).date}
                    </span>
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-400 italic font-league">
              You haven't joined any events yet.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
