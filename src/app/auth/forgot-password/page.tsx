'use client';

import ForgotPasswordForm from '@/components/forgot-password-form';
import ParallaxBackground from '@/components/ParallaxBackground';

export default function ForgotPassword() {
  return (
    <div className="min-h-screen w-full bg-app-bg relative flex items-center justify-center p-4">
      <ParallaxBackground variant="login" />
      
      <div className="relative z-10 bg-white/3 backdrop-blur-xl border border-white/5 rounded-2xl backdrop-saturate-150 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white/90 mb-2">Reset Password</h1>
          <p className="text-white/60">Enter your email to reset your password</p>
        </div>

        <ForgotPasswordForm />
        
        <div className="mt-6 text-center">
          <p className="text-sm text-white/60">
            Remember your password?{' '}
            <a href="/auth/login" className="text-main-accent hover:text-hover-pink font-medium transition-all duration-300 ease-out">
              Back to login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
