'use client';

import { useAuth } from "@/hooks/useAuth/useAuth";
import ParallaxBackground from "@/components/ParallaxBackground";

export default function SelectContextPage() {
  const { context, contextLoading, switchContext } = useAuth(true);

  if (contextLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg font-medium text-white">Loading your dashboard options...</div>
      </div>
    );
  }

  if (!context || context.type !== 'multi') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg font-medium text-red-500">Invalid access state</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-app-bg relative flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Choose Your Dashboard</h1>
          <p className="text-white/70">You have access to multiple contexts. Select one to continue.</p>
        </div>

        <div className="grid gap-6">
          {/* Company Access */}
          {context.companies.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Company Access</h2>
              <div className="space-y-3">
                {context.companies.map((company) => (
                  <button
                    key={company.id}
                    onClick={() => switchContext('company', company.id)}
                    className="w-full bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-main-accent/40 rounded-lg p-4 text-left transition-all duration-300 group"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-lg font-medium text-white group-hover:text-main-accent transition-colors">
                          {company.name}
                        </div>
                        <div className="text-sm text-white/60">
                          Role: {company.my_role} • Status: {company.status}
                        </div>
                      </div>
                      <div className="text-main-accent opacity-70 group-hover:opacity-100 transition-opacity">
                        →
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Client Access */}
          {context.clients.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Client Access</h2>
              <div className="space-y-3">
                {context.clients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => switchContext('client', client.id)}
                    className="w-full bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-main-accent/40 rounded-lg p-4 text-left transition-all duration-300 group"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-lg font-medium text-white group-hover:text-main-accent transition-colors">
                          {client.name}
                        </div>
                        <div className="text-sm text-white/60">
                          Company: {client.company_name} • Role: {client.my_client_role || client.my_company_role} • Status: {client.status}
                        </div>
                      </div>
                      <div className="text-main-accent opacity-70 group-hover:opacity-100 transition-opacity">
                        →
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Testing Info */}
        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <h3 className="text-sm font-medium text-blue-300 mb-2">Testing Info</h3>
          <p className="text-xs text-blue-200/70">
            Context Type: {context.type} | Companies: {context.companies.length} | Clients: {context.clients.length}
          </p>
        </div>
      </div>
      <ParallaxBackground />
    </div>
  );
}
