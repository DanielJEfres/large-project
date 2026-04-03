import { Calendar, ChevronRight, MapPin, Share } from "lucide-react";
import Navbar from "../components/Navbar";
import { Link, useParams } from "react-router";
import { useEffect, useState } from "react";
import type { Organization } from "../types/Organizations";
import { LOCAL_IP, SERVER_IP } from "../config";
import type { UniversityEvent } from "../types/UniversityEvent";
import { formatStackedDate } from "../utils/date";

export default function Organization() {
  const { orgId } = useParams();
  const [org, setOrg] = useState<Organization | null>(null);
  const [events, setEvents] = useState<UniversityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrgAndEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${LOCAL_IP}/api/organizations/${orgId}`);
        const data = await response.json();

        if (data.Organization) {
          setOrg(data.Organization);
          setEvents(data.Events || []);
        }
      } catch (err) {
        console.error("Error fetching organization details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (orgId) fetchOrgAndEvents();
  }, [orgId]);

  if (loading) return <div className="p-20 font-league">Loading...</div>;
  if (!org)
    return <div className="p-20 font-league">Organization not found.</div>;

  return (
    <>
      <Navbar />

      <section className="">
        <div className="relative">
          <div className="w-full h-60 bg-gray-100"></div>

          {/* organization header here */}

          <div className="absolute px-20 top-30 w-full">
            <div className="flex w-full">
              <div className="bg-gray h-50 w-50 rounded"></div>

              <div className="mt-auto ml-auto flex gap-10 ">
                <button className=" items-center gap-3 flex font-bold w-fit px-8 py-3 rounded-4xl text-black bg-lightgray my-3 px-4 py-2 font-league">
                  <Share width={20} />
                  Share Organization
                </button>
                <button className="font-bold w-40 px-8 py-3 rounded-4xl text-white bg-black my-3 px-4 py-2 font-league">
                  Join
                </button>
              </div>
            </div>

            {/* org title */}
            <h1 className="text-5xl font-bebas mt-6 tracking-wide">
              {org.name}
            </h1>

            {/* description */}

            <div className="mt-4 max-w-3xl">
              <p className="font-league text-lg text-gray-700 leading-relaxed">
                {org.description}
                <span className="text-black font-semibold cursor-pointer">
                  ...more
                </span>
              </p>
            </div>

            {/* websites */}

            <div className="mt-10">
              <p className="font-semibold mb-2">Websites</p>

              <div className="flex gap-4">
                {/* external link + socials */}

                {org.socialLinks.website && (
                  <div className="h-10 w-10 bg-lightgray rounded flex items-center justify-center cursor-pointer hover:bg-brand/20 transition-colors"></div>
                )}

                {org.socialLinks.instagram && (
                  <div className="h-10 w-10 bg-lightgray rounded flex items-center justify-center cursor-pointer hover:bg-brand/20 transition-colors"></div>
                )}

                {org.socialLinks.discord && (
                  <div className="h-10 w-10 bg-lightgray rounded flex items-center justify-center cursor-pointer hover:bg-brand/20 transition-colors"></div>
                )}

                {org.socialLinks.linkedin && (
                  <div className="h-10 w-10 bg-lightgray rounded flex items-center justify-center cursor-pointer hover:bg-brand/20 transition-colors"></div>
                )}

                {org.socialLinks.linktree && (
                  <div className="h-10 w-10 bg-lightgray rounded flex items-center justify-center cursor-pointer hover:bg-brand/20 transition-colors"></div>
                )}
              </div>
            </div>

            {/* events header! */}
            <div className="mt-10">
              <h2 className="font-bebas text-4xl mb-4">Events</h2>

              <div className="flex gap-10 items-center mb-0.5 mt-3 ">
                <h2 className="font-bold text-black ml-0.5 ">Upcoming</h2>

                <h2 className="font-bold text-gray-400 ml-0.5 ">Past</h2>
              </div>

              <div className="relative">
                <div className="w-22 h-0.5 bg-brand absolute z-10"> </div>
                <div className="w-full h-0.5 bg-gray-200 "> </div>
              </div>

              {/* events go here */}

              <div className="p-10 flex flex-col gap-6">
                {events.map((event) => (
                  <div
                    key={event._id}
                    className="w-full h-56  rounded-2xl flex overflow-hidden  bg-gray-100 "
                  >
                    {/* bg img */}
                    <div className="w-76 h-full  bg-gray/30  relative">
                      <div className="text-xs font-bold absolute px-2.5 py-1 text-sm bg-white rounded-full top-3 left-3">
                        <p>6:00 PM</p>
                      </div>
                    </div>

                    <div className="flex-col px-6 py-4 flex relative w-full">
                      <div className="text-xs bg-white  relative w-fit flex gap-2 px-2.5 py-1  rounded-full -left-2.25">
                        <p className="font-bold ">
                          {formatStackedDate(event.startDate).date}
                        </p>

                        <p className="text-gray font-semibold ">
                          {formatStackedDate(event.startDate).day}
                        </p>
                      </div>
                      <h3 className="font-semibold text-lg leading-tight mt-2">
                        {event.title}
                      </h3>

                      <p className="text-gray-500 text-sm font-league line-clamp-3 mt-1">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Esse, ducimus maxime aperiam, corporis inventore fugit
                        quae perferendis, voluptates at quia aut sed
                        exercitationem! Deleniti soluta nesciunt repellendus
                        asperiores possimus nostrum?
                      </p>

                      {/* tags */}
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {event.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-brand/40 text-[10px] font-bold uppercase tracking-wider text-black rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-gray-600 text-sm">
                          <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            <span>{event.location}</span>
                          </div>
                        </div>

                        <Link
                          to={`/event/${event._id}`}
                          className="ml-auto mt-auto font-semibold flex items-center gap-2 hover:text-brand transition-colors"
                        >
                          <button className="flex gap-2 cursor-pointer">
                            Learn More <ChevronRight width={17} />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
