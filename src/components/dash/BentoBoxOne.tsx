"use client";

import { PiPlayDuotone } from "react-icons/pi";
import Link from "next/link";

export default function BentoBoxOne() {
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
              <div className="text-xs text-white/50 mb-1">Today&apos;s Total</div>
              <div className="text-lg font-bold text-[var(--color-main-accent)]">$47.23</div>
            </div>
          </div>
        </div>
        
        <div className="space-y-3 flex-1">
          <div className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-white/90 mb-1">Customer Support - Product Issue</h4>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 text-xs bg-[var(--color-grassy-green)]/20 text-[var(--color-grassy-green)] border border-[var(--color-grassy-green)]/30 rounded-full">
                    Support
                  </span>
                  <span className="px-2 py-0.5 text-xs bg-[var(--color-main-accent)]/20 text-[var(--color-main-accent)] border border-[var(--color-main-accent)]/30 rounded-full">
                    Resolved
                  </span>
                  <span className="px-2 py-0.5 text-xs bg-white/10 text-white/80 border border-white/20 rounded-full">
                    $1.24
                  </span>
                </div>
              </div>
              <button className="group p-1.5 bg-[var(--color-sky-blue)]/20 hover:bg-[var(--color-sky-blue)]/40 rounded-lg border border-[var(--color-sky-blue)]/30 hover:border-[var(--color-sky-blue)]/60 transition-all duration-300">
                <PiPlayDuotone className="w-4 h-4 text-[var(--color-sky-blue)] group-hover:text-[var(--color-sky-blue)] group-hover:brightness-125 transition-all duration-300" />
              </button>
            </div>
            <div className="text-xs text-white/50">3:42 • 15 minutes ago</div>
          </div>
          
          <div className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-white/90 mb-1">Outbound Sales Call - Follow Up</h4>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 text-xs bg-[var(--color-hover-pink)]/20 text-[var(--color-hover-pink)] border border-[var(--color-hover-pink)]/30 rounded-full">
                    Outbound
                  </span>
                  <span className="px-2 py-0.5 text-xs bg-[var(--color-grassy-green)]/20 text-[var(--color-grassy-green)] border border-[var(--color-grassy-green)]/30 rounded-full">
                    Completed
                  </span>
                  <span className="px-2 py-0.5 text-xs bg-white/10 text-white/80 border border-white/20 rounded-full">
                    $2.30
                  </span>
                </div>
              </div>
              <button className="group p-1.5 bg-[var(--color-sky-blue)]/20 hover:bg-[var(--color-sky-blue)]/40 rounded-lg border border-[var(--color-sky-blue)]/30 hover:border-[var(--color-sky-blue)]/60 transition-all duration-300">
                <PiPlayDuotone className="w-4 h-4 text-[var(--color-sky-blue)] group-hover:text-[var(--color-sky-blue)] group-hover:brightness-125 transition-all duration-300" />
              </button>
            </div>
            <div className="text-xs text-white/50">7:23 • 32 minutes ago</div>
          </div>
          
          <div className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-white/90 mb-1">Front Desk - New Customer Inquiry</h4>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 text-xs bg-[var(--color-main-accent)]/20 text-[var(--color-main-accent)] border border-[var(--color-main-accent)]/30 rounded-full">
                    Front Desk
                  </span>
                  <span className="px-2 py-0.5 text-xs bg-[var(--color-hover-pink)]/20 text-[var(--color-hover-pink)] border border-[var(--color-hover-pink)]/30 rounded-full">
                    In Progress
                  </span>
                  <span className="px-2 py-0.5 text-xs bg-white/10 text-white/80 border border-white/20 rounded-full">
                    $0.68
                  </span>
                </div>
              </div>
              <button className="group p-1.5 bg-[var(--color-sky-blue)]/20 hover:bg-[var(--color-sky-blue)]/40 rounded-lg border border-[var(--color-sky-blue)]/30 hover:border-[var(--color-sky-blue)]/60 transition-all duration-300">
                <PiPlayDuotone className="w-4 h-4 text-[var(--color-sky-blue)] group-hover:text-[var(--color-sky-blue)] group-hover:brightness-125 transition-all duration-300" />
              </button>
            </div>
            <div className="text-xs text-white/50">2:15 • 45 minutes ago</div>
          </div>
          
          <div className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-white/90 mb-1">Technical Support - System Integration</h4>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 text-xs bg-[var(--color-grassy-green)]/20 text-[var(--color-grassy-green)] border border-[var(--color-grassy-green)]/30 rounded-full">
                    Support
                  </span>
                  <span className="px-2 py-0.5 text-xs bg-[var(--color-main-accent)]/20 text-[var(--color-main-accent)] border border-[var(--color-main-accent)]/30 rounded-full">
                    Resolved
                  </span>
                  <span className="px-2 py-0.5 text-xs bg-white/10 text-white/80 border border-white/20 rounded-full">
                    $0.01
                  </span>
                </div>
              </div>
              <button className="group p-1.5 bg-[var(--color-sky-blue)]/20 hover:bg-[var(--color-sky-blue)]/40 rounded-lg border border-[var(--color-sky-blue)]/30 hover:border-[var(--color-sky-blue)]/60 transition-all duration-300">
                <PiPlayDuotone className="w-4 h-4 text-[var(--color-sky-blue)] group-hover:text-[var(--color-sky-blue)] group-hover:brightness-125 transition-all duration-300" />
              </button>
            </div>
            <div className="text-xs text-white/50">12:08 • 1 hour ago</div>
          </div>
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
