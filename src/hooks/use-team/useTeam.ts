import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import type { TeamMember, UseTeamReturn, InviteUserData, InviteUserResponse } from './types';

export function useTeam(): UseTeamReturn {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInviting, setIsInviting] = useState(false);
  
  const { user, memberships } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  const isLoadingRef = useRef(false);
  
  // Memoize the current company ID to prevent unnecessary re-renders
  const currentCompanyId = useMemo(() => {
    return memberships.length > 0 ? memberships[0]?.company_id : null;
  }, [memberships]);

  // Memoize user info to prevent re-renders
  const currentUserInfo = useMemo(() => ({
    id: user?.id || '',
    email: user?.email || '',
    name: user?.user_metadata?.full_name || user?.user_metadata?.name || ''
  }), [user?.id, user?.email, user?.user_metadata?.full_name, user?.user_metadata?.name]);

  const fetchTeamMembers = useCallback(async () => {
    if (!currentUserInfo.id || !currentCompanyId) {
      setTeamMembers([]);
      setIsLoading(false);
      return;
    }

    // Prevent multiple simultaneous calls
    if (isLoadingRef.current) {
      return;
    }

    try {
      isLoadingRef.current = true;
      setIsLoading(true);
      setError(null);

      // Fetch all team members for this company
      const { data: membershipsData, error: membershipsError } = await supabase
        .from('memberships')
        .select('user_id, role, created_at')
        .eq('company_id', currentCompanyId)
        .neq('role', 'client'); // Exclude client users

      if (membershipsError) {
        console.error('Error fetching memberships:', membershipsError);
        setError('Failed to load team memberships');
        setTeamMembers([]);
        setIsLoading(false);
        return;
      }

      if (!membershipsData || membershipsData.length === 0) {
        setTeamMembers([]);
        setIsLoading(false);
        return;
      }

      // For now, we'll create user data based on available info
      // In a future version, this could be enhanced to fetch from a profiles table or auth metadata
      const userData = membershipsData.map((m) => ({
        id: m.user_id,
        full_name: m.user_id === currentUserInfo.id ? currentUserInfo.name : null,
        email: m.user_id === currentUserInfo.id ? currentUserInfo.email : null
      }));

      // Transform the data to match our TeamMember interface
      const formattedMembers: TeamMember[] = membershipsData.map((membership: any) => {
        // Find corresponding user data
        const userInfo = userData.find((u: any) => u.id === membership.user_id);
        
        const displayName = userInfo?.full_name || 
                           (userInfo?.email ? userInfo.email.split('@')[0] : null) ||
                           `${membership.role.charAt(0).toUpperCase() + membership.role.slice(1)} User`;

        return {
          id: membership.user_id,
          user_id: membership.user_id,
          name: displayName,
          email: userInfo?.email || 'Email not available',
          role: membership.role as 'owner' | 'admin' | 'member',
          status: 'Active', // For now, assume all are active. Could be enhanced later
          joinDate: new Date(membership.created_at).toLocaleDateString('en-US', { 
            month: 'short', 
            year: 'numeric' 
          }),
          created_at: membership.created_at
        };
      });

      // Sort by role hierarchy: owner > admin > member
      const roleOrder = { owner: 0, admin: 1, member: 2 };
      formattedMembers.sort((a, b) => {
        const aOrder = roleOrder[a.role] ?? 999;
        const bOrder = roleOrder[b.role] ?? 999;
        if (aOrder !== bOrder) return aOrder - bOrder;
        return a.name.localeCompare(b.name);
      });

      setTeamMembers(formattedMembers);
    } catch (err) {
      console.error('Error in fetchTeamMembers:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setTeamMembers([]);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [currentUserInfo, currentCompanyId, supabase]);

  const refresh = useCallback(async () => {
    await fetchTeamMembers();
  }, [fetchTeamMembers]);

  const inviteUser = useCallback(async (userData: InviteUserData): Promise<InviteUserResponse> => {
    setIsInviting(true);
    try {
      const response = await fetch('/api/invite-company-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to invite user');
      }

      // Refresh the team members list after successful invitation
      await fetchTeamMembers();

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to invite user';
      throw new Error(errorMessage);
    } finally {
      setIsInviting(false);
    }
  }, [fetchTeamMembers]);

  useEffect(() => {
    // Small delay to debounce multiple rapid calls
    const timeoutId = setTimeout(() => {
      fetchTeamMembers();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [fetchTeamMembers]);

  return {
    teamMembers,
    isLoading,
    error,
    refresh,
    totalMembers: teamMembers.length,
    inviteUser,
    isInviting
  };
}
