"use client";

import { PiMagnifyingGlassDuotone } from "react-icons/pi";

interface TopBarProps {
  isNavExpanded: boolean;
  pageName?: string;
}

export default function TopBar({ isNavExpanded, pageName = "Dashboard" }: TopBarProps) {
  return (
    <div 
      className={`
        fixed top-0 right-0 h-16
        ${isNavExpanded ? 'left-48' : 'left-16'} 
        transition-all duration-500 ease-out
        bg-white/3 
        backdrop-blur-xl 
        border-b border-l border-white/5
        backdrop-saturate-150
        flex items-center justify-between px-6
        z-10
      `}
    >
      {/* Page Name */}
      <div>
        <h1 className="text-xl font-semibold text-white/90">
          {pageName}
        </h1>
      </div>

      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <PiMagnifyingGlassDuotone className="h-4 w-4 text-white/50" />
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="
            w-64 pl-10 pr-4 py-2
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
    </div>
  );
}
