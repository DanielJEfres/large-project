import { useState } from "react";
import { Link } from "react-router";

export default function Navbar() {
  const [showSignup, setShowSignup] = useState(false);

  // add some logic to not show sign up + log in when user is logged in (prolly thru context hook)
  return (
    <>
      {/* Nav */}
      <div className="[&_*]:cursor-pointer flex justify-between items-center py-3 px-20">
        <div className="flex gap-12">
          <Link to="/events">
            <p className="font-league">Events</p>
          </Link>
          <p className="font-league">Organizations</p>
          <p className="font-league">Tickets</p>
        </div>

        <div className="flex gap-5">
          <Link to="/signup">
            <button className="rounded-[20px] font-league bg-gray-100 px-4 py-2">
              Sign up
            </button>
          </Link>
          <Link to="/login">
            <button className="rounded-[20px] font-league bg-black text-white px-4 py-2">
              Log in
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
