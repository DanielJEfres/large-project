import Navbar from "../components/Navbar";
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

          <div className="">
            <div className=""></div>
          </div>

          <h2 className="text-2xl font-league ">Trending</h2>

          <h2 className="text-2xl font-league ">Upcoming Events</h2>
        </div>
      </div>
    </>
  );
}
