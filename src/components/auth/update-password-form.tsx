'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function UpdatePasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setError(error.message);
      } else {
        router.push('/');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-white/70 mb-2">
          New Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white/90 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-main-accent/50 focus:border-main-accent/40 transition-all duration-300 backdrop-blur-sm"
          placeholder="Enter new password"
          required
          minLength={6}
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/70 mb-2">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white/90 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-main-accent/50 focus:border-main-accent/40 transition-all duration-300 backdrop-blur-sm"
          placeholder="Confirm new password"
          required
          minLength={6}
        />
        <p className="text-xs text-white/40 mt-1">Password must be at least 6 characters</p>
      </div>

      {error && (
        <div className="text-error-red text-sm text-center bg-error-red/10 border border-error-red/20 rounded-lg p-2 backdrop-blur-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-main-accent/20 hover:bg-main-accent/30 disabled:bg-white/5 disabled:text-white/40 text-main-accent border border-main-accent/20 hover:border-main-accent/40 disabled:border-white/10 font-medium py-2 px-4 rounded-lg transition-all duration-300 ease-out backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-main-accent/50"
      >
        {isLoading ? 'Updating...' : 'Update Password'}
      </button>
    </form>
  );
}
