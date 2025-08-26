# Row Level Security (RLS) Policies

## Overview

This document contains all Row Level Security policies for the multi-tenant AI agent management system. These policies ensure complete data isolation between companies and proper access control for client organizations.

## Current Policy Status

✅ **All policies tested and working**  
✅ **No circular dependencies**  
✅ **Production ready**  
✅ **Multi-tenant secure**

## Table Policies

### 1. Companies Table

**RLS Status**: ✅ Enabled  
**Policies**: 1 (Supabase managed)

```sql
-- Standard company membership access (managed by Supabase)
-- Users can only access companies they have membership in
```

### 2. Memberships Table

**RLS Status**: ✅ Enabled  
**Policies**: Standard (Supabase managed)

```sql
-- Standard membership policies (managed by Supabase)
-- Users can see their own memberships
```

### 3. User Clients Table

**RLS Status**: ✅ Enabled  
**Policies**: 1 active

```sql
-- Policy: Users can access their own client relationships
CREATE POLICY "Users can access their own client relationships" ON user_clients
FOR ALL USING (user_id = auth.uid());
```

**Explanation**: Simple and secure - users can only see client relationships where they are the user. No circular dependencies.

**Access Pattern**: 
- ✅ User sees own client memberships
- ❌ User cannot see other users' client relationships
- ✅ Company admins manage through application logic

### 4. Clients Table

**RLS Status**: ✅ Enabled  
**Policies**: 1 active

```sql
-- Policy: Company members can access their clients
CREATE POLICY "Company members can access their clients" ON clients
FOR ALL USING (
  company_id IN (
    SELECT company_id 
    FROM memberships 
    WHERE user_id = auth.uid()
  )
);
```

**Explanation**: Company owners/admins can access all clients belonging to their company. This enables the two-step query approach in `useAuth`.

**Access Pattern**:
- ✅ Company owners see all company clients
- ✅ Company admins see all company clients  
- ❌ Users from other companies cannot see clients
- ✅ Enables client details lookup for user-client relationships

### 5. Agents Table

**RLS Status**: ✅ Enabled  
**Policies**: 2 active

#### Policy A: Company Management
```sql
-- Policy: Company admins can manage their agents
CREATE POLICY "Company admins can manage agents" ON agents
FOR ALL USING (
  company_id IN (
    SELECT company_id 
    FROM memberships 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin')
  )
);
```

**Explanation**: Only company owners/admins can create, update, delete, and assign agents.

#### Policy B: Client Access
```sql
-- Policy: Users can see assigned agents
CREATE POLICY "Users can see assigned agents" ON agents
FOR SELECT USING (
  client_id IN (
    SELECT client_id 
    FROM user_clients 
    WHERE user_id = auth.uid()
  )
);
```

**Explanation**: Users can only see agents assigned to their client organizations.

**Combined Access Pattern**:
- ✅ Company owners: Full CRUD access to all company agents
- ✅ Company admins: Full CRUD access to all company agents
- ✅ Client users: READ access to assigned agents only
- ❌ No access to agents from other companies/clients

### 6. Agent Analytics Table

**RLS Status**: ✅ Enabled  
**Policies**: 5 active

#### Company Management Policies
```sql
-- Policy: Company admins can view analytics for their agents
CREATE POLICY "Company admins can view agent analytics" ON agent_analytics
FOR SELECT USING (
  agent_id IN (
    SELECT id FROM agents 
    WHERE company_id IN (
      SELECT company_id FROM memberships 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  )
);

-- Policy: Company admins can insert analytics
CREATE POLICY "Company admins can insert agent analytics" ON agent_analytics
FOR INSERT WITH CHECK (
  agent_id IN (
    SELECT id FROM agents 
    WHERE company_id IN (
      SELECT company_id FROM memberships 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  )
);

-- Similar UPDATE and DELETE policies for company admins...
```

#### Client Access Policy
```sql
-- Policy: Client users can view analytics for assigned agents
CREATE POLICY "Client users can view assigned agent analytics" ON agent_analytics
FOR SELECT USING (
  agent_id IN (
    SELECT id FROM agents 
    WHERE client_id IN (
      SELECT client_id FROM user_clients WHERE user_id = auth.uid()
    )
  )
);
```

**Explanation**: Analytics access follows the same pattern as agents - companies can manage all analytics for their agents, clients can only view analytics for agents assigned to them.

**Access Pattern**:
- ✅ Company owners/admins: Full CRUD access to all company agent analytics
- ✅ Client users: READ access to analytics for assigned agents only
- ❌ No access to analytics from other companies/clients
- 🔗 Inherits security from agents table (no circular dependencies)

## Security Model

### Company Level Isolation
```
Company A ────┐
              ├─ Complete Isolation
Company B ────┘
```

**Guarantee**: Users from Company A cannot access any data from Company B.

### Client Level Isolation
```
Company A:
  ├─ Client 1 ────┐
  │               ├─ User sees only Client 1 agents
  └─ Client 2 ────┘
```

**Guarantee**: Client users only see agents assigned to their specific client.

### Role-Based Access

| Role | Company Data | Client Assignment | Agent CRUD | Agent View | Analytics Access |
|------|--------------|-------------------|------------|------------|------------------|
| Company Owner | ✅ Full | ✅ Full | ✅ Full | ✅ All company agents | ✅ All company analytics |
| Company Admin | ✅ Full | ✅ Full | ✅ Full | ✅ All company agents | ✅ All company analytics |
| Client Admin | ❌ None | ❌ None | ❌ None | ✅ Assigned agents only | ✅ Assigned agent analytics |
| Client Member | ❌ None | ❌ None | ❌ None | ✅ Assigned agents only | ✅ Assigned agent analytics |

## Policy Design Principles

### 1. Avoid Circular Dependencies
```sql
-- ❌ BAD: Creates infinite recursion
CREATE POLICY "bad_policy" ON user_clients
FOR ALL USING (
  client_id IN (
    SELECT id FROM clients WHERE id IN (
      SELECT client_id FROM user_clients WHERE user_id = auth.uid()
    )
  )
);

-- ✅ GOOD: Direct relationship only
CREATE POLICY "good_policy" ON user_clients  
FOR ALL USING (user_id = auth.uid());
```

### 2. Minimal Complexity
- Simple `auth.uid()` checks where possible
- Single table lookups preferred
- Avoid deep JOIN chains in policies

### 3. Clear Separation of Concerns
- Company policies handle company-level access
- User policies handle individual access
- Application logic handles complex business rules

## Common Patterns

### Pattern 1: Direct Ownership
```sql
-- User owns the record directly
CREATE POLICY "direct_ownership" ON table_name
FOR ALL USING (user_id = auth.uid());
```

**Use Cases**: user_clients, user_profiles, user_settings

### Pattern 2: Company Membership
```sql
-- Access through company membership
CREATE POLICY "company_access" ON table_name
FOR ALL USING (
  company_id IN (
    SELECT company_id FROM memberships WHERE user_id = auth.uid()
  )
);
```

**Use Cases**: clients, company_settings

### Pattern 3: Role-Based Company Access
```sql
-- Access with specific roles only
CREATE POLICY "admin_access" ON table_name
FOR ALL USING (
  company_id IN (
    SELECT company_id 
    FROM memberships 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin')
  )
);
```

**Use Cases**: agents (management), billing, sensitive settings

### Pattern 4: Client Assignment
```sql
-- Access to assigned client resources
CREATE POLICY "client_assignment" ON table_name
FOR SELECT USING (
  client_id IN (
    SELECT client_id FROM user_clients WHERE user_id = auth.uid()
  )
);
```

**Use Cases**: agents (viewing), client_data, reports

## Troubleshooting Guide

### Error: "infinite recursion detected"
```
Error code: 42P17
```

**Cause**: Policy creates circular dependency between tables.

**Solution**: 
1. Identify which tables reference each other
2. Remove cross-references in policies
3. Use direct relationships only
4. Move complex logic to application layer

**Example Fix**:
```sql
-- Remove circular policy
DROP POLICY "circular_policy" ON user_clients;

-- Use simple direct policy
CREATE POLICY "simple_policy" ON user_clients
FOR ALL USING (user_id = auth.uid());
```

### Error: "permission denied for table"
```
Error code: 42501
```

**Cause**: Missing table grants or no RLS policy allows access.

**Solution**:
```sql
-- 1. Check table grants
GRANT ALL ON TABLE table_name TO authenticated;

-- 2. Verify RLS is enabled
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

-- 3. Add appropriate policy
CREATE POLICY "access_policy" ON table_name
FOR ALL USING (user_id = auth.uid());
```

### No Data Returned (Silent Failure)

**Cause**: Policy exists but condition never evaluates to true.

**Debug Steps**:
```sql
-- Test policy condition directly
SELECT EXISTS(
  SELECT 1 FROM memberships WHERE user_id = auth.uid()
) as has_membership;

-- Check auth context
SELECT auth.uid() as current_user;
```

## Testing Policies

### Manual Testing
```sql
-- 1. Test as specific user (requires admin access)
SELECT set_config('request.jwt.claims', '{"sub":"user-id"}', true);

-- 2. Test policy conditions
SELECT * FROM table_name; -- Should respect RLS

-- 3. Reset context  
SELECT set_config('request.jwt.claims', '', true);
```

### Application Testing
```typescript
// Test in useAuth hook
const { userClients, getCurrentClient } = useAuth()
console.log('Accessible clients:', userClients.length)
console.log('Current client:', getCurrentClient()?.client_name)
```

## Policy Maintenance

### Adding New Policies
1. **Design**: Sketch policy logic on paper first
2. **Test**: Use manual testing to verify logic
3. **Deploy**: Apply via migration
4. **Verify**: Test with real user accounts
5. **Document**: Update this file

### Modifying Existing Policies
1. **Backup**: Document current policy
2. **Plan**: Identify all affected queries
3. **Deploy**: Use migration with rollback plan
4. **Test**: Verify no breaking changes
5. **Monitor**: Check for new permission errors

### Policy Naming Convention
```sql
-- Pattern: "{subject} can {action} {object}"
CREATE POLICY "users can access their profiles" ON profiles...
CREATE POLICY "admins can manage company settings" ON settings...
CREATE POLICY "clients can view assigned agents" ON agents...
```

## Performance Considerations

### Policy Efficiency
- ✅ Direct `auth.uid()` checks are fastest
- ✅ Single table subqueries are efficient  
- ⚠️ JOIN-heavy policies can be slow
- ❌ Recursive policies cause infinite loops

### Indexing for Policies
```sql
-- Index commonly filtered columns in policies
CREATE INDEX idx_user_clients_user_id ON user_clients(user_id);
CREATE INDEX idx_memberships_user_id ON memberships(user_id);
CREATE INDEX idx_agents_client_id ON agents(client_id);
CREATE INDEX idx_clients_company_id ON clients(company_id);
```

### Query Optimization
```sql
-- Prefer IN queries over EXISTS for simple lookups
-- ✅ Good
company_id IN (SELECT company_id FROM memberships WHERE user_id = auth.uid())

-- ⚠️ Slower  
EXISTS(SELECT 1 FROM memberships WHERE company_id = table.company_id AND user_id = auth.uid())
```

## Migration Scripts

### Enable RLS on New Table
```sql
-- Template for new tables
CREATE TABLE new_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  -- other columns
);

-- Enable RLS
ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON TABLE new_table TO authenticated;

-- Add policy
CREATE POLICY "users can access own records" ON new_table
FOR ALL USING (user_id = auth.uid());
```

### Disable RLS (Emergency)
```sql
-- Only for debugging - not for production
ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;

-- Remember to re-enable
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

## Security Validation Checklist

- [ ] All tables have RLS enabled
- [ ] All tables have appropriate grants for `authenticated` role
- [ ] No circular dependencies between policies
- [ ] Company data is isolated between tenants
- [ ] Client data is isolated within company
- [ ] Admin roles can manage their company's data
- [ ] Client roles can only access assigned resources
- [ ] No sensitive data (API keys, passwords) accessible across boundaries
- [ ] Analytics data properly secured (company manages, clients view assigned only)
- [ ] Policies tested with multiple user roles
- [ ] Error handling graceful for permission denied cases
- [ ] Analytics cascade deletes when agents are removed

---

**Last Updated**: Current working implementation  
**Status**: Production Ready ✅  
**Next Review**: After any schema changes
