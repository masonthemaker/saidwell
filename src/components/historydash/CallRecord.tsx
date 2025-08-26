"use client";

import { PiPlayDuotone, PiDownloadDuotone, PiClockDuotone, PiPhoneDuotone } from "react-icons/pi";
import { CallWithDetails } from "@/hooks/use-calls";

interface CallRecordProps {
  record: CallWithDetails;
  onView?: (recordId: string) => void;
  onDownload?: (recordId: string) => void;
}

// Helper function to format date
function formatCallDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();
  
  const timeStr = date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  });
  
  if (isToday) {
    return `Today, ${timeStr}`;
  } else if (isYesterday) {
    return `Yesterday, ${timeStr}`;
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
}

export default function CallRecord({ record, onView, onDownload }: CallRecordProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Resolved":
      case "Completed":
        return "[var(--color-main-accent)]";
      case "In Progress":
      case "Scheduled":
        return "[var(--color-hover-pink)]";
      default:
        return "[var(--color-grassy-green)]";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Support":
        return "[var(--color-grassy-green)]";
      case "Outbound":
        return "[var(--color-hover-pink)]";
      case "Front Desk":
        return "[var(--color-main-accent)]";
      default:
        return "[var(--color-sky-blue)]";
    }
  };

  const handleView = () => {
    onView?.(record.id);
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Play functionality will be handled in the modal
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload?.(record.id);
  };

  // Get caller info (prefer name over phone)
  const callerInfo = record.caller_name || record.caller_phone || 'Unknown Caller';
  const formattedDate = formatCallDate(record.created_at);

  return (
    <div 
      onClick={handleView}
      className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/8 hover:border-white/20 transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-lg font-medium text-white/90">{record.title}</h3>
            <span className={`px-3 py-1 text-xs bg-${getTypeColor(record.type)}/20 text-${getTypeColor(record.type)} border border-${getTypeColor(record.type)}/30 rounded-full`}>
              {record.type}
            </span>
            <span className={`px-3 py-1 text-xs bg-${getStatusColor(record.status)}/20 text-${getStatusColor(record.status)} border border-${getStatusColor(record.status)}/30 rounded-full`}>
              {record.status}
            </span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-white/60 mb-2">
            <div className="flex items-center gap-2">
              <PiClockDuotone className="w-4 h-4" />
              <span>Duration: {record.duration_display || `${Math.floor(record.duration_seconds / 60)}:${(record.duration_seconds % 60).toString().padStart(2, '0')}`}</span>
            </div>
            <div className="flex items-center gap-2">
              <PiPhoneDuotone className="w-4 h-4" />
              <span>{record.type === 'Outbound' ? 'Client' : 'Caller'}: {callerInfo}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 text-xs bg-white/10 text-white/80 border border-white/20 rounded-full">
                Cost: {record.cost_display || `$${((record.cost_cents || 0) / 100).toFixed(2)}`}
              </span>
            </div>
          </div>
          
          <div className="text-xs text-white/50">{formattedDate} • Agent: {record.agent_name}</div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <button 
            onClick={handlePlayClick}
            className="group p-3 bg-[var(--color-sky-blue)]/20 hover:bg-[var(--color-sky-blue)]/40 rounded-xl border border-[var(--color-sky-blue)]/30 hover:border-[var(--color-sky-blue)]/60 transition-all duration-300"
            aria-label={`Play recording: ${record.title}`}
          >
            <PiPlayDuotone className="w-5 h-5 text-[var(--color-sky-blue)] group-hover:brightness-125 transition-all duration-300" />
          </button>
          <button 
            onClick={handleDownloadClick}
            className="group p-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 hover:border-white/30 transition-all duration-300"
            aria-label={`Download recording: ${record.title}`}
          >
            <PiDownloadDuotone className="w-5 h-5 text-white/70 group-hover:text-white transition-all duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
}
