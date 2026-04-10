import { Check, ChevronLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { LOCAL_IP, SERVER_IP } from "../config";
import { useParams, useNavigate, Link } from "react-router";

const CATEGORIES = [
  "Sports",
  "Computer Science",
  "Music",
  "Art",
  "Business",
  "Volunteering",
  "Marine Biology",
  "Engineering",
  "Professional Development",
  "Fashion",
];

const formatDisplayDate = (dateStr: string) => {
  if (!dateStr) return { day: "", time: "" };
  const d = new Date(dateStr);
  const day = d
    .toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
    .replace(",", "");
  const time = d
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();
  return { day, time };
};

export default function EditEvent() {
  const { eventId } = useParams(); // Using 'id' to match your console log /api/events/undefined
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    eventType: "Student" as "RSO" | "Student",
    title: "",
    description: "",
    location: "",
    link: "",
    selectedCategories: [] as string[],
    imagePreview: null as string | null,
    file: null as File | null,
    startDate: "",
    endDate: "",
  });

  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const res = await fetch(`${LOCAL_IP}/api/events/${eventId}`);
        const data = await res.json();
        const event = data.event;

        // Logic to match backend lowercase tags to frontend Title Case CATEGORIES
        const matchedTags = event.tags.map((t: any) => {
          const match = CATEGORIES.find(
            (cat) => cat.toLowerCase() === t.name.toLowerCase(),
          );
          return match || t.name;
        });

        setFormData({
          eventType: event.isRSO ? "RSO" : "Student",
          title: event.title,
          description: event.description || "",
          location: event.location,
          link: "",
          selectedCategories: matchedTags,
          imagePreview: event.flyer || null,
          file: null,
          startDate: new Date(event.startDate).toISOString().slice(0, 16),
          endDate: event.endDate
            ? new Date(event.endDate).toISOString().slice(0, 16)
            : "",
        });
      } catch (err) {
        console.error("Error fetching event:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEventData();
  }, [eventId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        file: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const toggleCategory = (cat: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(cat)
        ? prev.selectedCategories.filter((c) => c !== cat)
        : [...prev.selectedCategories, cat],
    }));
  };

  const handleSubmit = async () => {
    const submissionData = new FormData();
    submissionData.append("title", formData.title);
    submissionData.append("description", formData.description);
    submissionData.append("location", formData.location);
    submissionData.append("startDate", formData.startDate);
    if (formData.endDate) submissionData.append("endDate", formData.endDate);
    submissionData.append("isRSO", String(formData.eventType === "RSO"));

    formData.selectedCategories.forEach((tag) => {
      submissionData.append("tags", tag);
    });

    if (formData.file) {
      submissionData.append("flyer", formData.file);
    }

    try {
      const response = await fetch(`${LOCAL_IP}/api/events/${eventId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submissionData,
      });

      if (response.ok) {
        navigate(`/manage/event/${eventId}`);
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  if (loading) return null;

  const startFormatted = formatDisplayDate(formData.startDate);
  const endFormatted = formatDisplayDate(formData.endDate);

  return (
    <div className="min-h-screen bg-white font-inter antialiased">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 sm:px-16 pt-6 sm:pt-10 pb-12">
        <Link
          to={`/manage/event/${eventId}`}
          className="flex items-center text-gray-500 hover:text-black mb-8 transition-colors w-fit"
        >
          <ChevronLeft size={20} /> Cancel Editing
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="order-2 lg:order-1 lg:col-span-8">
            <div className="flex bg-[#F6F6F6] p-1 rounded-2xl w-fit mb-8 border border-[#EBEBEB]">
              <button
                onClick={() => setFormData((p) => ({ ...p, eventType: "RSO" }))}
                className={`px-4 sm:px-5 py-2 rounded-[12px] text-[13px] sm:text-[14px] font-medium flex items-center gap-2 transition-all duration-200 ${
                  formData.eventType === "RSO"
                    ? "bg-white text-black"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div
                  className={`transition-all duration-300 flex items-center ${
                    formData.eventType === "RSO"
                      ? "w-4 opacity-100 mr-2"
                      : "w-0 opacity-0"
                  }`}
                >
                  <Check size={12} strokeWidth={3} />
                </div>
                RSO Event
              </button>

              <button
                onClick={() =>
                  setFormData((p) => ({ ...p, eventType: "Student" }))
                }
                className={`px-4 sm:px-5 py-2 rounded-[12px] text-[13px] sm:text-[14px] font-medium flex items-center gap-2 transition-all duration-200 ${
                  formData.eventType === "Student"
                    ? "bg-white text-black"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <div
                  className={`transition-all duration-300 flex items-center ${
                    formData.eventType === "Student"
                      ? "w-4 opacity-100 mr-2"
                      : "w-0 opacity-0"
                  }`}
                >
                  <Check size={12} strokeWidth={3} />
                </div>
                Student Event
              </button>
            </div>

            <input
              name="title"
              value={formData.title}
              placeholder="My Event Title*"
              onChange={handleChange}
              className="w-full outline-none border-b border-gray-100 pb-2 mb-10 font-bold text-[32px] sm:text-[42px] tracking-tight focus:border-black transition-colors"
            />

            <div className="mb-12">
              <h2 className="text-[24px] sm:text-[28px] font-semibold mb-4 tracking-tight">
                Date
              </h2>
              <div className="flex flex-col sm:inline-flex sm:flex-row items-center border border-[#EBEBEB] rounded-[24px] sm:rounded-[18px] p-2 bg-white gap-2 sm:gap-0">
                <input
                  type="datetime-local"
                  ref={startInputRef}
                  className="absolute opacity-0 w-0 h-0"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, startDate: e.target.value }))
                  }
                />
                <input
                  type="datetime-local"
                  ref={endInputRef}
                  className="absolute opacity-0 w-0 h-0"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, endDate: e.target.value }))
                  }
                />

                <button
                  type="button"
                  onClick={() => startInputRef.current?.showPicker()}
                  className="w-full sm:w-auto bg-[#EDEDED] hover:bg-[#E5E5E5] transition-colors rounded-[14px] px-8 py-4 text-center"
                >
                  <p className="text-[14px] text-[#222222] font-medium">
                    {startFormatted.day}
                  </p>
                  <p className="text-[18px] text-black font-bold">
                    {startFormatted.time}
                  </p>
                </button>

                <div className="px-5 rotate-90 sm:rotate-0">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="black"
                    strokeWidth="3"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </div>

                <button
                  type="button"
                  onClick={() => endInputRef.current?.showPicker()}
                  className={`w-full sm:w-auto px-8 py-4 text-center rounded-[14px] transition-colors ${
                    formData.endDate
                      ? "bg-[#EDEDED]"
                      : "hover:bg-gray-50 border border-dashed border-gray-200 sm:border-none"
                  }`}
                >
                  {formData.endDate ? (
                    <>
                      <p className="text-[14px] text-[#222222] font-medium">
                        {endFormatted.day}
                      </p>
                      <p className="text-[18px] text-black font-bold">
                        {endFormatted.time}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-[14px] text-[#9CA3AF] font-medium">
                        Optional
                      </p>
                      <p className="text-[18px] text-[#9CA3AF] font-bold">
                        End Date
                      </p>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-[24px] sm:text-[28px] font-semibold mb-4 tracking-tight">
                Description
              </h2>
              <div className="bg-[#F6F6F6] rounded-[14px] p-5">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-[16px] text-gray-700 resize-none min-h-[140px]"
                  maxLength={1000}
                />
                <p className="text-right text-[14px] text-gray-400 mt-2 font-medium">
                  {formData.description.length}/1000
                </p>
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-[24px] sm:text-[28px] font-semibold mb-4 tracking-tight">
                Event Details
              </h2>
              <div className="space-y-3">
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Location*"
                  className="w-full bg-[#F6F6F6] rounded-[14px] px-5 py-4 text-[16px] outline-none"
                />
                <input
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  placeholder="Link (optional)"
                  className="w-full bg-[#F6F6F6] rounded-[14px] px-5 py-4 text-[16px] outline-none"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-5 py-2 rounded-full text-[14px] font-medium transition-all ${
                    formData.selectedCategories.includes(cat)
                      ? "bg-brand text-white"
                      : "bg-[#F0F0F0] text-black hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-4 flex flex-col gap-6 lg:pt-16">
            <div className="lg:sticky lg:top-10 flex flex-col gap-6">
              <div className="relative bg-[#DEDEDE] rounded-xl aspect-[4/3] lg:aspect-[3/4] sm:aspect-[4/3] flex items-center justify-center overflow-hidden">
                {formData.imagePreview ? (
                  <>
                    <img
                      src={formData.imagePreview}
                      className="w-full h-full object-cover"
                      alt="Cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <label className="cursor-pointer bg-white text-black text-sm font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform active:scale-95 shadow-lg">
                        Upload
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleImageUpload}
                          accept="image/*"
                        />
                      </label>
                    </div>
                  </>
                ) : (
                  <label className="cursor-pointer bg-white text-black text-sm font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform active:scale-95">
                    Upload
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleImageUpload}
                      accept="image/*"
                    />
                  </label>
                )}
              </div>

              <button
                onClick={handleSubmit}
                className="cursor-pointer w-full bg-[#282828] text-white py-4 rounded-full font-bold text-[16px] hover:bg-black transition-all mt-4 lg:mt-0"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
