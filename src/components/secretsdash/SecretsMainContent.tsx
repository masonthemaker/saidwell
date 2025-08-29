"use client";

import { useState } from "react";
import { PiLockKeyDuotone, PiEyeDuotone, PiEyeSlashDuotone } from "react-icons/pi";
import { Input } from "@/components/ui/input";

interface SecretsMainContentProps {
  isNavExpanded: boolean;
}

export default function SecretsMainContent({ isNavExpanded }: SecretsMainContentProps) {
  const [apiKeys, setApiKeys] = useState({
    vapi: "",
    retell: "",
    livekit: "",
  });
  const [showKeys, setShowKeys] = useState({
    vapi: false,
    retell: false,
    livekit: false,
  });

  const handleKeyChange = (provider: keyof typeof apiKeys, value: string) => {
    setApiKeys(prev => ({ ...prev, [provider]: value }));
  };

  const toggleVisibility = (provider: keyof typeof showKeys) => {
    setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  const handleSave = () => {
    // Placeholder for save functionality
    console.log("Saving API keys:", apiKeys);
  };

  return (
    <main
      className={`
        absolute top-22 right-6 bottom-6
        ${isNavExpanded ? "left-54" : "left-22"}
        transition-all duration-500 ease-out
        p-6 bg-white/3 backdrop-blur-xl backdrop-saturate-150
        border border-white/5 rounded-2xl overflow-y-auto scrollbar-hide
      `}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white/90 font-semibold text-xl">API Secrets</h1>
            <p className="text-white/60 text-sm">Manage API keys for voice AI providers.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Vapi API Key */}
          <div className="p-6 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[var(--color-sky-blue)]/20 rounded-lg border border-[var(--color-sky-blue)]/30">
                <PiLockKeyDuotone className="w-5 h-5 text-[var(--color-sky-blue)]" />
              </div>
              <div>
                <h3 className="text-white/90 font-medium">Vapi API Key</h3>
                <p className="text-white/60 text-sm">Voice + telephony platform</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="relative">
                <Input
                  type={showKeys.vapi ? "text" : "password"}
                  value={apiKeys.vapi}
                  onChange={(e) => handleKeyChange("vapi", e.target.value)}
                  placeholder="Enter your Vapi API key"
                  className="w-full bg-white/10 border-white/20 text-white/90 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-main-accent)]/50 focus:border-[var(--color-main-accent)]/40 pr-10"
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility("vapi")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors"
                >
                  {showKeys.vapi ? <PiEyeSlashDuotone className="w-4 h-4" /> : <PiEyeDuotone className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Retell API Key */}
          <div className="p-6 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[var(--color-hover-pink)]/20 rounded-lg border border-[var(--color-hover-pink)]/30">
                <PiLockKeyDuotone className="w-5 h-5 text-[var(--color-hover-pink)]" />
              </div>
              <div>
                <h3 className="text-white/90 font-medium">Retell API Key</h3>
                <p className="text-white/60 text-sm">Real-time voice platform</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="relative">
                <Input
                  type={showKeys.retell ? "text" : "password"}
                  value={apiKeys.retell}
                  onChange={(e) => handleKeyChange("retell", e.target.value)}
                  placeholder="Enter your Retell API key"
                  className="w-full bg-white/10 border-white/20 text-white/90 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-main-accent)]/50 focus:border-[var(--color-main-accent)]/40 pr-10"
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility("retell")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors"
                >
                  {showKeys.retell ? <PiEyeSlashDuotone className="w-4 h-4" /> : <PiEyeDuotone className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* LiveKit API Key */}
          <div className="p-6 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[var(--color-grassy-green)]/20 rounded-lg border border-[var(--color-grassy-green)]/30">
                <PiLockKeyDuotone className="w-5 h-5 text-[var(--color-grassy-green)]" />
              </div>
              <div>
                <h3 className="text-white/90 font-medium">LiveKit API Key</h3>
                <p className="text-white/60 text-sm">Managed WebRTC infrastructure</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="relative">
                <Input
                  type={showKeys.livekit ? "text" : "password"}
                  value={apiKeys.livekit}
                  onChange={(e) => handleKeyChange("livekit", e.target.value)}
                  placeholder="Enter your LiveKit API key"
                  className="w-full bg-white/10 border-white/20 text-white/90 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-main-accent)]/50 focus:border-[var(--color-main-accent)]/40 pr-10"
                />
                <button
                  type="button"
                  onClick={() => toggleVisibility("livekit")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors"
                >
                  {showKeys.livekit ? <PiEyeSlashDuotone className="w-4 h-4" /> : <PiEyeDuotone className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-[var(--color-main-accent)]/20 hover:bg-[var(--color-main-accent)]/30 border border-[var(--color-main-accent)]/30 hover:border-[var(--color-main-accent)]/50 rounded-xl text-[var(--color-main-accent)] font-medium transition-all duration-300"
          >
            Save API Keys
          </button>
        </div>
      </div>
    </main>
  );
}
