import { ChevronRight, Image, MapPin, Calendar } from "lucide-react";
import Navbar from "../components/Navbar";
import { Link } from "react-router";

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
];

export default function Events() {
  return (
    <>
      <Navbar />
      <div className="px-20">
        <h1 className="text-5xl font-bebas mt-10 mb-8">Events</h1>

        <div className="flex">
          <h2 className="font-semibold text-black ml-0.5 mb-0.5">RSO Events</h2>

          {/* later :p */}
          {/* <h2>Student Events</h2> */}
        </div>
        <div className="relative">
          <div className="w-22 h-0.5 bg-black absolute"> </div>
          <div className="w-full h-0.5 bg-brand "> </div>
        </div>

        <div className="flex flex-col gap-4 mt-9">
          <h2 className="text-2xl font-league ">For you</h2>

          {/* template */}

          <div className="flex gap-10">
            {EVENTS.map((event) => (
              <div
                key={event.id}
                className="h-60 min-w-fit flex border-gray/20 border-1 rounded-2xl overflow-hidden"
              >
                {/* 2 sides */}
                <div className="w-60 h-full bg-gray/30 flex items-center justify-center shrink-0">
                  {/* This is a placeholder */}
                  <Image size={40} className="text-gray/70" />
                </div>

                <div className="w-60 px-5 py-3 relative flex flex-col">
                  <p className=" font-bebas text-sm uppercase tracking-wider">
                    {event.orgName}
                  </p>

                  <p className="font-semibold text-lg leading-tight mt-1">
                    {event.title}
                  </p>

                  {/* Date and location */}
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={14} />
                      <span>{event.date}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <MapPin size={14} />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 px-3 py-1 bg-brand/40 text-[10px] font-bold uppercase tracking-wider text-black rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Button */}
                  <Link
                    to={`/event/${event.id}`}
                    className="ml-auto mt-auto font-semibold flex items-center gap-2 min-w-fit cursor-pointer "
                  >
                    Learn More
                    <ChevronRight width={17} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-league ">Trending</h2>

          <div className="flex gap-10">
            {EVENTS.map((event) => (
              <div key={event.id} className="">
                <div className="w-70 h-70 bg-gray/30 flex items-center justify-center shrink-0">
                  {/* This is a placeholder */}
                  <Image size={40} className="text-gray/70" />
                </div>

                {/* info */}

                <div className="mt-1">
                  <p className=" font-bebas text-sm uppercase tracking-wider">
                    {event.orgName}
                  </p>

                  <p className="font-semibold text-lg leading-tight">
                    {event.title}
                  </p>

                  <span className="text-sm ">{event.date}</span>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-league ">Upcoming Events</h2>
        </div>
      </div>
    </>
  );
}
