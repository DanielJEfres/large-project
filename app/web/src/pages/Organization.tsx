import {
  Calendar,
  ChevronRight,
  Hash,
  Image,
  MapPin,
  Share,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { Link, useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import type { Organization } from "../types/Organizations";
import { LOCAL_IP, SERVER_IP } from "../config";
import type { UniversityEvent } from "../types/UniversityEvent";
import { formatStackedDate, formatTime } from "../utils/date";
import { useMembership } from "../hooks/useMembership";

import ShareModal from "../components/ShareModal";

export default function Organization() {
  const { isOrgMember, toggleOrgMembership } = useMembership();
  const [activeTab, setActiveTab] = useState<"Upcoming" | "Past">("Upcoming");

  const { orgId } = useParams();
  const navigate = useNavigate();
  const [org, setOrg] = useState<Organization | null>(null);
  const [events, setEvents] = useState<UniversityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // For modal
  const [isShareOpen, setIsShareOpen] = useState(false);

  const now = new Date();

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.startDate);
    if (activeTab === "Upcoming") {
      return eventDate >= now;
    } else {
      return eventDate < now;
    }
  });

  // creates a dict that groups events together based on their dates (dateKey)
  const groupedEvents = filteredEvents.reduce(
    (groups: { [key: string]: UniversityEvent[] }, event) => {
      const dateKey = formatStackedDate(event.startDate).date;
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(event);
      return groups;
    },
    {},
  );

  useEffect(() => {
    const fetchOrgAndEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${SERVER_IP}/api/organizations/${orgId}`);
        const data = await response.json();

        if (data.Organization) {
          setOrg(data.Organization);
          console.log(data.Events);
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
          <div className="w-full h-40 md:h-60 bg-gray-100">
            {/* Mobile Share Icon */}
            <button
              onClick={() => setIsShareOpen(true)}
              className="md:hidden absolute top-4 right-4 z-30 p-2 bg-white/80 backdrop-blur-md rounded-full text-black"
            >
              <Share width={20} />
            </button>
          </div>

          {/* organization header here */}

          <div className="absolute px-6 md:px-20 top-20 md:top-30 w-full">
            <div className="flex flex-col md:flex-row w-full gap-4 md:gap-0">
              <div className="bg-gray-300 h-40 w-40 md:h-50 md:w-50 rounded overflow-hidden flex items-center justify-center shrink-0">
                {org.logo ? (
                  <img
                    src={org.logo}
                    alt={`${org.name} logo`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  /* Fallback Icon if no logo exists in DB */
                  <Image className="text-gray-400" size={24} />
                )}
              </div>

              <div className="md:mt-auto md:ml-auto flex flex-col md:flex-row gap-3 md:gap-10">
                {/* Desktop Share Button */}
                <button
                  onClick={() => setIsShareOpen(true)}
                  className="hover:cursor-pointer hidden md:flex items-center gap-3 font-bold w-fit px-8 py-3 rounded-4xl text-black bg-lightgray my-3 font-league"
                >
                  <Share width={20} />
                  Share Organization
                </button>
                <button
                  onClick={() => toggleOrgMembership(org._id)}
                  className={`font-bold w-full md:w-40 px-8 py-3 rounded-4xl md:my-3 font-league cursor-pointer transition-all active:scale-95 ${
                    isOrgMember(org._id)
                      ? "bg-gray-200 text-black border border-gray-300"
                      : "bg-black text-white hover:bg-zinc-800"
                  }`}
                >
                  {isOrgMember(org._id) ? "Leave" : "Join"}
                </button>
              </div>
            </div>

            {/* org title */}
            <h1 className="text-4xl md:text-5xl font-bebas mt-6 tracking-wide">
              {org.name}
            </h1>

            {/* description */}

            <div className="mt-4">
              <p className="font-inter text-md text-gray-700 leading-relaxed">
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

              {/* events go here */}

              <div className="py-10 flex flex-col gap-10 w-full max-w-5xl mx-auto">
                {Object.keys(groupedEvents).length === 0 && (
                  <div className="mt-20 h-30 text-gray-400 text-center">
                    <p>There's no {activeTab.toLowerCase()} events. :(</p>
                  </div>
                )}
                {Object.keys(groupedEvents).map((dateKey) => (
                  <div key={dateKey} className="flex flex-col gap-4">
                    {/* Date Header for the Group */}
                    <div className="text-lg bg-white relative w-fit flex gap-2 py-1 rounded-full md:-left-2.25">
                      <p className="font-bold">{dateKey}</p>
                      <p className="text-gray font-semibold">
                        {
                          formatStackedDate(groupedEvents[dateKey][0].startDate)
                            .day
                        }
                      </p>
                    </div>

                    {/* Events for this Date */}
                    <div className="flex flex-col gap-6">
                      {groupedEvents[dateKey].map((event) => (
                        <div
                          key={event._id}
                          onClick={() => navigate(`/event/${event._id}`)}
                          className="w-full h-36 md:h-56 rounded-2xl flex flex-row overflow-hidden bg-gray-50 cursor-pointer"
                        >
                          {/* Left Image Section */}
                          <div className="w-32 md:min-w-56 md:max-w-56 h-full bg-gray-200 relative shrink-0">
                            {event.flyer ? (
                              <img
                                src={event.flyer}
                                alt={event.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Image size={32} />
                              </div>
                            )}
                          </div>

                          {/* Content Section */}

                          <div className="flex-col px-4 md:px-6 py-3 md:py-5 flex relative w-full">
                            <div className="font-inter flex text-[10px] md:text-sm gap-1 relative font-semibold text-gray-500 rounded-full">
                              <p>{formatTime(event.startDate)}</p>
                              {event.endDate && (
                                <>
                                  <p>-</p>
                                  {
                                    <>
                                      {formatStackedDate(event.startDate)
                                        .date !=
                                        formatStackedDate(event.endDate)
                                          .date && (
                                        <p className="text-brand">
                                          {
                                            formatStackedDate(event.endDate)
                                              .date
                                          }
                                        </p>
                                      )}
                                    </>
                                  }
                                  <p className="text-brand">
                                    {formatTime(event.endDate)}
                                  </p>
                                </>
                              )}
                            </div>
                            <h3 className="font-inter font-semibold text-sm md:text-lg leading-tight mt-1 md:mt-2 line-clamp-1 md:line-clamp-none">
                              {event.title}
                            </h3>

                            <p className="text-gray-500 text-[10px] md:text-sm font-inter line-clamp-2 md:line-clamp-3 mt-1">
                              {event.description || "No description provided."}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1 md:gap-2 mt-2 md:mt-auto">
                              {event.tags.map((tag) => (
                                <span
                                  key={tag._id}
                                  className="flex gap-1 px-2 md:px-3 py-0.5 md:py-1 items-center bg-brand text-[8px] md:text-[10px] font-bold uppercase tracking-wider text-white rounded-full"
                                >
                                  <Hash size={10} className="md:w-[14px]" />
                                  {tag.name}
                                </span>
                              ))}
                            </div>

                            <div className="font-inter mt-2 flex flex-row items-center justify-between gap-3">
                              <div className="flex items-center gap-2 md:gap-4 text-gray-500 text-[10px] md:text-sm">
                                <div className="flex items-center gap-1">
                                  <MapPin size={12} className="md:w-[14px]" />
                                  <span className="line-clamp-1">
                                    {event.location}
                                  </span>
                                </div>
                              </div>

                              <div className="hidden md:flex font-semibold items-center gap-2 hover:text-brand transition-colors">
                                <button className="flex gap-2 cursor-pointer items-center">
                                  Learn More <ChevronRight width={17} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <ShareModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          link={window.location.href}
          title="Organization"
        />
      </section>
    </>
  );
}
