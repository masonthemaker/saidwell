'use client';

import { useAuth } from "@/hooks/useAuth/useAuth";
import { useState } from "react";

export default function ContextSwitcher() {
  const { context, switchContext } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!context || context.type === 'no_access') {
    return null;
  }

  if (context.type !== 'multi') {
    // Single context - just show current context
    return (
      <div className="px-3 py-2 bg-white/5 rounded-lg border border-white/10">
        <div className="text-xs text-white/60 uppercase tracking-wide">Context</div>
        <div className="text-sm font-medium text-white">
          {context.activeContext?.name || 'Loading...'}
        </div>
        <div className="text-xs text-white/60">
          {context.activeContext?.type === 'company' ? 'Company Admin' : 'Client User'}
        </div>
      </div>
    );
  }

  // Multi-access - show switcher
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-main-accent/40 transition-all duration-300 text-left"
      >
        <div className="text-xs text-white/60 uppercase tracking-wide">Context</div>
        <div className="text-sm font-medium text-white flex justify-between items-center">
          <span>{context.activeContext?.name || 'Select Context'}</span>
          <span className="text-white/40">⌄</span>
        </div>
        <div className="text-xs text-white/60">
          {context.activeContext?.type === 'company' ? 'Company Admin' : 'Client User'}
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg z-50">
          {/* Company Options */}
          {context.companies.length > 0 && (
            <div className="p-2">
              <div className="text-xs text-white/60 uppercase tracking-wide px-2 py-1">Companies</div>
              {context.companies.map((company) => (
                <button
                  key={company.id}
                  onClick={() => {
                    switchContext('company', company.id);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-2 py-2 hover:bg-white/10 rounded text-sm text-white transition-colors"
                >
                  <div className="font-medium">{company.name}</div>
                  <div className="text-xs text-white/60">Role: {company.my_role}</div>
                </button>
              ))}
            </div>
          )}

          {/* Client Options */}
          {context.clients.length > 0 && (
            <div className="p-2 border-t border-white/10">
              <div className="text-xs text-white/60 uppercase tracking-wide px-2 py-1">Clients</div>
              {context.clients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => {
                    switchContext('client', client.id);
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-2 py-2 hover:bg-white/10 rounded text-sm text-white transition-colors"
                >
                  <div className="font-medium">{client.name}</div>
                  <div className="text-xs text-white/60">
                    {client.company_name} • Role: {client.my_client_role || client.my_company_role}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
