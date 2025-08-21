'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
}

export const useAuth = (requireAuth: boolean = true) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
  });
  
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            user: session.user,
          });
        } else {
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
          });
          
          // Redirect to login if authentication is required
          if (requireAuth) {
            router.push('/auth/login');
          }
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
        });
        
        if (requireAuth) {
          router.push('/auth/login');
        }
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            user: session.user,
          });
        } else {
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
          });
          
          if (requireAuth && event === 'SIGNED_OUT') {
            router.push('/auth/login');
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [requireAuth, router, supabase.auth]);

  // Helper functions for authentication actions
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push('/auth/login');
    }
    return { error };
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    supabase,
  };
};

export default useAuth;
