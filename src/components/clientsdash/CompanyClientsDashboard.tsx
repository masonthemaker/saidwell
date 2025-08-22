"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import TopBar from "@/components/dash/TopBar";
import ParallaxBackground from "@/components/ParallaxBackground";
import { useAuth } from "@/hooks/useAuth/useAuth";

export default function CompanyClientsDashboard() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const { context } = useAuth();

  const companyName = context?.activeContext?.name || "Company";

  return (
    <div className="min-h-screen w-full bg-app-bg relative">
      <Sidebar isExpanded={isNavExpanded} setIsExpanded={setIsNavExpanded} />
      <TopBar isNavExpanded={isNavExpanded} pageName={`${companyName} Clients`} />
      <div
        className="transition-all duration-300 ease-in-out"
        style={{ marginLeft: isNavExpanded ? "240px" : "80px", paddingTop: "80px" }}
      >
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Clients</h1>
            <p className="text-white/70">Manage clients for {companyName}</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Client List</h2>
              <button className="bg-main-accent/20 hover:bg-main-accent/30 text-main-accent border border-main-accent/20 hover:border-main-accent/40 font-medium py-2 px-4 rounded-lg transition-all duration-300">
                Add New Client
              </button>
            </div>

            <div className="space-y-3">
              {context?.clients && context.clients.length > 0 ? (
                context.clients.map((client) => (
                  <div key={client.id} className="bg-white/5 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <div className="font-medium text-white">{client.name}</div>
                      <div className="text-sm text-white/60">Status: {client.status}</div>
                    </div>
                    <div className="text-sm text-white/70">
                      Role: {client.my_company_role || client.my_client_role}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-white/60 text-center py-8">No clients found</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ParallaxBackground />
    </div>
  );
}


