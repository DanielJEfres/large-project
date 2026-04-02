import Navbar from "../components/Navbar";

export default function Tickets() {
  return (
    <>
      <Navbar />
      <div className="px-20 pb-20">
        <h1 className="text-5xl font-bebas mt-10 mb-8">My Events</h1>
        {/* Tab Header */}
        <div className="flex gap-10 items-center mb-0.5 mt-3 ">
          <h2 className="font-bold text-black ml-0.5 ">Upcoming</h2>

          <h2 className="font-bold text-gray-400 ml-0.5 ">Past</h2>
        </div>

        <div className="relative">
          <div className="w-22 h-0.5 bg-brand absolute z-10"> </div>
          <div className="w-full h-0.5 bg-gray-200 "> </div>
        </div>
      </div>
    </>
  );
}
