'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

interface CompanyAccess {
  id: string;
  name: string;
  slug: string;
  my_role: string;
  status: string;
  joined_at: string;
}

interface ClientAccess {
  id: string;
  name: string;
  company_name: string;
  company_slug: string;
  my_client_role: string | null;
  my_company_role: string | null;
  access_type: 'company' | 'client';
  status: string;
}

interface UserContext {
  type: 'company' | 'client' | 'multi' | 'no_access';
  companies: CompanyAccess[];
  clients: ClientAccess[];
  activeContext?: {
    type: 'company' | 'client';
    id: string;
    name: string;
    slug: string;
  };
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  context: UserContext | null;
  contextLoading: boolean;
}

export const useAuth = (requireAuth: boolean = true) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    context: null,
    contextLoading: false,
  });
  
  const router = useRouter();
  const supabase = createClient();

  // Detect user context (company vs client access)
  const detectUserContext = async (): Promise<UserContext> => {
    try {
      const [companiesResult, clientsResult] = await Promise.all([
        supabase.from('v_my_companies').select('*'),
        supabase.from('v_my_clients').select('*')
      ]);

      const companies = companiesResult.data || [];
      const clients = clientsResult.data || [];

      // Determine context type
      let type: UserContext['type'];
      if (companies.length > 0 && clients.length > 0) {
        type = 'multi';
      } else if (companies.length > 0) {
        type = 'company';
      } else if (clients.length > 0) {
        type = 'client';
      } else {
        type = 'no_access';
      }

      // Set default active context
      let activeContext;
      if (type === 'company') {
        activeContext = {
          type: 'company' as const,
          id: companies[0].id,
          name: companies[0].name,
          slug: companies[0].slug,
        };
      } else if (type === 'client') {
        activeContext = {
          type: 'client' as const,
          id: clients[0].id,
          name: clients[0].name,
          slug: clients[0].company_slug,
        };
      }

      return {
        type,
        companies,
        clients,
        activeContext,
      };
    } catch (error) {
      console.error('Error detecting user context:', error);
      return {
        type: 'no_access',
        companies: [],
        clients: [],
      };
    }
  };

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Update auth state first
          setAuthState(prev => ({
            ...prev,
            isAuthenticated: true,
            isLoading: false,
            user: session.user,
            contextLoading: true,
          }));

          // Detect user context
          const context = await detectUserContext();
          
          setAuthState(prev => ({
            ...prev,
            context,
            contextLoading: false,
          }));
        } else {
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            context: null,
            contextLoading: false,
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
          context: null,
          contextLoading: false,
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
          setAuthState(prev => ({
            ...prev,
            isAuthenticated: true,
            isLoading: false,
            user: session.user,
            contextLoading: true,
          }));

          // Detect context for new session
          const context = await detectUserContext();
          
          setAuthState(prev => ({
            ...prev,
            context,
            contextLoading: false,
          }));
        } else {
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            context: null,
            contextLoading: false,
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

  // Switch between company and client contexts
  const switchContext = (contextType: 'company' | 'client', entityId: string) => {
    if (!authState.context) return;

    let activeContext;
    if (contextType === 'company') {
      const company = authState.context.companies.find(c => c.id === entityId);
      if (company) {
        activeContext = {
          type: 'company' as const,
          id: company.id,
          name: company.name,
          slug: company.slug,
        };
      }
    } else if (contextType === 'client') {
      const client = authState.context.clients.find(c => c.id === entityId);
      if (client) {
        activeContext = {
          type: 'client' as const,
          id: client.id,
          name: client.name,
          slug: client.company_slug,
        };
      }
    }

    if (activeContext) {
      setAuthState(prev => ({
        ...prev,
        context: prev.context ? {
          ...prev.context,
          activeContext,
        } : null,
      }));

      // Route to appropriate dashboard
      if (contextType === 'company') {
        router.push(`/company/${activeContext.slug}`);
      } else {
        router.push('/'); // Client dashboard (current dashboard)
      }
    }
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    switchContext,
    supabase,
  };
};

export default useAuth;
