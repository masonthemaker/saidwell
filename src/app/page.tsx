'use client';

import Dashboard from "@/components/dash";
import { useAuth } from "@/hooks/useAuth/useAuth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isLoading, contextLoading, context } = useAuth(true);
  const router = useRouter();

  useEffect(() => {
    // Auto-route based on context once loaded
    if (!isLoading && !contextLoading && context) {
      if (context.type === 'company') {
        // Company-only user, redirect to company dashboard
        router.push(`/company/${context.companies[0].slug}`);
      } else if (context.type === 'multi') {
        // Multi-access user, redirect to selection
        router.push('/dashboard/select-context');
      }
      // For 'client' type, stay on this page (current behavior)
    }
  }, [isLoading, contextLoading, context, router]);

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
