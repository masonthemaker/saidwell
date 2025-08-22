'use client';

import { useAuth } from "@/hooks/useAuth/useAuth";
import { useRouter } from "next/navigation";
import ParallaxBackground from "@/components/ParallaxBackground";

export default function AuthTestPage() {
  const { context, user, switchContext } = useAuth(false); // Don't require auth for testing
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-app-bg relative">
      <div className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6">Auth System Test Page</h1>
          
          {/* Auth Status */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Authentication Status</h2>
            <div className="space-y-2">
              <div><strong className="text-white">User:</strong> <span className="text-white/70">{user?.email || 'Not logged in'}</span></div>
              <div><strong className="text-white">Context Type:</strong> <span className="text-white/70">{context?.type || 'None'}</span></div>
              <div><strong className="text-white">Active Context:</strong> <span className="text-white/70">
                {context?.activeContext ? `${context.activeContext.name} (${context.activeContext.type})` : 'None'}
              </span></div>
            </div>
          </div>

          {/* Context Details */}
          {context && (
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Company Access */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Company Access ({context.companies.length})</h3>
                {context.companies.length > 0 ? (
                  <div className="space-y-3">
                    {context.companies.map((company) => (
                      <div key={company.id} className="bg-white/5 rounded-lg p-3">
                        <div className="font-medium text-white">{company.name}</div>
                        <div className="text-sm text-white/60">Slug: {company.slug}</div>
                        <div className="text-sm text-white/60">Role: {company.my_role}</div>
                        <button
                          onClick={() => switchContext('company', company.id)}
                          className="mt-2 text-xs bg-main-accent/20 hover:bg-main-accent/30 text-main-accent px-3 py-1 rounded transition-all"
                        >
                          Switch to Company
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-white/60">No company access</div>
                )}
              </div>

              {/* Client Access */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Client Access ({context.clients.length})</h3>
                {context.clients.length > 0 ? (
                  <div className="space-y-3">
                    {context.clients.map((client) => (
                      <div key={client.id} className="bg-white/5 rounded-lg p-3">
                        <div className="font-medium text-white">{client.name}</div>
                        <div className="text-sm text-white/60">Company: {client.company_name}</div>
                        <div className="text-sm text-white/60">Role: {client.my_client_role || client.my_company_role}</div>
                        <button
                          onClick={() => switchContext('client', client.id)}
                          className="mt-2 text-xs bg-main-accent/20 hover:bg-main-accent/30 text-main-accent px-3 py-1 rounded transition-all"
                        >
                          Switch to Client
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-white/60">No client access</div>
                )}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button
                onClick={() => router.push('/')}
                className="bg-main-accent/20 hover:bg-main-accent/30 text-main-accent border border-main-accent/20 hover:border-main-accent/40 font-medium py-2 px-4 rounded-lg transition-all duration-300"
              >
                Client Dashboard
              </button>
              <button
                onClick={() => router.push('/company/techcorp')}
                className="bg-main-accent/20 hover:bg-main-accent/30 text-main-accent border border-main-accent/20 hover:border-main-accent/40 font-medium py-2 px-4 rounded-lg transition-all duration-300"
              >
                Company Dashboard
              </button>
              <button
                onClick={() => router.push('/dashboard/select-context')}
                className="bg-main-accent/20 hover:bg-main-accent/30 text-main-accent border border-main-accent/20 hover:border-main-accent/40 font-medium py-2 px-4 rounded-lg transition-all duration-300"
              >
                Context Selection
              </button>
              <button
                onClick={() => router.push('/auth/login')}
                className="bg-main-accent/20 hover:bg-main-accent/30 text-main-accent border border-main-accent/20 hover:border-main-accent/40 font-medium py-2 px-4 rounded-lg transition-all duration-300"
              >
                Login Page
              </button>
            </div>
          </div>
        </div>
      </div>
      <ParallaxBackground />
    </div>
  );
}
