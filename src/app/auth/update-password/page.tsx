'use client';

import UpdatePasswordForm from '@/components/update-password-form';
import ParallaxBackground from '@/components/ParallaxBackground';

export default function UpdatePassword() {
  return (
    <div className="min-h-screen w-full bg-app-bg relative flex items-center justify-center p-4">
      <ParallaxBackground />
      
      <div className="relative z-10 bg-white/3 backdrop-blur-xl border border-white/5 rounded-2xl backdrop-saturate-150 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white/90 mb-2">Update Password</h1>
          <p className="text-white/60">Enter your new password</p>
        </div>

        <UpdatePasswordForm />
      </div>
    </div>
  );
}
