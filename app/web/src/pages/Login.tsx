import React, { useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router";
import { X, Eye, EyeOff, Info } from "lucide-react";
import styles from "./Login.module.css";
import Logo from "../components/Logo.tsx";
import { LOCAL_IP, SERVER_IP } from "../config";
import { useAuth } from "../context/AuthContext.tsx";

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const { setUser } = useAuth();

  const navigate = useNavigate();
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
      const response = await fetch(`${LOCAL_IP}/api/auth/login`, {
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
        if (response.status === 403) {
          setError(data.message || "Email not verified.");
          navigate("/verify");
          return;
        }
        throw new Error(data.message || "Something went wrong");
      }

      // saves jwt token
      localStorage.setItem("accessToken", data.accessToken);

      // updates auth context
      setUser({
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.ucfEmail,
        pfp: data.user.profilePicture,
      });

      console.log("Success:", data);
      if (data.isVerified) {
        navigate("/events");
      } else {
        navigate("/verify");
      }
    } catch (err: any) {
      setError(err?.message || "Internal Server Error");
    }
  };

  const isFieldError = (fieldKeyword: string) =>
    error.toLowerCase().includes(fieldKeyword.toLowerCase());

  return (
    <>
      <div className="[&_button]:cursor-pointer fixed inset-0 bg-white flex flex-col justify-center items-center z-50">
        <div className="w-95">
          <div className={styles.logo}>
            <Logo />
          </div>

          {/* welcome title */}
          <div className={styles.titleWrapper}>
            <h1 className="font-bebas text-5xl text-center">Welcome back</h1>
            <svg
              width="34"
              height="55"
              viewBox="0 0 39 61"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.5613 4.75128C11.5613 9.08789 10.571 20.3496 8.87909 24.5587C7.23105 28.6587 3.44331 31.7538 2.67801 33.0706C1.30983 35.4246 8.30137 33.7571 9.98575 34.8169C13.9526 37.3127 16.6782 44.4786 17.8112 51.7394C18.14 53.8467 17.9387 56.4681 17.9387 57.0645C17.9387 60.4768 19.0566 49.663 23.7909 43.7283C30.2068 35.6856 35.8141 35.8916 36.3806 35.267C36.9719 34.6151 32.2203 33.0293 27.5385 29.4749C23.971 25.7966 20.5835 18.8078 17.7699 10.127C16.8133 6.52194 16.8133 4.5412 16.4381 2.50044"
                stroke="black"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>
          </div>

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
