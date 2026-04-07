import { Link } from "react-router";

export default function Navbar() {
  // const [showSignup, setShowSignup] = useState(false);
  // commented out for now to fix typescript errors

  // add some logic to not show sign up + log in when user is logged in (prolly thru context hook)
  return (
    <>
      {/* Nav */}
      <div className="[&_*]:cursor-pointer flex justify-between items-center py-3 px-20">
        <div className="flex gap-12">
          <p className="font-league">Events</p>
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
