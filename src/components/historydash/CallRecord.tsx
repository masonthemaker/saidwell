"use client";

import { PiPlayDuotone, PiDownloadDuotone, PiClockDuotone, PiPhoneDuotone } from "react-icons/pi";

export interface CallRecordData {
  id: number;
  title: string;
  type: string;
  status: string;
  duration: string;
  caller: string;
  cost: string;
  date: string;
  agent: string;
}

interface CallRecordProps {
  record: CallRecordData;
  onView?: (recordId: number) => void;
  onDownload?: (recordId: number) => void;
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
    console.log(`Play clicked for record ${record.id}`);
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload?.(record.id);
  };

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
              <span>Duration: {record.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <PiPhoneDuotone className="w-4 h-4" />
              <span>{record.type === 'Outbound' ? 'Client' : 'Caller'}: {record.caller}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 text-xs bg-white/10 text-white/80 border border-white/20 rounded-full">
                Cost: {record.cost}
              </span>
            </div>
          </div>
          
          <div className="text-xs text-white/50">{record.date} • Agent: {record.agent}</div>
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
