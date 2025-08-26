"use client";

import React from "react";
import { ChartAreaInteractive } from "@/components/charts/ChartAreaInteractive";
import BentoBoxOne from "./BentoBoxOne";
import BentoBoxTwo from "./BentoBoxTwo";

interface MainContentProps {
  isNavExpanded: boolean;
}

export default function MainContent({ isNavExpanded }: MainContentProps) {
  
  return (
    <main 
      className={`
        absolute top-22 right-6 bottom-6
        ${isNavExpanded ? 'left-54' : 'left-22'} 
        transition-all duration-500 ease-out
        p-6
        bg-white/3 
        backdrop-blur-xl 
        border border-white/5
        rounded-2xl
        backdrop-saturate-150
        overflow-y-auto scrollbar-hide
      `}
    >
      <div className="space-y-6">
        {/* Chart at the top */}
        <ChartAreaInteractive />
        
        {/* Bento boxes below the chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BentoBoxOne />
          <BentoBoxTwo />
        </div>
      </div>
    </main>
  );
}
