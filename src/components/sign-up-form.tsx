'use client'

import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/protected`,
        },
      })
      if (error) throw error
      router.push('/auth/sign-up-success')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="bg-white/3 backdrop-blur-xl backdrop-saturate-150 border-2 border-dashed border-[var(--color-main-accent)]/40 rounded-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/saidwell.png"
              alt="Saidwell Logo"
              width={150}
              height={50}
              className="object-contain"
            />
          </div>
          <CardTitle className="text-2xl text-white/90">Sign up</CardTitle>
          <CardDescription className="text-white/60">Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-white/80">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border border-white/20 text-white/90 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-main-accent)]/50 focus:border-[var(--color-main-accent)]/40"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-white/80">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/5 border border-white/20 text-white/90 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-main-accent)]/50 focus:border-[var(--color-main-accent)]/40"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="repeat-password" className="text-white/80">Repeat Password</Label>
                </div>
                <Input
                  id="repeat-password"
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  className="bg-white/5 border border-white/20 text-white/90 placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-main-accent)]/50 focus:border-[var(--color-main-accent)]/40"
                />
              </div>
              {error && <p className="text-sm text-[var(--color-error-red)]">{error}</p>}
              <Button
                type="submit"
                className="w-full border border-[var(--color-main-accent)]/30 bg-[var(--color-main-accent)]/10 hover:bg-[var(--color-main-accent)]/20 text-[var(--color-main-accent)]"
                disabled={isLoading}
              >
                {isLoading ? 'Creating an account...' : 'Sign up'}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm text-white/70">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-[var(--color-main-accent)] underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
