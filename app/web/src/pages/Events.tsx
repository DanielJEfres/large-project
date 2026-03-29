import { ChevronRight, Image, MapPin, Calendar } from "lucide-react";
import Navbar from "../components/Navbar";

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

          <div className="flex gap-5">
            {EVENTS.map((event) => (
              <div
                key={event.id}
                className="h-60 flex bg-lightgray rounded-2xl overflow-hidden"
              >
                {/* 2 sides */}
                <div className="w-60 h-full bg-gray/30 flex items-center justify-center shrink-0">
                  {/* This is a placeholder */}
                  <Image size={40} className="text-gray/70" />
                </div>

                <div className="w-60 px-5 py-3 relative flex flex-col">
                  <p className="text-xs text-gray uppercase tracking-wider">
                    {event.orgName}
                  </p>

                  <p className="font-semibold text-lg leading-tight mt-1">
                    {event.title}
                  </p>

                  {/* Date and location */}
                  <div className="mt-2">
                    <div className="flex items-center gap-2 text-sm text-gray/80">
                      <Calendar size={14} />
                      <span>{event.date}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray/80">
                      <MapPin size={14} />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-white/50 px-2 py-0.5 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Button */}
                  <p className="ml-auto mt-auto font-semibold flex items-center gap-2 min-w-fit cursor-pointer">
                    Learn More
                    <ChevronRight width={17} />
                  </p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-league ">Trending</h2>

          <h2 className="text-2xl font-league ">Upcoming Events</h2>
        </div>
      </div>
    </>
  );
}
