import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { SERVER_IP } from "../config";
import { useAuth } from "../context/AuthContext";
import type { Tag } from "../types/Tag";

export default function Onboarding() {
  const { user, token, setUser, loading: authLoading } = useAuth(); // Rename loading from context
  const navigate = useNavigate();

  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<Set<string>>(new Set());
  const [tagsLoading, setTagsLoading] = useState(true); // Rename local loading
  const [saving, setSaving] = useState(false);

  // 1. REDIRECT GUARD: Protect the route
  useEffect(() => {
    if (authLoading) return; // Wait for AuthProvider to finish checking storage/cookies

    if (!user) {
      navigate("/login");
      return;
    }

    // If they already have interests, they don't belong here
    if (user.interests && user.interests.length > 0) {
      navigate("/events");
    }
  }, [user, authLoading, navigate]);

  // 2. FETCH SYSTEM TAGS
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch(`${SERVER_IP}/api/tags/getTags`);
        const data = await response.json();
        if (response.ok) {
          setAvailableTags(data.tags);
        }
      } catch (err) {
        console.error("Failed to fetch tags:", err);
      } finally {
        setTagsLoading(false);
      }
    };
    fetchTags();
  }, []);

  const toggleTag = (id: string) => {
    const newSelection = new Set(selectedTagIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedTagIds(newSelection);
  };

  const handleContinue = async () => {
    if (selectedTagIds.size === 0) {
      navigate("/events");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`${SERVER_IP}/api/tags/user/${user?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ interests: Array.from(selectedTagIds) }),
      });

      if (response.ok) {
        if (user) {
          setUser({ ...user, interests: Array.from(selectedTagIds) });
        }
        navigate("/events");
      }
    } catch (err) {
      console.error("Error saving interests:", err);
    } finally {
      setSaving(false);
    }
  };

  // Show a spinner if we are still checking auth OR fetching the tags
  if (authLoading || tagsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col px-6  md:px-20 font-inter ">
      {/* skip button */}
      <div className="flex justify-end">
        <button
          onClick={() => navigate("/events")}
          className="mt-5 hover:cursor-pointer text-gray-400 font-bold hover:text-black transition-colors uppercase text-sm tracking-widest"
        >
          Skip
        </button>
      </div>

      {/* main content */}
      <div className="mt-auto flex flex-col items-center justify-center max-w-4xl mx-auto text-center">
        <h1 className="text-6xl md:text-6xl font-bebas mb-4 uppercase leading-none">
          Select your interests
        </h1>
        <p className="text-gray-500 text-lg md:text-xl mb-12 max-w-xl font-league">
          Choose your favorite topics to get personalized event and club
          recommendations
        </p>

        {/* tag grid*/}
        <div className="flex flex-wrap justify-center gap-4">
          {availableTags.map((tag) => {
            const isSelected = selectedTagIds.has(tag._id);
            return (
              <button
                key={tag._id}
                onClick={() => toggleTag(tag._id)}
                className={`hover:cursor-pointer px-8 py-3 rounded-full border-2 font-semibold transition-all duration-200 transform active:scale-95 ${
                  isSelected
                    ? "bg-brand text-white border border-brand"
                    : "border-gray-100 text-gray-400 hover:border-gray-300 hover:text-gray-600"
                }`}
              >
                <span className="text-md capitalize flex gap-1 items-center">
                  {tag.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* save button */}
      <div className=" flex justify-center mt-20 mb-auto font-league">
        <button
          onClick={handleContinue}
          disabled={saving}
          className="hover:cursor-pointer bg-black text-white font-bold py-4 px-20 rounded-full text-md hover:brightness-110 active:scale-95 transition-all  disabled:opacity-50"
        >
          {saving ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
