"use client";

import { useState } from "react";
import { PiLockDuotone, PiEnvelopeDuotone, PiEyeDuotone, PiEyeSlashDuotone } from "react-icons/pi";

export default function AccountSettings() {
  const [emailSettings, setEmailSettings] = useState({
    currentEmail: "user@company.com",
    newEmail: "",
    confirmEmail: ""
  });

  const [passwordSettings, setPasswordSettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false
  });

  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleEmailChange = async () => {
    if (emailSettings.newEmail !== emailSettings.confirmEmail) {
      alert("Email addresses don't match!");
      return;
    }
    
    setIsUpdatingEmail(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log(`Email change requested: ${emailSettings.currentEmail} → ${emailSettings.newEmail}`);
    setEmailSettings({
      currentEmail: emailSettings.newEmail,
      newEmail: "",
      confirmEmail: ""
    });
    setIsUpdatingEmail(false);
    // TODO: Implement actual email change when connected to backend
  };

  const handlePasswordReset = async () => {
    if (passwordSettings.newPassword !== passwordSettings.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    
    if (passwordSettings.newPassword.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }
    
    setIsUpdatingPassword(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log("Password reset requested");
    setPasswordSettings({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      showCurrentPassword: false,
      showNewPassword: false,
      showConfirmPassword: false
    });
    setIsUpdatingPassword(false);
    // TODO: Implement actual password reset when connected to backend
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setPasswordSettings(prev => ({
      ...prev,
      [`show${field.charAt(0).toUpperCase() + field.slice(1)}Password`]: !prev[`show${field.charAt(0).toUpperCase() + field.slice(1)}Password` as keyof typeof prev]
    }));
  };

  const PasswordInput = ({ 
    value, 
    onChange, 
    placeholder, 
    showPassword, 
    onToggleVisibility,
    disabled = false 
  }: {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    showPassword: boolean;
    onToggleVisibility: () => void;
    disabled?: boolean;
  }) => (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full pr-10 pl-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white/90 placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-main-accent)]/50 focus:border-[var(--color-main-accent)]/40 transition-all duration-300 disabled:opacity-60"
      />
      <button
        type="button"
        onClick={onToggleVisibility}
        disabled={disabled}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors disabled:opacity-60"
      >
        {showPassword ? (
          <PiEyeSlashDuotone className="w-4 h-4" />
        ) : (
          <PiEyeDuotone className="w-4 h-4" />
        )}
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Change Email Section */}
      <div className="bg-white/3 backdrop-blur-xl border border-white/5 backdrop-saturate-150 rounded-2xl p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[var(--color-grassy-green)]/20 rounded-lg">
              <PiEnvelopeDuotone className="w-5 h-5 text-[var(--color-grassy-green)]" />
            </div>
            <h2 className="text-xl font-semibold text-white/90">Change Email Address</h2>
          </div>
          <p className="text-sm text-white/60">Update your account email address</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Current Email</label>
            <input
              type="email"
              value={emailSettings.currentEmail}
              disabled
              className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white/60 text-sm opacity-60"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">New Email</label>
              <input
                type="email"
                value={emailSettings.newEmail}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, newEmail: e.target.value }))}
                placeholder="Enter new email address"
                disabled={isUpdatingEmail}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white/90 placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-main-accent)]/50 focus:border-[var(--color-main-accent)]/40 transition-all duration-300 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Confirm New Email</label>
              <input
                type="email"
                value={emailSettings.confirmEmail}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, confirmEmail: e.target.value }))}
                placeholder="Confirm new email address"
                disabled={isUpdatingEmail}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white/90 placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-main-accent)]/50 focus:border-[var(--color-main-accent)]/40 transition-all duration-300 disabled:opacity-60"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/10">
            <button
              onClick={handleEmailChange}
              disabled={!emailSettings.newEmail || !emailSettings.confirmEmail || isUpdatingEmail}
              className="px-6 py-2.5 bg-[var(--color-grassy-green)]/20 hover:bg-[var(--color-grassy-green)]/40 text-[var(--color-grassy-green)] border border-[var(--color-grassy-green)]/30 hover:border-[var(--color-grassy-green)]/60 rounded-lg text-sm font-medium transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isUpdatingEmail ? "Updating..." : "Update Email"}
            </button>
          </div>
        </div>
      </div>

      {/* Reset Password Section */}
      <div className="bg-white/3 backdrop-blur-xl border border-white/5 backdrop-saturate-150 rounded-2xl p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[var(--color-hover-pink)]/20 rounded-lg">
              <PiLockDuotone className="w-5 h-5 text-[var(--color-hover-pink)]" />
            </div>
            <h2 className="text-xl font-semibold text-white/90">Reset Password</h2>
          </div>
          <p className="text-sm text-white/60">Change your account password for better security</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Current Password</label>
            <PasswordInput
              value={passwordSettings.currentPassword}
              onChange={(value) => setPasswordSettings(prev => ({ ...prev, currentPassword: value }))}
              placeholder="Enter current password"
              showPassword={passwordSettings.showCurrentPassword}
              onToggleVisibility={() => togglePasswordVisibility('current')}
              disabled={isUpdatingPassword}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">New Password</label>
              <PasswordInput
                value={passwordSettings.newPassword}
                onChange={(value) => setPasswordSettings(prev => ({ ...prev, newPassword: value }))}
                placeholder="Enter new password"
                showPassword={passwordSettings.showNewPassword}
                onToggleVisibility={() => togglePasswordVisibility('new')}
                disabled={isUpdatingPassword}
              />
              <p className="text-xs text-white/50 mt-1">Minimum 8 characters required</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Confirm New Password</label>
              <PasswordInput
                value={passwordSettings.confirmPassword}
                onChange={(value) => setPasswordSettings(prev => ({ ...prev, confirmPassword: value }))}
                placeholder="Confirm new password"
                showPassword={passwordSettings.showConfirmPassword}
                onToggleVisibility={() => togglePasswordVisibility('confirm')}
                disabled={isUpdatingPassword}
              />
            </div>
          </div>

          {/* Password Strength Indicator */}
          {passwordSettings.newPassword && (
            <div className="p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="text-xs text-white/70 mb-2">Password Strength</div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded ${
                      passwordSettings.newPassword.length >= level * 2
                        ? level <= 2 
                          ? 'bg-red-500' 
                          : level === 3 
                            ? 'bg-yellow-500' 
                            : 'bg-[var(--color-grassy-green)]'
                        : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
              <div className="text-xs text-white/50 mt-1">
                {passwordSettings.newPassword.length < 4 && "Weak"}
                {passwordSettings.newPassword.length >= 4 && passwordSettings.newPassword.length < 6 && "Fair"}
                {passwordSettings.newPassword.length >= 6 && passwordSettings.newPassword.length < 8 && "Good"}
                {passwordSettings.newPassword.length >= 8 && "Strong"}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-white/10">
            <button
              onClick={handlePasswordReset}
              disabled={!passwordSettings.currentPassword || !passwordSettings.newPassword || !passwordSettings.confirmPassword || isUpdatingPassword}
              className="px-6 py-2.5 bg-[var(--color-hover-pink)]/20 hover:bg-[var(--color-hover-pink)]/40 text-[var(--color-hover-pink)] border border-[var(--color-hover-pink)]/30 hover:border-[var(--color-hover-pink)]/60 rounded-lg text-sm font-medium transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isUpdatingPassword ? "Updating..." : "Reset Password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
