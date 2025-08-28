"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AgentsMainContentProps {
  isNavExpanded: boolean;
}

export default function AgentsMainContent({ isNavExpanded }: AgentsMainContentProps) {
  const mockAgents = [
    { id: "a1", name: "Front Desk Alpha", platform_name: "Vapi", client_id: "c1", client_name: "Acme Dental" },
    { id: "a2", name: "Outbound Gamma", platform_name: "Vapi", client_id: null, client_name: null },
    { id: "a3", name: "Support Delta", platform_name: "Vapi", client_id: "c2", client_name: "HomeCo" },
  ];
  const mockClients = [
    { id: "c1", name: "Acme Dental" },
    { id: "c2", name: "HomeCo" },
    { id: "c3", name: "Northwind" },
  ];

  const AgentsList = require("@/components/agentsdash/AgentsList").default;
  const [clientFilter, setClientFilter] = useState<string>("all");

  const filteredAgents =
    clientFilter === "all"
      ? mockAgents
      : clientFilter === "none"
      ? mockAgents.filter((a) => !a.client_id)
      : mockAgents.filter((a) => a.client_id === clientFilter);
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
            <h1 className="text-white/90 font-semibold text-xl">Agents</h1>
            <p className="text-white/60 text-sm">Manage voice AI agents assigned to clients.</p>
          </div>
        </div>

        {/* Controls: Filter + Import */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-white/70 text-sm">Filter by client</span>
            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger className="w-56 bg-white/10 hover:bg-white/15 border-white/20 text-white/90 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-main-accent)]/50 focus:border-[var(--color-main-accent)]/40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white/10 backdrop-blur-xl backdrop-saturate-150 border border-white/20 text-white/90 shadow-xl">
                <SelectItem value="all">All clients</SelectItem>
                <SelectItem value="none">Unassigned</SelectItem>
                {mockClients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <button
              onClick={() => {}}
              className="px-4 py-2 border border-[var(--color-main-accent)]/30 rounded-lg bg-[var(--color-main-accent)]/10 hover:bg-[var(--color-main-accent)]/20 text-[var(--color-main-accent)] transition-all duration-300"
            >
              Import Agent
            </button>
          </div>
        </div>

        <AgentsList agents={filteredAgents} clients={mockClients} />
      </div>
    </main>
  );
}


