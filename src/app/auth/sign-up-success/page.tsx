'use client';

import ParallaxBackground from '@/components/ParallaxBackground';

export default function SignUpSuccess() {
  return (
    <div className="min-h-screen w-full bg-app-bg relative flex items-center justify-center p-4">
      <ParallaxBackground variant="signup" />
      
      <div className="relative z-10 bg-white/3 backdrop-blur-xl border border-white/5 rounded-2xl backdrop-saturate-150 p-8 w-full max-w-md">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-grassy-green/20 border border-grassy-green/30 backdrop-blur-sm mb-4">
            <svg className="h-6 w-6 text-grassy-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-white/90 mb-2">Check Your Email</h1>
          <p className="text-white/60 mb-6">
            We&apos;ve sent you a confirmation link. Please check your email and click the link to activate your account.
          </p>
          
          <div className="space-y-4">
            <p className="text-sm text-white/40">
              Didn&apos;t receive the email? Check your spam folder or try signing up again.
            </p>
            
            <a 
              href="/auth/login"
              className="block w-full bg-main-accent/20 hover:bg-main-accent/30 text-main-accent border border-main-accent/20 hover:border-main-accent/40 font-medium py-2 px-4 rounded-lg transition-all duration-300 ease-out backdrop-blur-sm text-center"
            >
              Back to Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
