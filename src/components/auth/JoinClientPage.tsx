"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { PiFirstAidDuotone, PiEyeDuotone, PiEyeSlashDuotone } from "react-icons/pi";
import ParallaxBackground from "@/components/ParallaxBackground";

export default function JoinClientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Invitation data from URL params and token
  const [invitationData, setInvitationData] = useState<{
    clientName?: string;
    clientId?: string;
    role?: string;
  }>({});

  useEffect(() => {
    // Get token from URL hash (Supabase format)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const refreshToken = hashParams.get('refresh_token');
    const type = hashParams.get('type');

    // Get email from URL params
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }

    // If we have tokens and it's an invite type, extract user data
    if (accessToken && type === 'invite') {
      try {
        // Decode the JWT to get user data
        const payload = JSON.parse(atob(accessToken.split('.')[1]));
        
        if (payload.user_metadata || payload.app_metadata) {
          const metadata = payload.user_metadata || payload.app_metadata;
          setInvitationData({
            clientName: metadata.client_name,
            clientId: metadata.client_id,
            role: metadata.role
          });
        }
        
        // Set email from token if not in params
        if (payload.email && !emailParam) {
          setEmail(payload.email);
        }
      } catch (err) {
        console.warn('Could not decode invitation token:', err);
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validation
    if (!email || !password || !confirmPassword) {
      setError("All fields are required");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      // Get tokens from URL hash
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');

      if (!accessToken || !refreshToken) {
        setError("Invalid invitation link. Please request a new invitation.");
        setIsLoading(false);
        return;
      }

      // Set the session with the tokens from the invitation
      const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      });

      if (sessionError) {
        setError("Invalid invitation link. Please request a new invitation.");
        setIsLoading(false);
        return;
      }

      // Update the user's password
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) {
        setError("Failed to set password. Please try again.");
        setIsLoading(false);
        return;
      }

      // If we have client data, add user to the client
      if (invitationData.clientId && sessionData.user) {
        try {
          const { error: clientError } = await supabase
            .from('user_clients')
            .insert({
              user_id: sessionData.user.id,
              client_id: invitationData.clientId,
              role: invitationData.role || 'member'
            });

          if (clientError && clientError.code !== '23505') { // Ignore duplicate entries
            console.warn('Failed to add user to client:', clientError);
          }
        } catch (err) {
          console.warn('Failed to add user to client:', err);
        }
      }

      setSuccess(true);
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/');
      }, 2000);

    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app-bg relative">
        <ParallaxBackground />
        <div className="relative z-10 w-full max-w-md mx-4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center">
            <div className="p-4 bg-green-500/20 rounded-xl mb-6 mx-auto w-fit">
              <PiFirstAidDuotone className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-2xl font-semibold text-white mb-4">Welcome!</h1>
            <p className="text-white/70 mb-4">
              Your account has been set up successfully.
              {invitationData.clientName && (
                <> You now have access to <strong>{invitationData.clientName}</strong>.</>
              )}
            </p>
            <p className="text-sm text-white/60">Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-app-bg relative">
      <ParallaxBackground />
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="p-4 bg-[var(--color-main-accent)]/20 rounded-xl mb-4 mx-auto w-fit">
              <PiFirstAidDuotone className="w-8 h-8 text-[var(--color-main-accent)]" />
            </div>
            <h1 className="text-2xl font-semibold text-white mb-2">Join Your Team</h1>
            {invitationData.clientName ? (
              <p className="text-white/70">
                You've been invited to join <strong>{invitationData.clientName}</strong>
                {invitationData.role && <> as {invitationData.role}</>}
              </p>
            ) : (
              <p className="text-white/70">Complete your account setup to get started</p>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={true} // Email is from invitation, shouldn't be changed
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[var(--color-main-accent)]/50 focus:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
                Create Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[var(--color-main-accent)]/50 focus:bg-white/10 transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors"
                >
                  {showPassword ? (
                    <PiEyeSlashDuotone className="w-5 h-5" />
                  ) : (
                    <PiEyeDuotone className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[var(--color-main-accent)]/50 focus:bg-white/10 transition-all disabled:opacity-50"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !email || !password || !confirmPassword}
              className="w-full px-4 py-3 bg-[var(--color-main-accent)]/20 hover:bg-[var(--color-main-accent)]/30 border border-[var(--color-main-accent)]/30 hover:border-[var(--color-main-accent)]/50 rounded-xl text-[var(--color-main-accent)] font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[var(--color-main-accent)]/30 border-t-[var(--color-main-accent)] rounded-full animate-spin" />
                  Setting up account...
                </>
              ) : (
                <>
                  <PiFirstAidDuotone className="w-4 h-4" />
                  Complete Setup
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-white/60">
              By completing setup, you agree to our terms of service and privacy policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
