-- =============================================================================
-- Multi-Tenant AI Agent Dashboard Schema for Supabase/PostgreSQL
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For GIN trigram indexes

-- =============================================================================
-- 1. CREATE TYPES (ENUMS)
-- =============================================================================

-- Company and Client statuses
CREATE TYPE status_enum AS ENUM ('active', 'inactive', 'suspended', 'trial');

-- User roles - simplified but comprehensive RBAC
CREATE TYPE company_role_enum AS ENUM ('owner', 'admin', 'manager', 'member', 'viewer');
CREATE TYPE client_role_enum AS ENUM ('admin', 'manager', 'member', 'viewer');

-- Agent types and statuses
CREATE TYPE agent_type_enum AS ENUM ('chatbot', 'voice_assistant', 'analyzer', 'custom');
CREATE TYPE agent_status_enum AS ENUM ('active', 'inactive', 'draft', 'archived');

-- API key owner types
CREATE TYPE api_key_owner_enum AS ENUM ('company', 'client', 'agent');

-- Audit log scopes and actions
CREATE TYPE audit_scope_enum AS ENUM ('company', 'client', 'system');
CREATE TYPE audit_action_enum AS ENUM ('create', 'update', 'delete', 'login', 'logout', 'assign', 'unassign', 'invite', 'accept_invite');

-- Invitation scopes
CREATE TYPE invitation_scope_enum AS ENUM ('company', 'client');

-- File purposes
CREATE TYPE file_purpose_enum AS ENUM ('avatar', 'logo', 'document', 'training_data', 'export');

-- =============================================================================
-- 2. CREATE TABLES
-- =============================================================================

-- Companies (top-level tenant)
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    status status_enum NOT NULL DEFAULT 'trial',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    branding JSONB DEFAULT '{}',
    
    CONSTRAINT companies_slug_format CHECK (slug ~ '^[a-z0-9][a-z0-9-]*[a-z0-9]$'),
    CONSTRAINT companies_slug_length CHECK (length(slug) >= 3 AND length(slug) <= 63)
);

-- Company Users (RBAC for companies)
CREATE TABLE company_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL, -- FK to auth.users
    role company_role_enum NOT NULL DEFAULT 'member',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(company_id, user_id)
);

-- Clients (belong to companies)
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    external_ref VARCHAR(100), -- External identifier from company's system
    status status_enum NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    settings JSONB DEFAULT '{}',
    
    UNIQUE(company_id, external_ref) -- Allow NULL external_ref but unique when present
);

-- Client Users (RBAC for clients)
CREATE TABLE client_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    user_id UUID NOT NULL, -- FK to auth.users
    role client_role_enum NOT NULL DEFAULT 'member',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(client_id, user_id)
);

-- Agents (AI agents created by companies)
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type agent_type_enum NOT NULL DEFAULT 'chatbot',
    model VARCHAR(100) NOT NULL, -- e.g., 'gpt-4o', 'claude-3-sonnet'
    status agent_status_enum NOT NULL DEFAULT 'draft',
    base_config JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Client Agent Assignments (agents assigned to clients with overrides)
CREATE TABLE client_agent_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    override_config JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(client_id, agent_id)
);

-- API Keys (for programmatic access)
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_type api_key_owner_enum NOT NULL,
    owner_id UUID NOT NULL, -- References companies.id, clients.id, or agents.id
    name VARCHAR(255) NOT NULL,
    hashed_key VARCHAR(255) NOT NULL UNIQUE,
    last_used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ, -- NULL means no expiration
    
    -- Ensure name is unique per owner
    UNIQUE(owner_type, owner_id, name)
);

-- Audit Logs (activity tracking)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE, -- NULL for company-level actions
    actor_user_id UUID, -- FK to auth.users, NULL for system actions
    actor_scope audit_scope_enum NOT NULL,
    action audit_action_enum NOT NULL,
    entity_type VARCHAR(50) NOT NULL, -- 'company', 'client', 'agent', etc.
    entity_id UUID NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Invitations (for onboarding users)
CREATE TABLE invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scope invitation_scope_enum NOT NULL,
    scope_id UUID NOT NULL, -- References companies.id or clients.id
    email VARCHAR(320) NOT NULL,
    role VARCHAR(20) NOT NULL, -- Will be validated via CHECK constraint
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    accepted_at TIMESTAMPTZ
);

-- Files (document and asset storage)
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE, -- NULL for company-level files
    owner_user_id UUID NOT NULL, -- FK to auth.users
    purpose file_purpose_enum NOT NULL,
    storage_path VARCHAR(500) NOT NULL, -- Path in cloud storage
    filename VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- 3. CONSTRAINTS & TRIGGERS
-- =============================================================================

-- Ensure client_agent_assignments reference agents from same company as client
-- This is a complex constraint that requires a function
CREATE OR REPLACE FUNCTION check_agent_client_same_company()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM clients c 
        JOIN agents a ON a.company_id = c.company_id 
        WHERE c.id = NEW.client_id AND a.id = NEW.agent_id
    ) THEN
        RAISE EXCEPTION 'Agent and client must belong to the same company';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_agent_client_same_company
    BEFORE INSERT OR UPDATE ON client_agent_assignments
    FOR EACH ROW
    EXECUTE FUNCTION check_agent_client_same_company();

-- Add CHECK constraints for invitation roles
ALTER TABLE invitations 
ADD CONSTRAINT check_company_invitation_role 
CHECK (
    (scope = 'company' AND role IN ('owner', 'admin', 'manager', 'member', 'viewer')) OR
    (scope = 'client' AND role IN ('admin', 'manager', 'member', 'viewer'))
);

-- Auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update triggers to tables with updated_at columns
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_company_users_updated_at BEFORE UPDATE ON company_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_client_users_updated_at BEFORE UPDATE ON client_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_client_agent_assignments_updated_at BEFORE UPDATE ON client_agent_assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- 4. INDEXES
-- =============================================================================

-- Foreign key indexes for performance
CREATE INDEX idx_company_users_company_id ON company_users(company_id);
CREATE INDEX idx_company_users_user_id ON company_users(user_id);
CREATE INDEX idx_clients_company_id ON clients(company_id);
CREATE INDEX idx_client_users_client_id ON client_users(client_id);
CREATE INDEX idx_client_users_user_id ON client_users(user_id);
CREATE INDEX idx_agents_company_id ON agents(company_id);
CREATE INDEX idx_client_agent_assignments_client_id ON client_agent_assignments(client_id);
CREATE INDEX idx_client_agent_assignments_agent_id ON client_agent_assignments(agent_id);
CREATE INDEX idx_api_keys_owner ON api_keys(owner_type, owner_id);
CREATE INDEX idx_audit_logs_company_id ON audit_logs(company_id);
CREATE INDEX idx_audit_logs_client_id ON audit_logs(client_id) WHERE client_id IS NOT NULL;
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_invitations_scope ON invitations(scope, scope_id);
CREATE INDEX idx_invitations_token ON invitations(token) WHERE accepted_at IS NULL;

-- Prevent duplicate pending invitations (partial unique constraint)
CREATE UNIQUE INDEX idx_invitations_unique_pending ON invitations(scope, scope_id, email) WHERE accepted_at IS NULL;
CREATE INDEX idx_files_company_id ON files(company_id);
CREATE INDEX idx_files_client_id ON files(client_id) WHERE client_id IS NOT NULL;

-- Search indexes
CREATE INDEX idx_companies_slug ON companies(slug);
CREATE INDEX idx_companies_name_trgm ON companies USING gin(name gin_trgm_ops);
CREATE INDEX idx_clients_name_trgm ON clients USING gin(name gin_trgm_ops);
CREATE INDEX idx_agents_name_trgm ON agents USING gin(name gin_trgm_ops);

-- =============================================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_agent_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is company member
CREATE OR REPLACE FUNCTION is_company_member(company_uuid UUID, user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM company_users 
        WHERE company_id = company_uuid 
        AND user_id = user_uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user has minimum company role
CREATE OR REPLACE FUNCTION has_min_company_role(company_uuid UUID, min_role company_role_enum, user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
DECLARE
    user_role company_role_enum;
    role_hierarchy INTEGER[];
BEGIN
    -- Define role hierarchy (higher number = more permissions)
    role_hierarchy := ARRAY[1, 2, 3, 4, 5]; -- viewer, member, manager, admin, owner
    
    SELECT role INTO user_role 
    FROM company_users 
    WHERE company_id = company_uuid AND user_id = user_uuid;
    
    IF user_role IS NULL THEN
        RETURN FALSE;
    END IF;
    
    RETURN role_hierarchy[
        CASE user_role
            WHEN 'viewer' THEN 1
            WHEN 'member' THEN 2
            WHEN 'manager' THEN 3
            WHEN 'admin' THEN 4
            WHEN 'owner' THEN 5
        END
    ] >= role_hierarchy[
        CASE min_role
            WHEN 'viewer' THEN 1
            WHEN 'member' THEN 2
            WHEN 'manager' THEN 3
            WHEN 'admin' THEN 4
            WHEN 'owner' THEN 5
        END
    ];
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user can access client
CREATE OR REPLACE FUNCTION can_access_client(client_uuid UUID, user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
    -- Can access if company member OR client member
    RETURN EXISTS (
        SELECT 1 FROM clients c
        JOIN company_users cu ON cu.company_id = c.company_id
        WHERE c.id = client_uuid AND cu.user_id = user_uuid
    ) OR EXISTS (
        SELECT 1 FROM client_users
        WHERE client_id = client_uuid AND user_id = user_uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- RLS POLICIES
-- =============================================================================

-- Companies: only accessible to company members
CREATE POLICY companies_select_policy ON companies FOR SELECT
    USING (is_company_member(id));

CREATE POLICY companies_write_policy ON companies FOR ALL
    USING (has_min_company_role(id, 'admin'))
    WITH CHECK (has_min_company_role(id, 'admin'));

-- Company Users: only accessible to company members
CREATE POLICY company_users_select_policy ON company_users FOR SELECT
    USING (is_company_member(company_id));

CREATE POLICY company_users_write_policy ON company_users FOR ALL
    USING (has_min_company_role(company_id, 'admin'))
    WITH CHECK (has_min_company_role(company_id, 'admin'));

-- Clients: accessible to company members and client members
CREATE POLICY clients_select_policy ON clients FOR SELECT
    USING (can_access_client(id));

CREATE POLICY clients_write_policy ON clients FOR ALL
    USING (has_min_company_role(company_id, 'manager'))
    WITH CHECK (has_min_company_role(company_id, 'manager'));

-- Client Users: accessible to users who can access the client
CREATE POLICY client_users_select_policy ON client_users FOR SELECT
    USING (can_access_client(client_id));

CREATE POLICY client_users_write_policy ON client_users FOR ALL
    USING (
        has_min_company_role((SELECT company_id FROM clients WHERE id = client_id), 'manager') OR
        EXISTS (SELECT 1 FROM client_users WHERE client_id = client_users.client_id AND user_id = auth.uid() AND role = 'admin')
    )
    WITH CHECK (
        has_min_company_role((SELECT company_id FROM clients WHERE id = client_id), 'manager') OR
        EXISTS (SELECT 1 FROM client_users WHERE client_id = client_users.client_id AND user_id = auth.uid() AND role = 'admin')
    );

-- Agents: only accessible to company members
CREATE POLICY agents_select_policy ON agents FOR SELECT
    USING (is_company_member(company_id));

CREATE POLICY agents_write_policy ON agents FOR ALL
    USING (has_min_company_role(company_id, 'manager'))
    WITH CHECK (has_min_company_role(company_id, 'manager'));

-- Client Agent Assignments: accessible to users who can access the client
CREATE POLICY client_agent_assignments_select_policy ON client_agent_assignments FOR SELECT
    USING (can_access_client(client_id));

CREATE POLICY client_agent_assignments_write_policy ON client_agent_assignments FOR ALL
    USING (
        has_min_company_role((SELECT company_id FROM clients WHERE id = client_id), 'manager') OR
        EXISTS (SELECT 1 FROM client_users WHERE client_id = client_agent_assignments.client_id AND user_id = auth.uid() AND role IN ('admin', 'manager'))
    )
    WITH CHECK (
        has_min_company_role((SELECT company_id FROM clients WHERE id = client_id), 'manager') OR
        EXISTS (SELECT 1 FROM client_users WHERE client_id = client_agent_assignments.client_id AND user_id = auth.uid() AND role IN ('admin', 'manager'))
    );

-- API Keys: accessible based on owner type and user permissions
CREATE POLICY api_keys_select_policy ON api_keys FOR SELECT
    USING (
        (owner_type = 'company' AND is_company_member(owner_id)) OR
        (owner_type = 'client' AND can_access_client(owner_id)) OR
        (owner_type = 'agent' AND is_company_member((SELECT company_id FROM agents WHERE id = owner_id)))
    );

CREATE POLICY api_keys_write_policy ON api_keys FOR ALL
    USING (
        (owner_type = 'company' AND has_min_company_role(owner_id, 'admin')) OR
        (owner_type = 'client' AND (
            has_min_company_role((SELECT company_id FROM clients WHERE id = owner_id), 'admin') OR
            EXISTS (SELECT 1 FROM client_users WHERE client_id = owner_id AND user_id = auth.uid() AND role = 'admin')
        )) OR
        (owner_type = 'agent' AND has_min_company_role((SELECT company_id FROM agents WHERE id = owner_id), 'admin'))
    )
    WITH CHECK (
        (owner_type = 'company' AND has_min_company_role(owner_id, 'admin')) OR
        (owner_type = 'client' AND (
            has_min_company_role((SELECT company_id FROM clients WHERE id = owner_id), 'admin') OR
            EXISTS (SELECT 1 FROM client_users WHERE client_id = owner_id AND user_id = auth.uid() AND role = 'admin')
        )) OR
        (owner_type = 'agent' AND has_min_company_role((SELECT company_id FROM agents WHERE id = owner_id), 'admin'))
    );

-- Audit Logs: read-only, accessible to company/client members
CREATE POLICY audit_logs_select_policy ON audit_logs FOR SELECT
    USING (
        is_company_member(company_id) OR
        (client_id IS NOT NULL AND can_access_client(client_id))
    );

-- Invitations: accessible to users who can manage the scope
CREATE POLICY invitations_select_policy ON invitations FOR SELECT
    USING (
        (scope = 'company' AND is_company_member(scope_id)) OR
        (scope = 'client' AND can_access_client(scope_id))
    );

CREATE POLICY invitations_write_policy ON invitations FOR ALL
    USING (
        (scope = 'company' AND has_min_company_role(scope_id, 'admin')) OR
        (scope = 'client' AND (
            has_min_company_role((SELECT company_id FROM clients WHERE id = scope_id), 'manager') OR
            EXISTS (SELECT 1 FROM client_users WHERE client_id = scope_id AND user_id = auth.uid() AND role IN ('admin', 'manager'))
        ))
    )
    WITH CHECK (
        (scope = 'company' AND has_min_company_role(scope_id, 'admin')) OR
        (scope = 'client' AND (
            has_min_company_role((SELECT company_id FROM clients WHERE id = scope_id), 'manager') OR
            EXISTS (SELECT 1 FROM client_users WHERE client_id = scope_id AND user_id = auth.uid() AND role IN ('admin', 'manager'))
        ))
    );

-- Files: accessible to company/client members
CREATE POLICY files_select_policy ON files FOR SELECT
    USING (
        is_company_member(company_id) OR
        (client_id IS NOT NULL AND can_access_client(client_id))
    );

CREATE POLICY files_write_policy ON files FOR ALL
    USING (
        has_min_company_role(company_id, 'member') OR
        (client_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM client_users 
            WHERE client_id = files.client_id AND user_id = auth.uid()
        ))
    )
    WITH CHECK (
        has_min_company_role(company_id, 'member') OR
        (client_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM client_users 
            WHERE client_id = files.client_id AND user_id = auth.uid()
        ))
    );

-- =============================================================================
-- 6. VIEWS
-- =============================================================================

-- View for companies accessible to current user
CREATE VIEW v_my_companies AS
SELECT 
    c.*,
    cu.role as my_role,
    cu.created_at as joined_at
FROM companies c
JOIN company_users cu ON cu.company_id = c.id
WHERE cu.user_id = auth.uid();

-- View for clients accessible to current user
CREATE VIEW v_my_clients AS
SELECT DISTINCT
    c.*,
    co.name as company_name,
    co.slug as company_slug,
    clu.role as my_client_role,
    cu.role as my_company_role,
    CASE 
        WHEN clu.user_id IS NOT NULL THEN 'client'
        ELSE 'company'
    END as access_type
FROM clients c
JOIN companies co ON co.id = c.company_id
LEFT JOIN client_users clu ON clu.client_id = c.id AND clu.user_id = auth.uid()
LEFT JOIN company_users cu ON cu.company_id = c.company_id AND cu.user_id = auth.uid()
WHERE 
    -- Company member
    cu.user_id IS NOT NULL
    OR 
    -- Direct client member
    clu.user_id IS NOT NULL;

-- View for agent assignments with client context
CREATE VIEW v_client_agents AS
SELECT 
    caa.*,
    a.name as agent_name,
    a.type as agent_type,
    a.model as agent_model,
    a.status as agent_status,
    a.base_config,
    c.name as client_name,
    c.company_id
FROM client_agent_assignments caa
JOIN agents a ON a.id = caa.agent_id
JOIN clients c ON c.id = caa.client_id;

-- =============================================================================
-- 7. SAMPLE DATA
-- =============================================================================

-- Note: In real implementation, users would exist in auth.users
-- These are example UUIDs for demonstration

-- Sample Company
INSERT INTO companies (id, name, slug, status, branding) VALUES 
(
    '550e8400-e29b-41d4-a716-446655440001',
    'TechCorp Solutions',
    'techcorp',
    'active',
    '{"primary_color": "#2563eb", "logo_url": "/logos/techcorp.png", "custom_domain": "support.techcorp.com"}'
);

-- Sample Company Users (these user_ids would exist in auth.users)
INSERT INTO company_users (company_id, user_id, role) VALUES
('550e8400-e29b-41d4-a716-446655440001', '11111111-1111-1111-1111-111111111111', 'owner'),
('550e8400-e29b-41d4-a716-446655440001', '22222222-2222-2222-2222-222222222222', 'admin');

-- Sample Agent
INSERT INTO agents (id, company_id, name, type, model, status, base_config) VALUES
(
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440001',
    'Customer Support Assistant',
    'chatbot',
    'gpt-4o',
    'active',
    '{"temperature": 0.7, "max_tokens": 500, "system_prompt": "You are a helpful customer support assistant."}'
);

-- Sample Client
INSERT INTO clients (id, company_id, name, external_ref, status, settings) VALUES
(
    '550e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440001',
    'Acme Manufacturing',
    'ACME001',
    'active',
    '{"timezone": "America/New_York", "business_hours": "9-17", "escalation_enabled": true}'
);

-- Sample Client User (would exist in auth.users)
INSERT INTO client_users (client_id, user_id, role) VALUES
('550e8400-e29b-41d4-a716-446655440003', '33333333-3333-3333-3333-333333333333', 'admin');

-- Sample Agent Assignment to Client
INSERT INTO client_agent_assignments (client_id, agent_id, enabled, override_config) VALUES
(
    '550e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440002',
    true,
    '{"system_prompt": "You are Acme Manufacturing''s support assistant. Our business hours are 9 AM to 5 PM EST."}'
);

-- Sample API Key
INSERT INTO api_keys (owner_type, owner_id, name, hashed_key) VALUES
(
    'client',
    '550e8400-e29b-41d4-a716-446655440003',
    'Production API Key',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewSLvUpKvEuxOW6u' -- Example bcrypt hash
);

-- Sample Audit Log
INSERT INTO audit_logs (company_id, client_id, actor_user_id, actor_scope, action, entity_type, entity_id, metadata) VALUES
(
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440003',
    '33333333-3333-3333-3333-333333333333',
    'client',
    'assign',
    'agent',
    '550e8400-e29b-41d4-a716-446655440002',
    '{"agent_name": "Customer Support Assistant", "client_name": "Acme Manufacturing"}'
);

-- =============================================================================
-- COMMENTS ON KEY DESIGN DECISIONS
-- =============================================================================

/*
KEY DESIGN DECISIONS:

1. MULTI-TENANCY STRATEGY:
   - Row-level security (RLS) for strict tenant isolation
   - Company as the primary tenant boundary
   - All data scoped to company_id (direct or indirect)

2. ROLE-BASED ACCESS CONTROL:
   - Hierarchical roles with helper functions for permission checks
   - Separate role enums for company vs client scopes
   - RLS policies enforce role-based permissions automatically

3. AGENT-CLIENT RELATIONSHIP:
   - Many-to-many through client_agent_assignments
   - Agents belong to companies, assigned to clients
   - Configuration inheritance with client-specific overrides
   - Constraint ensures agents and clients belong to same company

4. SECURITY CONSIDERATIONS:
   - All tables have RLS enabled
   - Helper functions marked SECURITY DEFINER for elevated privileges
   - Policies prevent cross-tenant data access
   - API keys hashed for security
   - Audit trail for all significant actions

5. SCALABILITY FEATURES:
   - Proper indexing on all foreign keys and search columns
   - GIN indexes for full-text search on names
   - Partitioning-ready structure (audit_logs by created_at)
   - UUID primary keys for distributed scaling

6. SUPABASE INTEGRATION:
   - Uses auth.uid() for current user context
   - Compatible with Supabase Auth
   - Views provide convenient access patterns
   - Policies work with Supabase client libraries

7. FLEXIBILITY:
   - JSONB columns for extensible configuration
   - Generic audit_logs for any entity type
   - File storage abstraction with metadata
   - Invitation system supports both company and client onboarding
*/
