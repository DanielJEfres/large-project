import { Check } from "lucide-react";
import Navbar from "../components/Navbar";
import React, { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { LOCAL_IP } from "../config";

const CATEGORIES = [
  "Music",
  "Food & Drink",
  "Business",
  "Religion & Spirituality",
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

export default function CreateEvent() {
  const { user, token } = useAuth();

  const [eventType, setEventType] = useState<"RSO" | "Student">("Student");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [link, setLink] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "Music",
    "Business",
  ]);
  const [image, setImage] = useState<string | null>(null);

  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().slice(0, 16),
  );
  const [endDate, setEndDate] = useState<string>("");

  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);

  const startFormatted = formatDisplayDate(startDate);
  const endFormatted = formatDisplayDate(endDate);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
    }
  };

  const handleSubmit = async () => {
    //validation
    if (!title || !startDate) {
      alert("Title and Start Date are required.");
      return;
    }

    // 2. Map the frontend state to the Backend Schema
    const eventData = {
      title,
      description,
      location,
      startDate,
      endDate: endDate || null,
      createdBy: user?.id,
      isRSO: false, // Explicitly student event
      status: "upcoming",
      isPublic: true,
      rsvpEnabled: true,

      tags: [],
    };

    try {
      const response = await fetch(`${LOCAL_IP}/api/events`, {
        // Removed /addEvent
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Event created successfully!");
        // Optional: redirect to the new event or home
      } else {
        alert(`Error: ${data.error || data.message}`);
      }
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to connect to server.");
    }
  };

  return (
    <div className="min-h-screen bg-white font-inter antialiased">
      <Navbar />

      {/* Main Grid Container */}
      <div className="max-w-7xl mx-auto px-16 pt-10 pb-12 grid grid-cols-12 gap-16">
        {/* LEFT SIDE */}
        <div className="col-span-8">
          {/* Event Type Toggle */}
          <div className="flex bg-[#F6F6F6] p-1 rounded-2xl w-fit mb-8 border border-[#EBEBEB]">
            {/* RSO Button */}
            <button
              onClick={() => setEventType("RSO")}
              className={`px-5 py-2 rounded-[12px] text-[14px] font-medium flex items-center gap-2 transition-all duration-200 ${
                eventType === "RSO"
                  ? "bg-white text-black  ring-black/5"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-0 overflow-hidden">
                <div
                  className={`transition-all duration-300 flex items-center ${eventType === "RSO" ? "w-4 opacity-100 mr-2" : "w-0 opacity-0"}`}
                >
                  <Check size={12} strokeWidth={3} />
                </div>
                <span className="whitespace-nowrap">RSO Event</span>
              </div>
            </button>

            {/* Student Button */}
            <button
              onClick={() => setEventType("Student")}
              className={`px-5 py-2 rounded-[12px] text-[14px] font-medium flex items-center gap-2 transition-all duration-200 ${
                eventType === "Student"
                  ? "bg-white text-black "
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-0 overflow-hidden">
                <div
                  className={`transition-all duration-300 flex items-center ${eventType === "Student" ? "w-4 opacity-100 mr-2" : "w-0 opacity-0"}`}
                >
                  <Check size={12} strokeWidth={3} />
                </div>
                <span className="whitespace-nowrap">Student Event</span>
              </div>
            </button>
          </div>

          {/* Title Input */}
          <input
            value={title}
            placeholder="My Event Title"
            onChange={(e) => setTitle(e.target.value)}
            className="w-full outline-none border-b border-gray-100 pb-2 mb-10 font-bold text-[42px] tracking-tight focus:border-black transition-colors placeholder:text-gray-200"
          />

          {/* Date Picker Section */}
          <div className="mb-12">
            <h2 className="text-[28px] font-semibold mb-4 tracking-tight">
              Date
            </h2>
            <div className="inline-flex items-center border border-[#EBEBEB] rounded-[18px] p-2 bg-white">
              {/* Hidden native inputs */}
              <input
                type="datetime-local"
                ref={startInputRef}
                className="absolute opacity-0 w-0 h-0"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type="datetime-local"
                ref={endInputRef}
                className="absolute opacity-0 w-0 h-0"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />

              <button
                type="button"
                onClick={() => startInputRef.current?.showPicker()}
                className="bg-[#EDEDED] hover:bg-[#E5E5E5] transition-colors rounded-[14px] px-8 py-4 text-center"
              >
                <p className="text-[14px] text-[#222222] font-medium">
                  {startFormatted.day}
                </p>
                <p className="text-[18px] text-black font-bold">
                  {startFormatted.time}
                </p>
              </button>

              <div className="px-5">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="black"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>

              <button
                type="button"
                onClick={() => endInputRef.current?.showPicker()}
                className={`px-8 py-4 text-center rounded-[14px] transition-colors ${endDate ? "bg-[#EDEDED]" : "hover:bg-gray-50"}`}
              >
                {endDate ? (
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

          {/* Description Section */}
          <div className="mb-10">
            <h2 className="text-[28px] font-semibold mb-4 tracking-tight">
              Description
            </h2>
            <div className="bg-[#F6F6F6] rounded-[14px] p-5 transition-all focus-within:ring-1 focus-within:text-gray-400">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description of your event."
                className="w-full bg-transparent outline-none text-[16px] text-gray-700 placeholder:text-gray-400 resize-none min-h-[140px]"
                maxLength={1000}
              />
              <p className="text-right text-[14px] text-gray-400 mt-2 font-medium">
                {description.length}/1000
              </p>
            </div>
          </div>

          {/* Event Details Section */}
          <div className="mb-10">
            <h2 className="text-[28px] font-semibold mb-4 tracking-tight ">
              Event Details
            </h2>
            <div className="space-y-3">
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="w-full bg-[#F6F6F6] rounded-[14px] px-5 py-4 text-[16px] outline-none placeholder:text-gray-400 focus-within:ring-1 focus-within:text-gray-400"
              />
              <input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Link (optional)"
                className="w-full bg-[#F6F6F6] rounded-[14px] px-5 py-4 text-[16px] outline-none placeholder:text-gray-400 focus-within:ring-1 focus-within:text-gray-400"
              />
            </div>
          </div>

          {/* Category Tags */}
          <div className="flex flex-wrap gap-2 mt-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-5 py-2 rounded-full text-[14px] font-medium transition-all ${selectedCategories.includes(cat) ? "bg-brand text-white" : "bg-[#F0F0F0] text-black hover:bg-gray-200"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE*/}
        <div className="col-span-4 flex flex-col gap-6 pt-16">
          <div className="sticky top-10 flex flex-col gap-6">
            <div className="relative bg-[#DEDEDE] rounded-xl aspect-[3/4] flex items-center justify-center overflow-hidden ">
              {image ? (
                <img
                  src={image}
                  className="w-full h-full object-cover"
                  alt="Cover"
                />
              ) : (
                <label className="cursor-pointer bg-white text-black text-sm font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform active:scale-95 ">
                  Upload Flyer
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
              className="w-full bg-[#282828] text-white py-4 rounded-full font-bold text-[16px] hover:bg-black transition-all active:scale-[0.98] shadow-lg"
            >
              Create Event
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
