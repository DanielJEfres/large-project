import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { SERVER_IP } from "../config";

export default function Profile() {
  const { token, isLoggedIn, loading: authLoading } = useAuth(); // Get auth state
  const [myData, setMyData] = useState<any>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch(`${SERVER_IP}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Server responded with ${res.status}`);
        }

        const data = await res.json();
        setMyData(data.user);
        console.log(data);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setFetchError(err.message);
      }
    };

    // Only fetch if we are logged in and have a token
    if (token) {
      fetchMe();
    }
  }, [token]);

  // Show loading only while checking auth or fetching data
  if (authLoading) {
    return (
      <div className="p-20 font-league text-2xl">
        Checking authentication...
      </div>
    );
  }

  // Handle "Not Logged In" state
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

  // Handle Fetch Errors
  if (fetchError) {
    return (
      <div className="p-20 font-league text-red-500">Error: {fetchError}</div>
    );
  }

  // Final check for data
  if (!myData) {
    return (
      <div className="p-20 font-league text-2xl">
        Loading your profile data...
      </div>
    );
  }

  return (
    <div className="p-20 font-league">
      <h1 className="text-4xl font-bold">{myData.firstName}!</h1>
    </div>
  );
}
