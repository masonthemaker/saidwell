'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        // Wait a moment for auth state to update, then detect context
        setTimeout(async () => {
          try {
            const [companiesResult, clientsResult] = await Promise.all([
              supabase.from('v_my_companies').select('*'),
              supabase.from('v_my_clients').select('*')
            ]);

            const companies = companiesResult.data || [];
            const clients = clientsResult.data || [];

            // Route based on access
            if (companies.length > 0 && clients.length > 0) {
              // Multi-access - go to selection page
              router.push('/dashboard/select-context');
            } else if (companies.length > 0) {
              // Company only
              router.push(`/company/${companies[0].slug}`);
            } else if (clients.length > 0) {
              // Client only  
              router.push('/');
            } else {
              // No access
              setError('No access permissions found. Please contact your administrator.');
              await supabase.auth.signOut();
            }
          } catch (contextError) {
            console.error('Error detecting context:', contextError);
            router.push('/');
          }
        }, 1500);
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
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-white/70 mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-white/90 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-main-accent/50 focus:border-main-accent/40 transition-all duration-300 backdrop-blur-sm"
          placeholder="Enter your password"
          required
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm">
          <a href="/auth/forgot-password" className="text-main-accent hover:text-hover-pink transition-all duration-300 ease-out">
            Forgot your password?
          </a>
        </div>
      </div>

      {error && (
        <div className="text-error-red text-sm text-center bg-error-red/10 border border-error-red/20 rounded-lg p-2 backdrop-blur-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-main-accent/20 hover:bg-main-accent/30 disabled:bg-white/5 disabled:text-white/40 text-main-accent border border-main-accent/20 hover:border-main-accent/40 disabled:border-white/10 font-medium py-2 px-4 rounded-lg transition-all duration-300 ease-out backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-main-accent/50"
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
