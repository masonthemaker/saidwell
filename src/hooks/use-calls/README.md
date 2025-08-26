# useCalls Hook

A React hook for managing call data in the white-label dashboard system. This hook provides secure access to call records with automatic filtering based on user roles and company/client relationships.

## Features

- **🔒 Role-based Access Control**: Automatic data filtering via Row Level Security (RLS)
  - **Company Users** (owner/admin/member): See ALL calls for agents in their company (regardless of client assignment)
  - **Client Users**: See ONLY calls from agents specifically assigned to their client(s)
- **⚡ Real-time Data**: Automatic loading with intelligent caching
- **📊 Rich Query Methods**: Get calls by agent, date range, or specific call ID
- **📈 Chart Data**: Time-series data formatted for visualization components
- **📋 Summary Statistics**: Comprehensive metrics (cost, duration, success rates, breakdowns by type/status)
- **🎯 Smart Caching**: Minimizes database queries while keeping data fresh
- **🔄 Error Handling**: Comprehensive error states with detailed logging

## Usage

```typescript
import { useCalls } from '@/hooks/use-calls'

function CallsDashboard() {
  const {
    // Data (automatically filtered by RLS)
    allCalls,
    summary,
    chartData,
    
    // Computed values
    totalCalls,
    totalCost,        // Cost in cents
    totalDuration,    // Duration in seconds
    agentCount,       // Unique agents with calls
    
    // Loading states
    isLoading,
    isLoadingChart,
    isLoadingByAgent,
    error,
    
    // Methods
    getCallsByAgentId,
    getCallById,
    getChartData,
    refresh
  } = useCalls()

  if (isLoading) return <div>Loading calls...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {/* Summary Stats */}
      <div className="stats">
        <h2>Total Calls: {totalCalls}</h2>
        <h3>Total Cost: ${(totalCost / 100).toFixed(2)}</h3>
        <h3>Total Duration: {Math.round(totalDuration / 60)}m</h3>
        <h3>Success Rate: {summary.success_rate}%</h3>
        <h3>Active Agents: {agentCount}</h3>
      </div>

      {/* Breakdown by Type */}
      <div className="breakdown">
        <h4>By Type:</h4>
        {Object.entries(summary.by_type).map(([type, count]) => (
          <span key={type}>{type}: {count} </span>
        ))}
      </div>
      
      {/* Call Records */}
      <div className="calls-list">
        {allCalls.map(call => (
          <div key={call.id} className="call-record">
            <h4>{call.title}</h4>
            <p>Agent: {call.agent_name} ({call.agent_platform_name})</p>
            <p>Duration: {call.duration_display} • Cost: {call.cost_display}</p>
            <p>Caller: {call.caller_name || call.caller_phone}</p>
            <p>Status: {call.status} • Type: {call.type}</p>
            {call.client_name && <p>Client: {call.client_name}</p>}
            <p>Company: {call.company_name}</p>
            {call.tags && <p>Tags: {call.tags.join(', ')}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
```

## Data Structure

### Call Record (CallWithDetails)
```typescript
type CallWithDetails = {
  // Core call data
  id: string
  agent_id: string
  title: string
  type: 'Support' | 'Outbound' | 'Front Desk' | 'General'
  status: 'Completed' | 'In Progress' | 'Scheduled' | 'Resolved' | 'Failed'
  
  // Timing and cost
  duration_seconds: number      // Raw seconds for calculations
  duration_display?: string     // Formatted like "15:32"
  started_at?: string
  ended_at?: string
  cost_cents?: number          // Raw cents for calculations (avoid floating point)
  cost_display?: string        // Formatted like "$12.45"
  
  // Caller information
  caller_phone?: string
  caller_name?: string
  caller_id?: string
  
  // Call content
  transcript?: any             // JSONB array of conversation messages
  audio_url?: string           // URL to audio recording
  recording_id?: string        // External recording system ID
  
  // Call metadata
  call_direction?: 'inbound' | 'outbound'
  call_quality_score?: number  // 1-10 rating
  resolution_status?: string
  tags?: string[]             // Categorization tags
  notes?: string
  
  // Timestamps
  created_at: string
  updated_at: string
  
  // Joined data (from agents, clients, companies tables)
  agent_name: string
  agent_platform_name: string
  company_id: string
  client_id?: string
  client_name?: string        // Only present if agent is assigned to client
  company_name: string
}
```

### Summary Statistics
```typescript
type CallSummary = {
  total_calls: number
  total_duration_seconds: number
  total_cost_cents: number
  avg_duration_seconds: number     // Rounded average
  avg_cost_cents: number          // Rounded average
  success_rate: number            // Percentage (0-100)
  by_type: Record<string, number> // Call count breakdown by type
  by_status: Record<string, number> // Call count breakdown by status
}
```

### Chart Data Point
```typescript
type CallsChartDataPoint = {
  date: string                    // YYYY-MM-DD format
  [agentName: string]: number     // Dynamic keys for agent call counts
}
```

## Methods

### `getCallsByAgentId(agentId: string): Promise<CallWithDetails[]>`
Fetches all calls for a specific agent (still filtered by RLS). Results are cached for performance.

```typescript
// Get all calls for a specific agent
const agentCalls = await getCallsByAgentId('ace8d955-0968-469e-8199-bfc4bf098ab9')
console.log(`Agent has ${agentCalls.length} calls`)
```

### `getCallById(callId: string): Promise<CallWithDetails | null>`
Fetches a single call by ID. Checks cache first, then queries database if needed.

```typescript
// Get specific call details (useful for modals/detail views)
const call = await getCallById('c813f0d3-17a8-4267-8940-a61cfaa4199d')
if (call) {
  console.log('Call transcript:', call.transcript)
  console.log('Audio URL:', call.audio_url)
}
```

### `getChartData(limit?: number, days?: number): Promise<CallsChartDataPoint[]>`
Gets time-series data for charting. Finds top N agents by call count and returns daily call counts.

```typescript
// Get chart data for top 5 agents over last 30 days
const chartData = await getChartData(5, 30)

// Example result:
// [
//   { date: '2024-08-25', 'Lisa - Support': 3, 'John - Outbound': 2 },
//   { date: '2024-08-26', 'Lisa - Support': 1, 'Mike - Sales': 4 }
// ]
```

### `refresh(): Promise<void>`
Clears all cached data and reloads from database. Use when data might have changed externally.

```typescript
// Force refresh (e.g., after creating new calls)
await refresh()
```

## 🔒 Access Control & Security

The hook automatically enforces access control via **Row Level Security (RLS) policies** - no additional permission checks needed in your components.

### White-Label Architecture

**Companies** create and manage **Agents**. **Agents** can be assigned to **Clients** (or left unassigned).

```
Company (Test Company)
├── Agent: Lisa - Support      → Assigned to Client: Demo Client Org
├── Agent: John - Outbound     → Assigned to Client: Demo Client Org  
├── Agent: Sarah - Front Desk  → Assigned to Client: Demo Client Org
└── Agent: Mike - Sales        → Unassigned (company-only)
```

### Access Control Rules

#### 🏢 **Company Users** (owner/admin/member roles)
- ✅ See **ALL calls** from **ALL agents** belonging to their company
- ✅ See calls regardless of whether agents are assigned to clients or not
- ✅ Full visibility into their company's call activity

**Database Policy:**
```sql
-- Company users see all calls for their company's agents
agent_id IN (
  SELECT agents.id FROM agents
  WHERE agents.company_id IN (
    SELECT memberships.company_id FROM memberships
    WHERE memberships.user_id = auth.uid()
    AND memberships.role IN ('owner', 'admin', 'member')
  )
)
```

#### 👥 **Client Users** (member/admin roles in user_clients)
- ✅ See **ONLY calls** from **agents assigned to their client**
- ❌ Cannot see calls from agents assigned to other clients
- ❌ Cannot see calls from unassigned agents

**Database Policy:**
```sql
-- Client users see only calls from agents assigned to their client(s)
agent_id IN (
  SELECT agents.id FROM agents
  WHERE agents.client_id IN (
    SELECT user_clients.client_id FROM user_clients
    WHERE user_clients.user_id = auth.uid()
  )
)
```

### Example Scenarios

**As `clienttest@gmail.com` (Client User):**
```typescript
const { allCalls, totalCalls } = useCalls()
// Returns: 5 calls (only from assigned agents)
// Lisa, John, Sarah calls ✅
// Mike's calls ❌ (if Mike isn't assigned to this client)
```

**As `mason.adams38@gmail.com` (Company Owner):**
```typescript  
const { allCalls, totalCalls } = useCalls()
// Returns: ALL calls (from all company agents)
// Lisa, John, Sarah, Mike calls ✅
// Complete company visibility
```

## ⚡ Performance & Optimization

### Intelligent Caching
- **Call data** cached in `allCalls` state after first load
- **Agent-specific calls** cached in `callsById` map
- **Individual calls** checked in cache before database queries
- Cache cleared automatically on `refresh()`

### Smart Data Loading
- Uses `!inner` joins to fetch all related data in single queries
- Loads calls + agent details + company/client names in one request
- Chart data computed client-side from cached data when possible

### Loading States
- `isLoading`: Initial load of all calls
- `isLoadingByAgent`: Loading specific agent's calls
- `isLoadingChart`: Generating time-series chart data
- Granular loading states prevent unnecessary spinners

### Database Efficiency
- Indexed queries on `agent_id`, `created_at` for fast filtering
- RLS policies use efficient `IN` subqueries
- Chart data uses date range filtering to limit results
- Computed values (totals, averages) calculated client-side

### Memory Management
- Automatic cleanup via React hooks
- Cached data cleared when user changes
- No memory leaks from subscriptions or intervals

## 🛠️ Implementation Notes

### Database Schema
The hook expects the following table structure:
- `calls` table with RLS enabled
- Foreign key to `agents.id`
- Standard permissions granted to `anon` and `authenticated` roles
- Related tables (`agents`, `companies`, `clients`) also need proper permissions

### Error Handling  
- Comprehensive error logging with context
- Graceful fallbacks (empty arrays, null values)
- User-friendly error messages in `error` state
- Console logging for debugging (prefixed with emojis for easy filtering)

### TypeScript Support
- Full type safety with `CallWithDetails` interface
- Proper typing for all method return values
- Exported types for use in consuming components
