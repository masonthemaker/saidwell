"use client";

import { useState } from "react";
import { PiXDuotone, PiCloudArrowDownDuotone } from "react-icons/pi";

type Provider = "vapi" | "retell" | "livekit";

interface ImportAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (payload: { provider: Provider; agentId: string }) => void;
  providerStatus?: Partial<Record<Provider, "connected" | "disconnected">>;
}

export default function ImportAgentModal({ isOpen, onClose, onSelect, providerStatus }: ImportAgentModalProps) {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  if (!isOpen) return null;

  const selectCard = (p: Provider) => setProvider(p);
  const mockAgentsByProvider: Record<Provider, { id: string; name: string }[]> = {
    vapi: [
      { id: "vapi-1", name: "Vapi Front Desk" },
      { id: "vapi-2", name: "Vapi Sales Outbound" },
    ],
    retell: [
      { id: "retell-1", name: "Retell Concierge" },
      { id: "retell-2", name: "Retell Support L1" },
    ],
    livekit: [
      { id: "livekit-1", name: "LiveKit IVR" },
      { id: "livekit-2", name: "LiveKit Scheduler" },
    ],
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-3xl mx-4 bg-white/20 backdrop-blur-xl backdrop-saturate-150 rounded-2xl border border-white/30 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[var(--color-sky-blue)]/20 rounded-xl">
              <PiCloudArrowDownDuotone className="w-6 h-6 text-[var(--color-sky-blue)]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Import Agent</h2>
              <p className="text-sm text-white/60">Choose a provider to import from</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors" aria-label="Close">
            <PiXDuotone className="w-6 h-6 text-white/70 hover:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Vapi */}
            <button
              onClick={() => selectCard("vapi")}
              className={`p-4 rounded-xl border transition-all duration-300 text-left ${
                provider === "vapi"
                  ? "bg-[var(--color-main-accent)]/20 border-[var(--color-main-accent)]/50 shadow-lg"
                  : "bg-white/5 border-white/20 hover:bg-white/8 hover:border-white/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-white/90 font-medium">Vapi</div>
                <span className={`px-2 py-0.5 text-xs rounded-full border ${
                  (providerStatus?.vapi ?? "disconnected") === "connected"
                    ? "bg-[var(--color-grassy-green)]/20 text-[var(--color-grassy-green)] border-[var(--color-grassy-green)]/30"
                    : "bg-[var(--color-error-red)]/20 text-[var(--color-error-red)] border-[var(--color-error-red)]/30"
                }`}>
                  {(providerStatus?.vapi ?? "disconnected") === "connected" ? "Connected" : "Disconnected"}
                </span>
              </div>
            </button>

            {/* Retell */}
            <button
              onClick={() => selectCard("retell")}
              className={`p-4 rounded-xl border transition-all duration-300 text-left ${
                provider === "retell"
                  ? "bg-[var(--color-main-accent)]/20 border-[var(--color-main-accent)]/50 shadow-lg"
                  : "bg-white/5 border-white/20 hover:bg-white/8 hover:border-white/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-white/90 font-medium">Retell</div>
                <span className={`px-2 py-0.5 text-xs rounded-full border ${
                  (providerStatus?.retell ?? "disconnected") === "connected"
                    ? "bg-[var(--color-grassy-green)]/20 text-[var(--color-grassy-green)] border-[var(--color-grassy-green)]/30"
                    : "bg-[var(--color-error-red)]/20 text-[var(--color-error-red)] border-[var(--color-error-red)]/30"
                }`}>
                  {(providerStatus?.retell ?? "disconnected") === "connected" ? "Connected" : "Disconnected"}
                </span>
              </div>
            </button>

            {/* LiveKit Cloud */}
            <button
              onClick={() => selectCard("livekit")}
              className={`p-4 rounded-xl border transition-all duration-300 text-left ${
                provider === "livekit"
                  ? "bg-[var(--color-main-accent)]/20 border-[var(--color-main-accent)]/50 shadow-lg"
                  : "bg-white/5 border-white/20 hover:bg-white/8 hover:border-white/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-white/90 font-medium">LiveKit</div>
                <span className={`px-2 py-0.5 text-xs rounded-full border ${
                  (providerStatus?.livekit ?? "disconnected") === "connected"
                    ? "bg-[var(--color-grassy-green)]/20 text-[var(--color-grassy-green)] border-[var(--color-grassy-green)]/30"
                    : "bg-[var(--color-error-red)]/20 text-[var(--color-error-red)] border-[var(--color-error-red)]/30"
                }`}>
                  {(providerStatus?.livekit ?? "disconnected") === "connected" ? "Connected" : "Disconnected"}
                </span>
              </div>
            </button>
          </div>
          {provider && (
            <div className="mt-4">
              <div className="text-white/80 text-sm mb-2">Select an agent to import</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {mockAgentsByProvider[provider].map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setSelectedAgentId(a.id)}
                    className={`p-3 rounded-lg border text-left transition-all duration-300 ${
                      selectedAgentId === a.id
                        ? "bg-[var(--color-main-accent)]/20 border-[var(--color-main-accent)]/50"
                        : "bg-white/5 border-white/20 hover:bg-white/8 hover:border-white/30"
                    }`}
                  >
                    <div className="text-white/90 text-sm font-medium">{a.name}</div>
                    <div className="text-white/50 text-xs mt-0.5 truncate">{a.id}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
          <button onClick={onClose} className="px-4 py-2 text-white/70 hover:text-white transition-colors">
            Cancel
          </button>
          <button
            onClick={() => provider && selectedAgentId && onSelect({ provider, agentId: selectedAgentId })}
            disabled={!provider || !selectedAgentId}
            className="px-6 py-2 bg-[var(--color-main-accent)]/20 hover:bg-[var(--color-main-accent)]/30 border border-[var(--color-main-accent)]/30 hover:border-[var(--color-main-accent)]/50 rounded-xl text-[var(--color-main-accent)] font-medium transition-all duration-300 disabled:opacity-50"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
}


