"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import MainContent from "./MainContent";
import TopBar from "./TopBar";
import ParallaxBackground from "@/components/ParallaxBackground";

export default function Dashboard() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  return (
    <div className="min-h-screen w-full bg-app-bg relative">
      <Sidebar isExpanded={isNavExpanded} setIsExpanded={setIsNavExpanded} />
      <TopBar isNavExpanded={isNavExpanded} pageName="Dashboard" />
      <MainContent isNavExpanded={isNavExpanded} />
      <ParallaxBackground />
    </div>
  );
}
