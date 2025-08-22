'use client';

import { useAuth } from "@/hooks/useAuth/useAuth";
import { useParams } from "next/navigation";
import CompanyDashboard from "@/components/dash/CompanyDashboard";

export default function CompanyPage() {
  const { isLoading, contextLoading, context } = useAuth(true);
  const params = useParams();
  const slug = params.slug as string;

  if (isLoading || contextLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg font-medium">Loading...</div>
      </div>
    );
  }

  // Verify user has access to this company
  const hasAccess = context?.companies.some(c => c.slug === slug) || false;
  
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg font-medium text-red-500">Access Denied</div>
      </div>
    );
  }

  return <CompanyDashboard />;
}
