# useClients

A React hook to fetch clients for the current user's company memberships. Follows the same patterns as `useCalls` and `useAgentAnalytics`.

## Features

- Respects Supabase RLS policies (company users see their company clients)
- Loading and error states
- `refresh()` method to reload data

## Usage

```tsx
import { useClients } from '@/hooks/use-clients'

export function ClientsList() {
  const { isLoading, clients, error, refresh } = useClients()

  if (isLoading) return <div>Loading clients...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <button onClick={refresh}>Refresh</button>
      <ul>
        {clients.map(c => (
          <li key={c.id}>{c.name} {c.company_name ? `- ${c.company_name}` : ''}</li>
        ))}
      </ul>
    </div>
  )
}
```


