import React, { useState } from "react";
import { X, Upload, Loader2, User } from "lucide-react";
import { SERVER_IP } from "../config";
import { useAuth } from "../context/AuthContext";

interface EditProfileModalProps {
  user: any;
  token: string | null;
  onClose: () => void;
  onUpdate: (updatedUser: any) => void;
}

export default function EditProfileModal({
  user,
  token,
  onClose,
  onUpdate,
}: EditProfileModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    bio: user?.bio || "",
  });
  const { setUser } = useAuth();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(user?.profilePicture || "");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevents blank inputs
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      alert("First name and Last name cannot be blank.");
      return;
    }

    setLoading(true);

    const data = new FormData();
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("bio", formData.bio);
    if (selectedFile) data.append("profilePicture", selectedFile);

    try {
      const response = await fetch(`${SERVER_IP}/api/users/me`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      if (response.ok) {
        const result = await response.json();
        const updatedUser = result.user;

        // Update Profile.tsx local state
        onUpdate(updatedUser);

        // Update Global Auth state (Navbar/Menu)
        // We map profilePicture to pfp to match your User type in AuthContext
        setUser({
          ...updatedUser,
          pfp: updatedUser.profilePicture,
        });

        onClose();
      }
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60  p-4">
      <div className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-2xl font-league  tracking-tight">Edit Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors hover:cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 font-league">
          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-brand bg-gray-50 flex items-center justify-center">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  className="w-full h-full object-cover"
                  alt="Preview"
                  onError={(e) => (e.currentTarget.src = "")}
                />
              ) : (
                <User className="text-gray-300" size={32} />
              )}

              <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer text-white">
                <Upload size={20} />
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </label>
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Change Photo
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase text-gray-500">
                First Name
              </label>
              <input
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase text-gray-500">
                Last Name
              </label>
              <input
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase text-gray-500">
              Bio
            </label>
            <textarea
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all"
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
            />
          </div>

          <button
            disabled={loading}
            className="hover:cursor-pointer w-full bg-black text-white py-4 rounded-full font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all active:scale-95 disabled:bg-gray-400 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}
