## useAuth

Client-side hook exposing Supabase auth state. It logs a sanitized session object and decodes JWT claims on the client so you can inspect what the database/auth returns during development.

### What it returns
- **isLoading**: boolean
- **session**: Supabase `Session | null`
- **user**: Supabase `User | null`
- **accessToken**: `string | null`
- **refresh**: `() => Promise<void>`; re-fetches current session
- **memberships**: `Array<{ company_id: string; role: string }>` from `public.memberships`
- **roles**: `string[]` unique roles derived from memberships
- **hasRole(requiredRole: string)**: boolean helper
- **isOwner()**: boolean helper
- **isAdmin()**: boolean helper
- **isUser()**: boolean helper (true for `member` or `user`)
- **isClient()**: boolean helper

### What it logs (dev only)
- **Sanitized session**: `expires_at`, and `user` fields (no raw tokens)
- **Decoded JWT claims**: derived from `accessToken` on the client
- **Auth state changes**: event name plus sanitized session and claims
- **Membership roles**: bold log of roles and membership rows

Note: In Next.js dev with React Strict Mode, effects run twice, so you may see duplicate logs. This does not happen in production.

### Usage
```tsx
'use client'
import useAuth from '@/hooks/use-auth'

export default function Example() {
  const { isLoading, user, session, roles, isOwner, isAdmin, hasRole } = useAuth()
  if (isLoading) return null

  return (
    <div>
      {isOwner() && <div>Owner tools</div>}
      {isAdmin() && <div>Admin tools</div>}
      {hasRole('client') && <div>Client portal</div>}
      <pre className="text-xs">
        {JSON.stringify({
          user,
          roles,
          session: { expires_at: session?.expires_at, user: session?.user }
        }, null, 2)}
      </pre>
    </div>
  )
}
```

### Gating patterns (next steps)
- **Client-side UI gating**: Use helpers like `isOwner()` or `hasRole('admin')` to guard UI.
- **Server/middleware gating**: For hard protection and redirects, add checks in `src/middleware.ts` or server components via `src/lib/supabase/server.ts`. Consider fetching membership role on the server and redirecting based on it.

### Production notes
- Remove or guard console logs for production (e.g., log only in `process.env.NODE_ENV !== 'production'`).
- Avoid exposing sensitive tokens. The hook already avoids logging raw tokens.
