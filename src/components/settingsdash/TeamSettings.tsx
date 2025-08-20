"use client";

import { useState } from "react";
import { PiUsersDuotone, PiPlusDuotone, PiTrashDuotone, PiCrownDuotone, PiEnvelopeDuotone } from "react-icons/pi";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Member' | 'Viewer';
  status: 'Active' | 'Pending' | 'Inactive';
  joinDate: string;
}

export default function TeamSettings() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah@company.com",
      role: "Admin",
      status: "Active",
      joinDate: "Jan 2024"
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "michael@company.com", 
      role: "Member",
      status: "Active",
      joinDate: "Feb 2024"
    },
    {
      id: "3",
      name: "Emma Rodriguez",
      email: "emma@company.com",
      role: "Viewer",
      status: "Pending",
      joinDate: "Mar 2024"
    }
  ]);

  const [newInviteEmail, setNewInviteEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<'Admin' | 'Member' | 'Viewer'>('Member');

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-[var(--color-hover-pink)]/20 text-[var(--color-hover-pink)] border-[var(--color-hover-pink)]/30';
      case 'Member':
        return 'bg-[var(--color-main-accent)]/20 text-[var(--color-main-accent)] border-[var(--color-main-accent)]/30';
      case 'Viewer':
        return 'bg-[var(--color-sky-blue)]/20 text-[var(--color-sky-blue)] border-[var(--color-sky-blue)]/30';
      default:
        return 'bg-white/10 text-white/80 border-white/20';
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

  const handleInviteUser = () => {
    if (newInviteEmail.trim()) {
      const newMember: TeamMember = {
        id: Date.now().toString(),
        name: newInviteEmail.split('@')[0],
        email: newInviteEmail,
        role: selectedRole,
        status: 'Pending',
        joinDate: 'Just now'
      };
      setTeamMembers(prev => [...prev, newMember]);
      setNewInviteEmail("");
      console.log(`Invited ${newInviteEmail} as ${selectedRole}`);
      // TODO: Implement actual invitation when connected to backend
    }
  };

  const handleRemoveMember = (memberId: string) => {
    setTeamMembers(prev => prev.filter(member => member.id !== memberId));
    console.log(`Removed member ${memberId}`);
    // TODO: Implement actual removal when connected to backend
  };

  const handleRoleChange = (memberId: string, newRole: 'Admin' | 'Member' | 'Viewer') => {
    setTeamMembers(prev => prev.map(member => 
      member.id === memberId ? { ...member, role: newRole } : member
    ));
    console.log(`Changed role for ${memberId} to ${newRole}`);
    // TODO: Implement actual role change when connected to backend
  };

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
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="email"
                placeholder="Enter email address..."
                value={newInviteEmail}
                onChange={(e) => setNewInviteEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white/90 placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-main-accent)]/50 focus:border-[var(--color-main-accent)]/40 transition-all duration-300"
              />
            </div>
            
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as 'Admin' | 'Member' | 'Viewer')}
              className="appearance-none px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-main-accent)]/50 focus:border-[var(--color-main-accent)]/40 transition-all duration-300 [&>option]:bg-gray-800 [&>option]:text-white [&>option]:border-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff60' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.75rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1rem 1rem',
                paddingRight: '2.5rem'
              }}
            >
              <option value="Viewer">Viewer</option>
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
            </select>
            
            <button
              onClick={handleInviteUser}
              className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-main-accent)]/20 hover:bg-[var(--color-main-accent)]/40 text-[var(--color-main-accent)] border border-[var(--color-main-accent)]/30 hover:border-[var(--color-main-accent)]/60 rounded-lg text-sm font-medium transition-all duration-300"
            >
              <PiPlusDuotone className="w-4 h-4" />
              Invite
            </button>
          </div>
        </div>

        {/* Team Members List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-white/90">Team Members</h3>
            <span className="text-sm text-white/50">{teamMembers.length} member{teamMembers.length !== 1 ? 's' : ''}</span>
          </div>
          
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
                        {member.role === 'Admin' && (
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
                      {member.role}
                    </span>
                    <span className={`px-2 py-1 text-xs border rounded-full ${getStatusColor(member.status)}`}>
                      {member.status}
                    </span>
                    
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, e.target.value as 'Admin' | 'Member' | 'Viewer')}
                      className="appearance-none px-3 py-1 bg-white/5 border border-white/20 rounded-lg text-xs text-white/90 focus:outline-none focus:ring-1 focus:ring-[var(--color-main-accent)]/50 focus:border-[var(--color-main-accent)]/40 transition-all duration-300 [&>option]:bg-gray-800 [&>option]:text-white [&>option]:border-none"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff60' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.5rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1rem 1rem',
                        paddingRight: '2rem'
                      }}
                    >
                      <option value="Viewer">Viewer</option>
                      <option value="Member">Member</option>
                      <option value="Admin">Admin</option>
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
