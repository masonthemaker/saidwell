"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import MainContent from "./MainContent";
import ParallaxBackground from "@/components/ParallaxBackground";

export default function Dashboard() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  return (
    <div className="min-h-screen w-full bg-app-bg relative">
      <Sidebar isExpanded={isNavExpanded} setIsExpanded={setIsNavExpanded} />
      <MainContent isNavExpanded={isNavExpanded} />
      <ParallaxBackground />
    </div>
  );
}
