"use client";

import { useState } from "react";
import { PiUsersDuotone, PiPlusDuotone, PiTrashDuotone, PiCrownDuotone, PiEnvelopeDuotone } from "react-icons/pi";
import { useTeam } from "@/hooks/use-team";
import type { TeamMember } from "@/hooks/use-team";

export default function TeamSettings() {
  const { teamMembers, isLoading, error, refresh, totalMembers, inviteUser, isInviting, changeUserRole, isChangingRole } = useTeam();
  const [newInviteEmail, setNewInviteEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<'admin' | 'member'>('member');
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);
  const [roleChangeError, setRoleChangeError] = useState<string | null>(null);
  const [roleChangeSuccess, setRoleChangeSuccess] = useState<string | null>(null);

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'owner':
        return 'bg-[var(--color-hover-pink)]/20 text-[var(--color-hover-pink)] border-[var(--color-hover-pink)]/30';
      case 'admin':
        return 'bg-[var(--color-main-accent)]/20 text-[var(--color-main-accent)] border-[var(--color-main-accent)]/30';
      case 'member':
        return 'bg-[var(--color-sky-blue)]/20 text-[var(--color-sky-blue)] border-[var(--color-sky-blue)]/30';
      default:
        return 'bg-white/10 text-white/80 border-white/20';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role.toLowerCase()) {
      case 'owner':
        return 'Owner';
      case 'admin':
        return 'Admin';
      case 'member':
        return 'Member';
      default:
        return role;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-[var(--color-grassy-green)]/20 text-[var(--color-grassy-green)] border-[var(--color-grassy-green)]/30';
      case 'Pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Inactive':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-white/10 text-white/80 border-white/20';
    }
  };

  const handleInviteUser = async () => {
    if (!newInviteEmail.trim()) {
      setInviteError("Please enter an email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newInviteEmail)) {
      setInviteError("Please enter a valid email address");
      return;
    }

    // Clear previous messages
    setInviteError(null);
    setInviteSuccess(null);

    try {
      const result = await inviteUser({
        email: newInviteEmail.trim(),
        role: selectedRole
      });

      if (result.success) {
        setInviteSuccess(`Successfully invited ${newInviteEmail} as ${selectedRole}`);
        setNewInviteEmail("");
        
        // Console log the credentials as requested
        if (result.credentials) {
          console.log('🎉 New company user invited:');
          console.log('📧 Email:', result.credentials.email);
          console.log('🔑 Password:', result.credentials.password);
          console.log('👤 Role:', selectedRole);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to invite user';
      setInviteError(errorMessage);
    }
  };

  const handleRemoveMember = (memberId: string) => {
    // TODO: Implement member removal functionality
    console.log(`Would remove member ${memberId}`);
  };

  const handleRoleChange = async (memberId: string, newRole: 'admin' | 'member') => {
    // Clear previous messages
    setRoleChangeError(null);
    setRoleChangeSuccess(null);

    try {
      const result = await changeUserRole({
        userId: memberId,
        newRole: newRole
      });

      if (result.success) {
        setRoleChangeSuccess(result.message);
        // Clear success message after 3 seconds
        setTimeout(() => setRoleChangeSuccess(null), 3000);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to change role';
      setRoleChangeError(errorMessage);
      // Clear error message after 5 seconds
      setTimeout(() => setRoleChangeError(null), 5000);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white/3 backdrop-blur-xl border border-white/5 backdrop-saturate-150 rounded-2xl p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[var(--color-sky-blue)]/20 rounded-lg">
              <PiUsersDuotone className="w-5 h-5 text-[var(--color-sky-blue)]" />
            </div>
            <h2 className="text-xl font-semibold text-white/90">Team Settings</h2>
          </div>
          <p className="text-sm text-white/60">Loading team members...</p>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-white/10 rounded mb-2 w-1/3"></div>
                  <div className="h-3 bg-white/10 rounded w-1/2"></div>
                </div>
                <div className="flex gap-2">
                  <div className="w-16 h-6 bg-white/10 rounded"></div>
                  <div className="w-16 h-6 bg-white/10 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white/3 backdrop-blur-xl border border-white/5 backdrop-saturate-150 rounded-2xl p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-[var(--color-sky-blue)]/20 rounded-lg">
              <PiUsersDuotone className="w-5 h-5 text-[var(--color-sky-blue)]" />
            </div>
            <h2 className="text-xl font-semibold text-white/90">Team Settings</h2>
          </div>
        </div>
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
          <p className="text-red-300 text-sm">Error loading team members: {error}</p>
          <button 
            onClick={refresh}
            className="mt-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/30 rounded-lg text-sm transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/3 backdrop-blur-xl border border-white/5 backdrop-saturate-150 rounded-2xl p-6">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-[var(--color-sky-blue)]/20 rounded-lg">
            <PiUsersDuotone className="w-5 h-5 text-[var(--color-sky-blue)]" />
          </div>
          <h2 className="text-xl font-semibold text-white/90">Team Settings</h2>
        </div>
        <p className="text-sm text-white/60">Manage team members, roles, and invitations</p>
      </div>

      <div className="space-y-6">
        {/* Invite New Member */}
        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
          <h3 className="text-base font-medium text-white/90 mb-4">Invite Team Member</h3>
          <p className="text-sm text-white/60 mb-4">Add new company users with admin or member roles.</p>
          
          {/* Success Message */}
          {inviteSuccess && (
            <div className="mb-4 p-3 bg-[var(--color-grassy-green)]/20 border border-[var(--color-grassy-green)]/30 rounded-lg">
              <p className="text-[var(--color-grassy-green)] text-sm">{inviteSuccess}</p>
            </div>
          )}
          
          {/* Error Message */}
          {inviteError && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-300 text-sm">{inviteError}</p>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="email"
                placeholder="Enter email address..."
                value={newInviteEmail}
                onChange={(e) => {
                  setNewInviteEmail(e.target.value);
                  // Clear messages when user starts typing
                  if (inviteError) setInviteError(null);
                  if (inviteSuccess) setInviteSuccess(null);
                }}
                disabled={isInviting}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white/90 placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-main-accent)]/50 focus:border-[var(--color-main-accent)]/40 transition-all duration-300 disabled:opacity-50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleInviteUser();
                  }
                }}
              />
            </div>
            
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as 'admin' | 'member')}
              disabled={isInviting}
              className="appearance-none px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-main-accent)]/50 focus:border-[var(--color-main-accent)]/40 transition-all duration-300 [&>option]:bg-gray-800 [&>option]:text-white [&>option]:border-none disabled:opacity-50"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff60' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.75rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1rem 1rem',
                paddingRight: '2.5rem'
              }}
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            
            <button
              onClick={handleInviteUser}
              disabled={isInviting || !newInviteEmail.trim()}
              className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-main-accent)]/20 hover:bg-[var(--color-main-accent)]/30 text-[var(--color-main-accent)] border border-[var(--color-main-accent)]/30 hover:border-[var(--color-main-accent)]/50 rounded-lg text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PiPlusDuotone className="w-4 h-4" />
              {isInviting ? 'Inviting...' : 'Invite'}
            </button>
          </div>
        </div>

        {/* Team Members List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white/90">Team Members</h3>
            <span className="text-sm text-white/50">{totalMembers} member{totalMembers !== 1 ? 's' : ''}</span>
          </div>
          
          {/* Role Change Success Message */}
          {roleChangeSuccess && (
            <div className="mb-4 p-3 bg-[var(--color-grassy-green)]/20 border border-[var(--color-grassy-green)]/30 rounded-lg">
              <p className="text-[var(--color-grassy-green)] text-sm">{roleChangeSuccess}</p>
            </div>
          )}
          
          {/* Role Change Error Message */}
          {roleChangeError && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-300 text-sm">{roleChangeError}</p>
            </div>
          )}
          
          <div className="space-y-3">
            {teamMembers.map((member) => (
              <div key={member.id} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/8 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[var(--color-main-accent)]/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-[var(--color-main-accent)]">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-base font-medium text-white/90">{member.name}</h4>
                        {member.role === 'owner' && (
                          <PiCrownDuotone className="w-4 h-4 text-[var(--color-hover-pink)]" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <PiEnvelopeDuotone className="w-3 h-3" />
                        <span>{member.email}</span>
                        <span>•</span>
                        <span>Joined {member.joinDate}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 text-xs border rounded-full ${getRoleColor(member.role)}`}>
                      {getRoleDisplayName(member.role)}
                    </span>
                    <span className={`px-2 py-1 text-xs border rounded-full ${getStatusColor(member.status)}`}>
                      {member.status}
                    </span>
                    
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, e.target.value as 'admin' | 'member')}
                      disabled={isChangingRole || member.role === 'owner'}
                      className="appearance-none px-3 py-1 bg-white/5 border border-white/20 rounded-lg text-xs text-white/90 focus:outline-none focus:ring-1 focus:ring-[var(--color-main-accent)]/50 focus:border-[var(--color-main-accent)]/40 transition-all duration-300 [&>option]:bg-gray-800 [&>option]:text-white [&>option]:border-none disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff60' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.5rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1rem 1rem',
                        paddingRight: '2rem'
                      }}
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                      {/* Owner role cannot be changed via dropdown */}
                      {member.role === 'owner' && <option value="owner">Owner</option>}
                    </select>
                    
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg border border-red-500/30 hover:border-red-500/60 transition-all duration-300"
                    >
                      <PiTrashDuotone className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Role Permissions Info */}
        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
          <h3 className="text-base font-medium text-white/90 mb-3">Role Permissions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 border rounded-full ${getRoleColor('Admin')}`}>Admin</span>
              </div>
              <ul className="text-white/60 space-y-1">
                <li>• Full system access</li>
                <li>• Manage team members</li>
                <li>• Billing and settings</li>
                <li>• All data access</li>
              </ul>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 border rounded-full ${getRoleColor('Member')}`}>Member</span>
              </div>
              <ul className="text-white/60 space-y-1">
                <li>• Create and edit content</li>
                <li>• Access most features</li>
                <li>• View team data</li>
                <li>• Standard permissions</li>
              </ul>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 border rounded-full ${getRoleColor('Viewer')}`}>Viewer</span>
              </div>
              <ul className="text-white/60 space-y-1">
                <li>• Read-only access</li>
                <li>• View dashboards</li>
                <li>• Export reports</li>
                <li>• Limited permissions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
