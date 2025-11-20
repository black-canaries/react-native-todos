# Authentication Setup Guide

This guide will help you set up Convex Auth with email/password authentication for your React Native Todos app.

## Prerequisites

- Node.js installed (v18 or later)
- pnpm installed (`npm install -g pnpm`)
- A Convex account (sign up at https://convex.dev)

## Step 1: Deploy Convex Backend

1. Login to Convex:
   ```bash
   npx convex dev
   ```

2. Follow the prompts to:
   - Login or create a Convex account
   - Create a new project or select an existing one
   - The CLI will automatically deploy your schema and functions

3. Copy the deployment URL shown in the terminal (looks like `https://your-project.convex.cloud`)

## Step 2: Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your Convex deployment URL:
   ```
   EXPO_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
   ```

## Step 3: Understanding the Authentication Flow

### Email/Password Authentication

The app uses Convex Auth's Password provider for authentication:

- **Sign Up**: Creates a new user account with email and password
- **Sign In**: Authenticates existing users
- **Sign Out**: Logs out the current user

### Protected Routes

The app automatically handles authentication routing:

- **Unauthenticated users** are redirected to `/auth/login`
- **Authenticated users** are redirected to `/(tabs)` (main app)

### Data Isolation

All data is now scoped to the authenticated user:

- **Tasks**: Each task belongs to a specific user
- **Projects**: Each project belongs to a specific user
- **Labels**: Each label belongs to a specific user

Users can only see and modify their own data.

## Step 4: Run the App

1. Install dependencies (if not already done):
   ```bash
   pnpm install
   ```

2. Start the Expo dev server:
   ```bash
   pnpm start
   ```

3. Run on your preferred platform:
   ```bash
   pnpm ios       # iOS simulator
   pnpm android   # Android emulator
   pnpm web       # Web browser
   ```

## Step 5: Test Authentication

1. Open the app - you should see the login screen
2. Click "Sign Up" to create a new account
3. Enter an email and password (min 8 characters)
4. You'll be automatically logged in and redirected to the app
5. Test signing out and signing back in

## File Structure

```
convex/
├── auth.config.ts          # Auth provider configuration
├── http.ts                 # HTTP routes for auth
├── schema.ts               # Database schema with user relationships
├── tasksQuery.ts           # User-scoped task queries
├── tasksMutation.ts        # User-scoped task mutations
├── projectsQuery.ts        # User-scoped project queries
├── projectsMutation.ts     # User-scoped project mutations
└── labelsQuery.ts          # User-scoped label queries

src/
├── providers/
│   ├── ConvexProvider.tsx  # Convex client wrapper
│   └── AuthProvider.tsx    # Auth context and hooks
└── app/
    ├── auth/
    │   ├── login.tsx       # Login screen
    │   └── signup.tsx      # Sign up screen
    └── _layout.tsx         # Root layout with auth routing
```

## Using Authentication in Your App

### Check Authentication Status

```tsx
import { useAuth } from '../providers/AuthProvider';

function MyComponent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <Loading />;
  if (!isAuthenticated) return <LoginPrompt />;

  return <YourContent />;
}
```

### Sign Out

```tsx
import { useAuth } from '../providers/AuthProvider';

function ProfileScreen() {
  const { signOut } = useAuth();

  return (
    <Button onPress={signOut}>
      Sign Out
    </Button>
  );
}
```

### Query User Data

All Convex queries automatically filter by the authenticated user:

```tsx
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

function TaskList() {
  const tasks = useQuery(api.tasksQuery.listActive);
  // Only returns tasks belonging to the current user

  return <TaskListView tasks={tasks} />;
}
```

## Troubleshooting

### "Unauthorized" errors

- Make sure you're logged in
- Check that your Convex deployment URL is correct in `.env`
- Restart the Expo dev server after changing environment variables

### Can't sign up or sign in

- Check the console for error messages
- Verify your Convex backend is deployed (`npx convex dev`)
- Make sure the email is valid and password is at least 8 characters

### Data not showing up

- Verify you're logged in with the correct account
- Check that the Convex queries are returning data (use Convex Dashboard)
- Data from the old mock data won't appear - you'll need to create new tasks/projects

## Next Steps

- Add password reset functionality
- Implement OAuth providers (Google, GitHub, etc.)
- Add user profile management
- Set up email verification
- Implement multi-factor authentication

## Resources

- [Convex Auth Documentation](https://docs.convex.dev/auth)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [React Native Documentation](https://reactnative.dev/)
