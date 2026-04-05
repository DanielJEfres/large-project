import { ChevronRight, Share } from "lucide-react";
import Navbar from "../components/Navbar";
import { Link, useParams } from "react-router";
import { useEffect, useState } from "react";
import { LOCAL_IP, SERVER_IP } from "../config";
import type { UniversityEvent } from "../types/UniversityEvent";
import { formatStackedDate } from "../utils/date";
import { useOrganizations } from "../hooks/useOrganization";

import { useAuth } from "../context/AuthContext";

export default function Event() {
  const { eventId } = useParams();
  const [event, setEvent] = useState<UniversityEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const { orgLookup, fetchOrgDetails } = useOrganizations();

  const { user, token } = useAuth();
  const [isAttending, setIsAttending] = useState(false); // Track attendance locally

  const [showMenu, setShowMenu] = useState(false);
  const isOwner = user && event && user.id === event.createdBy;

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const response = await fetch(`${SERVER_IP}/api/events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Event deleted successfully");
        window.location.href = "/"; // Redirect to home or dashboard
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
    const fetchEvent = async () => {
      try {
        const response = await fetch(`${SERVER_IP}/api/events/${eventId}`);
        const data = await response.json();
        setEvent(data.event);

        // Check if current user is already in the attendees list
        if (user && data.event.attendees.includes(user.id)) {
          setIsAttending(true);
        }
      } catch (err) {
        console.error("Failed to fetch event:", err);
      } finally {
        setLoading(false);
      }
    };
    if (eventId) fetchEvent();
  }, [eventId, user]);

  const handleRSVP = async () => {
    if (!user || !user.id) return alert("Please log in to register"); // Check for user.id

    const endpoint = isAttending ? "unattendEvent" : "attendEvent";

    try {
      const response = await fetch(
        `${SERVER_IP}/api/events/${endpoint}/${eventId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          // Ensure the key matches exactly what the backend looks for: "userId"
          body: JSON.stringify({ userId: user.id }),
        },
      );

      if (response.ok) {
        setIsAttending(!isAttending);
      } else {
        const errorData = await response.json();
        alert(errorData.message); // This is where you see "userId is required"
      }
    } catch (err) {
      console.error("RSVP Error:", err);
    }
  };

  useEffect(() => {
    if (event?.organizationId) {
      fetchOrgDetails([event.organizationId]);
    }
  }, [event, fetchOrgDetails]);

  const hostOrg = event ? orgLookup[event.organizationId] : null;

  if (loading) return <div className="p-20 font-league">Loading...</div>;
  if (!event) return <div className="p-20 font-league">Event not found.</div>;

  return (
    <>
      <Navbar />

      <div className="font-inter px-20  [&_button]:cursor-pointer ">
        {/* 2 grids */}
        <div className="grid grid-cols-[350px_1fr] gap-10 mt-10">
          {/* 1st column */}
          <div className="w-full">
            {/* Add sticky, top-10, and self-start here */}
            <div className="sticky top-10 self-start">
              <div className="h-87 w-full bg-gray rounded-t-2xl overflow-hidden">
                {event.flyer ? (
                  <img
                    src={event.flyer}
                    alt="Event Flyer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300"></div>
                )}
              </div>

              <div className="p-5 bg-lightgray rounded-b-xl">
                <h2 className="text-xl mb-4 font-bebas text-black">
                  Event details
                </h2>

                <div className="flex flex-col gap-5 ">
                  {/* Date Section */}
                  <div className="flex flex-col">
                    <p className="font-league font-bold text-sm uppercase tracking-wider text-gray-500">
                      Date
                    </p>
                    <p className=" font-medium text-black">
                      {formatStackedDate(event.startDate).day +
                        ", " +
                        formatStackedDate(event.startDate).date}
                    </p>
                  </div>

                  {/* Location Section */}
                  <div className="flex flex-col">
                    <p className="font-league font-bold text-sm uppercase tracking-wider text-gray-500">
                      Location
                    </p>
                    <p className=" font-medium text-black">
                      {event.location || "Location TBD"}
                    </p>
                  </div>

                  {/* Category Section */}
                  <div className="flex flex-col">
                    <p className="font-league font-bold text-sm uppercase tracking-wider text-gray-500">
                      Category
                    </p>
                    <p className=" font-medium text-black">
                      {event.isRSO ? "RSO Event" : "Student Event"}
                    </p>
                  </div>

                  {/* Tags Section */}
                  <div className="flex flex-col">
                    <p className="font-league font-bold text-sm uppercase tracking-wider text-gray-500 mb-2">
                      Tags
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.length > 0 ? (
                        event.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-brand/10 text-brand text-xs font-bold uppercase rounded-full"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <p className=" font-medium text-black">No tags</p>
                      )}
                    </div>
                  </div>

                  {/* External Links Section */}
                  <div className="flex flex-col">
                    <p className="font-league font-bold text-sm uppercase tracking-wider text-gray-500">
                      External Links
                    </p>
                    <p className=" font-medium text-black italic">None</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2nd column */}
          <div className="w-full mb-20">
            {/* top half */}
            <div className=" h-87 flex flex-col">
              <p className="font-bebas text-2xl font-thin tracking-wider">
                {hostOrg?.name || "Loading..."}
              </p>
              <h1 className=" text-4xl font-bold">{event.title}</h1>

              <div className="mt-5">
                <p className="font-medium">Hosted by</p>

                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 bg-gray rounded-full"></div>
                    <p>{event.createdBy}</p>
                  </div>
                </div>
              </div>

              {/* buttons */}
              <div className="flex mt-auto gap-2 ">
                <button className=" items-center gap-3 flex font-bold w-fit px-8 py-3 rounded-4xl text-black bg-lightgray my-3 px-4 py-2 font-league">
                  <Share width={20} />
                  Share Event
                </button>
                <button
                  disabled={!event.rsvpEnabled}
                  onClick={handleRSVP}
                  className={`font-bold w-40 px-8 py-3 rounded-4xl text-white my-3 font-league disabled:bg-gray-400 transition-colors ${
                    isAttending
                      ? "bg-brand hover:bg-brand/90"
                      : "bg-black hover:bg-zinc-800"
                  }`}
                >
                  {!event.rsvpEnabled
                    ? "No RSVP Required"
                    : isAttending
                      ? "Unregister"
                      : "Register"}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-5 p-2 [&>div>h2]:font-league  [&>div>h2]:mb-1">
              <div className="min-h-50">
                <h2 className="text-xl mt-2">About This Event</h2>
                <p className="text-gray-600">
                  {event.description ||
                    "No description provided for this event."}
                </p>
              </div>
              <div>
                <h2 className="text-xl ">Organized By</h2>

                <div className="mt-2 bg-lightgray h-60 flex rounded-xl overflow-hidden shadow-sm">
                  {/* first */}
                  <div className="h-full w-100 bg-gray "></div>

                  {/* second */}
                  <div className="px-8 pt-8 flex flex-col w-full">
                    <p className="text-2xl font-bold font-league text-black leading-tight">
                      {hostOrg?.name || "Loading..."}
                    </p>
                    <p className="text-gray-600">
                      {hostOrg?.description || "Loading..."}
                    </p>

                    {/* buttons */}
                    <div className="mt-auto ml-auto gap-7 flex flex-nowrap">
                      <Link to={`/organization/${event.organizationId}`}>
                        <button className="font-medium  rounded-4xl my-3 py-2 font-league flex gap-2">
                          More Events
                          <ChevronRight width={17} />
                        </button>
                      </Link>
                      <button className="font-bold  px-7  rounded-4xl text-white bg-black my-3  py-2 font-league">
                        Join
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
