'use client';

import { useAuth } from "@/hooks/useAuth/useAuth";

export default function AuthContextInfo() {
  const { context, user } = useAuth();

  if (!context) return null;

  return (
    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-6">
      <h3 className="text-sm font-medium text-green-300 mb-2">🔐 Auth Context (Testing)</h3>
      <div className="space-y-1 text-xs">
        <div><strong className="text-green-200">User:</strong> <span className="text-green-100">{user?.email}</span></div>
        <div><strong className="text-green-200">Context Type:</strong> <span className="text-green-100">{context.type}</span></div>
        <div><strong className="text-green-200">Active Context:</strong> <span className="text-green-100">
          {context.activeContext ? `${context.activeContext.name} (${context.activeContext.type})` : 'None'}
        </span></div>
        <div><strong className="text-green-200">Companies:</strong> <span className="text-green-100">{context.companies.length}</span></div>
        <div><strong className="text-green-200">Clients:</strong> <span className="text-green-100">{context.clients.length}</span></div>
        {context.activeContext && (
          <div><strong className="text-green-200">Dashboard:</strong> <span className="text-green-100">
            {context.activeContext.type === 'company' ? 'Company Admin View' : 'Client User View'}
          </span></div>
        )}
      </div>
    </div>
  );
}
