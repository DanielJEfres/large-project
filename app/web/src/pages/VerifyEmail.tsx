import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Logo from "../components/Logo";
import styles from "./Login.module.css";
import { SERVER_IP } from "../config";
import { useAuth } from "../context/AuthContext";

export default function VerifyEmail() {
  const {user}  = useAuth();
  const { token } = useParams<{ token?: string }>();
  const navigate = useNavigate();
  const [statusMessage, setStatusMessage] = useState<string>(
    "We sent a verification link to your email. Check your inbox.",
  );
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
  // If no token is in the URL, the user just landed here after signing up.
  // We don't want to call any API automatically yet.
  if (!token) return;

  const verifyAccount = async () => {
    setLoading(true);
    setStatusMessage("Verifying your account...");
    try {
      // FIX: Hit the GET endpoint with the token, NOT the /request endpoint
      const response = await fetch(`${SERVER_IP}/api/email-verification/${token}`, {
        method: "GET",
      });

      if (response.ok) {
        setError("");
        setStatusMessage("Email verified successfully! Redirecting to events...");
        // On success, the backend currently redirects, but since this is a fetch call,
        // we handle the navigation here in React.
        setTimeout(() => navigate("/events"), 1500);
      } else {
        const data = await response.json();
        setError(data.message || "This verification link is invalid or has expired.");
      }
    } catch (err) {
      setError("Server error while verifying. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  verifyAccount();
}, [token, navigate]);

  return (
    <div className="[&_button]:cursor-pointer min-h-screen  bg-white flex flex-col justify-center items-center z-50">
      <div className="w-95">
        <div className={styles.logo}>
          <Logo />
        </div>

        <h1 className="font-bebas text-5xl text-center">Verify your email</h1>

        <div className="mt-2 text-center">
          {loading ? (
            <p className="text-gray-700">Verifying...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <p className="text-gray-700">{statusMessage}</p>
          )}
        </div>

        {!token && (
          <p className="text-sm text-center text-gray-700 mt-1">
            If you haven’t received an email, check your spam folder or try
            again.
          </p>
        )}
      </div>
    </div>
  );
}
