import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import type { UniversityEvent } from "../types/UniversityEvent";
import { SERVER_IP } from "../config";
import { Link, useNavigate } from "react-router";
import { useOrganizations } from "../hooks/useOrganization";
import { formatStackedDate } from "../utils/date";
import {
  ArrowRightIcon,
  Calendar,
  Image,
  MapPin,
  Users,
  Pencil,
} from "lucide-react";

export default function Manage() {
  const navigate = useNavigate();
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
          `${SERVER_IP}/api/events/created-by/${user.id}`,
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
      <div className="font-inter px-6 md:px-20 pb-20">
        <h1 className="text-4xl md:text-5xl font-bebas mt-10 mb-8">Manage</h1>

        <div className="font-inter flex gap-4 items-center mt-3">
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

        {/* Events Grid */}
        <div className="grid grid-row-1 gap-6 mt-10">
          {loading ? (
            <p>Loading your events...</p>
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <Link
                to={`/event/${event._id}`}
                key={event._id}
                className="group flex items-start"
              >
                {/* Image stays left: 120px on mobile, 248px on desktop */}
                <div className="relative flex-shrink-0 w-32 h-32 md:w-62 md:h-62 bg-gray-100 rounded-2xl overflow-hidden flex items-center justify-center">
                  {event.flyer ? (
                    <img
                      src={event.flyer}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Image className="w-8 h-8 md:w-12 md:h-12" />
                    </div>
                  )}
                </div>

                <div className="flex w-full h-full">
                  <div className="relative flex flex-col h-full px-4 md:p-6 w-full ">
                    <p className="font-bebas text-brand text-sm md:text-xl tracking-wide uppercase truncate">
                      {orgLookup[event.organizationId]?.name || "Student event"}
                    </p>
                    <h3 className="text-base md:text-lg font-bold line-clamp-1">
                      {event.title}
                    </h3>

                    <div className="mt-1 text-gray-500 font-medium text-xs md:text-sm flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
                      {formatStackedDate(event.startDate).day},{" "}
                      {formatStackedDate(event.startDate).date}
                    </div>

                    <div className="mt-1 text-gray-500 font-medium text-xs md:text-sm flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" />
                      <p className="truncate">{event.location}</p>
                    </div>

                    <div className="mt-auto text-gray-500 font-medium text-xs md:text-sm flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 md:w-6 md:h-6 shrink-0" />
                      <p className="truncate">
                        {event.attendees.length} are attending...
                      </p>
                    </div>
                  </div>

                  {/* Icon only on mobile, Text + Icon on Desktop */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/manage/event/${event._id}`);
                    }}
                    className="cursor-pointer font-league self-center h-fit flex items-center justify-center gap-2 p-3 md:px-6 md:py-3 bg-gray-100 rounded-xl md:rounded-2xl hover:bg-gray-200 transition-all font-bold shrink-0"
                  >
                    <span className="hidden md:inline">Manage</span>
                    <ArrowRightIcon size={16} className="hidden md:block" />
                    <Pencil size={18} className="md:hidden" />
                  </button>
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
