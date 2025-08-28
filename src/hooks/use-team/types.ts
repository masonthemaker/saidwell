export interface TeamMember {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  status: 'Active' | 'Pending' | 'Inactive';
  joinDate: string;
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

export interface UseTeamReturn {
  teamMembers: TeamMember[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  totalMembers: number;
  inviteUser: (userData: InviteUserData) => Promise<InviteUserResponse>;
  isInviting: boolean;
}
