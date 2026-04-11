import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import Logo from "../components/Logo";
import styles from "./Login.module.css";
import { SERVER_IP } from "../config";

export default function VerifyEmail() {
  const { token } = useParams<{ token?: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [statusMessage, setStatusMessage] = useState<string>(
    "We sent a verification link to your email. Check your inbox.");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const unverifiedEmail = location.state?.email;

  useEffect(() => {
    if (!token) return;
    
    const verify = async () => {
      setLoading(true);
      setStatusMessage("Verifying your account...");
      try {
        const response = await fetch(
          `${SERVER_IP}/api/email-verification/request`,
          { 
            method: "POST",
            headers: {
            "Content-Type": "application/json",
          },
            body: JSON.stringify({ ucfEmail: unverifiedEmail})
          }
        );
        const data = await response.json();
        if (response.ok) {
          setError("");
          setStatusMessage(
            "Email verified successfully! Redirecting to events...",
          );
          setTimeout(() => navigate("/events"), 1200);
        } else {
          setError(data.message || "Verification failed. Please try again.");
        }
      } catch (err) {
        setError("Server error while verifying email. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    verify();
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
