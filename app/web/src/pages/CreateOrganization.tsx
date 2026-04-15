import {
  Check,
  Upload,
  Globe,
  Mail,
  MessageCircle,
  Link as LinkIcon,
} from "lucide-react";
import Navbar from "../components/Navbar";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { SERVER_IP } from "../config";
import { useNavigate } from "react-router";

const CATEGORIES = [
  "Academic",
  "Professional",
  "Cultural",
  "Service",
  "Social",
  "Sports",
  "Technology",
  "Arts",
];

export default function CreateOrganization() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    contactEmail: "",
    logo: "", // For now, this is a URL string to match your schema match regex
    knightConnectUrl: "",
    socialLinks: {
      instagram: "",
      linkedin: "",
      discord: "",
      linktree: "",
      website: "",
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev: any) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.category) {
      alert("Organization name and category are required.");
      return;
    }

    const submissionData = {
      ...formData,
      createdBy: user?.id,
      president: user?.id, // Defaulting creator as president
      verificationStatus: "pending",
    };

    try {
      const response = await fetch(`${SERVER_IP}/api/organizations/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/organizations");
      } else {
        alert(`Error: ${data.message || "Failed to create organization"}`);
      }
    } catch (error) {
      console.error("Error creating organization:", error);
      alert("Failed to connect to server.");
    }
  };

  return (
    <div className="min-h-screen bg-white font-inter antialiased">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 sm:px-16 pt-6 sm:pt-10 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="order-2 lg:order-1 lg:col-span-8">
          <input
            name="name"
            value={formData.name}
            placeholder="Organization Name*"
            onChange={handleChange}
            className="w-full outline-none border-b border-gray-100 pb-2 mb-10 tracking-wider text-[32px] sm:text-[52px] focus:border-black transition-colors placeholder:text-gray-200 uppercase font-bebas"
          />

          <div className="mb-10">
            <h2 className="text-[24px] sm:text-[28px] font-semibold mb-4 tracking-tight">
              About
            </h2>
            <div className="bg-[#F6F6F6] rounded-[14px] p-5">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your organization's mission and goals."
                className="w-full bg-transparent outline-none text-[16px] text-gray-700 placeholder:text-gray-400 resize-none min-h-[140px]"
                maxLength={1000}
              />
              <p className="text-right text-[14px] text-gray-400 mt-2 font-medium">
                {formData.description.length}/1000
              </p>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-[24px] sm:text-[28px] font-semibold mb-4 tracking-tight">
              Category
            </h2>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, category: cat }))
                  }
                  className={`px-5 py-2 rounded-full text-[14px] font-medium transition-all ${
                    formData.category === cat
                      ? "bg-brand text-white"
                      : "bg-[#F0F0F0] text-black hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-[24px] sm:text-[28px] font-semibold mb-4 tracking-tight">
              Contact & Links
            </h2>
            <div className="space-y-3">
              <div className="flex items-center bg-[#F6F6F6] rounded-[14px] px-5 py-1">
                <Mail size={18} className="text-gray-400 mr-3" />
                <input
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  placeholder="Contact Email"
                  className="w-full bg-transparent py-4 text-[16px] outline-none placeholder:text-gray-400"
                />
              </div>
              <div className="flex items-center bg-[#F6F6F6] rounded-[14px] px-5 py-1">
                <input
                  name="knightConnectUrl"
                  value={formData.knightConnectUrl}
                  onChange={handleChange}
                  placeholder="KnightConnect URL (https://...)"
                  className="w-full bg-transparent py-4 text-[16px] outline-none placeholder:text-gray-400"
                />
              </div>
              <div className="flex items-center bg-[#F6F6F6] rounded-[14px] px-5 py-1">
                <input
                  name="logo"
                  value={formData.logo}
                  onChange={handleChange}
                  placeholder="Logo Image URL (https://...)"
                  className="w-full bg-transparent py-4 text-[16px] outline-none placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-[24px] sm:text-[28px] font-semibold mb-4 tracking-tight">
              Social Media
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center bg-[#F6F6F6] rounded-[14px] px-5">
                <input
                  name="socialLinks.instagram"
                  value={formData.socialLinks.instagram}
                  onChange={handleChange}
                  placeholder="Instagram URL"
                  className="w-full bg-transparent py-4 text-[16px] outline-none"
                />
              </div>
              <div className="flex items-center bg-[#F6F6F6] rounded-[14px] px-5">
                <input
                  name="socialLinks.linkedin"
                  value={formData.socialLinks.linkedin}
                  onChange={handleChange}
                  placeholder="LinkedIn URL"
                  className="w-full bg-transparent py-4 text-[16px] outline-none"
                />
              </div>
              <div className="flex items-center bg-[#F6F6F6] rounded-[14px] px-5">
                <input
                  name="socialLinks.discord"
                  value={formData.socialLinks.discord}
                  onChange={handleChange}
                  placeholder="Discord URL"
                  className="w-full bg-transparent py-4 text-[16px] outline-none"
                />
              </div>
              <div className="flex items-center bg-[#F6F6F6] rounded-[14px] px-5">
                <input
                  name="socialLinks.website"
                  value={formData.socialLinks.website}
                  onChange={handleChange}
                  placeholder="Website URL"
                  className="w-full bg-transparent py-4 text-[16px] outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2 lg:col-span-4 flex flex-col gap-6 lg:pt-16">
          <div className="lg:sticky lg:top-10 flex flex-col gap-6">
            <div className="relative bg-[#DEDEDE] rounded-xl aspect-square flex flex-col items-center justify-center overflow-hidden p-6 text-center">
              {formData.logo ? (
                <img
                  src={formData.logo}
                  className="w-full h-full object-contain bg-white rounded-lg p-2"
                  alt="Logo Preview"
                  onError={(e) => (e.currentTarget.src = "")}
                />
              ) : (
                <>
                  <Upload size={48} className="text-gray-400 mb-4" />
                  <p className="text-gray-500 text-sm font-medium px-4">
                    Enter a valid image URL to preview your organization's logo
                  </p>
                </>
              )}
            </div>

            <button
              onClick={handleSubmit}
              className="cursor-pointer w-full bg-[#282828] text-white py-4 rounded-full font-bold text-[16px] hover:bg-black transition-all mt-4 lg:mt-0 uppercase tracking-widest font-league"
            >
              Create Organization
            </button>
            <p className="text-[12px] text-gray-400 text-center px-4">
              By creating an organization, you agree to the EventKnight
              community guidelines. Organizations require verification before
              appearing in public searches.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
