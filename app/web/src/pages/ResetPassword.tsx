import React, { useState } from "react";
import { X, Info, CheckCircle } from "lucide-react";
import { LOCAL_IP } from "../config";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch(`${LOCAL_IP}/api/password-reset/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ucfEmail: email }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to send request");

      setStatus({
        type: "success",
        msg: "Check your UCF email for reset instructions!",
      });
    } catch (err: any) {
      setStatus({ type: "error", msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-4">
      <h1 className="text-5xl text-center font-bebas">Reset password</h1>
      <p className="font-league text-gray-600 mb-6 text-center max-w-sm">
        Enter your UCF email and we'll send you a link to get back into your
        account.
      </p>

      <form
        onSubmit={handleRequest}
        className="w-full max-w-xs flex flex-col gap-4"
      >
        <div className="flex flex-col relative">
          <label htmlFor="email" className="font-league text-gray mb-1">
            UCF Email
          </label>
          <div className="relative flex items-center">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-lightgray w-full outline-none py-2 px-4 pr-10 rounded-sm border-2 border-transparent focus:border-brand"
              placeholder="knightro@ucf.edu"
              required
            />
            {email && (
              <button
                type="button"
                onClick={() => setEmail("")}
                className="absolute right-3 text-gray-400"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {status && (
          <div
            className={`flex items-center gap-2 text-sm font-medium ${status.type === "error" ? "text-red-500" : "text-green-600"}`}
          >
            {status.type === "error" ? (
              <Info size={16} />
            ) : (
              <CheckCircle size={16} />
            )}
            <p>{status.msg}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-4xl font-bold bg-brand text-white py-2 mt-2 hover:brightness-110 disabled:opacity-50 transition-all"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}
