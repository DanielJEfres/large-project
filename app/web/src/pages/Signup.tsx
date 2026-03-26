import { useState, type ChangeEvent } from "react";
import { Link } from "react-router";
import { X, Eye, EyeOff, Info } from "lucide-react";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  interests: string[];
};

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    interests: [],
  });

  const [error, setError] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Helper
  const clearField = (fieldName: keyof FormData) => {
    setFormData((prev) => ({ ...prev, [fieldName]: "" }));
  };

  // Handle the form submission
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    // empty check
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password
    ) {
      setError("Please fill in all fields.");
      return;
    }

    // uni email check
    if (!formData.email.toLowerCase().endsWith(".edu")) {
      setError("Please use a valid university email (.edu).");
      return;
    }

    // check password length
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    // validation passed!

    console.log("Final Data:", formData);
    // api call here vvvvvvvv
  };

  const isInvalid = (fieldName: string) => {
    if (!error) return false;
    const lowerError = error.toLowerCase();
    return (
      lowerError.includes(fieldName.toLowerCase()) ||
      (lowerError.includes("all fields") &&
        !formData[fieldName as keyof FormData])
    );
  };

  const inputStyle = (fieldName: string) => `
    bg-lightgray w-full outline-none py-2 px-4 rounded-sm border-2 transition-all pr-10
    ${
      isInvalid(fieldName)
        ? "border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.2)]"
        : "border-transparent focus:border-brand"
    }
  `;

  return (
    <div className="[&_button]:cursor-pointer fixed inset-0 bg-white flex flex-col justify-center items-center z-50">
      <Link
        to="/"
        className="absolute top-6 left-6 w-10 h-10 rounded-full bg-black flex items-center justify-center text-white text-xl"
      ></Link>

      <div className="w-95">
        <h2 className="font-bebas text-5xl text-center">
          Sign up to find your next event
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 mx-3 [&>div>label]:font-league [&>div>label]:text-gray"
        >
          {/* FIRST NAME */}
          <div className="flex flex-col pt-10 relative">
            <label htmlFor="firstName">First Name</label>
            <div className="relative flex items-center">
              <input
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                className={inputStyle("firstName")}
              />
              {formData.firstName && (
                <button
                  type="button"
                  onClick={() => clearField("firstName")}
                  className="absolute right-3 text-gray-400 hover:text-black"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* LAST NAME */}
          <div className="flex flex-col relative">
            <label htmlFor="lastName">Last Name</label>
            <div className="relative flex items-center">
              <input
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                className={inputStyle("lastName")}
              />
              {formData.lastName && (
                <button
                  type="button"
                  onClick={() => clearField("lastName")}
                  className="absolute right-3 text-gray-400 hover:text-black"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* EMAIL */}
          <div className="flex flex-col relative">
            <label htmlFor="email">Email</label>
            <div className="relative flex items-center">
              <input
                name="email"
                type="text"
                value={formData.email}
                onChange={handleChange}
                className={inputStyle("email")}
              />
              {formData.email && (
                <button
                  type="button"
                  onClick={() => clearField("email")}
                  className="absolute right-3 text-gray-400 hover:text-black"
                >
                  <X size={16} />
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
                className={inputStyle("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-gray-400 hover:text-black transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* error message! */}
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
            Sign Up
          </button>
        </form>

        <div className="pt-8 text-center text-gray">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="font-bold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
