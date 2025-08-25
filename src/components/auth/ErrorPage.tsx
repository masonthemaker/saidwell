import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

type Props = {
  message?: string
}

export default function ErrorPage({ message }: Props) {
  return (
    <div className="min-h-svh flex items-center justify-center p-6">
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
  )
}


