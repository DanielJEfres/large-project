import { ChevronRight, Share } from "lucide-react";
import Navbar from "../components/Navbar";
import { Link, useParams } from "react-router";
import { useEffect, useState } from "react";
import { LOCAL_IP, SERVER_IP } from "../config";
import type { UniversityEvent } from "../types/UniversityEvent";
import { formatStackedDate } from "../utils/date";
import { useOrganizations } from "../hooks/useOrganization";

export default function Event() {
  const { eventId } = useParams();
  const [event, setEvent] = useState<UniversityEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const { orgLookup, fetchOrgDetails } = useOrganizations();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`${LOCAL_IP}/api/events/${eventId}`);
        const data = await response.json();
        setEvent(data.event);
      } catch (err) {
        console.error("Failed to fetch event:", err);
      } finally {
        setLoading(false);
      }
    };
    if (eventId) fetchEvent();
  }, [eventId]);

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

      <div className="px-20  [&_button]:cursor-pointer">
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
                <h2 className="text-xl mb-4 font-league text-black">
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
              <h1 className=" text-4xl font-medium">{event.title}</h1>

              <div className="mt-5">
                <p className="font-medium">Hosted by</p>

                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 bg-gray rounded-full"></div>
                    <p>{"Random ahh organizer"}</p>
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
                  className="font-bold w-40 px-8 py-3 rounded-4xl text-white bg-black my-3 px-4 py-2 font-league disabled:bg-gray-400"
                >
                  {event.rsvpEnabled ? "Register" : "No RSVP Required"}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-5 p-2 [&>div>h2]:font-league  [&>div>h2]:mb-1">
              <div className="min-h-50">
                <h2 className="text-xl mt-2">About This Event</h2>
                <p>
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
                        <button className="font-bold  rounded-4xl my-3 py-2 font-league flex gap-2">
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
