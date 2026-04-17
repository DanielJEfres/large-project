import React, { useState } from "react";
import { X, Copy, Check } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  link: string;
  title: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  link,
  title,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      // Hide the "Copied" message after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-league  tracking-tight">
            Share {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-2 pl-4">
          <input
            type="text"
            readOnly
            value={link}
            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-600 font-inter"
            onFocus={(e) => e.target.select()}
          />
          <button
            onClick={handleCopy}
            className="hover:cursor-pointer bg-black text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-zinc-800 transition-all active:scale-95 flex items-center gap-2"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        {/* YouTube-style Toast Notification */}
        {copied && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-[#282828] text-white px-6 py-3 rounded-lg text-sm font-medium shadow-xl animate-in slide-in-from-bottom-4 duration-300">
            Link copied to clipboard
          </div>
        )}
      </div>
    </div>
  );
}
