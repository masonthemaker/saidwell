"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import FilesMainContent from "./FilesMainContent";
import TopBar from "@/components/dash/TopBar";
import ParallaxBackground from "@/components/ParallaxBackground";

export default function FilesDashboard() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  return (
    <div className="min-h-screen w-full bg-app-bg relative">
      <Sidebar isExpanded={isNavExpanded} setIsExpanded={setIsNavExpanded} />
      <TopBar isNavExpanded={isNavExpanded} pageName="Files" />
      <FilesMainContent isNavExpanded={isNavExpanded} />
      <ParallaxBackground />
    </div>
  );
}
