"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import HistoryMainContent from "./HistoryMainContent";
import TopBar from "@/components/dash/TopBar";
import ParallaxBackground from "@/components/ParallaxBackground";

export default function HistoryDashboard() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  return (
    <div className="min-h-screen w-full bg-app-bg relative">
      <Sidebar isExpanded={isNavExpanded} setIsExpanded={setIsNavExpanded} />
      <TopBar isNavExpanded={isNavExpanded} pageName="History" />
      <HistoryMainContent isNavExpanded={isNavExpanded} />
      <ParallaxBackground />
    </div>
  );
}
