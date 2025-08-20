"use client";

import { useState } from "react";
import { PiCalendarDuotone, PiCaretDownDuotone } from "react-icons/pi";

interface DatePickerProps {
  selectedDate?: string;
  onDateChange?: (date: string) => void;
  placeholder?: string;
}

export default function DatePicker({ 
  selectedDate = "", 
  onDateChange = () => {}, 
  placeholder = "Select date..." 
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(selectedDate);

  const handleDateSelect = (date: string) => {
    setCurrentDate(date);
    onDateChange(date);
    setIsOpen(false);
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return placeholder;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const today = new Date();
  const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thisMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const quickOptions = [
    { 
      label: "Today", 
      value: today.toISOString().split('T')[0] 
    },
    { 
      label: "Last 7 days", 
      value: thisWeek.toISOString().split('T')[0] 
    },
    { 
      label: "Last 30 days", 
      value: thisMonth.toISOString().split('T')[0] 
    },
    { 
      label: "Clear", 
      value: "" 
    }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center justify-between
          w-full px-4 py-2.5
          bg-white/5 
          border border-white/20 
          rounded-lg
          text-white/90
          text-sm
          hover:bg-white/10 
          hover:border-white/30
          focus:outline-none 
          focus:ring-2 
          focus:ring-[var(--color-main-accent)]/50
          focus:border-[var(--color-main-accent)]/40
          transition-all duration-300
          backdrop-blur-sm
        "
      >
        <div className="flex items-center gap-2">
          <PiCalendarDuotone className="w-4 h-4 text-white/50" />
          <span className={currentDate ? "text-white/90" : "text-white/50"}>
            {formatDisplayDate(currentDate)}
          </span>
        </div>
        <PiCaretDownDuotone 
          className={`w-4 h-4 text-white/50 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="
            absolute top-full left-0 right-0 mt-2 z-20
            bg-white/10 
            backdrop-blur-xl 
            border border-white/20 
            rounded-lg
            backdrop-saturate-150
            overflow-hidden
            shadow-2xl
          ">
            {/* Quick Options */}
            <div className="p-2">
              <div className="text-xs text-white/50 px-2 py-1 mb-1">Quick Select</div>
              {quickOptions.map((option) => (
                <button
                  key={option.label}
                  onClick={() => handleDateSelect(option.value)}
                  className="
                    w-full text-left px-3 py-2 text-sm
                    text-white/80 hover:text-white
                    hover:bg-white/10
                    rounded-md
                    transition-all duration-200
                  "
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Separator */}
            <div className="border-t border-white/10 mx-2" />

            {/* Custom Date Input */}
            <div className="p-3">
              <div className="text-xs text-white/50 mb-2">Custom Date</div>
              <input
                type="date"
                value={currentDate}
                onChange={(e) => handleDateSelect(e.target.value)}
                className="
                  w-full px-3 py-2
                  bg-white/5 
                  border border-white/20 
                  rounded-md
                  text-white/90
                  text-sm
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-[var(--color-main-accent)]/50
                  focus:border-[var(--color-main-accent)]/40
                  transition-all duration-300
                  backdrop-blur-sm
                  [color-scheme:dark]
                "
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
