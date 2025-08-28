import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import type { TeamMember, UseTeamReturn, InviteUserData, InviteUserResponse, ChangeRoleData, ChangeRoleResponse, PendingInvitation, CancelInvitationData, CancelInvitationResponse, RemoveMemberData, RemoveMemberResponse } from './types';

export function useTeam(): UseTeamReturn {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInviting, setIsInviting] = useState(false);
  const [isChangingRole, setIsChangingRole] = useState(false);
  const [isCancellingInvitation, setIsCancellingInvitation] = useState(false);
  const [isRemovingMember, setIsRemovingMember] = useState(false);
  
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
        // Check if this user has ever logged in by checking last_sign_in_at
        // If they haven't signed in, they're still "invited"
        const hasSignedIn = member.last_sign_in_at != null;
        
        return {
          id: member.user_id,
          user_id: member.user_id,
          name: member.full_name || member.email.split('@')[0] || 'Unknown User',
          email: member.email || 'Email not available',
          role: member.role as 'owner' | 'admin' | 'member',
          status: hasSignedIn ? 'Active' : 'Invited',
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

      // Also fetch pending invitations
      await fetchPendingInvitations();
    } catch (err) {
      console.error('Error in fetchTeamMembers:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setTeamMembers([]);
      setPendingInvitations([]);
    } finally {
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  }, [currentUserInfo, currentCompanyId, supabase]);

  const fetchPendingInvitations = useCallback(async () => {
    if (!currentCompanyId) {
      setPendingInvitations([]);
      return;
    }

    try {
      const { data: invitationsData, error: invitationsError } = await supabase
        .from('invitations')
        .select(`
          id,
          email,
          role,
          status,
          invited_by,
          expires_at,
          created_at
        `)
        .eq('company_id', currentCompanyId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (invitationsError) {
        console.error('Error fetching invitations:', invitationsError);
        setPendingInvitations([]);
        return;
      }

      const formattedInvitations: PendingInvitation[] = invitationsData?.map((invitation: any) => ({
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        status: invitation.status,
        invited_by: invitation.invited_by,
        expires_at: invitation.expires_at,
        created_at: invitation.created_at
      })) || [];

      setPendingInvitations(formattedInvitations);
    } catch (err) {
      console.error('Error fetching pending invitations:', err);
      setPendingInvitations([]);
    }
  }, [currentCompanyId, supabase]);

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

  const changeUserRole = useCallback(async (roleData: ChangeRoleData): Promise<ChangeRoleResponse> => {
    if (!currentCompanyId) {
      throw new Error('No company selected');
    }

    setIsChangingRole(true);
    try {
      const { data, error } = await supabase.rpc('change_user_role', {
        target_user_id: roleData.userId,
        new_role: roleData.newRole,
        company_uuid: currentCompanyId
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to change role');
      }

      // Refresh the team members list after successful role change
      await fetchTeamMembers();

      return {
        success: true,
        message: data.message || `Role updated to ${roleData.newRole} successfully`
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to change role';
      throw new Error(errorMessage);
    } finally {
      setIsChangingRole(false);
    }
  }, [currentCompanyId, supabase, fetchTeamMembers]);

  const cancelInvitation = useCallback(async (invitationData: CancelInvitationData): Promise<CancelInvitationResponse> => {
    setIsCancellingInvitation(true);
    try {
      const { error } = await supabase
        .from('invitations')
        .update({ status: 'cancelled' })
        .eq('id', invitationData.invitationId);

      if (error) {
        throw new Error(error.message);
      }

      // Refresh the invitations list
      await fetchPendingInvitations();

      return {
        success: true,
        message: 'Invitation cancelled successfully'
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to cancel invitation';
      throw new Error(errorMessage);
    } finally {
      setIsCancellingInvitation(false);
    }
  }, [supabase, fetchPendingInvitations]);

  const removeMember = useCallback(async (memberData: RemoveMemberData): Promise<RemoveMemberResponse> => {
    if (!currentCompanyId) {
      throw new Error('No company selected');
    }

    setIsRemovingMember(true);
    try {
      const { data, error } = await supabase.rpc('remove_team_member', {
        target_user_id: memberData.userId,
        company_uuid: currentCompanyId
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to remove member');
      }

      // Refresh the team members list after successful removal
      await fetchTeamMembers();

      return {
        success: true,
        message: data.message || 'Member removed successfully'
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove member';
      throw new Error(errorMessage);
    } finally {
      setIsRemovingMember(false);
    }
  }, [currentCompanyId, supabase, fetchTeamMembers]);

  useEffect(() => {
    // Small delay to debounce multiple rapid calls
    const timeoutId = setTimeout(() => {
      fetchTeamMembers();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [fetchTeamMembers]);

  return {
    teamMembers,
    pendingInvitations,
    isLoading,
    error,
    refresh,
    totalMembers: teamMembers.length,
    totalPendingInvitations: pendingInvitations.length,
    inviteUser,
    isInviting,
    changeUserRole,
    isChangingRole,
    cancelInvitation,
    isCancellingInvitation,
    removeMember,
    isRemovingMember
  };
}
