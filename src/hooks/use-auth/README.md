## useAuth

Multi-tenant authentication hook supporting both company-level and client-level permissions. Exposes Supabase auth state with support for white-label dashboard providers (companies) and their client organizations.

### What it returns

#### Core Auth State
- **isLoading**: boolean
- **session**: Supabase `Session | null`
- **user**: Supabase `User | null`
- **accessToken**: `string | null`
- **refresh**: `() => Promise<void>`; re-fetches current session

#### Company-Level Permissions
- **memberships**: `Array<{ company_id: string; role: string }>` from `public.memberships`
- **roles**: `string[]` unique roles derived from memberships
- **hasRole(requiredRole: string)**: boolean helper
- **isOwner()**: boolean helper (company owner)
- **isAdmin()**: boolean helper (company admin)
- **isUser()**: boolean helper (true for `member` or `user`)
- **isClient()**: boolean helper

#### Client-Level Permissions
- **userClients**: `UserClient[]` - client organizations user belongs to
- **clientRoles**: `string[]` - unique client roles (admin, member)
- **hasClientRole(requiredRole: string)**: boolean helper
- **isClientAdmin()**: boolean helper
- **isClientMember()**: boolean helper
- **getCurrentClient()**: `UserClient | null` - currently selected client
- **setCurrentClient(clientId: string)**: void - switch active client

#### UserClient Type
```typescript
type UserClient = {
  client_id: string
  client_name: string
  company_id: string
  role: string // 'admin' | 'member'
}
```

### Silent Operation
The hook operates silently without console logging for production use. All error handling is done internally with graceful fallbacks.

### Multi-Tenant Data Flow

1. **User logs in** → Supabase Auth session established
2. **Load company memberships** → `public.memberships` table
3. **Load client relationships** → `public.user_clients` + `public.clients` tables  
4. **Set current client** → First client selected by default
5. **Access control applied** → RLS policies enforce data isolation

### Usage

#### Basic Company-Level Access
```tsx
'use client'
import useAuth from '@/hooks/use-auth'

export default function CompanyDashboard() {
  const { isLoading, isOwner, isAdmin, memberships } = useAuth()
  
  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      {isOwner() && <div>Company Owner Tools</div>}
      {isAdmin() && <div>Company Admin Tools</div>}
      <p>Company memberships: {memberships.length}</p>
    </div>
  )
}
```

#### Multi-Client Access
```tsx
'use client'
import useAuth from '@/hooks/use-auth'

export default function ClientDashboard() {
  const { 
    isLoading, 
    userClients, 
    getCurrentClient, 
    setCurrentClient,
    isClientAdmin,
    isOwner 
  } = useAuth()
  
  if (isLoading) return <div>Loading...</div>

  const currentClient = getCurrentClient()

  return (
    <div>
      {/* Client Switcher */}
      {userClients.length > 1 && (
        <select 
          value={currentClient?.client_id || ''} 
          onChange={(e) => setCurrentClient(e.target.value)}
        >
          {userClients.map(client => (
            <option key={client.client_id} value={client.client_id}>
              {client.client_name}
            </option>
          ))}
        </select>
      )}

      {/* Role-based UI */}
      {isOwner() && <div>Company Owner: Can create clients & agents</div>}
      {isClientAdmin() && <div>Client Admin: Can manage client settings</div>}
      
      {/* Current client context */}
      {currentClient && (
        <div>
          <h2>Current Client: {currentClient.client_name}</h2>
          <p>Your role: {currentClient.role}</p>
        </div>
      )}
    </div>
  )
}
```

#### Agent Access (Company vs Client perspective)
```tsx
'use client'
import useAuth from '@/hooks/use-auth'

export default function AgentManager() {
  const { isOwner, isAdmin, getCurrentClient } = useAuth()
  
  // Company owners/admins can create and assign agents
  const canManageAgents = isOwner() || isAdmin()
  
  // Client users can only see agents assigned to their client
  const currentClient = getCurrentClient()
  
  return (
    <div>
      {canManageAgents && (
        <div>
          <h2>Agent Management (Company Level)</h2>
          <button>Create New Agent</button>
          <button>Assign Agents to Clients</button>
        </div>
      )}

      {currentClient && (
        <div>
          <h2>My Agents ({currentClient.client_name})</h2>
          {/* Show agents assigned to current client */}
        </div>
      )}
    </div>
  )
}
```

#### Analytics Components (Separate from Auth)
```tsx
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import useAuth from '@/hooks/use-auth'

type AgentAnalytics = {
  id: string
  agent_id: string
  agent_name: string
  total_interactions: number
  client_name?: string
}

export default function AnalyticsComponent() {
  const { isOwner, isAdmin, getCurrentClient } = useAuth()
  const [analytics, setAnalytics] = useState<AgentAnalytics[]>([])
  const supabase = createClient()

  useEffect(() => {
    const loadAnalytics = async () => {
      // RLS policies will automatically filter based on user's access level
      const { data } = await supabase
        .from('agent_analytics')
        .select(`
          id, agent_id, total_interactions,
          agents!inner (name, clients(name))
        `)
        .order('created_at', { ascending: false })
      
      if (data) {
        setAnalytics(data.map(item => ({
          id: item.id,
          agent_id: item.agent_id, 
          agent_name: item.agents.name,
          total_interactions: item.total_interactions,
          client_name: item.agents.clients?.name
        })))
      }
    }

    loadAnalytics()
  }, [])

  return (
    <div>
      <h2>Analytics Dashboard</h2>
      {(isOwner() || isAdmin()) && (
        <p>Company View: {analytics.length} total records</p>
      )}
      
      {analytics.map(analytic => (
        <div key={analytic.id}>
          {analytic.agent_name}: {analytic.total_interactions} interactions
          {analytic.client_name && ` (${analytic.client_name})`}
        </div>
      ))}
    </div>
  )
}
```

### Access Control Patterns

#### Company-Level Gating
```tsx
// Company management - owners/admins only
{(isOwner() || isAdmin()) && (
  <CreateClientButton />
  <ManageAgentsButton />
)}

// Role-specific features
{isOwner() && <CompanySettingsPanel />}
{hasRole('admin') && <UserManagementPanel />}
```

#### Client-Level Gating
```tsx
// Client-specific features
{isClientAdmin() && <ClientSettingsPanel />}
{getCurrentClient() && <AgentDashboard clientId={getCurrentClient().client_id} />}

// Multi-client scenarios
{userClients.length > 1 && <ClientSwitcher />}
```

#### Combined Permissions
```tsx
// Agent creation: Company level
{(isOwner() || isAdmin()) && <CreateAgentForm />}

// Agent usage: Client level  
{getCurrentClient() && <UseAgentInterface />}
```

### Server-Side Gating (Recommended)
- **Middleware**: Check company/client permissions in `src/middleware.ts`
- **Server Components**: Validate access via `src/lib/supabase/server.ts`
- **API Routes**: Always verify permissions server-side for security

### Production Notes
- **Logging**: Remove or guard console logs (`process.env.NODE_ENV !== 'production'`)
- **Token Security**: Hook avoids logging raw tokens, but verify in production
- **RLS Policies**: Database-level security is enabled and tested
- **Client Switching**: Consider persisting selected client in localStorage/session
