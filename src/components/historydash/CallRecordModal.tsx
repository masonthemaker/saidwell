"use client";

import { useState } from "react";
import { PiXDuotone, PiPlayDuotone, PiPauseDuotone, PiDownloadDuotone, PiClockDuotone, PiPhoneDuotone } from "react-icons/pi";
import { CallRecordData } from "./CallRecord";

interface TranscriptMessage {
  id: string;
  speaker: 'assistant' | 'caller';
  timestamp: string;
  message: string;
}

interface CallRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: CallRecordData | null;
  transcript?: TranscriptMessage[];
}

export default function CallRecordModal({ isOpen, onClose, record, transcript = [] }: CallRecordModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("00:00");

  if (!isOpen || !record) return null;

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

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    // TODO: Implement actual audio playback
  };

  const handleDownload = () => {
    // TODO: Implement actual download functionality
    console.log(`Downloading transcript for record ${record.id}`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl backdrop-saturate-150 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-2xl font-semibold text-white/90">{record.title}</h2>
                <span className={`px-3 py-1 text-xs bg-${getTypeColor(record.type)}/20 text-${getTypeColor(record.type)} border border-${getTypeColor(record.type)}/30 rounded-full`}>
                  {record.type}
                </span>
                <span className={`px-3 py-1 text-xs bg-${getStatusColor(record.status)}/20 text-${getStatusColor(record.status)} border border-${getStatusColor(record.status)}/30 rounded-full`}>
                  {record.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2 text-white/60">
                  <PiClockDuotone className="w-4 h-4" />
                  <span>Duration: {record.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <PiPhoneDuotone className="w-4 h-4" />
                  <span>{record.type === 'Outbound' ? 'Client' : 'Caller'}: {record.caller}</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <span>Cost: {record.cost}</span>
                </div>
                <div className="text-white/50">
                  {record.date} • Agent: {record.agent}
                </div>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 hover:border-white/30 transition-all duration-300 ml-4"
            >
              <PiXDuotone className="w-5 h-5 text-white/70" />
            </button>
          </div>
        </div>

        {/* Audio Controls */}
        <div className="p-6 bg-white/5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlayback}
                className="group p-4 bg-[var(--color-sky-blue)]/20 hover:bg-[var(--color-sky-blue)]/40 rounded-xl border border-[var(--color-sky-blue)]/30 hover:border-[var(--color-sky-blue)]/60 transition-all duration-300"
              >
                {isPlaying ? (
                  <PiPauseDuotone className="w-6 h-6 text-[var(--color-sky-blue)] group-hover:brightness-125 transition-all duration-300" />
                ) : (
                  <PiPlayDuotone className="w-6 h-6 text-[var(--color-sky-blue)] group-hover:brightness-125 transition-all duration-300" />
                )}
              </button>
              
              <div className="flex flex-col">
                <div className="text-sm font-medium text-white/90">
                  {isPlaying ? "Playing" : "Paused"} • {currentTime} / {record.duration}
                </div>
                <div className="text-xs text-white/60">Call Recording Audio</div>
              </div>
            </div>
            
            <button
              onClick={handleDownload}
              className="group flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 hover:border-white/30 transition-all duration-300"
            >
              <PiDownloadDuotone className="w-4 h-4 text-white/70 group-hover:text-white transition-all duration-300" />
              <span className="text-sm text-white/70 group-hover:text-white">Download</span>
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-white/10 rounded-full h-2">
              <div className="bg-[var(--color-sky-blue)] h-2 rounded-full w-1/3 transition-all duration-300"></div>
            </div>
          </div>
        </div>

        {/* Transcript */}
        <div className="flex-1 overflow-y-auto max-h-96 scrollbar-hide">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white/90 mb-4">Call Transcript</h3>
            
            {transcript.length > 0 ? (
              <div className="space-y-4">
                {transcript.map((message) => (
                  <div key={message.id} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                        message.speaker === 'assistant' 
                          ? 'bg-[var(--color-main-accent)]/20 text-[var(--color-main-accent)]' 
                          : 'bg-[var(--color-hover-pink)]/20 text-[var(--color-hover-pink)]'
                      }`}>
                        {message.speaker === 'assistant' ? 'AI' : 'C'}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-white/90 capitalize">
                          {message.speaker === 'assistant' ? 'AI Assistant' : 'Customer'}
                        </span>
                        <span className="text-xs text-white/50">{message.timestamp}</span>
                      </div>
                      <div className="text-sm text-white/80 leading-relaxed">
                        {message.message}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-white/50 mb-2">No transcript available</p>
                <p className="text-xs text-white/40">Transcript will be generated automatically for future calls</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
