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

export interface UseTeamReturn {
  teamMembers: TeamMember[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  totalMembers: number;
}
