import { UpdatePasswordForm } from '@/components/update-password-form'
import ParallaxBackground from '@/components/ParallaxBackground'

export default function UpdatePasswordPage() {
  return (
    <div className="relative min-h-screen w-full bg-app-bg">
      <div className="relative z-10 flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <UpdatePasswordForm />
        </div>
      </div>
      <ParallaxBackground />
    </div>
  )
}


