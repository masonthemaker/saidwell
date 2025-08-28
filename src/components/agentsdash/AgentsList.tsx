"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PiFinnTheHumanBold } from "react-icons/pi";
import AgentSettingsModal from "./AgentSettingsModal";

export interface AgentListItem {
  id: string;
  name: string;
  platform_name: string;
  client_id?: string | null;
  client_name?: string | null;
}

interface AgentsListProps {
  agents: AgentListItem[];
  clients: { id: string; name: string }[];
}

export default function AgentsList({ agents, clients }: AgentsListProps) {
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeAgent = useMemo(() => agents.find(a => a.id === activeAgentId) ?? null, [agents, activeAgentId]);

  const openSettings = (agentId: string) => {
    setActiveAgentId(agentId);
    setIsModalOpen(true);
  };

  const handleSave = (_values: { clientId: string | null; pricingModel: "per_minute" | "per_outcome"; rate: number }) => {
    // placeholder; to be wired to API later
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {agents.map((agent) => (
        <Card
          key={agent.id}
          className="bg-white/5 border-white/10 cursor-pointer hover:bg-white/8 hover:border-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-main-accent)]/40"
          role="button"
          tabIndex={0}
          onClick={() => openSettings(agent.id)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openSettings(agent.id);
            }
          }}
        >
          <CardHeader className="flex items-start justify-start gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[var(--color-sky-blue)]/20 rounded-lg border border-[var(--color-sky-blue)]/30">
                <PiFinnTheHumanBold className="w-5 h-5 text-[var(--color-sky-blue)]" />
              </div>
              <div>
                <CardTitle className="text-white/90 text-base">{agent.name}</CardTitle>
                <CardDescription className="text-white/60 text-xs">{agent.platform_name}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <div className="text-white/60 text-sm">
                <span className="text-white/50">Client:</span> {agent.client_name ?? "Unassigned"}
              </div>
              <span
                className={`px-2 py-0.5 text-xs rounded-full border ${
                  agent.client_name
                    ? "bg-[var(--color-grassy-green)]/20 text-[var(--color-grassy-green)] border-[var(--color-grassy-green)]/30"
                    : "bg-[var(--color-error-red)]/20 text-[var(--color-error-red)] border-[var(--color-error-red)]/30"
                }`}
              >
                {agent.client_name ? "Assigned" : "Unassigned"}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}

      {activeAgent && (
        <AgentSettingsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          agentName={activeAgent.name}
          currentClientId={activeAgent.client_id ?? null}
          clients={clients}
          currentPricing={{ model: "per_minute", rate: 0.25 }}
        />
      )}
    </div>
  );
}


