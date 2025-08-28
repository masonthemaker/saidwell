# useTeam Hook

## Overview
The `useTeam` hook provides functionality for managing team members within a company. It fetches and manages company users (excluding client users) from the memberships table.

## Features
- Fetch team members for the current company
- Real-time data from Supabase
- Automatic sorting by role hierarchy (owner > admin > member)
- Loading states and error handling
- Refresh functionality

## Usage

```tsx
import { useTeam } from '@/hooks/use-team';

function TeamSettings() {
  const { 
    teamMembers, 
    isLoading, 
    error, 
    refresh, 
    totalMembers 
  } = useTeam();

  if (isLoading) return <div>Loading team...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Team Members ({totalMembers})</h2>
      {teamMembers.map(member => (
        <div key={member.id}>
          <span>{member.name} - {member.role}</span>
        </div>
      ))}
    </div>
  );
}
```

## API Reference

### Return Value
- `teamMembers`: Array of team member objects
- `isLoading`: Boolean indicating if data is being fetched
- `error`: Error message string or null
- `refresh`: Function to manually refresh the team data
- `totalMembers`: Total count of team members

### TeamMember Object
- `id`: Unique identifier (user_id)
- `user_id`: User ID from auth.users
- `name`: Display name of the team member
- `email`: Email address
- `role`: Role in company ('owner' | 'admin' | 'member')
- `status`: Account status ('Active' | 'Pending' | 'Inactive')
- `joinDate`: Formatted join date
- `created_at`: Raw timestamp

## Notes
- Only shows company users (excludes client users)
- Automatically sorts by role hierarchy
- Uses the first company membership if user belongs to multiple companies
- Handles missing user metadata gracefully
