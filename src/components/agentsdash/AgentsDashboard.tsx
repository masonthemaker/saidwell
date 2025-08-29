"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/dash/TopBar";
import ParallaxBackground from "@/components/ParallaxBackground";
import AgentsMainContent from "@/components/agentsdash/AgentsMainContent";

export default function AgentsDashboard() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  return (
    <div className="min-h-screen w-full bg-app-bg relative">
      <Sidebar isExpanded={isNavExpanded} setIsExpanded={setIsNavExpanded} />
      <TopBar isNavExpanded={isNavExpanded} pageName="Agents" />
      <AgentsMainContent isNavExpanded={isNavExpanded} />
      <ParallaxBackground />
    </div>
  );
}


