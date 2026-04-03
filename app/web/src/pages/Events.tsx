import {
  ChevronRight,
  Image,
  MapPin,
  Calendar,
  ListFilter,
  Search,
  ChevronLeft,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { Link } from "react-router";
import { useRef, useState, useEffect } from "react";
import { LOCAL_IP, SERVER_IP } from "../config";
import type { UniversityEvent } from "../types/UniversityEvent";
import { formatStackedDate } from "../utils/date";
import { useOrganizations } from "../hooks/useOrganization";

const EVENTS: UniversityEvent[] = [
  {
    _id: "e1",
    title: "Hackathon 2026",
    description: "A 24-hour coding marathon.",
    location: "Student Union Hall",
    startDate: "2026-04-01T10:00:00Z",
    endDate: "2026-04-02T10:00:00Z",
    organizationId: "org123",
    createdBy: "user456",
    tags: ["65d1a...", "65d1b..."], // These would be Tag ObjectIds
    attendees: [],
    isRSO: true,
    flyer: null,
    status: "upcoming",
    isPublic: true,
    rsvpEnabled: true,
    rsvpLimit: 100,
  },
  {
    _id: "e2",
    title: "Figma Workshop",
    description: "Learn the basics of UI/UX design.",
    location: "Design Lab B",
    startDate: "2026-04-03T16:00:00Z",
    endDate: null,
    organizationId: "org789",
    createdBy: "user456",
    tags: ["65d1c..."],
    attendees: [],
    isRSO: false,
    flyer: null,
    status: "upcoming",
    isPublic: true,
    rsvpEnabled: false,
    rsvpLimit: null,
  },
];

export default function Events() {
  const [trendingEvents, setTrendingEvents] = useState<UniversityEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UniversityEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { orgLookup, fetchOrgDetails } = useOrganizations();

  // Create Refs for the scrollable containers
  const forYouRef = useRef<HTMLDivElement>(null);
  const trendingRef = useRef<HTMLDivElement>(null);

  // State to track if we've scrolled (to show/hide the left arrow)
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
        const response = await fetch(`${LOCAL_IP}/api/getEvents/getTrending`);
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
          `${LOCAL_IP}/api/getEvents/getUpcoming`,
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
    }
  }, [upcomingEvents, fetchOrgDetails]);

  return (
    <>
      <Navbar />
      <div className="px-20 pb-20">
        <h1 className="text-5xl font-bebas mt-10 mb-8">Events</h1>
        {/* Tab Header */}
        <div className="flex gap-10 items-center mb-0.5 mt-3 ">
          <h2 className="font-bold text-black ml-0.5 ">RSO Events</h2>

          <h2 className="font-bold text-gray-400 ml-0.5 ">Student Events</h2>
        </div>

        <div className="relative">
          <div className="w-22 h-0.5 bg-brand absolute z-10"> </div>
          <div className="w-full h-0.5 bg-gray-200 "> </div>
        </div>
        {/* Search Bar */}
        <div className="mt-9 flex items-center gap-3">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray ">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search Events"
              value={searchQuery} // Bind value
              onChange={(e) => setSearchQuery(e.target.value)} // Update state
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
              <h2 className="text-2xl font-league">For you</h2>

              {/* Arrows */}
              {scrolledForYou && (
                <button
                  onClick={() => scroll(forYouRef, "left")}
                  className="absolute left-[-50px] top-1/2 bg-white p-2 rounded-full shadow-md z-20 hover:scale-110 transition-all"
                >
                  <ChevronLeft size={24} />
                </button>
              )}
              <button
                onClick={() => scroll(forYouRef, "right")}
                className="absolute right-[-50px] top-1/2 bg-white p-2 rounded-full shadow-md z-20 hover:scale-110 transition-all"
              >
                <ChevronRight size={24} />
              </button>

              <div
                ref={forYouRef}
                onScroll={() => handleScroll(forYouRef, setScrolledForYou)}
                className="flex gap-10 overflow-x-auto scrollbar-hide scroll-smooth py-2"
              >
                {upcomingEvents.map((event) => (
                  <div
                    key={event._id}
                    className="h-max-fit min-w-fit flex border-gray/20 border-1 rounded-2xl overflow-hidden bg-white shrink-0 hover:shadow-md transition-shadow"
                  >
                    <div className="w-60 h-full bg-gray/30 flex items-center justify-center shrink-0">
                      <Image size={40} className="text-gray/70" />
                    </div>
                    <div className="w-60 px-5 py-3 relative flex flex-col">
                      <p className="font-bebas text-sm uppercase tracking-wider">
                        {orgLookup[event.organizationId]?.name || "Loading..."}
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
                          <span>{event.location || "Location TBD"}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {event.tags?.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-brand/40 text-[10px] font-bold uppercase text-black rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Link
                        to={`/event/${event._id}`}
                        className="pt-6 mt-auto  font-semibold flex items-center justify-end gap-2 text-black hover:text-brand transition-colors"
                      >
                        Learn More <ChevronRight width={17} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* --- TRENDING CAROUSEL --- */}
            <div className="flex flex-col gap-4 mt-12 group/carousel relative">
              <h2 className="text-2xl font-league">Trending</h2>

              {scrolledTrending && (
                <button
                  onClick={() => scroll(trendingRef, "left")}
                  className="absolute left-[-50px] top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-20 hover:scale-110 transition-all cursor-pointer"
                >
                  <ChevronLeft size={24} />
                </button>
              )}

              <button
                onClick={() => scroll(trendingRef, "right")}
                className="absolute right-[-50px] top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-20 hover:scale-110 transition-all cursor-pointer"
              >
                <ChevronRight size={24} />
              </button>

              <div
                ref={trendingRef}
                onScroll={() => handleScroll(trendingRef, setScrolledTrending)}
                className="flex gap-10 overflow-x-auto scrollbar-hide scroll-smooth py-2"
              >
                {trendingEvents.map((event) => (
                  <Link to={`/event/${event._id}`}>
                    <div
                      key={event._id}
                      className="shrink-0 group cursor-pointer"
                    >
                      <div className="w-80 h-80 bg-gray/30 flex items-center justify-center rounded-2xl overflow-hidden group-hover:brightness-95 transition-all">
                        <Image size={40} className="text-gray/70" />
                      </div>

                      <div className="mt-2 max-w-80">
                        <div className="flex justify-between items-center">
                          <p className="font-bebas text-sm uppercase tracking-wider text-brand">
                            {orgLookup[event.organizationId]?.name ||
                              "Loading..."}
                          </p>
                          <span className="text-[10px] font-bold text-gray-400">
                            {event.attendees.length} ATTENDING
                          </span>
                        </div>

                        <p className="font-semibold text-lg leading-tight mt-1 line-clamp-2">
                          {event.title}
                        </p>
                        <span className="text-sm text-gray">
                          <span>
                            {formatStackedDate(event.startDate).day +
                              ", " +
                              formatStackedDate(event.startDate).date}
                          </span>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6 mt-16">
              <h2 className="text-2xl font-league">Upcoming Events</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {upcomingEvents.map((event) => (
                  <div
                    key={event._id}
                    className="flex flex-col border-gray/20 border-1 rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-all"
                  >
                    <div className="w-full h-48 bg-gray/30 flex items-center justify-center shrink-0">
                      <Image size={40} className="text-gray/70" />
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <p className="font-bebas text-sm uppercase tracking-wider ">
                        {orgLookup[event.organizationId]?.name || "Loading..."}
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
                            key={tag}
                            className="px-3 py-1 bg-brand/40 text-[10px] font-bold uppercase text-black rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <Link
                        to={`/event/${event._id}`}
                        className="mt-auto pt-6 font-semibold flex items-center justify-end gap-2 text-black hover:text-brand transition-colors"
                      >
                        Learn More <ChevronRight width={17} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mt-12">
              <h2 className="text-2xl font-league mb-6">Search Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
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
                    <div
                      key={event._id}
                      className="flex flex-col border-gray/20 border-1 rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-all"
                    >
                      <div className="w-full h-48 bg-gray/30 flex items-center justify-center shrink-0">
                        <Image size={40} className="text-gray/70" />
                      </div>

                      <div className="p-5 flex flex-col flex-1">
                        <p className="font-bebas text-sm uppercase tracking-wider ">
                          {orgLookup[event.organizationId]?.name ||
                            "Loading..."}
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
                              key={tag}
                              className="px-3 py-1 bg-brand/40 text-[10px] font-bold uppercase text-black rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <Link
                          to={`/event/${event._id}`}
                          className="mt-6 font-semibold flex items-center justify-end gap-2 text-black hover:text-brand transition-colors"
                        >
                          Learn More <ChevronRight width={17} />
                        </Link>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
