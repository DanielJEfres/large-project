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
import { useRef, useState } from "react";

interface UniversityEvent {
  id: string;
  orgName: string;
  title: string;
  date: string;
  location: string;
  tags: string[];
}

const EVENTS: UniversityEvent[] = [
  {
    id: "e1",
    orgName: "TECH BUILDERS",
    title: "Hackathon 2026",
    date: "Tomorrow, 10:00 AM",
    location: "Student Union Hall",
    tags: ["Coding", "Free Food"],
  },
  {
    id: "e2",
    orgName: "DESIGN COLLECTIVE",
    title: "Figma Workshop",
    date: "Friday, 4:00 PM",
    location: "Design Lab B",
    tags: ["UI/UX", "Workshop"],
  },
  {
    id: "e3",
    orgName: "DESIGN COLLECTIVE",
    title: "Figma Workshop",
    date: "Friday, 4:00 PM",
    location: "Design Lab B",
    tags: ["UI/UX", "Workshop"],
  },

  {
    id: "e3",
    orgName: "DESIGN COLLECTIVE",
    title: "Figma Workshop",
    date: "Friday, 4:00 PM",
    location: "Design Lab B",
    tags: ["UI/UX", "Workshop"],
  },

  {
    id: "e3",
    orgName: "DESIGN COLLECTIVE",
    title: "Figma Workshop",
    date: "Friday, 4:00 PM",
    location: "Design Lab B",
    tags: ["UI/UX", "Workshop"],
  },
];
export default function Events() {
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <>
      <Navbar />
      <div className="px-20 pb-20">
        <h1 className="text-5xl font-bebas mt-10 mb-8">Events</h1>
        {/* Tab Header */}
        <div className="flex">
          <h2 className="font-semibold text-black ml-0.5 mb-0.5">RSO Events</h2>
        </div>
        <div className="relative">
          <div className="w-22 h-0.5 bg-black absolute z-10"> </div>
          <div className="w-full h-0.5 bg-brand "> </div>
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
                {EVENTS.map((event) => (
                  <div
                    key={event.id}
                    className="h-60 min-w-fit flex border-gray/20 border-1 rounded-2xl overflow-hidden bg-white shrink-0 hover:shadow-md transition-shadow"
                  >
                    <div className="w-60 h-full bg-gray/30 flex items-center justify-center shrink-0">
                      <Image size={40} className="text-gray/70" />
                    </div>
                    <div className="w-60 px-5 py-3 relative flex flex-col">
                      <p className="font-bebas text-sm uppercase tracking-wider">
                        {event.orgName}
                      </p>
                      <p className="font-semibold text-lg leading-tight mt-1">
                        {event.title}
                      </p>
                      <div className="mt-2 space-y-1 text-gray-700">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar size={14} />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin size={14} />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {event.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-brand/40 text-[10px] font-bold uppercase text-black rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Link
                        to={`/event/${event.id}`}
                        className="ml-auto mt-auto font-semibold flex items-center gap-2 hover:text-brand transition-colors"
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
                  className="absolute left-[-50px] top-1/2 bg-white p-2 rounded-full shadow-md z-20 hover:scale-110 transition-all"
                >
                  <ChevronLeft size={24} />
                </button>
              )}
              <button
                onClick={() => scroll(trendingRef, "right")}
                className="absolute right-[-50px] top-1/2 bg-white p-2 rounded-full shadow-md z-20 hover:scale-110 transition-all"
              >
                <ChevronRight size={24} />
              </button>

              <div
                ref={trendingRef}
                onScroll={() => handleScroll(trendingRef, setScrolledTrending)}
                className="flex gap-10 overflow-x-auto scrollbar-hide scroll-smooth py-2"
              >
                {EVENTS.map((event) => (
                  <div key={event.id} className="shrink-0 group cursor-pointer">
                    <div className="w-70 h-70 bg-gray/30 flex items-center justify-center rounded-2xl overflow-hidden group-hover:brightness-95 transition-all">
                      <Image size={40} className="text-gray/70" />
                    </div>
                    <div className="mt-2">
                      <p className="font-bebas text-sm uppercase tracking-wider text-gray">
                        {event.orgName}
                      </p>
                      <p className="font-semibold text-lg leading-tight">
                        {event.title}
                      </p>
                      <span className="text-sm text-gray">{event.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6 mt-16">
              <h2 className="text-2xl font-league">Upcoming Events</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {EVENTS.map((event) => (
                  <div
                    key={event.id}
                    className="flex flex-col border-gray/20 border-1 rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-all"
                  >
                    {/* Image on Top */}
                    <div className="w-full h-48 bg-gray/30 flex items-center justify-center shrink-0">
                      <Image size={40} className="text-gray/70" />
                    </div>

                    {/* Text Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <p className="font-bebas text-sm uppercase tracking-wider ">
                        {event.orgName}
                      </p>

                      <p className="font-semibold text-lg leading-tight mt-1">
                        {event.title}
                      </p>

                      <div className="mt-3 space-y-1 text-gray-700">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar size={14} className="shrink-0" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin size={14} className="shrink-0" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mt-4">
                        {event.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-brand/40 text-[10px] font-bold uppercase text-black rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Button */}
                      <Link
                        to={`/event/${event.id}`}
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
        ) : (
          <>
            <div className="mt-12">
              <h2 className="text-2xl font-league mb-6">Search Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {EVENTS.filter(
                  (event) =>
                    event.title
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    event.orgName
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()),
                ).map((event) => (
                  /* ... Use the same Vertical Card layout here ... */
                  <div
                    key={event.id}
                    className="flex flex-col border-gray/20 border-1 rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-all"
                  >
                    {/* Image on Top */}
                    <div className="w-full h-48 bg-gray/30 flex items-center justify-center shrink-0">
                      <Image size={40} className="text-gray/70" />
                    </div>

                    {/* Text Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <p className="font-bebas text-sm uppercase tracking-wider ">
                        {event.orgName}
                      </p>

                      <p className="font-semibold text-lg leading-tight mt-1">
                        {event.title}
                      </p>

                      <div className="mt-3 space-y-1 text-gray-700">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar size={14} className="shrink-0" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin size={14} className="shrink-0" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mt-4">
                        {event.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-brand/40 text-[10px] font-bold uppercase text-black rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Button */}
                      <Link
                        to={`/event/${event.id}`}
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
