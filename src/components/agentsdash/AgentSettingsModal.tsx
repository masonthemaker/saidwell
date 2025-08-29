"use client";

import { useEffect, useMemo, useState } from "react";
import { 
  PiXDuotone,
  PiFinnTheHumanBold,
  PiAddressBookDuotone,
  PiCurrencyDollarDuotone,
  PiClockDuotone,
  PiTargetDuotone
} from "react-icons/pi";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface AgentSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: { clientId: string | null; pricingModel: "per_minute" | "per_outcome"; rate: number }) => void;
  agentName: string;
  currentClientId: string | null;
  clients: { id: string; name: string }[];
  currentPricing?: { model: "per_minute" | "per_outcome"; rate: number };
}

export default function AgentSettingsModal({
  isOpen,
  onClose,
  onSave,
  agentName,
  currentClientId,
  clients,
  currentPricing,
}: AgentSettingsModalProps) {
  const [clientId, setClientId] = useState<string | null>(currentClientId ?? null);
  const [pricingModel, setPricingModel] = useState<"per_minute" | "per_outcome">(currentPricing?.model ?? "per_minute");
  const [rate, setRate] = useState<number>(currentPricing?.rate ?? 0);

  useEffect(() => {
    setClientId(currentClientId ?? null);
  }, [currentClientId]);

  useEffect(() => {
    if (currentPricing) {
      setPricingModel(currentPricing.model);
      setRate(currentPricing.rate);
    }
  }, [currentPricing]);

  const canSave = useMemo(() => rate >= 0, [rate]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!canSave) return;
    onSave({ clientId, pricingModel, rate });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-5xl mx-4 bg-white/20 backdrop-blur-xl backdrop-saturate-150 rounded-2xl border border-white/30 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[var(--color-sky-blue)]/20 rounded-xl">
              <PiFinnTheHumanBold className="w-6 h-6 text-[var(--color-sky-blue)]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{agentName}</h2>
              <p className="text-sm text-white/60">Agent Details & Settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            aria-label="Close"
          >
            <PiXDuotone className="w-6 h-6 text-white/70 hover:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Assignment Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <PiAddressBookDuotone className="w-6 h-6 text-white/70" />
              <h3 className="text-lg font-medium text-white">Assignment</h3>
            </div>

            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <label className="text-white/70 text-sm">Assigned Client</label>
              <div className="mt-2">
                <Select value={clientId ?? "none"} onValueChange={(v) => setClientId(v === "none" ? null : v)}>
                  <SelectTrigger className="w-full bg-white/10 hover:bg-white/15 border-white/20 text-white/90 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-main-accent)]/50 focus:border-[var(--color-main-accent)]/40">
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/10 backdrop-blur-xl backdrop-saturate-150 border border-white/20 text-white/90 shadow-xl">
                    <SelectItem value="none">Unassigned</SelectItem>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Pricing Configuration */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <PiCurrencyDollarDuotone className="w-6 h-6 text-[var(--color-main-accent)]" />
              <h3 className="text-lg font-medium text-white">Pricing Configuration</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Per Minute Option */}
              <div 
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                  pricingModel === 'per_minute'
                    ? 'bg-[var(--color-main-accent)]/20 border-[var(--color-main-accent)]/50 shadow-lg'
                    : 'bg-white/5 border-white/20 hover:bg-white/8 hover:border-white/30'
                }`}
                onClick={() => setPricingModel('per_minute')}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${
                    pricingModel === 'per_minute' ? 'bg-[var(--color-main-accent)]/30' : 'bg-white/10'
                  }`}>
                    <PiClockDuotone className={`w-5 h-5 ${
                      pricingModel === 'per_minute' ? 'text-[var(--color-main-accent)]' : 'text-white/60'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Per Minute</h4>
                    <p className="text-xs text-white/60">Charge based on call duration</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-white/70">Rate per minute ($)</label>
                  <Input
                    type="number"
                    step={0.01}
                    min={0}
                    value={Number.isNaN(rate) ? 0 : rate}
                    onChange={(e) => setRate(parseFloat(e.target.value))}
                    className="w-full bg-white/10 border-white/20 text-white/90 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-main-accent)]/50 focus:border-[var(--color-main-accent)]/40"
                    aria-label="Per minute rate"
                  />
                </div>
              </div>

              {/* Outcome Based Option */}
              <div 
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                  pricingModel === 'per_outcome'
                    ? 'bg-[var(--color-main-accent)]/20 border-[var(--color-main-accent)]/50 shadow-lg'
                    : 'bg-white/5 border-white/20 hover:bg-white/8 hover:border-white/30'
                }`}
                onClick={() => setPricingModel('per_outcome')}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${
                    pricingModel === 'per_outcome' ? 'bg-[var(--color-main-accent)]/30' : 'bg-white/10'
                  }`}>
                    <PiTargetDuotone className={`w-5 h-5 ${
                      pricingModel === 'per_outcome' ? 'text-[var(--color-main-accent)]' : 'text-white/60'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Outcome Based</h4>
                    <p className="text-xs text-white/60">Charge based on successful outcomes</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-white/70">Rate per outcome ($)</label>
                  <Input
                    type="number"
                    step={0.01}
                    min={0}
                    value={Number.isNaN(rate) ? 0 : rate}
                    onChange={(e) => setRate(parseFloat(e.target.value))}
                    className="w-full bg-white/10 border-white/20 text-white/90 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-main-accent)]/50 focus:border-[var(--color-main-accent)]/40"
                    aria-label="Per outcome rate"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Current Configuration Summary */}
          <div className="p-4 bg-[var(--color-main-accent)]/10 border border-[var(--color-main-accent)]/20 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 bg-[var(--color-main-accent)] rounded-full"></span>
              <span className="text-sm font-medium text-[var(--color-main-accent)]">Active Pricing Model</span>
            </div>
            <p className="text-white">
              {pricingModel === 'per_minute' 
                ? `Per Minute: $${(Number.isNaN(rate) ? 0 : rate).toFixed(2)}/min`
                : `Outcome Based: $${(Number.isNaN(rate) ? 0 : rate).toFixed(2)}/outcome`}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white/70 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="px-6 py-2 bg-[var(--color-main-accent)]/20 hover:bg-[var(--color-main-accent)]/30 border border-[var(--color-main-accent)]/30 hover:border-[var(--color-main-accent)]/50 rounded-xl text-[var(--color-main-accent)] font-medium transition-all duration-300 disabled:opacity-50"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}


