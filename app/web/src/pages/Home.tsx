import Navbar from "../components/Navbar";
import { Image } from "lucide-react";
import { Link } from "react-router";
import Knight from "../components/Knight";

export default function Home() {
  // const [count, setCount] = useState(0);
  // commented out for now to fix typescript errors

  return (
    <>
      {/* Nav */}
      <Navbar />

      {/* Hero section */}
      <section className="">
        <div className="relative max-md:h-fit max-md:py-4 h-120 bg-white max-md:px-4 px-20 py-70 flex justify-between items-center overflow-hidden">
          {/* 1. Parent Container */}
          <div className="mx-auto flex flex-col md:flex-row items-center justify-between ">
            {/* 2. The Knight Container (Move this ABOVE the text in the code) */}
            <div
              className="
      /* Mobile: Center it and give it space */
      self-center mb-10
      /* Desktop: Remove margin, align to right */
      md:mb-0 md:ml-10
      /* Sizes */
      min-w-[300px] min-h-[300px]
      lg:min-w-[350px] lg:min-h-[350px]
      /* Order: This makes it stay on top even if you move it in code */
      order-first md:order-last 
    "
            >
              <div
                style={{
                  transform: "scale(1.9)",
                  transformOrigin: "center",
                  clipPath: "inset(0% 0% 15% 0%)",
                }}
              >
                <Knight />
              </div>
            </div>

            {/* 3. The Text Container */}
            <div className="flex flex-col items-start text-center text-left">
              <h1 className="font-bebas font-bold text-5xl md:text-7xl lg:text-8xl max-w-[550px]">
                Choose your next <span className="text-brand">experience.</span>
              </h1>
              <p className="my-5 w-[350px]">
                Discover clubs. Find events. Meet your people. The easiest way
                to get involved at UCF.
              </p>
              <Link to="/signup">
                <button className="cursor-pointer font-bold w-40 px-8 py-3 rounded-4xl text-white bg-black my-3 px-4 py-2 font-league">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
