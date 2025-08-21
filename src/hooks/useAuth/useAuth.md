# Authentication System Documentation

This document explains the authentication system in SaidWell, including the `useAuth` hook and all authentication components. This is designed for newer developers and AI agents to understand how authentication works in this Next.js + Supabase application.

## Overview

The authentication system uses **Supabase Auth** for user management and provides a complete set of components for login, signup, password management, and session handling. The system includes email verification and password reset functionality.

---

## Core Hook: `useAuth`

### Location
`src/hooks/useAuth/useAuth.ts`

### Purpose
The `useAuth` hook is the central authentication manager that:
- Tracks user authentication state
- Provides authentication methods (login, signup, logout)
- Handles automatic redirects for protected routes
- Listens for authentication state changes

### Usage

```typescript
import { useAuth } from '@/hooks/useAuth/useAuth';

// For protected pages (automatically redirects if not authenticated)
const { isAuthenticated, isLoading, user, signIn, signUp, signOut } = useAuth();

// For public pages (doesn't redirect)
const { isAuthenticated, isLoading, user, signIn, signUp, signOut } = useAuth(false);
```

### Parameters
- `requireAuth` (boolean, default: `true`): Whether to automatically redirect unauthenticated users to `/auth/login`

### Return Values

| Property | Type | Description |
|----------|------|-------------|
| `isAuthenticated` | `boolean` | Whether user is currently authenticated |
| `isLoading` | `boolean` | Whether authentication state is being checked |
| `user` | `User \| null` | Supabase user object or null |
| `signIn` | `function` | Method to sign in with email/password |
| `signUp` | `function` | Method to create new account |
| `signOut` | `function` | Method to sign out current user |
| `supabase` | `SupabaseClient` | Direct access to Supabase client |

### Methods

#### `signIn(email: string, password: string)`
- **Purpose**: Authenticates user with email and password
- **Returns**: `{ data, error }` from Supabase
- **Side Effects**: Sets authentication state, no automatic redirect

#### `signUp(email: string, password: string)`
- **Purpose**: Creates new user account
- **Returns**: `{ data, error }` from Supabase
- **Side Effects**: Sends confirmation email, sets authentication state

#### `signOut()`
- **Purpose**: Signs out current user
- **Returns**: `{ error }` from Supabase
- **Side Effects**: Clears authentication state, redirects to `/auth/login`

---

## Authentication Components

### 1. LoginForm Component

**Location**: `src/components/login-form.tsx`

**Purpose**: Handles user sign-in with email and password

**Features**:
- Email/password validation
- Loading states during authentication
- Error message display
- Automatic redirect to home page on success
- Link to forgot password page

**Usage**:
```tsx
import LoginForm from '@/components/login-form';

<LoginForm />
```

### 2. SignUpForm Component

**Location**: `src/components/sign-up-form.tsx`

**Purpose**: Handles new user account creation

**Features**:
- Email/password validation (minimum 6 characters)
- Loading states during signup
- Error message display
- Email confirmation setup
- Automatic redirect to success page

**Email Confirmation**: Users receive confirmation email with link to `/auth/confirm`

### 3. ForgotPasswordForm Component

**Location**: `src/components/forgot-password-form.tsx`

**Purpose**: Handles password reset requests

**Features**:
- Email validation
- Success/error message display
- Password reset email sending
- User feedback with confirmation UI

**Flow**: 
1. User enters email
2. System sends password reset email
3. Email contains link to `/auth/update-password`

### 4. UpdatePasswordForm Component

**Location**: `src/components/update-password-form.tsx`

**Purpose**: Handles password updates from reset emails

**Features**:
- New password input with confirmation
- Password matching validation
- Minimum 6 character requirement
- Automatic redirect to home on success

### 5. LogoutButton Component

**Location**: `src/components/logout-button.tsx`

**Purpose**: Provides sign-out functionality

**Features**:
- Customizable styling via className prop
- Customizable button text via children prop
- Automatic redirect to login page
- Error handling

**Usage**:
```tsx
import LogoutButton from '@/components/logout-button';

// Default usage
<LogoutButton />

// Custom styling and text
<LogoutButton className="custom-style">
  Custom Sign Out Text
</LogoutButton>
```

---

## Authentication Pages Structure

### Page Routes and Components

| Route | Component | Purpose |
|-------|-----------|---------|
| `/auth/login` | `LoginForm` | User sign-in page |
| `/auth/sign-up` | `SignUpForm` | New account creation |
| `/auth/forgot-password` | `ForgotPasswordForm` | Password reset request |
| `/auth/update-password` | `UpdatePasswordForm` | Password update from email |
| `/auth/sign-up-success` | Success message | Post-signup confirmation |
| `/auth/error` | Error display | Authentication error handling |
| `/auth/confirm` | Email confirmation | Account verification route |

### Background Variants
Each auth page uses different background images via `ParallaxBackground` component:
- **Login pages** (login, forgot-password, update-password): `background2.png`
- **Signup pages** (sign-up, sign-up-success): `background3.png`
- **Error page**: `background.png` (default)

---

## Email Confirmation Flow

### 1. Account Creation
1. User fills out signup form
2. `SignUpForm` calls Supabase `signUp()` with email redirect to `/auth/confirm`
3. User redirected to `/auth/sign-up-success` page
4. Confirmation email sent to user

### 2. Email Confirmation
1. User clicks link in email
2. Route handler at `/auth/confirm/route.ts` processes the token
3. On success: User redirected to home page
4. On error: User redirected to `/auth/error` with error message

### 3. Password Reset
1. User submits email in `ForgotPasswordForm`
2. Reset email sent with link to `/auth/update-password`
3. User clicks email link and updates password
4. On success: User redirected to home page

---

## Supabase Configuration

### Client Setup
**Location**: `src/lib/supabase/client.ts`

Creates browser client for client-side operations using environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Server Setup
**Location**: `src/lib/supabase/server.ts`

Creates server client for server-side operations and API routes.

---

## Usage Examples

### Protecting a Page
```tsx
'use client';
import { useAuth } from '@/hooks/useAuth/useAuth';

export default function ProtectedPage() {
  const { isAuthenticated, isLoading, user } = useAuth(); // requireAuth defaults to true

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // This won't render as user will be redirected to login
    return null;
  }

  return (
    <div>
      <h1>Welcome, {user?.email}!</h1>
      {/* Protected content */}
    </div>
  );
}
```

### Public Page with Optional Auth
```tsx
'use client';
import { useAuth } from '@/hooks/useAuth/useAuth';

export default function PublicPage() {
  const { isAuthenticated, user } = useAuth(false); // No automatic redirect

  return (
    <div>
      <h1>Public Page</h1>
      {isAuthenticated ? (
        <p>Welcome back, {user?.email}!</p>
      ) : (
        <p><a href="/auth/login">Sign in</a> to access more features</p>
      )}
    </div>
  );
}
```

### Using Authentication Methods
```tsx
'use client';
import { useAuth } from '@/hooks/useAuth/useAuth';

export default function CustomAuthComponent() {
  const { signIn, signUp, signOut, isAuthenticated } = useAuth(false);

  const handleLogin = async () => {
    const { data, error } = await signIn('user@example.com', 'password');
    if (error) {
      console.error('Login failed:', error.message);
    }
  };

  const handleSignup = async () => {
    const { data, error } = await signUp('user@example.com', 'password');
    if (error) {
      console.error('Signup failed:', error.message);
    }
  };

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      console.error('Logout failed:', error.message);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={handleLogout}>Sign Out</button>
      ) : (
        <div>
          <button onClick={handleLogin}>Sign In</button>
          <button onClick={handleSignup}>Sign Up</button>
        </div>
      )}
    </div>
  );
}
```

---

## Error Handling

### Common Error Patterns

1. **Invalid Credentials**: Display error message from Supabase
2. **Network Issues**: Show generic "Please try again" message
3. **Email Already Exists**: Supabase returns specific error message
4. **Weak Password**: Supabase enforces minimum requirements

### Error Display
All form components include error state management with consistent styling:
```tsx
{error && (
  <div className="text-error-red text-sm text-center bg-error-red/10 border border-error-red/20 rounded-lg p-2 backdrop-blur-sm">
    {error}
  </div>
)}
```

---

## Styling Notes

All auth components use consistent styling patterns:
- **Glass morphism effects**: `backdrop-blur-xl`, `bg-white/3`
- **Form inputs**: Semi-transparent with accent color focus states
- **Buttons**: Accent color with hover effects and disabled states
- **Error/Success messages**: Color-coded with appropriate backgrounds

The styling integrates with the app's design system using CSS custom properties defined in `globals.css`.

---

## Best Practices

1. **Always handle loading states** when using `useAuth`
2. **Check for authentication errors** in form submissions
3. **Use requireAuth parameter appropriately** for public vs protected pages
4. **Provide user feedback** for all authentication actions
5. **Handle edge cases** like network failures gracefully

This authentication system provides a complete, production-ready solution for user management in the SaidWell application.