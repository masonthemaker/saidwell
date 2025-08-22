# Saidwell Auth System Setup Documentation

## Overview

This document outlines the multi-tenant authentication system setup for Saidwell, including the database schema, test data creation, and implementation guidance for determining whether a user is logging in as a company or client.

## Database Schema Structure

### Core Tables

The auth system uses a multi-tenant architecture with the following key tables:

1. **`companies`** - Top-level tenant organizations
2. **`company_users`** - Users with roles in companies  
3. **`clients`** - Sub-tenants that belong to companies
4. **`client_users`** - Users with roles in specific clients
5. **`agents`** - AI agents created by companies
6. **`client_agent_assignments`** - Agents assigned to clients

### Key Design Principles

- **Hierarchical Tenancy**: Companies → Clients → Users
- **Role-Based Access Control (RBAC)**: Separate role enums for company vs client scopes
- **Row-Level Security (RLS)**: All tables have RLS enabled with comprehensive policies
- **Flexible Access**: Users can have roles in multiple companies and/or clients

## Test Data Created

### User Account
- **Email**: `mason.adams38@gmail.com`
- **User ID**: `62a97212-acd1-4ddb-a8b0-3876c53ba215`

### Company Access
- **Company**: TechCorp Solutions
- **Slug**: `techcorp` 
- **Role**: `admin`
- **Company ID**: `550e8400-e29b-41d4-a716-446655440001`

### Client Access  
- **Client**: Acme Manufacturing
- **External Ref**: ACME001
- **Role**: `admin`
- **Client ID**: `550e8400-e29b-41d4-a716-446655440003`
- **Parent Company**: TechCorp Solutions

## Authentication Flow Implementation

### 1. Post-Login User Context Detection

After Supabase auth succeeds, determine user's access context:

```sql
-- Check company access
SELECT * FROM v_my_companies;

-- Check client access  
SELECT * FROM v_my_clients;
```

### 2. Routing Logic

Based on query results, implement this routing logic:

```typescript
async function determineUserContext(supabase: SupabaseClient) {
  const [companies, clients] = await Promise.all([
    supabase.from('v_my_companies').select('*'),
    supabase.from('v_my_clients').select('*')
  ]);

  const hasCompanyAccess = companies.data?.length > 0;
  const hasClientAccess = clients.data?.length > 0;

  if (hasCompanyAccess && hasClientAccess) {
    // Multi-access user - show selection UI
    return { type: 'multi', companies: companies.data, clients: clients.data };
  } else if (hasCompanyAccess) {
    // Company-only user
    return { type: 'company', data: companies.data[0] };
  } else if (hasClientAccess) {
    // Client-only user  
    return { type: 'client', data: clients.data[0] };
  } else {
    // No access - error state
    return { type: 'no_access' };
  }
}
```

### 3. Dashboard Routing

```typescript
// In your auth callback or middleware
const userContext = await determineUserContext(supabase);

switch (userContext.type) {
  case 'company':
    redirect(`/dashboard/company/${userContext.data.slug}`);
    break;
  case 'client':
    redirect(`/dashboard/client/${userContext.data.company_slug}/${userContext.data.external_ref}`);
    break;
  case 'multi':
    redirect('/dashboard/select-context'); // User chooses company or client
    break;
  case 'no_access':
    redirect('/auth/error?message=no_access');
    break;
}
```

## Key Views for Frontend

### `v_my_companies`
Returns companies the authenticated user has access to:
- `id`, `name`, `slug`, `status`
- `my_role` - user's role in the company
- `joined_at` - when user joined the company

### `v_my_clients` 
Returns clients the authenticated user has access to:
- `id`, `name`, `external_ref`, `status`
- `company_name`, `company_slug` - parent company info
- `my_client_role` - direct client role (if any)
- `my_company_role` - company role (if accessing via company membership)
- `access_type` - 'company' or 'client' indicating access method

## Security Features

### Row-Level Security (RLS)
- All tables have RLS enabled
- Policies automatically enforce tenant isolation
- Helper functions: `is_company_member()`, `has_min_company_role()`, `can_access_client()`

### Role Hierarchy
**Company Roles** (highest to lowest):
- `owner` - Full control
- `admin` - Administrative access
- `manager` - Management functions
- `member` - Standard access
- `viewer` - Read-only access

**Client Roles** (highest to lowest):
- `admin` - Client admin
- `manager` - Client management
- `member` - Standard client access
- `viewer` - Read-only client access

## Current Database State

The following test scenario is now available:

- **mason.adams38@gmail.com** can log in and will have access to both:
  1. **Company Dashboard** as admin of TechCorp Solutions
  2. **Client Dashboard** as admin of Acme Manufacturing

## Next Steps

### 1. Implement Auth Middleware ⏭️
Create middleware in `middleware.ts` that:
- Detects user context after auth
- Sets appropriate session/context variables
- Redirects to correct dashboard

### 2. Update Auth Components ⏭️
Modify existing auth components:
- `src/components/login-form.tsx` - Add context detection after login
- `src/components/sign-up-form.tsx` - Handle company vs client registration
- `src/hooks/useAuth/useAuth.ts` - Add context management

### 3. Create Context Selection UI ⏭️
For multi-access users, create a selection page:
- Show available companies and clients
- Allow user to choose active context
- Store choice in session/local storage

### 4. Update Dashboard Routing ⏭️
Modify dashboard components to respect context:
- `src/components/dash/Dashboard.tsx` - Company context
- Create client-specific dashboard variant
- Update sidebar navigation based on context

### 5. Add Context Switching ⏭️
Allow users to switch between contexts:
- Add context switcher to sidebar/header
- Update `useAuth` hook to manage active context
- Preserve user preference

### 6. Test Access Patterns ⏭️
Verify RLS policies work correctly:
- Test data isolation between tenants
- Verify role-based permissions
- Test cross-tenant access prevention

## Files to Modify

1. **`src/hooks/useAuth/useAuth.ts`** - Add context detection and management
2. **`middleware.ts`** - Add auth routing logic
3. **`src/components/login-form.tsx`** - Add post-login context handling
4. **`src/app/layout.tsx`** - Add context provider if needed
5. **Dashboard components** - Add context-aware rendering

## Database Utilities

For testing and development, you can use these queries:

```sql
-- Check user's company access
SELECT c.name, cu.role FROM companies c 
JOIN company_users cu ON cu.company_id = c.id 
WHERE cu.user_id = auth.uid();

-- Check user's client access
SELECT cl.name, co.name as company, clu.role FROM clients cl
JOIN companies co ON co.id = cl.company_id
JOIN client_users clu ON clu.client_id = cl.id
WHERE clu.user_id = auth.uid();

-- Use the views (when authenticated)
SELECT * FROM v_my_companies;
SELECT * FROM v_my_clients;
```

## Configuration Notes

- **Supabase Project ID**: `exsbezyealevsgwyhbdn`
- **Region**: us-east-2
- **RLS**: Enabled on all tables
- **Sample Data**: Includes TechCorp Solutions company and Acme Manufacturing client

The multi-tenant architecture is now ready for development and testing with your user account having both company and client access scenarios covered.
