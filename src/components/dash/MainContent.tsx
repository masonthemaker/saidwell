"use client";

import React from "react";
import { ChartAreaInteractive } from "@/components/charts/ChartAreaInteractive";
import BentoBoxOne from "./BentoBoxOne";
import BentoBoxTwo from "./BentoBoxTwo";
import useAuth from "@/hooks/use-auth";
import { useAgentAnalytics } from "@/hooks/use-agent-analytics";

interface MainContentProps {
  isNavExpanded: boolean;
}

export default function MainContent({ isNavExpanded }: MainContentProps) {
  // Get hook data without excessive logging
  const auth = useAuth();
  const agentAnalytics = useAgentAnalytics();
  
  // Console log only when data changes (using useEffect)
  React.useEffect(() => {
    if (!auth.isLoading && auth.user) {
      console.log('🔐 Auth Hook Results:', {
        user: auth.user.email,
        roles: auth.roles,
        isOwner: auth.isOwner(),
        isAdmin: auth.isAdmin(),
        currentClient: auth.getCurrentClient()?.name
      });
    }
  }, [auth.isLoading, auth.user, auth.roles]);
  
  React.useEffect(() => {
    if (!agentAnalytics.isLoading && agentAnalytics.chartData.length > 0) {
      console.log('📊 Agent Analytics Hook Results:', {
        totalInteractions: agentAnalytics.totalInteractions,
        agentCount: agentAnalytics.agentCount,
        chartDataPoints: agentAnalytics.chartData.length,
        error: agentAnalytics.error
      });
    }
  }, [agentAnalytics.isLoading, agentAnalytics.chartData, agentAnalytics.totalInteractions]);
  
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
