import React, { useState, type ChangeEvent } from "react";
import { Link } from "react-router";
import { X, Eye, EyeOff, Info } from "lucide-react";
import styles from "./Login.module.css";
import Logo from "../components/Logo";

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
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
    // api call here vvvvvvvvv
  };

  const isFieldError = (fieldKeyword: string) =>
    error.toLowerCase().includes(fieldKeyword.toLowerCase());

  return (
    <div className={styles.page}>
      <div className={styles.logo}>
        <Logo />
      </div>

      {/* welcome title */}
      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>Welcome Back</h1>
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

      {/* form */}
      <div className={styles.form}>
        <form id="login-form" onSubmit={handleSubmit}>
          {/* email */}
          <p className={styles.label}>Email address (.edu)</p>
          <input
            className={styles.input}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder=""
          />

          {/* password */}
          <div className={styles.passwordRow}>
            <p className={styles.label}>Password</p>
          </div>
          <div className="relative flex items-center">
            <input
              className={styles.input}
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder=""
            />
            <div className="absolute right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-black transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <div className="w-[1px] h-4 bg-gray-300"></div>
              <button
                type="button"
                className="font-bold text-gray-400 text-sm hover:underline"
              >
                Forgot?
              </button>
            </div>
          </div>
        </form>

        {/* error message */}
        {error && (
          <div className="flex items-center justify-center gap-2 mt-2 text-red-500 animate-in fade-in slide-in-from-top-1">
            <Info size={16} className="shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        <button type="submit" form="login-form" className={styles.loginButton}>
          Log In
        </button>

        <p className={styles.signupText}>
          Don't have an account?{" "}
          <Link to="/signup">
            <span className={styles.signupLink}>Sign up</span>
          </Link>
        </p>
      </div>
    </div>
  );
}
