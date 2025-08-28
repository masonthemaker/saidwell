export interface TeamMember {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  status: 'Active' | 'Invited' | 'Pending' | 'Inactive';
  joinDate: string;
  created_at: string;
}

export interface PendingInvitation {
  id: string;
  email: string;
  role: 'admin' | 'member';
  status: 'pending' | 'accepted' | 'expired' | 'cancelled';
  invited_by: string;
  invited_by_name?: string;
  expires_at: string;
  created_at: string;
}

export interface InviteUserData {
  email: string;
  role: 'admin' | 'member';
}

export interface InviteUserResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    role: string;
  };
  credentials?: {
    email: string;
    password: string;
  };
}

export interface ChangeRoleData {
  userId: string;
  newRole: 'admin' | 'member';
}

export interface ChangeRoleResponse {
  success: boolean;
  message: string;
}

export interface CancelInvitationData {
  invitationId: string;
}

export interface CancelInvitationResponse {
  success: boolean;
  message: string;
}

export interface RemoveMemberData {
  userId: string;
}

export interface RemoveMemberResponse {
  success: boolean;
  message: string;
}

export interface UseTeamReturn {
  teamMembers: TeamMember[];
  pendingInvitations: PendingInvitation[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  totalMembers: number;
  totalPendingInvitations: number;
  inviteUser: (userData: InviteUserData) => Promise<InviteUserResponse>;
  isInviting: boolean;
  changeUserRole: (roleData: ChangeRoleData) => Promise<ChangeRoleResponse>;
  isChangingRole: boolean;
  cancelInvitation: (invitationData: CancelInvitationData) => Promise<CancelInvitationResponse>;
  isCancellingInvitation: boolean;
  removeMember: (memberData: RemoveMemberData) => Promise<RemoveMemberResponse>;
  isRemovingMember: boolean;
}
