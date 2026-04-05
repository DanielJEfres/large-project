import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import type { UniversityEvent } from "../types/UniversityEvent";
import { LOCAL_IP } from "../config";
import { Link } from "react-router";

export default function Tickets() {
  const { user, token } = useAuth();
  const [myEvents, setMyEvents] = useState<UniversityEvent[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <>
      <Navbar />
      <div className="px-20 pb-20">
        <h1 className="text-5xl font-bebas mt-10 mb-8">My Events</h1>
        <div className="flex gap-10 items-center mb-0.5 mt-3 ">
          <h2 className="font-bold text-black ml-0.5 ">Upcoming</h2>
          <h2 className="font-bold text-gray-400 ml-0.5 ">Past</h2>
        </div>

        <div className="relative">
          <div className="w-22 h-0.5 bg-brand absolute z-10"> </div>
          <div className="w-full h-0.5 bg-gray-200 "> </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {loading ? (
            <p className="text-gray-400 font-league">Loading...</p>
          ) : myEvents.length > 0 ? (
            myEvents.map((event) => (
              <Link
                to={`/event/${event._id}`}
                key={event._id}
                className=" rounded-xl p-4 bg-lightgray"
              >
                <h3 className="font-bold text-xl">{event.title}</h3>
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
