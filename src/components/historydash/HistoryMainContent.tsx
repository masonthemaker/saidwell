"use client";

import HistoryCallsFullPage from "./HistoryCallsFullPage";

interface HistoryMainContentProps {
  isNavExpanded: boolean;
}

export default function HistoryMainContent({ isNavExpanded }: HistoryMainContentProps) {
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
      <HistoryCallsFullPage />
    </main>
  );
}
