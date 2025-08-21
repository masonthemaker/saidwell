'use client';

import FilesDashboard from "@/components/filesdash";
import { useAuth } from "@/hooks/useAuth/useAuth";

export default function Files() {
  const { isLoading } = useAuth(true);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg font-medium">Loading...</div>
      </div>
    );
  }

  return <FilesDashboard />;
}
