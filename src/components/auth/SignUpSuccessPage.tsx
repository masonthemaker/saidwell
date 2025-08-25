import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-svh flex items-center justify-center p-6">
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
  )
}


