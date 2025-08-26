# useClients Hook

A React hook for managing client organization data in the white-label dashboard system. This hook provides secure access to client records with automatic filtering based on user roles and company memberships, following the same patterns as `useCalls` and `useAgentAnalytics`.

## Features

- **🔒 Role-based Access Control**: Automatic data filtering via Row Level Security (RLS)
  - **Company Users** (owner/admin/member): See ALL clients for their company
  - **Client Users**: Redirected away (no access to client management)
- **⚡ Smart Caching**: Loads data once per user session, persists across tab switches
- **🔄 Manual Refresh**: Explicit refresh method to reload data when needed
- **🛡️ Auth Protection**: Automatic redirect for unauthorized users
- **📊 Real-time States**: Loading, error, and data states
- **🎯 Performance Optimized**: Prevents unnecessary reloads and flashing

## Usage

### Basic Usage

```tsx
import { useClients } from '@/hooks/use-clients'

export function ClientManagement() {
  const { isLoading, clients, error, refresh } = useClients()

  if (isLoading) return <div>Loading clients...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <div className="header">
        <h1>Client Management</h1>
        <button onClick={refresh}>Refresh</button>
      </div>
      
      <div className="stats">
        <p>Total Clients: {clients.length}</p>
      </div>
      
      <div className="client-list">
        {clients.map(client => (
          <div key={client.id} className="client-card">
            <h3>{client.name}</h3>
            {client.company_name && <p>Company: {client.company_name}</p>}
            {client.created_at && (
              <p>Created: {new Date(client.created_at).toLocaleDateString()}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
```

### With Stats and Empty States

```tsx
import { useClients } from '@/hooks/use-clients'

export function ClientsDashboard() {
  const { isLoading, clients, error, refresh } = useClients()

  const totalClients = clients.length
  const recentClients = clients.filter(client => {
    if (!client.created_at) return false
    const clientDate = new Date(client.created_at)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return clientDate > thirtyDaysAgo
  }).length

  if (isLoading) {
    return <div className="loading">Loading clients...</div>
  }

  if (error) {
    return (
      <div className="error">
        <p>Error: {error}</p>
        <button onClick={refresh}>Try Again</button>
      </div>
    )
  }

  if (clients.length === 0) {
    return (
      <div className="empty-state">
        <h2>No clients yet</h2>
        <p>Get started by adding your first client organization</p>
        <button>Add Your First Client</button>
      </div>
    )
  }

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{totalClients}</h3>
          <p>Total Clients</p>
        </div>
        <div className="stat-card">
          <h3>{recentClients}</h3>
          <p>Added This Month</p>
        </div>
      </div>
      
      {/* Client list rendering */}
    </div>
  )
}
```

## Return Values

### Data
- `clients: ClientOrg[]` - Array of client organizations user has access to
- `isLoading: boolean` - Loading state for data fetching
- `error: string | null` - Current error message, if any

### Methods
- `refresh(): Promise<void>` - Manually refresh client data and clear cache

## Data Structure

### ClientOrg Type
```typescript
type ClientOrg = {
  id: string                    // Unique client ID
  name: string                  // Client organization name
  company_id: string            // ID of the company that owns this client
  company_name?: string         // Name of the owning company (joined data)
  created_at?: string          // ISO timestamp when client was created
}
```

## 🔒 Access Control & Security

The hook automatically enforces access control via **Row Level Security (RLS) policies** and client-side auth checks.

### White-Label Architecture

**Companies** create and manage **Client Organizations**. Each client can have multiple users and assigned agents.

```
Company (Acme Corp)
├── Client: Restaurant Chain A
├── Client: Hotel Group B  
└── Client: Retail Store C
```

### Access Control Rules

#### 🏢 **Company Users** (owner/admin/member roles)
- ✅ See **ALL clients** belonging to their company
- ✅ Full visibility into client management
- ✅ Can create, edit, and manage clients

#### 👥 **Client Users** (client-level users)
- ❌ **Automatically redirected** to home page
- ❌ No access to client management functionality
- ❌ Cannot see other clients or company data

**Database Policy:**
```sql
-- Company users can access their company's clients
CREATE POLICY "Company members can access their clients" ON clients
FOR ALL USING (
  company_id IN (
    SELECT company_id 
    FROM memberships 
    WHERE user_id = auth.uid()
  )
);
```

### Example Scenarios

**As Company Owner/Admin:**
```typescript
const { clients, isLoading } = useClients()
// Returns: All clients for their company
// Can see: Restaurant Chain A, Hotel Group B, Retail Store C
```

**As Client User:**
```typescript
const { clients, isLoading } = useClients()
// Immediately redirected to "/" - no data returned
// Cannot access client management at all
```

## ⚡ Performance & Caching

### Smart Caching Strategy
- **One-time Load**: Data loaded once per user session
- **Tab Persistence**: No reload when switching between tabs
- **Manual Refresh**: Explicit refresh clears cache and reloads
- **User Change**: Cache cleared when user logs out/changes

### Loading Behavior
```typescript
// First visit to /clients page
useClients() // → Loads data from database

// Switch to /history page, then back to /clients
useClients() // → Uses cached data, no reload

// Click refresh button
refresh() // → Clears cache, reloads from database

// User logs out and new user logs in
useClients() // → Clears old cache, loads new user's data
```

### Memory Management
- Automatic cleanup via React hooks
- Cache cleared on user change
- No memory leaks from subscriptions

## 🛠️ Implementation Notes

### Database Schema
The hook expects:
- `clients` table with RLS enabled
- Foreign key to `companies.id`
- Proper RLS policies for company-based access
- Standard permissions for `anon` and `authenticated` roles

### Error Handling  
- Comprehensive error logging with context
- Graceful fallbacks (empty arrays, null values)
- User-friendly error messages in `error` state
- Automatic redirect for unauthorized access

### TypeScript Support
- Full type safety with `ClientOrg` interface
- Proper typing for all return values
- Exported types for use in consuming components

### Integration with useAuth
- Seamlessly integrates with existing `useAuth` hook
- Uses auth context for permission checks and redirects
- Leverages existing RLS policy infrastructure
- Respects company membership roles


