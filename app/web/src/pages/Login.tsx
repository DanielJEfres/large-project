<<<<<<< HEAD
import styles from './Login.module.css'

export default function Login() {
  return (
    <div className={styles.page}>


      <div className={styles.logo}>logo</div>

      {/* welcome title */}
      <div className={styles.titleWrapper}>
        <h1 className={styles.title}>Welcome Back</h1>
        <svg width="34" height="55" viewBox="0 0 39 61" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.5613 4.75128C11.5613 9.08789 10.571 20.3496 8.87909 24.5587C7.23105 28.6587 3.44331 31.7538 2.67801 33.0706C1.30983 35.4246 8.30137 33.7571 9.98575 34.8169C13.9526 37.3127 16.6782 44.4786 17.8112 51.7394C18.14 53.8467 17.9387 56.4681 17.9387 57.0645C17.9387 60.4768 19.0566 49.663 23.7909 43.7283C30.2068 35.6856 35.8141 35.8916 36.3806 35.267C36.9719 34.6151 32.2203 33.0293 27.5385 29.4749C23.971 25.7966 20.5835 18.8078 17.7699 10.127C16.8133 6.52194 16.8133 4.5412 16.4381 2.50044" stroke="black" strokeWidth="5" strokeLinecap="round"/>
        </svg>
      </div>

      {/* form */}
      <div className={styles.form}>

        {/* email box */}
        <p className={styles.label}>Email address (.edu)</p>
        <input className={styles.input} type="email" placeholder="" />

        {/* password box */}
        <div className={styles.passwordRow}>
          <p className={styles.label}>Password</p>
          <span className={styles.forgot}>Forgot?</span>
        </div>
        <input className={styles.input} type="password" placeholder="" />

        {/* login btn*/}
        <button className={styles.loginButton}>Log in</button>

        {/* sign up btn */}
        <p className={styles.signupText}>
          Don't have an account? <span className={styles.signupLink}>Sign up</span>
        </p>

      </div>
    </div>
  )
}
=======
import React, { useState, type ChangeEvent } from "react";
import { Link } from "react-router";
import { X, Eye, EyeOff, Info } from "lucide-react";

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
>>>>>>> f0799c986d00a21f740cbf523447daf53d0d47c4
