"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import MainContent from "./MainContent";
import TopBar from "./TopBar";
import ParallaxBackground from "@/components/ParallaxBackground";
import { useAuth } from "@/hooks/useAuth/useAuth";
import AuthContextInfo from "@/components/auth/AuthContextInfo";

export default function CompanyDashboard() {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const { context } = useAuth();

  const companyName = context?.activeContext?.name || "Company";

  return (
    <div className="min-h-screen w-full bg-app-bg relative">
      <Sidebar isExpanded={isNavExpanded} setIsExpanded={setIsNavExpanded} />
      <TopBar isNavExpanded={isNavExpanded} pageName={`${companyName} Dashboard`} />
      <div className="transition-all duration-300 ease-in-out" style={{
        marginLeft: isNavExpanded ? '240px' : '80px',
        paddingTop: '80px'
      }}>
        <div className="p-6">
          <AuthContextInfo />
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Company Dashboard</h1>
            <p className="text-white/70">Managing {companyName} - Company Admin View</p>
          </div>
          
          {/* Company-specific content */}
          <div className="grid gap-6">
            {/* Company Overview */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Company Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-2xl font-bold text-main-accent">
                    {context?.clients.length || 0}
                  </div>
                  <div className="text-white/70">Active Clients</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-2xl font-bold text-main-accent">5</div>
                  <div className="text-white/70">AI Agents</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-2xl font-bold text-main-accent">
                    {context?.companies.length || 0}
                  </div>
                  <div className="text-white/70">Companies Managed</div>
                </div>
              </div>
            </div>

            {/* Client Management */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Client Management</h2>
              <div className="space-y-3">
                {context?.clients.map((client) => (
                  <div key={client.id} className="bg-white/5 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <div className="font-medium text-white">{client.name}</div>
                      <div className="text-sm text-white/60">Status: {client.status}</div>
                    </div>
                    <div className="text-sm text-white/70">
                      Role: {client.my_company_role || client.my_client_role}
                    </div>
                  </div>
                )) || (
                  <div className="text-white/60 text-center py-8">No clients found</div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="bg-main-accent/20 hover:bg-main-accent/30 text-main-accent border border-main-accent/20 hover:border-main-accent/40 font-medium py-3 px-4 rounded-lg transition-all duration-300">
                  Add New Client
                </button>
                <button className="bg-main-accent/20 hover:bg-main-accent/30 text-main-accent border border-main-accent/20 hover:border-main-accent/40 font-medium py-3 px-4 rounded-lg transition-all duration-300">
                  Create AI Agent
                </button>
                <button className="bg-main-accent/20 hover:bg-main-accent/30 text-main-accent border border-main-accent/20 hover:border-main-accent/40 font-medium py-3 px-4 rounded-lg transition-all duration-300">
                  Manage Users
                </button>
                <button className="bg-main-accent/20 hover:bg-main-accent/30 text-main-accent border border-main-accent/20 hover:border-main-accent/40 font-medium py-3 px-4 rounded-lg transition-all duration-300">
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ParallaxBackground />
    </div>
  );
}
