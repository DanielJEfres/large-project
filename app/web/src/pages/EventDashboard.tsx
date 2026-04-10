import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { SERVER_IP } from "../config";
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
  const { id } = useParams();
  const [event, setEvent] = useState<UniversityEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();

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
        window.location.href = "/";
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
        const res = await fetch(`${SERVER_IP}/api/events/${id}`);
        const data = await res.json();

        const eventData = data.event;
        setEvent(eventData);
      } catch (err) {
        console.error(err);
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
      <div className="max-w-7xl mx-auto px-20 py-10 font-inter text-black ">
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

        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex flex-col bg-white sticky top-0">
            <h3 className="font-bold text-xl">Details</h3>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0">
            <h3 className="font-bold text-xl">Attendees List</h3>
          </div>
        </div>

        <div className="mt-20 border border-gray-100 rounded-3xl shadow-sm  p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div>
                <h3 className="text-xl font-bold">Cancel</h3>

                <p className="text-gray-600 ">lowkey gotta style ts later</p>
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
