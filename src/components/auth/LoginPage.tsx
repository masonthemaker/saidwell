import { LoginForm } from '@/components/login-form'
import ParallaxBackground from '@/components/ParallaxBackground'

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full bg-app-bg">
      <div className="relative z-10 flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
      <ParallaxBackground />
    </div>
  )
}


