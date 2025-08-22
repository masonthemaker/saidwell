'use client';

import SignUpForm from '@/components/auth/sign-up-form';
import ParallaxBackground from '@/components/ParallaxBackground';

export default function SignUp() {
  return (
    <div className="min-h-screen w-full bg-app-bg relative flex items-center justify-center p-4">
      <ParallaxBackground variant="signup" />
      
      <div className="relative z-10 bg-white/3 backdrop-blur-xl border border-white/5 rounded-2xl backdrop-saturate-150 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white/90 mb-2">Create Account</h1>
          <p className="text-white/60">Sign up for a new account</p>
        </div>

        <SignUpForm />
        
        <div className="mt-6 text-center">
          <p className="text-sm text-white/60">
            Already have an account?{' '}
            <a href="/auth/login" className="text-main-accent hover:text-hover-pink font-medium transition-all duration-300 ease-out">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
