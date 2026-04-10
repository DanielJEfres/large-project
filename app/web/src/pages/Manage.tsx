import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import type { UniversityEvent } from "../types/UniversityEvent";
import { LOCAL_IP, SERVER_IP } from "../config";
import { Link, useNavigate } from "react-router";
import { useOrganizations } from "../hooks/useOrganization";
import { formatStackedDate } from "../utils/date";
import { ArrowRightIcon, Calendar, Image, MapPin, Users } from "lucide-react";

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
                className="group flex "
              >
                <div className="relative min-w-62 min-h-62 max-w-62 max-h-62 bg-gray-100 rounded-2xl overflow-hidden mb-4">
                  {event.flyer ? (
                    <img
                      src={event.flyer}
                      className="w-full h-full w-2 object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Image size={48} />
                    </div>
                  )}
                </div>
                <div className="flex w-full">
                  <div className="relative flex flex-col p-6 w-full">
                    <p className="font-bebas text-brand text-xl tracking-wide uppercase">
                      {orgLookup[event.organizationId]?.name ||
                        "this should say user's name  :p"}
                    </p>
                    <h3 className="text-lg font-bold line-clamp-1">
                      {event.title}
                    </h3>
                    <div className="mt-1 text-gray-500 font-medium text-sm flex items-center gap-1">
                      <Calendar size={16} className="shrink-0" />
                      {formatStackedDate(event.startDate).day},{" "}
                      {formatStackedDate(event.startDate).date}
                    </div>

                    <div className="mt-1 text-gray-500 font-medium text-sm flex items-center gap-1">
                      <MapPin size={16} className="shrink-0" />
                      <p>{event.location}</p>
                    </div>

                    <div className="mt-auto mb-5 text-gray-500 font-medium text-sm flex items-center gap-1">
                      <Users />
                      <p>{event.attendees.length} are attending... </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/manage/event/${event._id}`);
                    }}
                    className="cursor-pointer font-league self-center h-fit flex items-center gap-2 px-6 py-3 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-all font-bold"
                  >
                    <span>Manage</span>
                    <ArrowRightIcon size={16} />
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
