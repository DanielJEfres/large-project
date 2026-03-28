import { ChevronRight, Share } from "lucide-react";
import Navbar from "../components/Navbar";
export default function Event() {
  return (
    <>
      <Navbar />

      <div className="px-20 [&_button]:cursor-pointer">
        {/* 2 grids */}

        <div className="grid grid-cols-[350px_1fr] gap-10 mt-10">
          {/* 1st column */}
          <div className="w-full ">
            <div className="h-87 w-full bg-gray rounded-xl"></div>

            <div className="p-5 bg-lightgray">
              <h2 className="text-xl mb-2 font-league">Event details</h2>

              <div className="flex flex-col gap-2">
                <p className="font-medium">Date</p>

                <p className="font-medium">Location</p>

                <p className="font-medium">Category</p>
                <p className="font-medium">Tags</p>
                <p className="font-medium">External Links</p>
                <p className="font-medium">Add to Calendar</p>
              </div>
            </div>
          </div>

          {/* 2nd column */}
          <div className="w-full">
            {/* top half */}
            <div className=" h-87 flex flex-col">
              <p className="font-bebas text-2xl font-thin">Organization Name</p>
              <h1 className=" text-4xl font-medium">Event Title </h1>

              <div className="mt-5">
                <p className="font-medium">Hosted by</p>

                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 bg-gray rounded-full"></div>
                    <p>Random ahh Director</p>
                  </div>
                </div>
              </div>

              {/* buttons */}
              <div className="flex mt-auto gap-2 ">
                <button className=" items-center gap-3 flex font-bold w-fit px-8 py-3 rounded-4xl text-black bg-lightgray my-3 px-4 py-2 font-league">
                  <Share width={20} />
                  Share Event
                </button>
                <button className="font-bold w-40 px-8 py-3 rounded-4xl text-white bg-black my-3 px-4 py-2 font-league">
                  Register
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-5 p-2 [&>div>h2]:font-league  [&>div>h2]:mb-1">
              <div className="min-h-50">
                <h2 className="text-xl mt-2">About This Event</h2>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Sapiente expedita ex nobis repellat delectus quaerat eligendi
                  omnis earum quis soluta iste, cupiditate magnam nostrum itaque
                  consequuntur adipisci suscipit necessitatibus deserunt! Lorem
                  ipsum dolor sit amet consectetur adipisicing elit. Sapiente
                  expedita ex nobis repellat delectus quaerat eligendi omnis
                  earum quis soluta iste, cupiditate magnam nostrum itaque
                  consequuntur adipisci suscipit necessitatibus deserunt!
                </p>
              </div>
              <div>
                <h2 className="text-xl ">Organized By</h2>

                <div className="bg-lightgray h-60  flex">
                  {/* two parts */}

                  {/* first */}
                  <div className="h-full w-80 bg-gray"></div>

                  {/* second */}
                  <div className="p-5 flex flex-col w-full">
                    <p className="font-medium">Name of Organization</p>
                    <p className="text-gray">Random description</p>

                    {/* buttons */}

                    <div className="mt-auto ml-auto gap-7 flex flex-nowrap">
                      <button className="font-bold   rounded-4xl my-3 py-2 font-league flex gap-2">
                        More Events
                        <ChevronRight width={17} />
                      </button>
                      <button className="font-bold  px-7  rounded-4xl text-white bg-black my-3  py-2 font-league">
                        Join
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
