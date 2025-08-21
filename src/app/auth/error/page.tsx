'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ParallaxBackground from '@/components/ParallaxBackground';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen w-full bg-app-bg relative flex items-center justify-center p-4">
      <ParallaxBackground variant="default" />
      
      <div className="relative z-10 bg-white/3 backdrop-blur-xl border border-white/5 rounded-2xl backdrop-saturate-150 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-error-red mb-2">Authentication Error</h1>
          <p className="text-white/60">Something went wrong during authentication</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error-red/10 border border-error-red/20 rounded-lg backdrop-blur-sm">
            <p className="text-error-red text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <p className="text-white/60 text-center">
            Please try again or contact support if the problem persists.
          </p>
          
          <div className="flex gap-3 justify-center">
            <Link 
              href="/auth/login"
              className="bg-main-accent/20 hover:bg-main-accent/30 text-main-accent border border-main-accent/20 hover:border-main-accent/40 font-medium py-2 px-4 rounded-lg transition-all duration-300 ease-out backdrop-blur-sm"
            >
              Back to Login
            </Link>
            <Link 
              href="/"
              className="bg-white/10 hover:bg-white/20 text-white/90 border border-white/20 hover:border-white/30 font-medium py-2 px-4 rounded-lg transition-all duration-300 ease-out backdrop-blur-sm"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
