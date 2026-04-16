import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { LOCAL_IP, SERVER_IP } from "../config";
import Navbar from "../components/Navbar";
import type { UniversityEvent } from "../types/UniversityEvent";
import {
  Users,
  Eye,
  Edit3,
  MapPin,
  Calendar,
  ChevronLeft,
  Clock,
  Info,
  Image as ImageIcon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function EventDashboard() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [event, setEvent] = useState<UniversityEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  const [attendeeDetails, setAttendeeDetails] = useState<any[]>([]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const response = await fetch(`${SERVER_IP}/api/events/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Event deleted successfully");
        navigate("/manage");
      } else {
        const data = await response.json();
        alert(data.message || "Failed to delete event");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("An error occurred while deleting.");
    }
  };

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch(`${SERVER_IP}/api/events/${id}`);
        const data = await response.json();
        setEvent(data.event);

        if (data.event.attendees && data.event.attendees.length > 0) {
          const details = await Promise.all(
            data.event.attendees.map(async (attendeeId: string) => {
              const res = await fetch(`${SERVER_IP}/api/users/${attendeeId}`);
              return res.ok
                ? await res.json()
                : { fullName: "Unknown User", id: attendeeId };
            }),
          );
          setAttendeeDetails(details);
        }
      } catch (err) {
        console.error("Failed to fetch event:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id]);

  if (loading)
    return <div className="p-20 font-inter">Loading Dashboard...</div>;
  if (!event)
    return <div className="p-20 font-inter text-center">Event not found.</div>;

  const startDate = new Date(event.startDate);
  const endDate = event.endDate ? new Date(event.endDate) : null;

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto font-inter px-4 md:px-20 text-black ">
        <Link
          to="/manage"
          className="flex items-center text-gray-500 hover:text-black mb-8 transition-colors w-fit"
        >
          <ChevronLeft size={20} /> Back to Manage
        </Link>

        {/* Header and Flyer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12 items-center">
          <div className="lg:col-span-7">
            <h1 className="text-6xl font-bebas leading-none mb-6">
              {event.title}
            </h1>
            <div className="font-league flex gap-3">
              <Link
                to={`/event/${event._id}`}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-all font-bold"
              >
                <Eye size={18} /> View Page
              </Link>
              <Link
                to={`/manage/event/${event._id}/edit`}
                className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-2xl hover:bg-zinc-800 transition-all font-bold"
              >
                <Edit3 size={18} /> Edit Event
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="aspect-video w-full bg-gray-50 rounded-3xl overflow-hidden border border-gray-100">
              {event.flyer ? (
                <img
                  src={event.flyer}
                  alt="Flyer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                  <ImageIcon size={48} />
                  <p className="text-sm mt-2 font-medium">No flyer uploaded</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom stuff */}

        <div className="grid grid-cols-1 gap-4">
          {/* Details Section */}
          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden h-full">
            <div className="p-8 border-b border-gray-50 bg-white">
              <h3 className="font-bold text-xl mb-6 ">Details</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs text-gray-500 font-league uppercase tracking-wider font-bold">
                      Location
                    </p>
                    <p className="font-medium">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs text-gray-500 font-league uppercase tracking-wider font-bold">
                      Start Date
                    </p>
                    <p className="font-medium">
                      {startDate.toLocaleDateString()} at{" "}
                      {startDate.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                {endDate && (
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs text-gray-500 font-league uppercase tracking-wider font-bold">
                        End Date
                      </p>
                      <p className="font-medium">
                        {endDate.toLocaleDateString()} at{" "}
                        {endDate.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs text-gray-500 font-league uppercase tracking-wider font-bold">
                      About
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white">
              <h3 className="font-bold text-xl">Attendees</h3>
              <span className="flex gap-2 bg-black text-white px-4 py-1 rounded-full text-sm font-bold">
                <Users size={18} />
                {event.attendees?.length || 0}
              </span>
            </div>
            <div className="px-8 max-h-[400px] overflow-y-auto pb-8">
              {event.attendees && event.attendees.length > 0 ? (
                <div className="space-y-4">
                  {attendeeDetails.map((attendee, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl"
                    >
                      <div className="w-10 h-10 bg-zinc-200 rounded-full flex items-center justify-center"></div>
                      <div>
                        <p className="text-sm font-bold">{attendee.fullName}</p>
                        {/* <p className="text-xs text-gray-500 font-inter">
                          ( role possibly )
                        </p> */}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-10">
                  No attendees yet.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-10 border border-gray-100 rounded-3xl shadow-sm  p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div>
                <h3 className="text-xl font-bold">Cancel</h3>

                <p className="text-gray-600 ">
                  Permanently delete this event and all associated data.
                </p>
              </div>
            </div>
            <button
              onClick={handleDelete}
              className="cursor-pointer px-8 py-4 bg-red-600 text-white font-league font-bold rounded-2xl hover:bg-red-700 transition-all active:scale-95 whitespace-nowrap"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
