import Navbar from "../components/Navbar";
import React, { useState, useRef } from "react";

const CATEGORIES = [
  "Music", "Food & Drink", "Business", "Religion & Spirituality"
];

const formatDisplayDate = (dateStr: string) => {
  if (!dateStr) return { day: "", time: "" };
  const d = new Date(dateStr);
  const day = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).replace(',', '');
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
  return { day, time };
};

export default function CreateEvent() {
  const [eventType, setEventType] = useState<"RSO" | "Student">("RSO");
  const [title, setTitle] = useState("My Event Title");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [link, setLink] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["Music", "Business"]);
  const [image, setImage] = useState<string | null>(null);

  const [startDate, setStartDate] = useState<string>("2026-03-28T20:00");
  const [endDate, setEndDate] = useState<string>("");

  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);

  const startFormatted = formatDisplayDate(startDate);
  const endFormatted = formatDisplayDate(endDate);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
    }
  };

  return (
    <div className="min-h-screen bg-white font-inter antialiased">
      <Navbar />

      <div className="flex gap-16 px-16 pt-10 pb-12">
 
        <div className="flex-1 max-w-xl">
          

          <div className="flex border border-[#EBEBEB] rounded-2xl w-fit mb-8 overflow-hidden">
            <button 
              onClick={() => setEventType("RSO")} 
              className={`px-4 py-2 text-[14px] font-medium flex items-center gap-2 ${eventType === "RSO" ? "bg-[#F6F6F6]" : "bg-white"}`}
            >
              {eventType === "RSO" && <CheckIcon />} RSO Event
            </button>
            <div className="w-px bg-gray-100" />
            <button 
              onClick={() => setEventType("Student")} 
              className={`px-4 py-2 text-[14px] font-medium flex items-center gap-2 ${eventType === "Student" ? "bg-[#F6F6F6]" : "bg-white"}`}
            >
              {eventType === "Student" && <CheckIcon />} Student Event
            </button>
          </div>

       
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full outline-none border-b border-gray-100 pb-2 mb-10 font-bold text-[42px] tracking-tight focus:border-black transition-colors"
          />


          <div className="mb-12">
            <h2 className="text-[28px] font-semibold mb-4 tracking-tight">Date</h2>
            <div className="inline-flex items-center border border-[#EBEBEB] rounded-[18px] p-2 bg-white">
              <input type="datetime-local" ref={startInputRef} className="absolute opacity-0 w-0 h-0" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <input type="datetime-local" ref={endInputRef} className="absolute opacity-0 w-0 h-0" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

              <button 
                type="button"
                onClick={() => startInputRef.current?.showPicker()}
                className="bg-[#EDEDED] hover:bg-[#E5E5E5] transition-colors rounded-[14px] px-8 py-4 text-center"
              >
                <p className="text-[14px] text-[#222222] font-medium">{startFormatted.day}</p>
                <p className="text-[18px] text-black font-bold">{startFormatted.time}</p>
              </button>

              <div className="px-5">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </div>

              <button 
                type="button"
                onClick={() => endInputRef.current?.showPicker()}
                className={`px-8 py-4 text-center rounded-[14px] transition-colors ${endDate ? "bg-[#EDEDED]" : "hover:bg-gray-50"}`}
              >
                {endDate ? (
                  <>
                    <p className="text-[14px] text-[#222222] font-medium">{endFormatted.day}</p>
                    <p className="text-[18px] text-black font-bold">{endFormatted.time}</p>
                  </>
                ) : (
                  <>
                    <p className="text-[14px] text-[#9CA3AF] font-medium">Optional</p>
                    <p className="text-[18px] text-[#9CA3AF] font-bold">End Date</p>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* description box */}
          <div className="mb-10">
            <h2 className="text-[28px] font-semibold mb-4 tracking-tight">Description</h2>
            <div className="bg-[#F6F6F6] rounded-[14px] p-5">
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

          {/* event details */}
          <div className="mb-10">
            <h2 className="text-[28px] font-semibold mb-4 tracking-tight">Event Details</h2>
            <div className="space-y-3">
              <input 
                value={location} 
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location" 
                className="w-full bg-[#F6F6F6] rounded-[14px] px-5 py-4 text-[16px] outline-none placeholder:text-gray-400"
              />
              <input 
                value={link} 
                onChange={(e) => setLink(e.target.value)}
                placeholder="Link (optional)" 
                className="w-full bg-[#F6F6F6] rounded-[14px] px-5 py-4 text-[16px] outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* category tags */}
          <div className="flex flex-wrap gap-2 mt-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-5 py-2 rounded-full text-[14px] font-medium transition-all ${
                  selectedCategories.includes(cat) 
                  ? "bg-black text-white" 
                  : "bg-[#F0F0F0] text-black hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* image upload */}
        <div className="w-80 pt-16 flex flex-col gap-6">
          <div className="relative bg-[#DEDEDE] rounded-xl h-96 flex items-center justify-center overflow-hidden">
            {image ? (
              <img src={image} className="w-full h-full object-cover" alt="Cover" />
            ) : (
              <label className="cursor-pointer bg-[#FFEB3B] text-[black] text-sm font-bold px-8 py-3 rounded-full hover:scale-105 transition-transform active:scale-95 shadow-sm">
                Upload
                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
              </label>
            )}
          </div>
          
          <button className="w-full bg-[#282828] text-white py-4 rounded-full font-bold text-[16px] hover:bg-black transition-all active:scale-[0.98]">
            Create Event
          </button>
        </div>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 175 170" fill="none">
      <rect x="1" y="1" width="173" height="168" rx="14" fill="#F6F6F6" stroke="#D9D9D9" strokeWidth="2" />
      <path d="M45 85L75 115L130 55" stroke="black" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}