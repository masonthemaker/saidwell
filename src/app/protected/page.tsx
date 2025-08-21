'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import LogoutButton from '@/components/logout-button';
import ParallaxBackground from '@/components/ParallaxBackground';
import type { User } from '@supabase/supabase-js';

export default function ProtectedPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();
  }, [supabase.auth]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-app-bg flex items-center justify-center">
        <div className="text-lg font-medium text-white/90">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-app-bg relative py-12">
      <ParallaxBackground />
      <div className="max-w-2xl mx-auto px-4 relative z-10">
        <div className="bg-white/3 backdrop-blur-xl border border-white/5 rounded-2xl backdrop-saturate-150 shadow p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white/90 mb-2">Protected Page</h1>
              <p className="text-white/60">This page requires authentication to access.</p>
            </div>
            <LogoutButton />
          </div>

          {user && (
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur-sm">
              <h2 className="text-lg font-medium text-white/90 mb-2">User Information</h2>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium text-white/70">Email:</span> <span className="text-white/60">{user.email}</span></p>
                <p><span className="font-medium text-white/70">User ID:</span> <span className="text-white/60">{user.id}</span></p>
                <p><span className="font-medium text-white/70">Created:</span> <span className="text-white/60">{new Date(user.created_at || '').toLocaleDateString()}</span></p>
                <p><span className="font-medium text-white/70">Last Sign In:</span> <span className="text-white/60">{new Date(user.last_sign_in_at || '').toLocaleDateString()}</span></p>
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-white/10">
            <h2 className="text-lg font-medium text-white/90 mb-2">Navigation</h2>
            <div className="flex gap-4">
              <a 
                href="/"
                className="bg-main-accent/20 hover:bg-main-accent/30 text-main-accent border border-main-accent/20 hover:border-main-accent/40 font-medium py-2 px-4 rounded-lg transition-all duration-300 ease-out backdrop-blur-sm"
              >
                Dashboard
              </a>
              <a 
                href="/files"
                className="bg-white/10 hover:bg-white/20 text-white/90 border border-white/20 hover:border-white/30 font-medium py-2 px-4 rounded-lg transition-all duration-300 ease-out backdrop-blur-sm"
              >
                Files
              </a>
              <a 
                href="/history"
                className="bg-white/10 hover:bg-white/20 text-white/90 border border-white/20 hover:border-white/30 font-medium py-2 px-4 rounded-lg transition-all duration-300 ease-out backdrop-blur-sm"
              >
                History
              </a>
              <a 
                href="/settings"
                className="bg-white/10 hover:bg-white/20 text-white/90 border border-white/20 hover:border-white/30 font-medium py-2 px-4 rounded-lg transition-all duration-300 ease-out backdrop-blur-sm"
              >
                Settings
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
