import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { LOCAL_IP, SERVER_IP } from "../config";

export default function NewPassword() {
  const { token } = useParams(); // Grabs token from URL
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");

  // Verify on mount
  useEffect(() => {
    const verifyToken = async () => {
      const res = await fetch(`${SERVER_IP}/api/password-reset/${token}`);
      if (!res.ok) setError("This link is invalid or has expired.");
    };
    verifyToken();
  }, [token]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${SERVER_IP}/api/password-reset/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      if (!response.ok) throw new Error("Failed to update password.");

      alert("Password updated! Please log in.");
      navigate("/login");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="font-bebas text-4xl mb-4">Create New Password</h1>
      <form onSubmit={handleUpdate} className="flex flex-col gap-4 w-80">
        <input
          type="password"
          placeholder="New Password"
          className="bg-lightgray p-2 border-2 border-transparent focus:border-brand outline-none"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-brand text-white font-bold py-2 rounded-full"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}
