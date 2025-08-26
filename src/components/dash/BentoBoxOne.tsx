"use client";

import { PiPlayDuotone } from "react-icons/pi";
import Link from "next/link";
import { useCalls } from "@/hooks/use-calls";

export default function BentoBoxOne() {
  const { allCalls, isLoading, error } = useCalls();
  
  // Get recent calls (latest 3)
  const recentCalls = allCalls.slice(0, 3);
  
  // Calculate today's calls total cost
  const today = new Date().toDateString();
  const todaysCalls = allCalls.filter(call => 
    new Date(call.created_at).toDateString() === today
  );
  const todaysTotal = todaysCalls.reduce((sum, call) => sum + (call.cost_cents || 0), 0);
  
  // Helper functions
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Support": return "[var(--color-grassy-green)]";
      case "Outbound": return "[var(--color-hover-pink)]";
      case "Front Desk": return "[var(--color-main-accent)]";
      default: return "[var(--color-sky-blue)]";
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved":
      case "Completed": return "[var(--color-main-accent)]";
      case "In Progress":
      case "Scheduled": return "[var(--color-hover-pink)]";
      default: return "[var(--color-grassy-green)]";
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return "Less than 1 hour ago";
    if (diffHours === 1) return "1 hour ago";
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  return (
    <div className="bg-white/3 backdrop-blur-xl border border-white/5 backdrop-saturate-150 rounded-2xl p-6">
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-white/90 mb-1">
                Call History
              </h3>
              <p className="text-sm text-white/60">
                Recent call recordings and details
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-white/50 mb-1">Today's Total</div>
              <div className="text-lg font-bold text-[var(--color-main-accent)]">
                ${(todaysTotal / 100).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-3 flex-1">
          {isLoading && (
            <div className="text-center py-4">
              <div className="text-sm text-white/50">Loading calls...</div>
            </div>
          )}
          
          {error && (
            <div className="text-center py-4">
              <div className="text-sm text-red-400">Error loading calls</div>
            </div>
          )}
          
          {!isLoading && !error && recentCalls.length === 0 && (
            <div className="text-center py-4">
              <div className="text-sm text-white/50">No calls yet</div>
            </div>
          )}
          
          {!isLoading && !error && recentCalls.map((call) => (
            <div key={call.id} className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-white/90 mb-1 line-clamp-1">{call.title}</h4>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`px-2 py-0.5 text-xs bg-${getTypeColor(call.type)}/20 text-${getTypeColor(call.type)} border border-${getTypeColor(call.type)}/30 rounded-full`}>
                      {call.type}
                    </span>
                    <span className={`px-2 py-0.5 text-xs bg-${getStatusColor(call.status)}/20 text-${getStatusColor(call.status)} border border-${getStatusColor(call.status)}/30 rounded-full`}>
                      {call.status}
                    </span>
                    <span className="px-2 py-0.5 text-xs bg-white/10 text-white/80 border border-white/20 rounded-full">
                      {call.cost_display || `$${((call.cost_cents || 0) / 100).toFixed(2)}`}
                    </span>
                  </div>
                </div>
                <button className="group p-1.5 bg-[var(--color-sky-blue)]/20 hover:bg-[var(--color-sky-blue)]/40 rounded-lg border border-[var(--color-sky-blue)]/30 hover:border-[var(--color-sky-blue)]/60 transition-all duration-300">
                  <PiPlayDuotone className="w-4 h-4 text-[var(--color-sky-blue)] group-hover:text-[var(--color-sky-blue)] group-hover:brightness-125 transition-all duration-300" />
                </button>
              </div>
              <div className="text-xs text-white/50">
                {call.duration_display || `${Math.floor(call.duration_seconds / 60)}:${(call.duration_seconds % 60).toString().padStart(2, '0')}`} • {formatDate(call.created_at)}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-white/10">
          <Link 
            href="/history"
            className="w-full text-sm text-white/70 hover:text-white transition-colors duration-300 block text-center"
          >
            View all recordings →
          </Link>
        </div>
      </div>
    </div>
  );
}