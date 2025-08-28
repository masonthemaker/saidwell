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

      // Fetch all team members for this company using the database function
      const { data: teamMembersData, error: teamMembersError } = await supabase
        .rpc('get_company_team_members', { company_uuid: currentCompanyId });

      if (teamMembersError) {
        console.error('Error fetching team members:', teamMembersError);
        setError('Failed to load team members');
        setTeamMembers([]);
        setIsLoading(false);
        return;
      }

      if (!teamMembersData || teamMembersData.length === 0) {
        setTeamMembers([]);
        setIsLoading(false);
        return;
      }

      // Transform the data to match our TeamMember interface
      const formattedMembers: TeamMember[] = teamMembersData.map((member: any) => {
        return {
          id: member.user_id,
          user_id: member.user_id,
          name: member.full_name || member.email.split('@')[0] || 'Unknown User',
          email: member.email || 'Email not available',
          role: member.role as 'owner' | 'admin' | 'member',
          status: 'Active', // For now, assume all are active. Could be enhanced later
          joinDate: new Date(member.created_at).toLocaleDateString('en-US', { 
            month: 'short', 
            year: 'numeric' 
          }),
          created_at: member.created_at
        };
      });

      // The database function already sorts by role hierarchy, but let's ensure consistent sorting
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
