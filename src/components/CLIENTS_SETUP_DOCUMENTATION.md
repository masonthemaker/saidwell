### Clients: How companies add clients and grant access

This app is white‑label: companies own clients. Company users can access their company and any of its clients. Client users only access their assigned client. The flow for adding a new client and granting a user access is:

1) Create a row in `public.clients` for the company
2) Create a membership in `public.client_users` for the user and client

---

## Data model (simplified)
- **companies**: `{ id, name, slug, status, ... }`
- **clients**: `{ id, company_id, name, status, settings? }`
- **client_users**: `{ id, client_id, user_id, role, created_at, updated_at }`
  - `role` is an enum: `admin | manager | member | viewer`
  - There is a unique constraint on `(client_id, user_id)` (upserts are safe)

Views used by the app:
- `v_my_companies` → lists companies the current user can access
- `v_my_clients` → lists clients the current user can access

Routing behavior in the app:
- Company‑only users → auto‑redirect to `company/[slug]`
- Multi‑access users (company + clients) → `dashboard/select-context`
- Client‑only users → land on `/` (client dashboard) directly

---

## Step 1 — Create a client for a company
Inputs needed:
- `company_id` of the owning company
- `name` for the client (e.g., "Acme Manufacturing")

Example: resolve a company by slug and create the client.

```sql
-- 1) Resolve company_id by slug (example: techcorp)
select id as company_id from public.companies where slug ilike 'techcorp' limit 1;

-- 2) Create the client
insert into public.clients (id, company_id, name, status, created_at, updated_at)
values (gen_random_uuid(),
        /* company_id */ 'REPLACE_WITH_COMPANY_ID',
        'Acme Manufacturing',
        'active',
        now(), now())
returning *;
```

Notes:
- `status` should generally be `active` unless you need to stage access.
- `settings` (jsonb) is optional if you need per‑client config.

---

## Step 2 — Add a client user membership
Inputs needed:
- `user_id` from `auth.users`
- `client_id` from Step 1
- `role` from `client_role_enum` (`viewer` is a common default)

Example: upsert a user as a `viewer` on a client.

```sql
-- 1) Resolve user_id (example email)
with u as (
  select id as user_id from auth.users where email ilike 'client@example.com' limit 1
)
-- 2) Resolve client_id (example name)
, c as (
  select id as client_id from public.clients where name ilike 'Acme Manufacturing' limit 1
)
insert into public.client_users (id, client_id, user_id, role, created_at, updated_at)
values (gen_random_uuid(), (select client_id from c), (select user_id from u), 'viewer', now(), now())
on conflict (client_id, user_id)
do update set role = excluded.role, updated_at = now()
returning *;
```

Role options (as defined in the DB):
- `admin`
- `manager`
- `member`
- `viewer`

---

## Verify access

Check the membership and the client list for the user:

```sql
-- Membership row exists
with u as (select id as user_id from auth.users where email ilike 'client@example.com' limit 1)
select cu.*
from public.client_users cu
where cu.user_id = (select user_id from u);

-- The app uses v_my_clients to populate client context
select * from public.v_my_clients; -- Should include the new client for that user when queried as that user
```

When that user logs in:
- If they only have client memberships (no company memberships in `company_users`), they’ll be taken directly to the client dashboard `/`.
- If they also have company access, they’ll land on `dashboard/select-context` to choose a context.

---

## Update or remove access

```sql
-- Change a client role
update public.client_users
set role = 'manager', updated_at = now()
where client_id = 'CLIENT_ID' and user_id = 'USER_ID';

-- Remove a client membership
delete from public.client_users
where client_id = 'CLIENT_ID' and user_id = 'USER_ID';
```

---

## Operational notes
- If performing these writes from a backend job, use a service role key to bypass RLS.
- If doing it from the app with user JWTs, ensure your RLS policies allow the acting company admin to create clients and add client users.
- The app’s context switcher and routing are already wired to `v_my_clients` / `v_my_companies`, so once the rows exist, the UX updates automatically.


