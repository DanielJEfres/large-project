import {
  ChevronRight,
  Image,
  MapPin,
  Calendar,
  ListFilter,
  Search,
  ChevronLeft,
  Hash,
  Users,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { Link } from "react-router";
import { useRef, useState, useEffect } from "react";
import { SERVER_IP } from "../config";
import type { UniversityEvent } from "../types/UniversityEvent";
import { formatStackedDate } from "../utils/date";
import { useOrganizations } from "../hooks/useOrganization";
import EventSkeleton from "../components/EventSkeleton";

export default function Events() {
  const [activeTab, setActiveTab] = useState<"RSO" | "Student">("RSO");

  const [loading, setLoading] = useState(true);
  const [trendingEvents, setTrendingEvents] = useState<UniversityEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UniversityEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { orgLookup, fetchOrgDetails } = useOrganizations();

  const forYouRef = useRef<HTMLDivElement>(null);
  const trendingRef = useRef<HTMLDivElement>(null);

  const [scrolledForYou, setScrolledForYou] = useState(false);
  const [scrolledTrending, setScrolledTrending] = useState(false);

  const scroll = (
    ref: React.RefObject<HTMLDivElement | null>,
    direction: "left" | "right",
  ) => {
    if (ref.current) {
      const scrollAmount = 400;
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = (
    ref: React.RefObject<HTMLDivElement | null>,
    setScrolled: (val: boolean) => void,
  ) => {
    if (ref.current) {
      setScrolled(ref.current.scrollLeft > 20);
    }
  };

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch(`${SERVER_IP}/api/getEvents/getTrending`);
        const data = await response.json();
        setTrendingEvents(data.events);
      } catch (err) {
        console.error("Failed to fetch trending:", err);
      }
    };
    fetchTrending();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const upcomingRes = await fetch(
          `${SERVER_IP}/api/getEvents/getUpcoming`,
        );
        const upcomingData = await upcomingRes.json();
        setUpcomingEvents(upcomingData.events);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (upcomingEvents.length > 0) {
      const ids = upcomingEvents.map((e) => e.organizationId);
      fetchOrgDetails(ids);
      setLoading(false);
    }
  }, [upcomingEvents, fetchOrgDetails]);

  const filteredUpcoming = upcomingEvents.filter((event) =>
    activeTab === "RSO" ? event.isRSO : !event.isRSO,
  );

  const filteredTrending = trendingEvents.filter((event) =>
    activeTab === "RSO" ? event.isRSO : !event.isRSO,
  );

  return (
    <>
      <Navbar />
      <div className="font-inter px-6 md:px-20 pb-20 overflow-x-hidden">
        <h1 className="text-4xl md:text-5xl font-bebas mt-10 mb-8">Events</h1>

        <div className="font-inter flex gap-6 md:gap-10 items-center mt-3 overflow-x-auto scrollbar-hide">
          <div
            onClick={() => setActiveTab("RSO")}
            className="relative py-2 cursor-pointer z-10 shrink-0"
          >
            <h2
              className={`font-bold transition-colors ${activeTab === "RSO" ? "text-black" : "text-gray-400"}`}
            >
              RSO Events
            </h2>
            <div
              className={`absolute bottom-0 left-0 h-0.5 bg-brand z-20 transition-all duration-200 
      ${activeTab === "RSO" ? "w-full opacity-100" : "w-0 opacity-0"}`}
            />
          </div>

          <div
            onClick={() => setActiveTab("Student")}
            className="relative py-2 cursor-pointer z-10 shrink-0"
          >
            <h2
              className={`font-bold transition-colors ${activeTab === "Student" ? "text-black" : "text-gray-400"}`}
            >
              Student Events
            </h2>
            <div
              className={`absolute bottom-0 left-0 h-0.5 bg-brand z-20 transition-all duration-200 
      ${activeTab === "Student" ? "w-full opacity-100" : "w-0 opacity-0"}`}
            />
          </div>
        </div>

        <div className="w-full h-0.5 bg-gray-200 -mt-0.5 relative z-0"></div>

        <div className="mt-9 flex items-center gap-3">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray ">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search Events"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-lightgray py-3 pl-11 pr-4 rounded-2xl outline-none border-2 border-transparent transition-all font-league"
            />
          </div>
          <button className="p-3 bg-lightgray rounded-2xl text-gray hover:text-black active:scale-95 transition-all">
            <ListFilter size={20} />
          </button>
        </div>

        {searchQuery === "" ? (
          <>
            {/* --- FOR YOU CAROUSEL --- */}
            <div className="flex flex-col gap-4 mt-9 group/carousel relative ">
              <h2 className="text-2xl font-league ">For you</h2>

              {scrolledForYou && (
                <button
                  onClick={() => scroll(forYouRef, "left")}
                  className="hidden md:flex absolute left-[-50px] top-1/2 bg-white p-2 rounded-full shadow-md z-20 hover:scale-110 transition-all"
                >
                  <ChevronLeft size={24} />
                </button>
              )}
              <button
                onClick={() => scroll(forYouRef, "right")}
                className="hidden md:flex absolute right-[-50px] top-1/2 bg-white p-2 rounded-full shadow-md z-20 hover:scale-110 transition-all"
              >
                <ChevronRight size={24} />
              </button>

              <div
                ref={forYouRef}
                onScroll={() => handleScroll(forYouRef, setScrolledForYou)}
                className="flex gap-6 md:gap-10 overflow-x-auto scrollbar-hide scroll-smooth py-2"
              >
                {loading ? (
                  <>
                    {[...Array(3)].map((_, i) => (
                      <EventSkeleton key={i} variant="horizontal" />
                    ))}
                  </>
                ) : (
                  <>
                    {filteredUpcoming.map((event) => (
                      <Link
                        key={event._id}
                        to={`/event/${event._id}`}
                        className="group border border-gray-100 shadow-sm h-fit w-[280px] sm:w-auto sm:min-w-fit flex flex-col sm:flex-row rounded-2xl overflow-hidden shrink-0 cursor-pointer"
                      >
                        <div className="w-full sm:w-80 h-60 sm:h-80 bg-gray/30 flex items-center justify-center shrink-0 overflow-hidden ">
                          <img
                            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                            src={
                              event.flyer ||
                              "https://www.ucf.edu/wp-content/blogs.dir/4/files/2024/11/PegFa24-OnCampus-1200x800-1.jpg"
                            }
                            alt={event.title}
                          />
                        </div>
                        <div className="w-full sm:w-60 px-5 py-4 relative flex flex-col">
                          <p className="font-bebas text-lg uppercase tracking-wider text-brand">
                            {event.isRSO
                              ? orgLookup[event.organizationId]?.name ||
                                "Loading..."
                              : `${event.createdBy.firstName} ${event.createdBy.lastName}`}
                          </p>
                          <p className="font-semibold text-lg leading-tight mt-1 line-clamp-2 ">
                            {event.title}
                          </p>
                          <div className="mt-2 space-y-1 text-gray-700">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar size={14} />
                              <span>
                                {formatStackedDate(event.startDate).day +
                                  ", " +
                                  formatStackedDate(event.startDate).date}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin size={14} />
                              <span className="line-clamp-1">
                                {event.location || "Location TBD"}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-3">
                            {event.tags?.slice(0, 2).map((tag) => (
                              <span
                                key={tag.name}
                                className="flex gap-1 items-center px-3 py-1 bg-brand text-[10px] font-bold uppercase text-white rounded-full "
                              >
                                <Hash size={14} />
                                {tag.name}
                              </span>
                            ))}
                          </div>
                          <div className="font-league pt-6 mt-auto font-semibold flex items-center justify-end gap-2 hover:text-gray-500 text-black transition-colors">
                            Learn More <ChevronRight width={17} />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* --- TRENDING CAROUSEL --- */}
            <div className="flex flex-col gap-4 mt-12 group/carousel relative">
              <h2 className="text-2xl font-league">Trending</h2>

              {scrolledTrending && (
                <button
                  onClick={() => scroll(trendingRef, "left")}
                  className="hidden md:flex absolute left-[-50px] top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-20 hover:scale-110 transition-all cursor-pointer"
                >
                  <ChevronLeft size={24} />
                </button>
              )}

              <button
                onClick={() => scroll(trendingRef, "right")}
                className="hidden md:flex absolute right-[-50px] top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-20 hover:scale-110 transition-all cursor-pointer"
              >
                <ChevronRight size={24} />
              </button>

              <div
                ref={trendingRef}
                onScroll={() => handleScroll(trendingRef, setScrolledTrending)}
                className="flex gap-6 md:gap-10 overflow-x-auto scrollbar-hide scroll-smooth py-2"
              >
                {loading ? (
                  <>
                    {[...Array(6)].map((_, i) => (
                      <EventSkeleton key={i} variant="square" />
                    ))}
                  </>
                ) : (
                  <>
                    {filteredTrending.map((event, index) => (
                      <Link
                        key={event._id}
                        to={`/event/${event._id}`}
                        className="shrink-0 group cursor-pointer"
                      >
                        <div className="w-64 md:w-80 h-64 md:h-80 bg-gray/30 flex items-center justify-center rounded-2xl overflow-hidden group-hover:brightness-95 transition-all">
                          <img
                            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                            src={
                              event.flyer ||
                              "https://www.ucf.edu/wp-content/blogs.dir/4/files/2024/11/PegFa24-OnCampus-1200x800-1.jpg"
                            }
                            alt={event.title}
                          />
                        </div>

                        <div className="max-w-64 md:max-w-80 p-2">
                          <div className="flex justify-between items-center">
                            <p className="font-bebas text-lg uppercase tracking-wider text-brand line-clamp-1">
                              {event.isRSO
                                ? orgLookup[event.organizationId]?.name ||
                                  "Loading..."
                                : `#${index + 1}`}
                            </p>
                            <span className="gap-1 flex text-[10px] font-bold text-gray-400 items-center min-w-fit">
                              <Users size={16} />
                              {event.attendees.length} ATTENDING
                            </span>
                          </div>

                          <p className="font-semibold text-lg leading-tight mt-1 line-clamp-2">
                            {event.title}
                          </p>
                          <span className="text-sm text-gray">
                            {formatStackedDate(event.startDate).day +
                              ", " +
                              formatStackedDate(event.startDate).date}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* --- UPCOMING GRID --- */}
            <div className="flex flex-col gap-6 mt-16">
              <h2 className="text-2xl font-league">Upcoming Events</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                {loading ? (
                  <>
                    {[...Array(6)].map((_, i) => (
                      <EventSkeleton key={i} variant="vertical" />
                    ))}
                  </>
                ) : (
                  <>
                    {filteredUpcoming.map((event) => (
                      <Link
                        to={`/event/${event._id}`}
                        key={event._id}
                        className="group border border-gray-100 shadow-sm flex flex-col rounded-2xl overflow-hidden hover:cursor-pointer transition-all"
                      >
                        <div className="w-full overflow-hidden h-48 bg-gray/30 flex items-center justify-center shrink-0">
                          <img
                            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                            src={
                              event.flyer ||
                              "https://www.ucf.edu/wp-content/blogs.dir/4/files/2024/11/PegFa24-OnCampus-1200x800-1.jpg"
                            }
                            alt={event.title}
                          />
                        </div>

                        <div className="p-5 flex flex-col flex-1">
                          <p className="font-bebas text-lg uppercase tracking-wider text-brand">
                            {event.isRSO
                              ? orgLookup[event.organizationId]?.name ||
                                "Loading..."
                              : `${event.createdBy.firstName} ${event.createdBy.lastName}`}
                          </p>

                          <p className="font-semibold text-lg leading-tight mt-1">
                            {event.title}
                          </p>

                          <div className="mt-3 space-y-1 text-gray-700">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar size={14} className="shrink-0" />
                              <span>
                                {formatStackedDate(event.startDate).day +
                                  ", " +
                                  formatStackedDate(event.startDate).date}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin size={14} className="shrink-0" />
                              <span className="line-clamp-1">
                                {event.location || "Location TBD"}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1 mt-4">
                            {event.tags?.slice(0, 2).map((tag) => (
                              <span
                                key={tag.name}
                                className="flex gap-1 items-center px-3 py-1 bg-brand text-[10px] font-bold uppercase text-white rounded-full "
                              >
                                <Hash size={14} />
                                {tag.name}
                              </span>
                            ))}
                          </div>

                          <div className="font-league mt-auto pt-6 font-semibold flex items-center justify-end gap-2 text-black hover:text-gray-500 transition-colors">
                            Learn More <ChevronRight width={17} />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          /* --- SEARCH RESULTS --- */
          <div className="mt-12">
            <h2 className="text-2xl font-league mb-6">Search Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
              {upcomingEvents
                .filter(
                  (event) =>
                    event.title
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    (event.description &&
                      event.description
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())),
                )
                .map((event) => (
                  <Link
                    to={`/event/${event._id}`}
                    key={event._id}
                    className="flex flex-col border border-gray-100 shadow-sm rounded-2xl overflow-hidden bg-white hover:cursor-pointer transition-all"
                  >
                    <div className="w-full h-48 bg-gray/30 flex items-center justify-center shrink-0">
                      <img
                        className="w-full h-full object-cover"
                        src={
                          event.flyer ||
                          "https://www.ucf.edu/wp-content/blogs.dir/4/files/2024/11/PegFa24-OnCampus-1200x800-1.jpg"
                        }
                        alt={event.title}
                      />
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <p className="font-bebas text-brand text-lg uppercase tracking-wider ">
                        {event.isRSO
                          ? orgLookup[event.organizationId]?.name ||
                            "Loading..."
                          : `${event.createdBy.firstName} ${event.createdBy.lastName}`}
                      </p>

                      <p className="font-semibold text-lg leading-tight mt-1">
                        {event.title}
                      </p>

                      <div className="mt-3 space-y-1 text-gray-700">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar size={14} className="shrink-0" />
                          <span>
                            {formatStackedDate(event.startDate).day +
                              ", " +
                              formatStackedDate(event.startDate).date}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin size={14} className="shrink-0" />
                          <span className="line-clamp-1">
                            {event.location || "Location TBD"}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-4">
                        {event.tags?.slice(0, 2).map((tag) => (
                          <span
                            key={tag.name}
                            className="flex gap-1 items-center px-3 py-1 bg-brand text-[10px] font-bold uppercase text-white rounded-full"
                          >
                            <Hash size={14} />
                            {tag.name}
                          </span>
                        ))}
                      </div>

                      <div className="font-league mt-auto pt-6 font-semibold flex items-center justify-end gap-2 text-black hover:text-gray-500 transition-colors">
                        Learn More <ChevronRight width={17} />
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
