import { ChevronRight, Image, Search, Tag } from "lucide-react";
import Navbar from "../components/Navbar";

interface Organization {
  id: string;
  name: string;
  description: string;
  tags: string[];
}

// Hardcoded Data
const ORGS: Organization[] = [
  {
    id: "1",
    name: "Tech Builders",
    description:
      "A community for student developers to build cool projects together.",
    tags: ["Coding", "Project-Based"],
  },
  {
    id: "2",
    name: "Design Collective",
    description: "Exploring UI/UX and graphic design through weekly workshops.",
    tags: ["Creative", "Design"],
  },
  {
    id: "3",
    name: "Business Bond",
    description:
      "Networking and professional development for future entrepreneurs.",
    tags: ["Networking", "Professional"],
  },
];

export default function Organizations() {
  return (
    <>
      <Navbar />
      <div className="px-20 pb-20">
        <h1 className="text-5xl font-bebas mt-10 mb-8">Organizations</h1>

        {/* Searchbar */}
        <div className="relative w-full text-gray mb-12">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search size={20} />
          </div>
          <input
            className="w-full rounded-2xl bg-lightgray py-3 pl-12 pr-4 outline-none focus:ring-1 focus:ring-brand transition-all"
            placeholder="Search Organizations"
          />
        </div>

        {/* The Grid Layout */}
        <div className="grid grid-row-1  gap-6">
          {ORGS.map((org) => (
            <div
              key={org.id}
              className="rounded-2xl bg-white border border-lightgray hover:border-gray-300 transition-all overflow-hidden flex h-50"
            >
              {/* Image */}
              <div className="w-70 bg-gray/30 flex items-center justify-center shrink-0">
                {/* This is a placeholder */}
                <Image size={40} className="text-gray/70" />
              </div>

              {/* The Content (Right Side) */}
              <div className="p-6 w-2/3 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bebas mb-2 line-clamp-1">
                    {org.name}
                  </h2>
                  <p className="text-gray text-sm mb-4 line-clamp-3">
                    {org.description}
                  </p>
                </div>

                {/* Tags */}

                <div className="flex flex-wrap gap-2 pt-2">
                  {org.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 px-3 py-1 bg-brand/10 text-xs font-bold uppercase tracking-wider text-black rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex ml-auto">
                <div className="flex mt-auto mr-10 gap-5">
                  <button className="font-bold rounded-4xl my-3 py-2 font-league flex gap-2 min-w-fit">
                    More Events
                    <ChevronRight width={17} />
                  </button>
                  <button className="font-bold  px-14 rounded-4xl text-white bg-black my-3 py-2 font-league">
                    Join
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
