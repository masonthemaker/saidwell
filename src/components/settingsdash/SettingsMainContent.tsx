"use client";

import TeamSettings from "./TeamSettings";
import AccountSettings from "./AccountSettings";

interface SettingsMainContentProps {
  isNavExpanded: boolean;
}

export default function SettingsMainContent({ isNavExpanded }: SettingsMainContentProps) {
  return (
    <main 
      className={`
        absolute top-22 right-6 bottom-6
        ${isNavExpanded ? 'left-54' : 'left-22'} 
        transition-all duration-500 ease-out
        p-6
        bg-transparent
        overflow-y-auto scrollbar-hide
        flex flex-col
      `}
    >
      <div className="space-y-6">
        {/* Team Settings */}
        <TeamSettings />
        
        {/* Account Settings */}
        <AccountSettings />
      </div>
    </main>
  );
}
