import React, { useState, type ChangeEvent } from "react";
import { Link } from "react-router";
import { X, Eye, EyeOff, Info } from "lucide-react";
import { LOCAL_IP, SERVER_IP } from "../config";


interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>("");
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  // Change handler
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle the form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // uni email check
    if (!formData.email || !formData.password) {
      setError("Please enter both email and password.");
      return;
    }

    // uni email check
    if (!formData.email.toLowerCase().endsWith(".edu")) {
      setError("Please use a valid university email (.edu).");
      return;
    }

    // validation passed!

    console.log("Final Data:", formData);

    try {
      const response = await fetch(`${LOCAL_IP}5000/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          ucfEmail: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      console.log("Success:", data);
      alert("Login successful wooo");
    } catch (err: any) {
      setError("Internal Server Error");
    }
  };

  const isFieldError = (fieldKeyword: string) =>
    error.toLowerCase().includes(fieldKeyword.toLowerCase());

  return (
    <>
      <div className="[&_button]:cursor-pointer fixed inset-0 bg-white flex flex-col justify-center items-center z-50">
        <Link
          to="/"
          className="absolute top-6 left-6 w-10 h-10 rounded-full bg-black flex items-center justify-center text-white text-xl"
        ></Link>
        <div className="w-95">
          <h2 className="font-bebas text-5xl text-center">Welcome back</h2>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 mx-3 [&>div>label]:font-league [&>div>label]:text-gray"
          >
            {/* EMAIL */}
            <div className="flex flex-col pt-10 relative">
              <label htmlFor="email">Email address (.edu)</label>
              <div className="relative flex items-center">
                <input
                  id="email"
                  name="email"
                  type="text"
                  value={formData.email}
                  onChange={handleChange}
                  className={`bg-lightgray w-full outline-none py-2 px-4 pr-10 rounded-sm border-2 transition-colors ${
                    isFieldError("email")
                      ? "border-red-500 shadow-[0_0_5px_rgba(239,68,68,0.2)]"
                      : "border-transparent focus:border-brand"
                  }`}
                />
                {formData.email.length > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, email: "" }))
                    }
                    className="absolute right-3 text-gray-400 hover:text-black"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* PASSWORD */}
            <div className="flex flex-col relative">
              <label htmlFor="password">Password</label>
              <div className="relative flex items-center">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className={`bg-lightgray w-full outline-none py-2 px-4 pr-10 rounded-sm border-2 transition-colors ${
                    isFieldError("password")
                      ? "border-red-500 shadow-[0_0_5px_rgba(239,68,68,0.2)]"
                      : "border-transparent focus:border-brand"
                  }`}
                />
                <div className="absolute right-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-black transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <div className="w-[1px] h-4 bg-gray-300 mx-1"></div>
                  <button
                    type="button"
                    className="font-bold text-gray text-sm hover:underline"
                  >
                    Forgot?
                  </button>
                </div>
              </div>
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="flex items-center justify-center gap-2 mt-2 text-red-500 animate-in fade-in slide-in-from-top-1">
                <Info size={16} className="shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="rounded-4xl font-bold self-center bg-brand text-white w-40 px-8 py-2 mt-4 hover:brightness-110 active:scale-95 transition-all"
            >
              Log In
            </button>
          </form>

          <div className="pt-8 [&>*]:text-gray text-center">
            <p>Don't have an account?</p>
            <Link to="/signup">
              <p className="font-bold hover:underline">Sign up</p>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
