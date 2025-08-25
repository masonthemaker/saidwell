import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import ParallaxBackground from '@/components/ParallaxBackground'

export default function SignUpSuccessPage() {
  return (
    <div className="relative min-h-screen w-full bg-app-bg">
      <div className="relative z-10 flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Check Your Email</CardTitle>
              <CardDescription>We just sent a confirmation link</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-white/70">
                Click the link in your inbox to verify your account. Then you can{' '}
                <Link href="/auth/login" className="underline underline-offset-4">
                  log in
                </Link>
                .
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <ParallaxBackground />
    </div>
  )
}


