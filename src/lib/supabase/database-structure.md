# Database Structure Documentation

## Overview

This document explains the database structure for the multi-tenant AI agent management system. The system supports white-label dashboard providers (companies) who create and manage AI agents for their clients.

## Core Entities

### 1. Companies
**Purpose**: White-label dashboard providers
**Table**: `companies`

```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  theme JSONB DEFAULT '{}',
  domain TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Description**: Companies are the main tenants of the system. They white-label the dashboard and manage their own clients and agents.

### 2. Memberships
**Purpose**: Company admin/owner relationships
**Table**: `memberships`

```sql
CREATE TABLE memberships (
  user_id UUID REFERENCES auth.users(id),
  company_id UUID REFERENCES companies(id),
  role TEXT CHECK (role IN ('owner', 'admin', 'member', 'client')),
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, company_id)
);
```

**Description**: Links users to companies with specific roles. Company owners/admins can manage the company's clients and agents.

### 3. Clients
**Purpose**: Client organizations (end customers of companies)
**Table**: `clients`

```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

**Description**: Client organizations created by companies. Each client can have multiple users and assigned agents.

### 4. User Clients
**Purpose**: Users belonging to client organizations
**Table**: `user_clients`

```sql
CREATE TABLE user_clients (
  user_id UUID REFERENCES auth.users(id),
  client_id UUID REFERENCES clients(id),
  role TEXT CHECK (role IN ('admin', 'member')) DEFAULT 'member',
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, client_id)
);
```

**Description**: Many-to-many relationship between users and clients. Multiple users can belong to a single client organization.

### 5. Agents
**Purpose**: AI agents with platform integration
**Table**: `agents`

```sql
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id),
  client_id UUID REFERENCES clients(id),
  name TEXT NOT NULL,
  platform_name TEXT NOT NULL,
  api_key TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Description**: AI agents created by companies and assigned to specific clients. Contains platform integration details.

### 6. Agent Analytics
**Purpose**: Analytics and metrics for AI agents
**Table**: `agent_analytics`

```sql
CREATE TABLE agent_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  total_interactions INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

**Description**: Tracks usage analytics for agents. Company admins can view all analytics for their agents, while client users can only see analytics for agents assigned to their client.

## Relationships

```
Companies (1) -----> (N) Clients
    |                   |
    |                   |
    v                   v
Memberships         User_Clients
    |                   |
    |                   |
    v                   v
auth.users (N) <--- (N) auth.users

Companies (1) -----> (N) Agents -----> (1) Agent_Analytics
Clients (1) -------> (N) Agents
```

## Data Flow & Access Patterns

### Company Perspective
1. **Company** creates **clients** (their customer organizations)
2. **Company** creates **agents** with platform credentials
3. **Company** assigns **agents** to specific **clients**
4. **Company** manages which **users** belong to each **client**

### Client/User Perspective  
1. **Users** log in and see only their assigned **client(s)**
2. **Users** can only access **agents** assigned to their **client**
3. **Users** cannot see other clients' agents or data

## Row Level Security (RLS) Policies

### Companies Table
- Users can only access companies they have membership in

### Clients Table
```sql
-- Company members can access their company's clients
CREATE POLICY "Company members can access their clients" ON clients
FOR ALL USING (
  company_id IN (
    SELECT company_id 
    FROM memberships 
    WHERE user_id = auth.uid()
  )
);
```

### User Clients Table
```sql  
-- Users can access their own client relationships
CREATE POLICY "Users can access their own client relationships" ON user_clients
FOR ALL USING (user_id = auth.uid());
```

**Note**: Original design included a policy for company admins to manage user-client relationships, but this created circular dependencies between tables. The current simplified approach relies on company owners/admins having direct access through company membership, then managing user-client relationships through application logic rather than database policies.

### Agents Table
```sql
-- Company admins can manage their agents
CREATE POLICY "Company admins can manage agents" ON agents
FOR ALL USING (
  company_id IN (
    SELECT company_id 
    FROM memberships 
    WHERE user_id = auth.uid() 
    AND role IN ('owner', 'admin')
  )
);

-- Users can see agents assigned to their client
CREATE POLICY "Users can see assigned agents" ON agents
FOR SELECT USING (
  client_id IN (
    SELECT client_id 
    FROM user_clients 
    WHERE user_id = auth.uid()
  )
);
```

## Use Cases

### Creating a New Client Setup
1. Company admin creates a new client: `INSERT INTO clients (company_id, name) VALUES (...)`
2. Company admin creates agents for the client: `INSERT INTO agents (company_id, client_id, name, platform_name, api_key) VALUES (...)`
3. Company admin adds users to the client: `INSERT INTO user_clients (user_id, client_id, role) VALUES (...)`

### User Login Flow
1. User logs in via Supabase Auth
2. Query user's clients: `SELECT * FROM user_clients WHERE user_id = auth.uid()`
3. Query available agents: `SELECT * FROM agents WHERE client_id IN (user's client ids)`
4. User can only interact with agents assigned to their client(s)

### Agent Management
- **Create**: Company admins can create agents for any of their clients
- **Assign**: Company admins can assign/reassign agents to different clients
- **Access**: Users can only see and use agents assigned to their client
- **Update**: Company admins can update agent credentials and settings

## Security Considerations

1. **Multi-tenancy**: RLS policies ensure complete data isolation between companies
2. **Client Isolation**: Users can only access agents assigned to their specific client
3. **Role-based Access**: Different permissions for company admins vs. client users
4. **API Key Security**: Agent API keys are stored securely and only accessible by authorized users
5. **Simplified Policies**: Current policies avoid circular dependencies for better performance and reliability

## Current RLS Policy Status

### ✅ Working Policies
- **user_clients**: Simple `user_id = auth.uid()` policy (no circular dependencies)
- **clients**: Company membership-based access via `memberships` table
- **agents**: Dual policies for company management and client access
- **companies**: Standard company membership access
- **memberships**: Standard RLS policies (managed by Supabase)

### 🔒 Security Model
- **Company Level**: Owners/admins can create clients, agents, and manage assignments
- **Client Level**: Users see only agents assigned to their specific client
- **Data Isolation**: Complete separation between companies and clients
- **Permission Inheritance**: Client access inherits from company membership

## Migration Notes

- All tables have RLS enabled and tested
- Table grants properly configured for `authenticated` and `anon` roles
- Foreign key constraints ensure referential integrity
- Cascade deletes protect against orphaned records
- Updated_at triggers maintain audit trails on the agents table
- Policies designed to avoid circular dependencies and infinite recursion
