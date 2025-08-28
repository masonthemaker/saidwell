"use client";

import { useState } from "react";
import { PiUserDuotone, PiLockDuotone, PiEyeDuotone, PiEyeSlashDuotone } from "react-icons/pi";

const PasswordInput = ({ 
  value, 
  onChange, 
  placeholder, 
  showPassword, 
  onToggleVisibility,
  disabled = false,
  autoComplete
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  showPassword: boolean;
  onToggleVisibility: () => void;
  disabled?: boolean;
  autoComplete?: string;
}) => (
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      autoComplete={autoComplete}
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

export default function AccountSettings() {
  const [passwordSettings, setPasswordSettings] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false
  });

  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const handlePasswordReset = async () => {
    // Clear previous messages
    setPasswordError(null);
    setPasswordSuccess(null);

    // Validation
    if (!passwordSettings.currentPassword.trim()) {
      setPasswordError("Please enter your current password");
      return;
    }

    if (!passwordSettings.newPassword.trim()) {
      setPasswordError("Please enter a new password");
      return;
    }

    if (passwordSettings.newPassword !== passwordSettings.confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }
    
    if (passwordSettings.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long");
      return;
    }

    if (passwordSettings.currentPassword === passwordSettings.newPassword) {
      setPasswordError("New password must be different from current password");
      return;
    }
    
    setIsUpdatingPassword(true);
    
    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordSettings.currentPassword,
          newPassword: passwordSettings.newPassword
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update password');
      }

      // Success!
      setPasswordSuccess(result.message || 'Password updated successfully');
      setPasswordSettings({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        showCurrentPassword: false,
        showNewPassword: false,
        showConfirmPassword: false
      });

      // Clear success message after 5 seconds
      setTimeout(() => setPasswordSuccess(null), 5000);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update password';
      setPasswordError(errorMessage);
      // Clear error message after 7 seconds
      setTimeout(() => setPasswordError(null), 7000);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setPasswordSettings(prev => {
      switch (field) {
        case 'current':
          return { ...prev, showCurrentPassword: !prev.showCurrentPassword };
        case 'new':
          return { ...prev, showNewPassword: !prev.showNewPassword };
        case 'confirm':
          return { ...prev, showConfirmPassword: !prev.showConfirmPassword };
        default:
          return prev;
      }
    });
  };



  return (
    <div className="space-y-6">
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

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handlePasswordReset();
          }}
          className="space-y-4"
        >
          {/* Success Message */}
          {passwordSuccess && (
            <div className="p-3 bg-[var(--color-grassy-green)]/20 border border-[var(--color-grassy-green)]/30 rounded-lg">
              <p className="text-[var(--color-grassy-green)] text-sm">{passwordSuccess}</p>
            </div>
          )}
          
          {/* Error Message */}
          {passwordError && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-300 text-sm">{passwordError}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Current Password</label>
            <PasswordInput
              value={passwordSettings.currentPassword}
              onChange={(value) => {
                setPasswordSettings(prev => ({ ...prev, currentPassword: value }));
                // Clear messages when user starts typing
                if (passwordError) setPasswordError(null);
                if (passwordSuccess) setPasswordSuccess(null);
              }}
              placeholder="Enter current password"
              showPassword={passwordSettings.showCurrentPassword}
              onToggleVisibility={() => togglePasswordVisibility('current')}
              disabled={isUpdatingPassword}
              autoComplete="current-password"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">New Password</label>
              <PasswordInput
                value={passwordSettings.newPassword}
                onChange={(value) => {
                  setPasswordSettings(prev => ({ ...prev, newPassword: value }));
                  // Clear messages when user starts typing
                  if (passwordError) setPasswordError(null);
                  if (passwordSuccess) setPasswordSuccess(null);
                }}
                placeholder="Enter new password"
                showPassword={passwordSettings.showNewPassword}
                onToggleVisibility={() => togglePasswordVisibility('new')}
                disabled={isUpdatingPassword}
                autoComplete="new-password"
              />
              <p className="text-xs text-white/50 mt-1">Minimum 8 characters required</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Confirm New Password</label>
              <PasswordInput
                value={passwordSettings.confirmPassword}
                onChange={(value) => {
                  setPasswordSettings(prev => ({ ...prev, confirmPassword: value }));
                  // Clear messages when user starts typing
                  if (passwordError) setPasswordError(null);
                  if (passwordSuccess) setPasswordSuccess(null);
                }}
                placeholder="Confirm new password"
                showPassword={passwordSettings.showConfirmPassword}
                onToggleVisibility={() => togglePasswordVisibility('confirm')}
                disabled={isUpdatingPassword}
                autoComplete="new-password"
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
              type="submit"
              disabled={!passwordSettings.currentPassword || !passwordSettings.newPassword || !passwordSettings.confirmPassword || isUpdatingPassword}
              className="px-6 py-2.5 bg-[var(--color-hover-pink)]/20 hover:bg-[var(--color-hover-pink)]/40 text-[var(--color-hover-pink)] border border-[var(--color-hover-pink)]/30 hover:border-[var(--color-hover-pink)]/60 rounded-lg text-sm font-medium transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isUpdatingPassword ? "Updating..." : "Reset Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
