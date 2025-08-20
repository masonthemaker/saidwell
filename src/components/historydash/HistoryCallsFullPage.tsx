"use client";

import { useState } from "react";
import { PiPlayDuotone, PiDownloadDuotone, PiClockDuotone, PiPhoneDuotone, PiMagnifyingGlassDuotone } from "react-icons/pi";
import DatePicker from "./DatePicker";
import CallRecord, { CallRecordData } from "./CallRecord";
import CallRecordModal from "./CallRecordModal";

export default function HistoryCallsFullPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("30 days");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [visibleRecords, setVisibleRecords] = useState(4);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<CallRecordData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const timePeriods = [
    { label: "7 days", value: "7 days" },
    { label: "30 days", value: "30 days" },
    { label: "3 months", value: "3 months" }
  ];

  const allCallRecords: CallRecordData[] = [
    {
      id: 1,
      title: "Customer Support - Product Issue Resolution",
      type: "Support",
      status: "Resolved",
      duration: "15:32",
      caller: "+1 (555) 123-4567",
      cost: "$12.45",
      date: "Today, 2:30 PM",
      agent: "Sarah Johnson"
    },
    {
      id: 2,
      title: "Outbound Sales Call - Follow Up Meeting",
      type: "Outbound",
      status: "Completed",
      duration: "23:45",
      caller: "+1 (555) 987-6543",
      cost: "$18.92",
      date: "Today, 1:45 PM",
      agent: "Michael Chen"
    },
    {
      id: 3,
      title: "Front Desk - New Customer Onboarding",
      type: "Front Desk",
      status: "In Progress",
      duration: "8:12",
      caller: "+1 (555) 456-7890",
      cost: "$6.78",
      date: "Today, 12:15 PM",
      agent: "Emma Rodriguez"
    },
    {
      id: 4,
      title: "Technical Support - System Integration Help",
      type: "Support",
      status: "Resolved",
      duration: "31:07",
      caller: "+1 (555) 111-2222",
      cost: "$24.83",
      date: "Yesterday, 4:20 PM",
      agent: "David Kim"
    },
    {
      id: 5,
      title: "Sales Inquiry - Product Demo Request",
      type: "Outbound",
      status: "Scheduled",
      duration: "12:34",
      caller: "+1 (555) 333-4444",
      cost: "$9.67",
      date: "Yesterday, 2:15 PM",
      agent: "Lisa Thompson"
    }
  ];

  const handleLoadMore = async () => {
    setIsLoading(true);
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setVisibleRecords(prev => Math.min(prev + 2, allCallRecords.length));
    setIsLoading(false);
  };

  // Sample transcript data for the first call (Product Issue Resolution)
  const sampleTranscript = [
    {
      id: "1",
      speaker: "assistant" as const,
      timestamp: "00:00",
      message: "Hello! Thank you for calling our support line. I'm Sarah, your AI assistant. I see you're calling from +1 (555) 123-4567. How can I help you today?"
    },
    {
      id: "2",
      speaker: "caller" as const,
      timestamp: "00:12",
      message: "Hi Sarah, I'm having trouble with the product I purchased last week. It's not working properly and I'm getting error messages when I try to use it."
    },
    {
      id: "3",
      speaker: "assistant" as const,
      timestamp: "00:28",
      message: "I'm sorry to hear you're experiencing issues with your recent purchase. I'd be happy to help resolve this for you. Can you tell me what specific error messages you're seeing?"
    },
    {
      id: "4",
      speaker: "caller" as const,
      timestamp: "00:45",
      message: "It says 'Connection failed - please check your network settings' but my internet is working fine. I've tried restarting the device multiple times."
    },
    {
      id: "5",
      speaker: "assistant" as const,
      timestamp: "01:02",
      message: "That error message typically indicates a configuration issue rather than a network problem. Let me walk you through some troubleshooting steps. First, can you confirm which model you purchased?"
    },
    {
      id: "6",
      speaker: "caller" as const,
      timestamp: "01:18",
      message: "It's the Pro model, the blue one. I have the order number if that helps - it's #SP-2024-0847."
    },
    {
      id: "7",
      speaker: "assistant" as const,
      timestamp: "01:32",
      message: "Perfect, thank you for that information. I can see your order here. For the Pro model, this issue is usually resolved by updating the firmware. Can you access the settings menu on the device?"
    },
    {
      id: "8",
      speaker: "caller" as const,
      timestamp: "01:48",
      message: "Yes, I can see the settings menu. There are several options here."
    },
    {
      id: "9",
      speaker: "assistant" as const,
      timestamp: "01:55",
      message: "Great! Look for an option called 'System Update' or 'Firmware Update'. It should be in the general settings section. Do you see that?"
    },
    {
      id: "10",
      speaker: "caller" as const,
      timestamp: "02:08",
      message: "Yes! I found 'System Update'. It says there's an update available. Should I install it?"
    },
    {
      id: "11",
      speaker: "assistant" as const,
      timestamp: "02:18",
      message: "Absolutely! Please go ahead and install that update. This will likely resolve the connection issues you've been experiencing. The update process usually takes about 3-5 minutes."
    },
    {
      id: "12",
      speaker: "caller" as const,
      timestamp: "02:35",
      message: "Okay, I've started the update. It's showing a progress bar... looks like it's about halfway done."
    },
    {
      id: "13",
      speaker: "assistant" as const,
      timestamp: "02:45",
      message: "Perfect! While we wait for that to complete, I'll make a note in your account about this issue and the solution. Is there anything else I can help you with today?"
    },
    {
      id: "14",
      speaker: "caller" as const,
      timestamp: "02:58",
      message: "The update just finished! Let me try using the device now... Oh wow, it's working perfectly! The error message is gone. Thank you so much, Sarah!"
    },
    {
      id: "15",
      speaker: "assistant" as const,
      timestamp: "03:15",
      message: "That's wonderful to hear! I'm so glad we could resolve this quickly for you. The firmware update should prevent this issue from occurring again. Is there anything else I can assist you with today?"
    },
    {
      id: "16",
      speaker: "caller" as const,
      timestamp: "03:28",
      message: "No, that was exactly what I needed. You've been incredibly helpful. Have a great day!"
    },
    {
      id: "17",
      speaker: "assistant" as const,
      timestamp: "03:35",
      message: "You're very welcome! I'm happy I could help resolve your issue. Thank you for choosing our products, and don't hesitate to call if you need any further assistance. Have a wonderful day!"
    }
  ];

  const handleViewRecord = (recordId: number) => {
    const record = allCallRecords.find(r => r.id === recordId);
    if (record) {
      setSelectedRecord(record);
      setIsModalOpen(true);
    }
  };

  const handleDownloadRecord = (recordId: number) => {
    console.log(`Downloading record ${recordId}`);
    // TODO: Implement download functionality when connected to database
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
  };

  const getTranscriptForRecord = (recordId: number) => {
    // Only return transcript for the first record (Product Issue Resolution)
    return recordId === 1 ? sampleTranscript : [];
  };

  return (
    <div className="h-full space-y-6">
      {/* Header Section */}
      <div className="bg-white/3 backdrop-blur-xl border border-white/5 backdrop-saturate-150 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-white/90 mb-2">
              Call History
            </h1>
            <p className="text-lg text-white/60">
              Complete archive of all call recordings and details
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-white/50 mb-2">Total Cost</div>
            <div className="text-3xl font-bold text-[var(--color-main-accent)] mb-1">$1,247.89</div>
            <div className="text-xs text-white/50">This month</div>
          </div>
        </div>

        {/* Time Period Selector */}
        <div className="mt-6 mb-6">
          <div className="flex flex-wrap gap-2">
            {timePeriods.map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                  ${selectedPeriod === period.value
                    ? 'bg-[var(--color-main-accent)]/20 text-[var(--color-main-accent)] border border-[var(--color-main-accent)]/40'
                    : 'bg-white/5 text-white/70 border border-white/20 hover:bg-white/10 hover:border-white/30 hover:text-white/90'
                  }
                `}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[var(--color-main-accent)]/20 rounded-lg">
                <PiPhoneDuotone className="w-5 h-5 text-[var(--color-main-accent)]" />
              </div>
              <div>
                <div className="text-lg font-semibold text-white/90">147</div>
                <div className="text-xs text-white/50">Total Calls</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[var(--color-grassy-green)]/20 rounded-lg">
                <PiClockDuotone className="w-5 h-5 text-[var(--color-grassy-green)]" />
              </div>
              <div>
                <div className="text-lg font-semibold text-white/90">42h 15m</div>
                <div className="text-xs text-white/50">Total Duration</div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[var(--color-sky-blue)]/20 rounded-lg">
                <PiPlayDuotone className="w-5 h-5 text-[var(--color-sky-blue)]" />
              </div>
              <div>
                <div className="text-lg font-semibold text-white/90">89%</div>
                <div className="text-xs text-white/50">Success Rate</div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[var(--color-hover-pink)]/20 rounded-lg">
                <PiDownloadDuotone className="w-5 h-5 text-[var(--color-hover-pink)]" />
              </div>
              <div>
                <div className="text-lg font-semibold text-white/90">$8.49</div>
                <div className="text-xs text-white/50">Avg. Cost</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call Records Grid */}
      <div className="bg-white/3 backdrop-blur-xl border border-white/5 backdrop-saturate-150 rounded-2xl p-6 flex-1">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-semibold text-white/90 mb-2">Recent Recordings</h2>
              <p className="text-sm text-white/60">Click play to listen to any recording</p>
            </div>
            
            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3 min-w-0 sm:min-w-96">
              {/* Search Bar */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PiMagnifyingGlassDuotone className="h-4 w-4 text-white/50" />
                </div>
                <input
                  type="text"
                  placeholder="Search recordings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="
                    w-full pl-10 pr-4 py-2.5
                    bg-white/5 
                    border border-white/20 
                    rounded-lg
                    text-white/90
                    placeholder-white/50
                    text-sm
                    focus:outline-none 
                    focus:ring-2 
                    focus:ring-[var(--color-main-accent)]/50
                    focus:border-[var(--color-main-accent)]/40
                    transition-all duration-300
                    backdrop-blur-sm
                  "
                />
              </div>
              
              {/* Date Picker */}
              <div className="w-full sm:w-48">
                <DatePicker
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                  placeholder="Filter by date..."
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {allCallRecords.slice(0, visibleRecords).map((record) => (
            <CallRecord 
              key={record.id} 
              record={record}
              onView={handleViewRecord}
              onDownload={handleDownloadRecord}
            />
          ))}
        </div>
        
        {/* Load More Button */}
        {visibleRecords < allCallRecords.length && (
          <div className="mt-8 pt-6 border-t border-white/10">
            <button 
              onClick={handleLoadMore}
              disabled={isLoading}
              className="w-full py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Loading..." : `Load more recordings (${allCallRecords.length - visibleRecords} remaining) →`}
            </button>
          </div>
        )}
        
        {visibleRecords >= allCallRecords.length && (
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-white/50">All recordings loaded</p>
          </div>
        )}
      </div>

      {/* Call Record Modal */}
      <CallRecordModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        record={selectedRecord}
        transcript={selectedRecord ? getTranscriptForRecord(selectedRecord.id) : []}
      />
    </div>
  );
}
