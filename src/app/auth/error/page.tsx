import ErrorPage from '@/components/auth/ErrorPage'

export default function Page({ searchParams }: { searchParams: { error?: string } }) {
  return <ErrorPage message={searchParams?.error} />
}

