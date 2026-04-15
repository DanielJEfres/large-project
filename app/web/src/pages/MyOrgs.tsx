import { Plus } from "lucide-react";
import Navbar from "../components/Navbar";

export default function MyOrgs() {
  return (
    <>
      <Navbar />
      <div className="font-inter px-20 pb-20 ">
        <div className="flex  mt-10 mb-8 justify-between items-center">
          <h1 className="text-5xl font-bebas min-w-fit">YOUR ORGANIZATIONS</h1>

          <button className="rounded-[20px] bg-[#F6F6F6] text-black px-4 py-2 font-league font-medium flex text-md items-center gap-2">
            <Plus size={18} /> Create Organization
          </button>
        </div>

        {/* list of orgs here */}
      </div>
    </>
  );
}
