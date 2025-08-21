'use client';

import Dashboard from "@/components/dash";
import { useAuth } from "@/hooks/useAuth/useAuth";

export default function Home() {
  const { isLoading } = useAuth(true);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg font-medium">Loading...</div>
      </div>
    );
  }

  return <Dashboard />;
}
