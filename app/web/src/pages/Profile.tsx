import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { SERVER_IP } from "../config";
import Navbar from "../components/Navbar";
import { formatDate } from "../utils/date";
import type { Organization } from "../types/Organizations";
import type { UniversityEvent } from "../types/UniversityEvent";
import { Image as ImageIcon } from "lucide-react";
import { Link } from "react-router";

export default function Profile() {
  const { token, isLoggedIn, loading: authLoading, user } = useAuth(); // Get auth state
  const [myData, setMyData] = useState<any>(null);
  const [myOrgs, setMyOrgs] = useState<any[]>([]);
  const [myEvents, setMyEvents] = useState<UniversityEvent[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const [userRes, orgsRes, eventsRes] = await Promise.all([
          fetch(`${SERVER_IP}/api/users/me`, { headers }),
          fetch(`${SERVER_IP}/api/users/me/organizations`, { headers }),
          fetch(`${SERVER_IP}/api/events/user/${user?.id}`),
        ]);

        if (!userRes.ok || !orgsRes.ok) {
          throw new Error("Failed to fetch profile data");
        }

        const userData = await userRes.json();
        const orgsData = await orgsRes.json();
        const eventsData = await eventsRes.json();

        setMyData(userData.user);
        setMyOrgs(orgsData.organizations);
        setMyEvents(eventsData);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setFetchError(err.message);
      }
    };

    if (token) {
      fetchProfileData();
    }
  }, [token, user?.id]);

  if (authLoading) {
    return (
      <div className="p-20 font-league text-2xl">
        Checking authentication...
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="p-20 font-league">
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p className="mt-4">You need to be logged in to view your profile.</p>
        <button
          onClick={() => (window.location.href = "/login")}
          className="mt-6 bg-black text-white px-6 py-2 rounded-xl"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="p-20 font-league text-red-500">Error: {fetchError}</div>
    );
  }

  if (!myData) {
    return (
      <div className="p-20 font-league text-2xl">
        Loading your profile data...
      </div>
    );
  }

  const upcomingEvents = myEvents.filter(
    (e) => new Date(e.startDate) >= new Date(),
  );
  const pastEvents = myEvents.filter((e) => new Date(e.startDate) < new Date());

  return (
    <>
      <Navbar />
      <div className="font-inter relative pb-20">
        {/* banner */}
        <div className="bg-lightgray w-full h-60"></div>

        {/* profile info */}
        <div className="absolute top-30 left-1/2 -translate-x-1/2 flex flex-col items-center w-full max-w-xs px-4">
          {/* pfp */}
          <div className="rounded-full h-40 w-40 bg-gray-300  overflow-hidden  flex items-center justify-center">
            {myData.profilePicture ? (
              <img
                src={myData.profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageIcon className="text-gray-400" size={48} />
            )}
          </div>

          {/* user info */}
          <div className="text-center mt-2">
            <p className="font-bold text-xl">{myData.fullName}</p>
            <p className="text-gray-500 text-sm">{myData.email}</p>

            <button className="hover:cursor-pointer font-league mt-4 bg-black font-bold text-white px-4 py-2 rounded-4xl">
              Edit Profile
            </button>
          </div>
        </div>

        <div className="px-6 md:px-20 mt-50 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Organizations Section */}
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-end  pb-2">
              <h1 className="text-2xl font-league ">My Organizations</h1>
              <p className="text-sm text-gray-500 cursor-pointer hover:text-black">
                View all
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {myOrgs.length > 0 ? (
                myOrgs.map((org) => (
                  <Link
                    to={`/organization/${org.id}`}
                    key={org.id}
                    className="flex items-center bg-[#f5f5f76e] rounded-xl p-3  overflow-hidden"
                  >
                    <div className="h-16 w-16 bg-gray/20 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {org.logo ? (
                        <img
                          src={org.logo}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon size={24} className="text-gray/40" />
                      )}
                    </div>
                    <div className="px-5">
                      <p className="font-bold font-league text-lg leading-tight">
                        {org.name}
                      </p>
                      <p className="text-gray-500 text-sm capitalize">
                        {org.role}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-gray-400 font-league">
                  You haven't joined any organizations yet.
                </p>
              )}
            </div>
          </div>

          {/* Upcoming Events Section */}
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-end pb-2">
              <h1 className="text-2xl font-league">
                Upcoming Events ({upcomingEvents.length})
              </h1>
              <p className="text-sm text-gray-500 cursor-pointer hover:text-black">
                View all
              </p>
            </div>

            <div className="flex gap-4 flex-wrap">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.slice(0, 3).map((event) => (
                  <Link
                    to={`/event/${event._id}`}
                    key={event._id}
                    className="h-24 w-24  rounded-xl overflow-hidden group cursor-pointer relative"
                  >
                    {event.flyer ? (
                      <img
                        src={event.flyer}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-brand/10 text-brand font-bold text-xs p-2 text-center">
                        <p className="line-clamp-3 overflow-hidden text-ellipsis">
                          {event.title}
                        </p>
                      </div>
                    )}
                  </Link>
                ))
              ) : (
                <p className="text-gray-400 font-league">No upcoming events.</p>
              )}
            </div>
          </div>
        </div>

        {/* Past Events Section */}
        <div className="px-6 md:px-20 mt-16">
          <div className="flex justify-between items-end pb-2 mb-6">
            <h1 className="text-2xl font-league">
              Events Attended ({pastEvents.length})
            </h1>
          </div>

          <div className="flex gap-4 flex-wrap">
            {pastEvents.length > 0 ? (
              pastEvents.map((event) => (
                <Link
                  to={`/event/${event._id}`}
                  key={event._id}
                  className="h-40 w-40 md:h-50 md:w-50 bg-brand/10 rounded-2xl overflow-hidden cursor-pointer border border-gray/5"
                >
                  {event.flyer ? (
                    <img
                      src={event.flyer}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                      <p className="font-bold text-sm text-brand">
                        {event.title}
                      </p>
                      <p className="text-[10px]  mt-1">
                        {formatDate(event.startDate)}
                      </p>
                    </div>
                  )}
                </Link>
              ))
            ) : (
              <p className="text-gray-400 font-league">
                You haven't attended any events yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
