"use client";

import { useState } from "react";
import { PiXDuotone, PiFirstAidDuotone } from "react-icons/pi";
import type { CreateClientData } from "@/hooks/use-clients";

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateClientData) => Promise<boolean>;
  isCreating: boolean;
}

export default function AddClientModal({ isOpen, onClose, onSubmit, isCreating }: AddClientModalProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Client name is required");
      return;
    }

    const success = await onSubmit({ name: name.trim() });
    if (success) {
      setName("");
      onClose();
    }
  };

  const handleClose = () => {
    if (!isCreating) {
      setName("");
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[var(--color-main-accent)]/20 rounded-xl">
              <PiFirstAidDuotone className="w-5 h-5 text-[var(--color-main-accent)]" />
            </div>
            <h2 className="text-xl font-semibold text-white">Add New Client</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isCreating}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PiXDuotone className="w-5 h-5 text-white/70" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="clientName" className="block text-sm font-medium text-white/80 mb-2">
              Client Organization Name
            </label>
            <input
              id="clientName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter client name..."
              disabled={isCreating}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[var(--color-main-accent)]/50 focus:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              autoFocus
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isCreating}
              className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/15 border border-white/20 hover:border-white/30 rounded-xl text-white text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || !name.trim()}
              className="flex-1 px-4 py-3 bg-[var(--color-main-accent)]/20 hover:bg-[var(--color-main-accent)]/30 border border-[var(--color-main-accent)]/30 hover:border-[var(--color-main-accent)]/50 rounded-xl text-[var(--color-main-accent)] text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-[var(--color-main-accent)]/30 border-t-[var(--color-main-accent)] rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <PiFirstAidDuotone className="w-4 h-4" />
                  Create Client
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
