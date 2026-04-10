import {
  ChevronRight,
  Image,
  MapPin,
  Calendar,
  ListFilter,
  Search,
  ChevronLeft,
  Hash,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { Link } from "react-router";
import { useRef, useState, useEffect } from "react";
import { SERVER_IP } from "../config";
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
    createdBy: {
      _id: "1",
      firstName: "a",
      lastName: "b",
    },
    // Update this to match the Tag interface
    tags: [
      { _id: "t1", name: "Coding", isCustom: false, isApproved: true },
      { _id: "t2", name: "Competition", isCustom: false, isApproved: true },
    ],
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
    createdBy: {
      _id: "1",
      firstName: "a",
      lastName: "b",
    },
    // Update this to match the Tag interface
    tags: [{ _id: "t3", name: "Design", isCustom: false, isApproved: true }],
    attendees: [],
    isRSO: false,
    flyer: null,
    status: "upcoming",
    isPublic: true,
    rsvpEnabled: false,
    rsvpLimit: null,
  },
];

const EventSkeleton = () => (
  <div className="flex min-w-fit bg-white h-80 rounded-2xl  border border-gray-100 animate-pulse">
    {/* image */}
    <div className="h-80 w-80 bg-gray-200  rounded-l-2xl"></div>

    {/* info */}
    <div className="h-80 w-60 px-6 py-4 bg-white rounded-2xl flex flex-col">
      <div className="flex flex-col">
        <div className="w-15 h-4 bg-gray-200 rounded mb-1"></div>
        <div className="w-full h-8 bg-gray-300 rounded"></div>
      </div>

      <div className="space-y-2 mt-5">
        <div className="w-3/4 h-3 bg-gray-100 rounded"></div>
        <div className="w-1/2 h-3 bg-gray-100 rounded"></div>
      </div>

      <div className="flex gap-1 mt-5">
        <div className="w-12 h-5 bg-gray-200 rounded-full"></div>
        <div className="w-12 h-5 bg-gray-200 rounded-full"></div>
      </div>
      <div className="mt-auto ml-auto bg-gray-200 h-5  rounded-2xl w-20"></div>
    </div>
  </div>
);

export default function Events() {
  const [activeTab, setActiveTab] = useState<"RSO" | "Student">("RSO");

  const [loading, setLoading] = useState(true);
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
      <div className="font-inter px-20 pb-20 ">
        <h1 className="text-5xl font-bebas mt-10 mb-8">Events</h1>

        <div className="font-inter flex gap-10 items-center mt-3">
          {/* RSO Tab */}
          <div
            onClick={() => setActiveTab("RSO")}
            className="relative py-2 cursor-pointer z-10"
          >
            <h2
              className={`font-bold transition-colors ${activeTab === "RSO" ? "text-black" : "text-gray-400"}`}
            >
              RSO Events
            </h2>
            {/* Underline */}
            <div
              className={`absolute bottom-0 left-0 h-0.5 bg-brand z-20 transition-all duration-200 
      ${activeTab === "RSO" ? "w-full opacity-100" : "w-0 opacity-0"}`}
            />
          </div>

          {/* Student Tab */}
          <div
            onClick={() => setActiveTab("Student")}
            className="relative py-2 cursor-pointer z-10"
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
              <h2 className="text-2xl font-league ">For you</h2>

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
                {loading ? (
                  <>
                    {[...Array(3)].map((_, i) => (
                      <EventSkeleton key={i} />
                    ))}
                  </>
                ) : (
                  <>
                    {filteredUpcoming.map((event) => (
                      <Link
                        key={event._id}
                        to={`/event/${event._id}`}
                        className="group border border-gray-100 shadow-sm h-max-fit min-w-fit flex rounded-2xl overflow-hidden shrink-0 cursor-pointer"
                      >
                        <div className="w-80 h-80 bg-gray/30 flex items-center justify-center shrink-0 overflow-hidden ">
                          <img
                            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                            src={
                              event.flyer ||
                              "https://www.ucf.edu/wp-content/blogs.dir/4/files/2024/11/PegFa24-OnCampus-1200x800-1.jpg"
                            }
                            alt={event.title}
                          />
                        </div>
                        <div className="w-60 px-5 py-3 relative flex flex-col">
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
                              <span>{event.location || "Location TBD"}</span>
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
                          <div className="font-league pt-6 mt-auto  font-semibold flex items-center justify-end gap-2 hover:text-gray-500  text-black transition-colors">
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
                {filteredTrending.map((event) => (
                  <Link to={`/event/${event._id}`}>
                    <div
                      key={event._id}
                      className="shrink-0 group cursor-pointer "
                    >
                      <div className="w-80 h-80 bg-gray/30 flex items-center justify-center rounded-2xl overflow-hidden group-hover:brightness-95 transition-all">
                        <img
                          className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                          src={
                            event.flyer ||
                            "https://www.ucf.edu/wp-content/blogs.dir/4/files/2024/11/PegFa24-OnCampus-1200x800-1.jpg"
                          }
                          alt={event.title}
                        />
                      </div>

                      <div className="max-w-80  p-2">
                        <div className="flex justify-between items-center">
                          <p className="font-bebas text-lg uppercase tracking-wider text-brand">
                            {event.isRSO
                              ? orgLookup[event.organizationId]?.name ||
                                "Loading..."
                              : `${event.createdBy.firstName} ${event.createdBy.lastName}`}
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

                      <div className="font-league mt-auto pt-6 font-semibold flex items-center justify-end gap-2 text-black hover:text-gray-500  transition-colors">
                        Learn More <ChevronRight width={17} />
                      </div>
                    </div>
                  </Link>
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
                        <p className="font-bebas text-brand text-lg uppercase tracking-wider ">
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
                              key={tag.name}
                              className="flex gap-1 items-center px-3 py-1 bg-brand text-[10px] font-bold uppercase text-white rounded-full"
                            >
                              <Hash size={14} />
                              {tag.name}
                            </span>
                          ))}
                        </div>

                        <Link
                          to={`/event/${event._id}`}
                          className="font-league mt-6 font-semibold flex items-center justify-end gap-2 text-black hover:text-gray-500  transition-colors"
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
