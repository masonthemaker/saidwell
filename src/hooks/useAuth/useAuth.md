# useAuth Hook

A custom React hook for handling multi-tenant authentication state in the Saidwell application using Supabase Auth. This hook provides company vs client context detection and automatic routing based on user permissions.

## Features

- **Multi-tenant context detection** - Automatically determines if user has company, client, or both access types
- **Intelligent routing** - Routes users to appropriate dashboards based on their permissions
- **Context switching** - Allows users to switch between company and client views
- **Session persistence** - Maintains active context across page reloads
- **Automatic session management** - Handles auth state and redirects
- **Real-time auth state updates** - Listens for auth changes

## Usage

```tsx
import { useAuth } from '@/hooks/useAuth/useAuth';

export default function MyComponent() {
  const { 
    isAuthenticated, 
    isLoading, 
    contextLoading,
    user, 
    context,
    switchContext,
    signIn, 
    signUp, 
    signOut,
    supabase 
  } = useAuth(true); // true = require authentication

  if (isLoading || contextLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // User will be automatically redirected to login
    return null;
  }

  return (
    <div>
      <p>Welcome, {user?.email}</p>
      <p>Context: {context?.activeContext?.name} ({context?.activeContext?.type})</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

## Parameters

- `requireAuth` (boolean, default: true) - Whether the component requires authentication. If true, unauthenticated users are automatically redirected to `/auth/login`.

## Return Value

The hook returns an object with the following properties:

### State Properties

- `isAuthenticated` (boolean) - Whether the user is currently authenticated
- `isLoading` (boolean) - Whether the authentication state is being checked
- `contextLoading` (boolean) - Whether the user context is being detected
- `user` (User | null) - The authenticated user object from Supabase
- `context` (UserContext | null) - The user's access context information

### Context Properties

The `context` object contains:

```typescript
interface UserContext {
  type: 'company' | 'client' | 'multi' | 'no_access';
  companies: CompanyAccess[];
  clients: ClientAccess[];
  activeContext?: {
    type: 'company' | 'client';
    id: string;
    name: string;
    slug: string;
  };
}

interface CompanyAccess {
  id: string;
  name: string;
  slug: string;
  my_role: string;
  status: string;
  joined_at: string;
}

interface ClientAccess {
  id: string;
  name: string;
  company_name: string;
  company_slug: string;
  my_client_role: string | null;
  my_company_role: string | null;
  access_type: 'company' | 'client';
  status: string;
}
```

### Helper Functions

- `signIn(email: string, password: string)` - Sign in a user with email and password
- `signUp(email: string, password: string)` - Sign up a new user with email and password
- `signOut()` - Sign out the current user, clear context, and redirect to login
- `switchContext(type: 'company' | 'client', entityId: string)` - Switch between company and client contexts

### Supabase Client

- `supabase` - The Supabase client instance for making additional queries

## Authentication Flow

### Login Process
1. User authenticates via Supabase Auth
2. Hook queries `v_my_companies` and `v_my_clients` views
3. Context type is determined:
   - **`company`** - User has company access only
   - **`client`** - User has client access only  
   - **`multi`** - User has both company and client access
   - **`no_access`** - User has no permissions

### Routing Logic
- **Company-only users** → `/company/{slug}`
- **Client-only users** → `/` (client dashboard)
- **Multi-access users** → `/dashboard/select-context` (selection page)
- **No access** → Sign out and show error

### Context Switching
Users with multi-access can switch contexts using:
```tsx
const { switchContext } = useAuth();

// Switch to company context
switchContext('company', companyId);

// Switch to client context  
switchContext('client', clientId);
```

## Implementation Details

The hook automatically:
1. Checks for existing session and detects user context
2. Persists active context in sessionStorage for page reloads
3. Sets up listeners for auth state changes
4. Handles context switching and appropriate routing
5. Manages cleanup of listeners and session data

## Examples

### Multi-tenant Dashboard
```tsx
function Dashboard() {
  const { context } = useAuth();
  
  const isCompanyView = context?.activeContext?.type === 'company';
  const entityName = context?.activeContext?.name || 'Dashboard';
  
  return (
    <div>
      <h1>{entityName} {isCompanyView ? 'Company' : 'Client'} Dashboard</h1>
      {/* Render appropriate content based on context */}
    </div>
  );
}
```

### Context Switcher Component
```tsx
function ContextSwitcher() {
  const { context, switchContext } = useAuth();
  
  if (context?.type !== 'multi') return null;
  
  return (
    <select onChange={(e) => {
      const [type, id] = e.target.value.split(':');
      switchContext(type as 'company' | 'client', id);
    }}>
      {context.companies.map(c => (
        <option key={c.id} value={`company:${c.id}`}>{c.name} (Company)</option>
      ))}
      {context.clients.map(c => (
        <option key={c.id} value={`client:${c.id}`}>{c.name} (Client)</option>
      ))}
    </select>
  );
}
```

### Protected Route with Context
```tsx
function ProtectedPage() {
  const { isAuthenticated, context } = useAuth(true);
  
  // Check if user has required permissions
  const hasAccess = context?.companies.some(c => c.my_role === 'admin') || false;
  
  if (!hasAccess) {
    return <div>Access Denied</div>;
  }
  
  return <div>Admin Content</div>;
}
```

## Error Handling

### Common Error Patterns

1. **Invalid Credentials**: Display error message from Supabase
2. **Network Issues**: Show generic "Please try again" message
3. **Context Detection Failures**: Fallback to basic routing
4. **No Access**: Sign out and redirect to login with error message

### Error Display
All form components include error state management with consistent styling:
```tsx
{error && (
  <div className="text-error-red text-sm text-center bg-error-red/10 border border-error-red/20 rounded-lg p-2 backdrop-blur-sm">
    {error}
  </div>
)}
```

## Best Practices

1. **Always handle loading states** for both `isLoading` and `contextLoading`
2. **Check for authentication errors** in form submissions
3. **Use requireAuth parameter appropriately** for public vs protected pages
4. **Provide user feedback** for all authentication actions
5. **Handle multi-tenant context** appropriately in components
6. **Test both company and client access flows** during development

This authentication system provides a complete, production-ready solution for multi-tenant user management in the Saidwell application.