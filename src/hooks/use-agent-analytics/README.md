# useAgentAnalytics

A React hook for managing agent analytics data with proper permission handling and caching. Built following the same patterns as `useAuth` hook.

## Features

- **Permission-aware**: Automatically respects RLS policies
  - Company owners/admins see all company agent analytics
  - Client users see only analytics for agents assigned to their client
- **Caching**: Intelligent caching of analytics data by agent ID
- **Real-time loading states**: Separate loading states for different operations
- **Error handling**: Comprehensive error handling with user-friendly messages
- **TypeScript**: Full TypeScript support with proper types

## Usage

### Basic Usage

```tsx
import { useAgentAnalytics } from '@/hooks/use-agent-analytics'

export function AnalyticsDashboard() {
  const {
    allAnalytics,
    isLoading,
    totalInteractions,
    agentCount,
    error,
    refresh
  } = useAgentAnalytics()

  if (isLoading) return <div>Loading analytics...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h2>Analytics Overview</h2>
      <p>Total Agents: {agentCount}</p>
      <p>Total Interactions: {totalInteractions}</p>
      
      <button onClick={refresh}>Refresh Data</button>
      
      {allAnalytics.map(analytics => (
        <div key={analytics.id}>
          <h3>{analytics.agent_name}</h3>
          <p>Platform: {analytics.agent_platform_name}</p>
          <p>Interactions: {analytics.total_interactions}</p>
          {analytics.client_name && <p>Client: {analytics.client_name}</p>}
        </div>
      ))}
    </div>
  )
}
```

### Get Analytics by Agent ID

```tsx
import { useAgentAnalytics } from '@/hooks/use-agent-analytics'

export function AgentDetail({ agentId }: { agentId: string }) {
  const { getAnalyticsByAgentId, isLoadingByAgent } = useAgentAnalytics()
  const [agentAnalytics, setAgentAnalytics] = useState([])

  useEffect(() => {
    const loadAgentData = async () => {
      const data = await getAnalyticsByAgentId(agentId)
      setAgentAnalytics(data)
    }
    
    loadAgentData()
  }, [agentId, getAnalyticsByAgentId])

  if (isLoadingByAgent) return <div>Loading agent analytics...</div>

  return (
    <div>
      <h2>Agent Analytics History</h2>
      {agentAnalytics.map(analytics => (
        <div key={analytics.id}>
          <p>Interactions: {analytics.total_interactions}</p>
          <p>Updated: {new Date(analytics.updated_at).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  )
}
```

## Return Values

### Loading States
- `isLoading: boolean` - Loading state for initial data fetch
- `isLoadingByAgent: boolean` - Loading state for agent-specific queries

### Data
- `allAnalytics: AgentAnalyticsWithDetails[]` - All analytics data user has access to
- `analyticsById: Record<string, AgentAnalyticsWithDetails[]>` - Cached analytics by agent ID

### Methods
- `refresh(): Promise<void>` - Refresh all data and clear cache
- `getAnalyticsByAgentId(agentId: string): Promise<AgentAnalyticsWithDetails[]>` - Get analytics for specific agent

### Computed Values
- `totalInteractions: number` - Sum of all interactions across all analytics
- `agentCount: number` - Number of unique agents with analytics

### Error Handling
- `error: string | null` - Current error message, if any

## Types

### AgentAnalytics
```typescript
type AgentAnalytics = {
  id: string
  agent_id: string
  total_interactions: number
  created_at: string
  updated_at: string
}
```

### AgentAnalyticsWithDetails
```typescript
type AgentAnalyticsWithDetails = AgentAnalytics & {
  agent_name: string
  agent_platform_name: string
  client_id?: string
  client_name?: string
  company_id: string
}
```

## Permission Model

The hook automatically handles permissions through Supabase RLS policies:

### Company Level Access
- **Company Owners**: Full access to all company agent analytics
- **Company Admins**: Full access to all company agent analytics

### Client Level Access
- **Client Users**: Read access to analytics for agents assigned to their client only

### Data Isolation
- Complete isolation between different companies
- Client users only see data for their assigned agents
- All permissions enforced at the database level via RLS

## Caching Strategy

- **All Analytics**: Loaded once on mount, refreshed on demand
- **By Agent ID**: Cached after first fetch, cleared on refresh
- **Intelligent Updates**: Cache invalidation on refresh to ensure data freshness

## Error Handling

The hook provides comprehensive error handling:
- Database query errors are caught and exposed via the `error` state
- Network errors are handled gracefully
- Invalid agent IDs return empty arrays without throwing
- All errors are logged to console for debugging

## Integration with useAuth

The hook seamlessly integrates with the existing `useAuth` hook:
- Automatically respects user authentication state
- Uses auth context for permission checks
- Clears data when user logs out
- Leverages existing RLS policy infrastructure
