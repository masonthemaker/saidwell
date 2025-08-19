"use client";

export default function BentoBoxTwo() {
  return (
    <div className="bg-white/3 backdrop-blur-xl border border-white/5 backdrop-saturate-150 rounded-2xl p-6">
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white/90 mb-2">
            Call Success Rate
          </h3>
          <p className="text-sm text-white/60">
            Recent call outcomes and failure analysis
          </p>
        </div>
        
        <div className="space-y-4 flex-1">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="text-2xl font-bold text-[var(--color-grassy-green)] mb-1">94%</div>
              <div className="text-xs text-white/60">Success Rate</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="text-2xl font-bold text-[var(--color-error-red)] mb-1">6%</div>
              <div className="text-xs text-white/60">Failed Calls</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[var(--color-grassy-green)] rounded-full"></div>
                <span className="text-sm text-white/80">Customer inquiry resolved</span>
              </div>
              <span className="text-xs text-white/50">2m ago</span>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[var(--color-error-red)] rounded-full"></div>
                <div className="flex-1">
                  <span className="text-sm text-white/80">Call failed</span>
                  <div className="text-sm text-[var(--color-error-red)] mt-1 font-medium">Caller hung up before resolution</div>
                </div>
              </div>
              <span className="text-xs text-white/50">5m ago</span>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[var(--color-grassy-green)] rounded-full"></div>
                <span className="text-sm text-white/80">Payment processed successfully</span>
              </div>
              <span className="text-xs text-white/50">8m ago</span>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[var(--color-grassy-green)] rounded-full"></div>
                <span className="text-sm text-white/80">Appointment scheduled successfully</span>
              </div>
              <span className="text-xs text-white/50">12m ago</span>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[var(--color-grassy-green)] rounded-full"></div>
                <span className="text-sm text-white/80">Technical issue resolved</span>
              </div>
              <span className="text-xs text-white/50">15m ago</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-white/10">
          <button className="w-full text-sm text-white/70 hover:text-white transition-colors duration-300">
            View failure analysis →
          </button>
        </div>
      </div>
    </div>
  );
}
