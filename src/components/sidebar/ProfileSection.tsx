"use client";

import { FaSignOutAlt, FaBuilding, FaUser } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { AiTwotoneMail } from "react-icons/ai";
import Link from "next/link";

interface ProfileSectionProps {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
}

export default function ProfileSection({ isExpanded, setIsExpanded }: ProfileSectionProps) {
  return (
    <div className="mt-auto mb-2 w-full px-2 relative">
      {/* Divider above Profile - Edge to Edge */}
      {isExpanded ? (
        <div className="absolute left-0 right-0 mb-3">
          <div className="border-t-2 border-dotted border-white/20"></div>
        </div>
      ) : (
        <div className="absolute left-0 right-0 mb-4">
          <div className="border-t border-gray-300/40"></div>
        </div>
      )}
      
      {/* Add top margin to account for absolute positioned divider */}
      <div className="mt-6"></div>
      {isExpanded ? (
        <div className="w-full bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-3 backdrop-saturate-150">
          {/* User Info */}
          <div className="mb-3 flex items-center justify-between">
            <div className="text-xs text-gray-300 font-medium">John Doe</div>
            <Link
              href="/settings"
              aria-label="Settings"
              className="group p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 ease-out"
            >
              <IoSettingsOutline className="w-3 h-3 text-main-accent group-hover:text-hover-pink transition-all duration-300 ease-out" />
            </Link>
          </div>
          
          {/* Company Info and Invite Button */}
          <div className="mb-3 flex items-center gap-2">
            <div className="flex items-center flex-1 p-2 rounded-lg bg-white/5 border border-white/10">
              <FaBuilding className="w-3 h-3 mr-2 text-main-accent" />
              <span className="text-xs text-gray-200 font-medium">Acme Corp</span>
            </div>
            <button 
              aria-label="Invite"
              className="flex items-center justify-center p-2 rounded-lg bg-main-accent/10 border border-main-accent/20 hover:bg-main-accent/20 transition-all duration-300 ease-out"
            >
              <AiTwotoneMail className="w-3 h-3 text-main-accent" />
            </button>
          </div>

          {/* Logout Button */}
          <button className="w-full flex items-center p-2 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-all duration-500 ease-out">
            <FaSignOutAlt className="w-3 h-3 mr-2 text-red-400" />
            <span className="text-xs text-red-400 font-medium">Logout</span>
          </button>
        </div>
      ) : (
        /* Collapsed Profile Button */
        <div className="group w-full flex items-center justify-center p-3 rounded-md bg-white/5 backdrop-blur-xl border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-500 ease-out backdrop-saturate-150">
          <FaUser className="w-5 h-5 text-main-accent group-hover:text-hover-green transition-all duration-500 ease-out" />
        </div>
      )}
    </div>
  );
}
