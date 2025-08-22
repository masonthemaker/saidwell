"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import MainContent from "./MainContent";
import TopBar from "./TopBar";
import ParallaxBackground from "@/components/ParallaxBackground";
import { useAuth } from "@/hooks/useAuth/useAuth";

export default function Dashboard() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const { context } = useAuth();

  const clientName = context?.activeContext?.name || "Client";
  const isClientView = context?.activeContext?.type === 'client' || context?.type === 'client';

  return (
    <div className="min-h-screen w-full bg-app-bg relative">
      <Sidebar isExpanded={isNavExpanded} setIsExpanded={setIsNavExpanded} />
      <TopBar 
        isNavExpanded={isNavExpanded} 
        pageName={isClientView ? `${clientName} Dashboard` : "Dashboard"} 
      />
      <MainContent isNavExpanded={isNavExpanded} />
      <ParallaxBackground />
    </div>
  );
}
