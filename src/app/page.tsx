'use client';

import Dashboard from "@/components/dash";
import { useAuth } from "@/hooks/useAuth/useAuth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isLoading, contextLoading, context } = useAuth(true);
  const router = useRouter();
  const [hasRouted, setHasRouted] = useState(false);

  useEffect(() => {
    // Only auto-route on initial load, not when user explicitly navigates to /
    const isInitialLoad = !hasRouted && typeof window !== 'undefined' && !window.sessionStorage.getItem('explicit-client-route');
    
    if (!isLoading && !contextLoading && context && isInitialLoad) {
      // If user has only company access, redirect to company dashboard
      if (context.type === 'company') {
        setHasRouted(true);
        router.push(`/company/${context.companies[0].slug}`);
        return;
      }
      
      // If user has multi-access and no active context, go to selection
      if (context.type === 'multi' && !context.activeContext) {
        setHasRouted(true);
        router.push('/dashboard/select-context');
        return;
      }
      
      // For client-only or when active context is client, stay here
    }
  }, [isLoading, contextLoading, context, hasRouted, router]);

  if (isLoading || contextLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg font-medium text-white">Loading...</div>
      </div>
    );
  }

  // Show client dashboard (current dashboard)
  return <Dashboard />;
}
