import Navbar from "../components/Navbar";
import { Image } from "lucide-react";
import { Link } from "react-router";

export default function Home() {
  // const [count, setCount] = useState(0);
  // commented out for now to fix typescript errors

  return (
    <>
      {/* Nav */}
      <Navbar />

      {/* Hero section */}
      <section className="">
        <div className="max-md:h-fit max-md:py-4 h-120 bg-brand max-md:px-4 px-20 py-20">
          <div className="flex flex-col">
            <div className="md:hidden max-sm:self-center max-sm:h-85 max-sm:w-full max-md:h-90 max-md:w-90 bg-gray flex flex-col items-center justify-center mb-4">
              <Image />
              <p className="opacity-15">(i'll add a drawing here trust)</p>
            </div>
            <h1 className="max-md:text-6xl max-md:w-fit font-bebas text-8xl w-137">
              Choose your next <span className="text-white">experience.</span>
            </h1>

            <p className="my-5 max-md:w-fit w-100">
              Discover clubs. Find events. Meet your people. The easiest way to
              get involved at UCF.
            </p>

            <Link to="/signup">
              <button className="cursor-pointer font-bold w-40 px-8 py-3 rounded-4xl text-white bg-black my-3 px-4 py-2 font-league">
                Get Started
              </button>
            </Link>
          </div>
        </div>

        {/* Carousel! */}

        <div className="max-md:px-4 px-20 p-5 ">
          <h2 className="text-3xl font-league text-center">
            Trending Events in UCF
          </h2>
          <div className="flex gap-5 ">
            <div className="h-50 w-50 bg-amber-300"> </div>
            <div className="h-50 w-50 bg-amber-300"> </div>
            <div className="h-50 w-50 bg-amber-300"> </div>
            <div className="h-50 w-50 bg-amber-300"> </div>
          </div>
        </div>

        <div className="px-20 p-5 ">
          <h2 className="text-3xl font-league text-center">
            We make getting involved easy
          </h2>
          <div className="flex gap-5"></div>
        </div>
      </section>
    </>
  );
}
