import {
  Calendar,
  ChevronRight,
  Globe,
  Hash,
  Image,
  LinkIcon,
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

            {/* category */}
            {org.category && (
              <div className="flex gap-2 mt-2">
                <span className="flex items-center gap-1 px-2 md:px-3 py-0.5 md:py-1 bg-brand/40 text-[10px] md:text-xs font-bold uppercase tracking-wider text-black">
                  {org.category}
                </span>
              </div>
            )}

            {/* description */}

            <div className="mt-4">
              <p className="font-inter text-md text-gray-700 leading-relaxed">
                {org.description}
              </p>
            </div>

            {/* websites */}

            {/* external link + socials */}
            {/* websites */}
            {Object.values(org.socialLinks).some((link) => link) && (
              <div className="mt-10">
                <p className="font-semibold mb-3">Websites</p>

                <div className="flex gap-4">
                  {/* Website */}
                  {org.socialLinks.website && (
                    <a
                      href={org.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-10 w-10 bg-lightgray rounded flex items-center justify-center cursor-pointer hover:bg-brand/20 transition-all hover:scale-110"
                    >
                      <Globe size={20} />
                    </a>
                  )}

                  {/* Instagram */}
                  {org.socialLinks.instagram && (
                    <a
                      href={org.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-10 w-10 bg-lightgray rounded flex items-center justify-center cursor-pointer hover:bg-[#E1306C]/20 transition-all hover:scale-110"
                    >
                      <svg
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
                          fill="#E1306C"
                        />
                        <path
                          d="M18 5C17.4477 5 17 5.44772 17 6C17 6.55228 17.4477 7 18 7C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5Z"
                          fill="#E1306C"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M1.65396 4.27606C1 5.55953 1 7.23969 1 10.6V13.4C1 16.7603 1 18.4405 1.65396 19.7239C2.2292 20.8529 3.14708 21.7708 4.27606 22.346C5.55953 23 7.23969 23 10.6 23H13.4C16.7603 23 18.4405 23 19.7239 22.346C20.8529 21.7708 21.7708 20.8529 22.346 19.7239C23 18.4405 23 16.7603 23 13.4V10.6C23 7.23969 23 5.55953 22.346 4.27606C21.7708 3.14708 20.8529 2.2292 19.7239 1.65396C18.4405 1 16.7603 1 13.4 1H10.6C7.23969 1 5.55953 1 4.27606 1.65396C3.14708 2.2292 2.2292 3.14708 1.65396 4.27606ZM13.4 3H10.6C8.88684 3 7.72225 3.00156 6.82208 3.0751C5.94524 3.14674 5.49684 3.27659 5.18404 3.43597C4.43139 3.81947 3.81947 4.43139 3.43597 5.18404C3.27659 5.49684 3.14674 5.94524 3.0751 6.82208C3.00156 7.72225 3 8.88684 3 10.6V13.4C3 15.1132 3.00156 16.2777 3.0751 17.1779C3.14674 18.0548 3.27659 18.5032 3.43597 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C5.49684 20.7234 5.94524 20.8533 6.82208 20.9249C7.72225 20.9984 8.88684 21 10.6 21H13.4C15.1132 21 16.2777 20.9984 17.1779 20.9249C18.0548 20.8533 18.5032 20.7234 18.816 20.564C19.5686 20.1805 20.1805 19.5686 20.564 18.816C20.7234 18.5032 20.8533 18.0548 20.9249 17.1779C20.9984 16.2777 21 15.1132 21 13.4V10.6C21 8.88684 20.9984 7.72225 20.9249 6.82208C20.8533 5.94524 20.7234 5.49684 20.564 5.18404C20.1805 4.43139 19.5686 3.81947 18.816 3.43597C18.5032 3.27659 18.0548 3.14674 17.1779 3.0751C16.2777 3.00156 15.1132 3 13.4 3Z"
                          fill="#E1306C"
                        />
                      </svg>
                    </a>
                  )}

                  {/* Discord */}
                  {org.socialLinks.discord && (
                    <a
                      href={org.socialLinks.discord}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-10 w-10 bg-lightgray rounded flex items-center justify-center cursor-pointer hover:bg-[#5865F2]/20 transition-all hover:scale-110"
                    >
                      <svg
                        className="w-6 h-6"
                        viewBox="0 0 192 192"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke="#5865F2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="12"
                          d="m68 138-8 16c-10.19-4.246-20.742-8.492-31.96-15.8-3.912-2.549-6.284-6.88-6.378-11.548-.488-23.964 5.134-48.056 19.369-73.528 1.863-3.334 4.967-5.778 8.567-7.056C58.186 43.02 64.016 40.664 74 39l6 11s6-2 16-2 16 2 16 2l6-11c9.984 1.664 15.814 4.02 24.402 7.068 3.6 1.278 6.704 3.722 8.567 7.056 14.235 25.472 19.857 49.564 19.37 73.528-.095 4.668-2.467 8.999-6.379 11.548-11.218 7.308-21.769 11.554-31.96 15.8l-8-16m-68-8s20 10 40 10 40-10 40-10"
                        />
                        <ellipse
                          cx="71"
                          cy="101"
                          fill="#5865F2"
                          rx="13"
                          ry="15"
                        />
                        <ellipse
                          cx="121"
                          cy="101"
                          fill="#5865F2"
                          rx="13"
                          ry="15"
                        />
                      </svg>
                    </a>
                  )}

                  {/* LinkedIn */}
                  {org.socialLinks.linkedin && (
                    <a
                      href={org.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-10 w-10 bg-lightgray rounded flex items-center justify-center cursor-pointer hover:bg-[#0077B5]/20 transition-all hover:scale-110"
                    >
                      <svg
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18.72 3.99997H5.37C5.19793 3.99191 5.02595 4.01786 4.86392 4.07635C4.70189 4.13484 4.55299 4.22471 4.42573 4.34081C4.29848 4.45692 4.19537 4.59699 4.12232 4.75299C4.04927 4.909 4.0077 5.07788 4 5.24997V18.63C4.01008 18.9901 4.15766 19.3328 4.41243 19.5875C4.6672 19.8423 5.00984 19.9899 5.37 20H18.72C19.0701 19.9844 19.4002 19.8322 19.6395 19.5761C19.8788 19.32 20.0082 18.9804 20 18.63V5.24997C20.0029 5.08247 19.9715 4.91616 19.9078 4.76122C19.8441 4.60629 19.7494 4.466 19.6295 4.34895C19.5097 4.23191 19.3672 4.14059 19.2108 4.08058C19.0544 4.02057 18.8874 3.99314 18.72 3.99997ZM9 17.34H6.67V10.21H9V17.34ZM7.89 9.12997C7.72741 9.13564 7.5654 9.10762 7.41416 9.04768C7.26291 8.98774 7.12569 8.89717 7.01113 8.78166C6.89656 8.66615 6.80711 8.5282 6.74841 8.37647C6.6897 8.22474 6.66301 8.06251 6.67 7.89997ZM17.34 17.34H15V13.44C15 12.51 14.67 11.87 13.84 11.87C13.5822 11.8722 13.3313 11.9541 13.1219 12.1045C12.9124 12.2549 12.7546 12.4664 12.67 12.71C12.605 12.8926 12.5778 13.0865 12.59 13.28V17.34H10.29V10.21H12.59V11.21C12.7945 10.8343 13.0988 10.5225 13.4694 10.3089C13.84 10.0954 14.2624 9.98848 14.69 9.99997C16.2 9.99997 17.34 11 17.34 13.13V17.34Z"
                          fill="#0077B5"
                        />
                      </svg>
                    </a>
                  )}

                  {/* Linktree (Using fallback icon) */}
                  {org.socialLinks.linktree && (
                    <a
                      href={org.socialLinks.linktree}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-10 w-10 bg-lightgray rounded flex items-center justify-center cursor-pointer hover:bg-[#43E760]/20 transition-all hover:scale-110"
                    >
                      <Share size={20} className="text-[#43E760]" />
                    </a>
                  )}
                </div>
              </div>
            )}

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
                            <h3 className="font-inter font-semibold text-sm md:text-lg leading-tight mt-1 md:mt-2 ">
                              {event.title}
                            </h3>

                            <p className="text-gray-500 text-[10px] md:text-sm font-inter mt-1">
                              {event.description || "No description provided."}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1 md:gap-2 mt-3 md:mt-auto">
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
