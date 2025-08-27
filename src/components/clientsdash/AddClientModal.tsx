"use client";

import { useState, useCallback, useEffect } from "react";
import { PiXDuotone, PiFirstAidDuotone, PiWarningDuotone } from "react-icons/pi";
import type { CreateClientData } from "@/hooks/use-clients";

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateClientData) => Promise<boolean>;
  isCreating: boolean;
}

export default function AddClientModal({ isOpen, onClose, onSubmit, isCreating }: AddClientModalProps) {
  const [name, setName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [emailExists, setEmailExists] = useState<boolean | null>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Client name is required");
      return;
    }

    // Prevent creation if email exists
    if (adminEmail.trim() && emailExists === true) {
      setError("Cannot create client - this email is already registered. Please use a different email or leave empty.");
      return;
    }

    const success = await onSubmit({ 
      name: name.trim(),
      adminEmail: adminEmail.trim() || undefined
    });
    if (success) {
      setName("");
      setAdminEmail("");
      setEmailExists(null);
      onClose();
    }
  };

  // Check if email exists with debouncing
  const checkEmailExists = useCallback(async (email: string) => {
    if (!email.trim() || !email.includes('@')) {
      setEmailExists(null);
      return;
    }

    setCheckingEmail(true);
    try {
      const response = await fetch('/api/check-user-exists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() })
      });

      if (response.ok) {
        const result = await response.json();
        setEmailExists(result.exists);
      }
    } catch (err) {
      console.warn('Failed to check email:', err);
      setEmailExists(null);
    } finally {
      setCheckingEmail(false);
    }
  }, []);

  // Debounce email checking
  useEffect(() => {
    const timer = setTimeout(() => {
      checkEmailExists(adminEmail);
    }, 500);

    return () => clearTimeout(timer);
  }, [adminEmail, checkEmailExists]);

  const handleClose = () => {
    if (!isCreating) {
      setName("");
      setAdminEmail("");
      setError(null);
      setEmailExists(null);
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

          <div>
            <label htmlFor="adminEmail" className="block text-sm font-medium text-white/80 mb-2">
              Admin Email <span className="text-white/50 font-normal">(optional)</span>
            </label>
            <input
              id="adminEmail"
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="admin@clientcompany.com"
              disabled={isCreating}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[var(--color-main-accent)]/50 focus:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <p className="mt-2 text-xs text-white/60">
              If provided, we'll send an invitation email to set up their admin account
            </p>
            
            {/* Email status indicator */}
            {adminEmail && (
              <div className="mt-2">
                {checkingEmail ? (
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <div className="w-3 h-3 border border-white/30 border-t-white/60 rounded-full animate-spin" />
                    Checking email...
                  </div>
                ) : emailExists === true ? (
                  <div className="flex items-center gap-2 text-xs text-red-400">
                    <PiWarningDuotone className="w-4 h-4" />
                    Email already exists - please use a different email or leave empty
                  </div>
                ) : emailExists === false ? (
                  <div className="flex items-center gap-2 text-xs text-green-400">
                    ✓ New user - invitation will be sent
                  </div>
                ) : null}
              </div>
            )}
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
              disabled={
                isCreating || 
                !name.trim() || 
                (adminEmail.trim() && emailExists === true) ||
                checkingEmail
              }
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
