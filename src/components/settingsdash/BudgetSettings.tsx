"use client";

import { useState } from "react";
import { PiBellDuotone, PiToggleLeftDuotone, PiToggleRightDuotone } from "react-icons/pi";

export default function BudgetSettings() {
  const [budgetAlerts, setBudgetAlerts] = useState({
    enabled: true,
    dailyLimit: "50.00",
    weeklyLimit: "300.00",
    monthlyLimit: "1000.00",
    emailNotifications: true,
    smsNotifications: false,
    slackNotifications: true
  });

  const handleToggle = (setting: keyof typeof budgetAlerts) => {
    setBudgetAlerts(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleLimitChange = (limit: string, value: string) => {
    setBudgetAlerts(prev => ({
      ...prev,
      [limit]: value
    }));
  };

  const ToggleButton = ({ isOn, onClick }: { isOn: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`transition-all duration-300 ${
        isOn ? 'text-[var(--color-main-accent)]' : 'text-white/40'
      }`}
    >
      {isOn ? (
        <PiToggleRightDuotone className="w-8 h-8" />
      ) : (
        <PiToggleLeftDuotone className="w-8 h-8" />
      )}
    </button>
  );

  return (
    <div className="bg-white/3 backdrop-blur-xl border border-white/5 backdrop-saturate-150 rounded-2xl p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-[var(--color-main-accent)]/20 rounded-lg">
            <PiBellDuotone className="w-5 h-5 text-[var(--color-main-accent)]" />
          </div>
          <h2 className="text-xl font-semibold text-white/90">Budget Alert Settings</h2>
        </div>
        <p className="text-sm text-white/60">Configure spending limits and notification preferences</p>
      </div>

      <div className="space-y-6">
        {/* Master Toggle */}
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
          <div>
            <h3 className="text-base font-medium text-white/90 mb-1">Enable Budget Alerts</h3>
            <p className="text-sm text-white/60">Receive notifications when spending limits are reached</p>
          </div>
          <ToggleButton 
            isOn={budgetAlerts.enabled} 
            onClick={() => handleToggle('enabled')} 
          />
        </div>

        {/* Spending Limits */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white/90">Spending Limits</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Daily Limit</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">$</span>
                <input
                  type="number"
                  value={budgetAlerts.dailyLimit}
                  onChange={(e) => handleLimitChange('dailyLimit', e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white/90 placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-main-accent)]/50 focus:border-[var(--color-main-accent)]/40 transition-all duration-300"
                  disabled={!budgetAlerts.enabled}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Weekly Limit</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">$</span>
                <input
                  type="number"
                  value={budgetAlerts.weeklyLimit}
                  onChange={(e) => handleLimitChange('weeklyLimit', e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white/90 placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-main-accent)]/50 focus:border-[var(--color-main-accent)]/40 transition-all duration-300"
                  disabled={!budgetAlerts.enabled}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Monthly Limit</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">$</span>
                <input
                  type="number"
                  value={budgetAlerts.monthlyLimit}
                  onChange={(e) => handleLimitChange('monthlyLimit', e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white/90 placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-main-accent)]/50 focus:border-[var(--color-main-accent)]/40 transition-all duration-300"
                  disabled={!budgetAlerts.enabled}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notification Methods */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white/90">Notification Methods</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-white/80">Email Notifications</span>
                <span className="px-2 py-1 text-xs bg-[var(--color-grassy-green)]/20 text-[var(--color-grassy-green)] border border-[var(--color-grassy-green)]/30 rounded-full">
                  Recommended
                </span>
              </div>
              <ToggleButton 
                isOn={budgetAlerts.emailNotifications} 
                onClick={() => handleToggle('emailNotifications')} 
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
              <span className="text-sm font-medium text-white/80">SMS Notifications</span>
              <ToggleButton 
                isOn={budgetAlerts.smsNotifications} 
                onClick={() => handleToggle('smsNotifications')} 
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
              <span className="text-sm font-medium text-white/80">Slack Notifications</span>
              <ToggleButton 
                isOn={budgetAlerts.slackNotifications} 
                onClick={() => handleToggle('slackNotifications')} 
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t border-white/10">
          <button className="px-6 py-2.5 bg-[var(--color-main-accent)]/20 hover:bg-[var(--color-main-accent)]/40 text-[var(--color-main-accent)] border border-[var(--color-main-accent)]/30 hover:border-[var(--color-main-accent)]/60 rounded-lg text-sm font-medium transition-all duration-300">
            Save Budget Settings
          </button>
        </div>
      </div>
    </div>
  );
}
