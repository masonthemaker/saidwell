'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage('Check your email for a password reset link.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (message) {
    return (
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-grassy-green/20 border border-grassy-green/30 backdrop-blur-sm mb-4">
          <svg className="h-6 w-6 text-grassy-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-grassy-green font-medium mb-4">{message}</p>
        <p className="text-white/60 text-sm">
          If you don&apos;t see the email in your inbox, check your spam folder.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-2">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white/90 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-main-accent/50 focus:border-main-accent/40 transition-all duration-300 backdrop-blur-sm"
          placeholder="Enter your email"
          required
        />
        <p className="text-xs text-white/40 mt-1">
          We&apos;ll send a password reset link to this email address
        </p>
      </div>

      {error && (
        <div className="text-error-red text-sm text-center bg-error-red/10 border border-error-red/20 rounded-lg p-2 backdrop-blur-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-main-accent/20 hover:bg-main-accent/30 disabled:bg-white/5 disabled:text-white/40 text-main-accent border border-main-accent/20 hover:border-main-accent/40 disabled:border-white/10 font-medium py-2 px-4 rounded-lg transition-all duration-300 ease-out backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-main-accent/50"
      >
        {isLoading ? 'Sending...' : 'Send Reset Link'}
      </button>
    </form>
  );
}
