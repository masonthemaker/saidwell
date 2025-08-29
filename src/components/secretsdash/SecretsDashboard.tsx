"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/dash/TopBar";
import ParallaxBackground from "@/components/ParallaxBackground";
import SecretsMainContent from "./SecretsMainContent";

export default function SecretsDashboard() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  return (
    <div className="min-h-screen w-full bg-app-bg relative">
      <Sidebar isExpanded={isNavExpanded} setIsExpanded={setIsNavExpanded} />
      <TopBar isNavExpanded={isNavExpanded} pageName="Secrets" />
      <SecretsMainContent isNavExpanded={isNavExpanded} />
      <ParallaxBackground />
    </div>
  );
}
