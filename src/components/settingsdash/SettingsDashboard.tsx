"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import SettingsMainContent from "./SettingsMainContent";
import TopBar from "@/components/dash/TopBar";
import ParallaxBackground from "@/components/ParallaxBackground";

export default function SettingsDashboard() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);

  return (
    <div className="min-h-screen w-full bg-app-bg relative">
      <Sidebar isExpanded={isNavExpanded} setIsExpanded={setIsNavExpanded} />
      <TopBar isNavExpanded={isNavExpanded} pageName="Settings" />
      <SettingsMainContent isNavExpanded={isNavExpanded} />
      <ParallaxBackground />
    </div>
  );
}
