import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import Logo from "../components/Logo";
import styles from "./Login.module.css";
import { SERVER_IP } from "../config";

export default function VerifyEmail() {
  const { token } = useParams<{ token?: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const unverifiedEmail = location.state?.email;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const sentRef = useRef(false);

  // Auto-send verification email on mount when there's no token (just signed up)
  useEffect(() => {
    if (token || !unverifiedEmail || sentRef.current) return;
    sentRef.current = true;
    sendVerificationEmail();
  }, []);

  const handleConfirm = async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${SERVER_IP}/api/email-verification/${token}`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setConfirmed(true);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(data.message || "Verification failed. Please try again.");
      }
    } catch {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const sendVerificationEmail = async () => {
    if (!unverifiedEmail) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${SERVER_IP}/api/email-verification/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ucfEmail: unverifiedEmail }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.message || "Failed to send email.");
    } catch {
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // ── Confirmation page (user arrived from email link) ──────────────────────
  if (token) {
    return (
      <div className="[&_button]:cursor-pointer min-h-screen bg-white flex flex-col justify-center items-center">
        <div className="w-95 text-center">
          <div className={styles.logo}>
            <Logo />
          </div>
          <h1 className="font-bebas text-5xl">Confirm your email</h1>
          <p className="text-gray-600 mt-2 mb-6">
            Click the button below to verify your EventKnight account.
          </p>

          {confirmed ? (
            <p className="text-green-600 font-medium">
              Verified! Redirecting to login...
            </p>
          ) : (
            <>
              {error && <p className="text-red-600 mb-3">{error}</p>}
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="w-full py-3 bg-black text-white rounded-xl font-league font-bold uppercase tracking-wider hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Confirm Email"}
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ── Waiting page (user just signed up, email sent) ────────────────────────
  return (
    <div className="[&_button]:cursor-pointer min-h-screen bg-white flex flex-col justify-center items-center">
      <div className="w-95 text-center">
        <div className={styles.logo}>
          <Logo />
        </div>
        <h1 className="font-bebas text-5xl">Verify your email</h1>
        <p className="text-gray-700 mt-2">
          We sent a verification link to <strong>{unverifiedEmail || "your email"}</strong>.
          Check your inbox and click the link to confirm your account.
        </p>
        <p className="text-sm text-gray-500 mt-3">
          Didn't get it? Check your spam folder or resend below.
        </p>
        {error && <p className="text-red-600 mt-2">{error}</p>}
        {unverifiedEmail && (
          <button
            onClick={sendVerificationEmail}
            disabled={loading}
            className="mt-4 w-full py-3 bg-black text-white rounded-xl font-league font-bold uppercase tracking-wider hover:bg-zinc-800 transition-colors disabled:opacity-50"
          >
            {loading ? "Sending..." : "Resend Email"}
          </button>
        )}
      </div>
    </div>
  );
}
