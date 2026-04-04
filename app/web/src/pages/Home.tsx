import Navbar from "../components/Navbar";

export default function Home() {
  // const [count, setCount] = useState(0);
  // commented out for now to fix typescript errors

  return (
    <>
      {/* Nav */}
      <Navbar />

      {/* Hero section */}
      <section className="">
        <div className="h-120 bg-brand px-20 py-20">
          <div className="">
            <h1 className="font-bebas text-8xl w-137">
              Choose your next <span className="text-white">experience.</span>
            </h1>

            <p className="my-5 w-100">
              Discover clubs. Find events. Meet your people. The easiest way to
              get involved at UCF.
            </p>

            <button className="font-bold w-40 px-8 py-3 rounded-4xl text-white bg-black my-3 px-4 py-2 font-league">
              Get Started
            </button>
          </div>
        </div>

        {/* Carousel! */}

        <div className="px-20 p-5 ">
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
