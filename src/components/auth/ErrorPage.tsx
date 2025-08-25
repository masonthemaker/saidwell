import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import ParallaxBackground from '@/components/ParallaxBackground'

type Props = {
  message?: string
}

export default function ErrorPage({ message }: Props) {
  return (
    <div className="relative min-h-screen w-full bg-app-bg">
      <div className="relative z-10 flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Something went wrong</CardTitle>
              <CardDescription>We couldn\'t complete the request</CardDescription>
            </CardHeader>
            <CardContent>
              {message && <p className="mb-4 text-sm text-red-400">{message}</p>}
              <p className="text-sm text-white/70">
                You can try again or go back to{' '}
                <Link href="/auth/login" className="underline underline-offset-4">
                  login
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


