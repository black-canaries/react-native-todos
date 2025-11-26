<objective>
Set up Convex Auth backend with Google OAuth, GitHub OAuth, and Email OTP (via Resend) authentication providers. Update the existing Convex schema to support user ownership of data entities.

This is foundational work that enables user-specific data access and multi-user support for the todo app.
</objective>

<context>
This is a React Native Expo app using Convex as the backend. The app currently has no authentication - all data is shared globally.

Existing schema tables that need userId field:
- projects
- tasks
- labels
- chatSessions
- chatMessages

@convex/schema.ts - Current schema to modify
@src/app/_layout.tsx - Root layout that needs ConvexAuthProvider
@package.json - Check existing dependencies
</context>

<research>
Before implementing, read the CLAUDE.md file to understand project conventions and tech stack.

Reference the Convex Auth documentation patterns:
- authTables spread operator for auth schema
- getAuthUserId() for protected queries/mutations
- ConvexAuthProvider for React Native client
</research>

<requirements>
1. Install required packages:
   - @convex-dev/auth
   - @auth/core@0.37.0
   - resend (for OTP emails)

2. Create `convex/auth.ts` with:
   - Google OAuth provider
   - GitHub OAuth provider
   - Custom Email OTP provider using Resend

3. Update `convex/schema.ts`:
   - Spread authTables for auth-related tables
   - Add `userId: v.id("users")` to projects, tasks, labels, chatSessions tables
   - Add appropriate indexes for userId queries

4. Create `convex/ResendOTP.ts`:
   - Custom OTP provider using Resend API
   - 8-digit OTP code generation
   - 15-minute expiration
   - Professional email template

5. Update `convex/http.ts` (create if needed):
   - Import and expose auth HTTP routes

6. Document required environment variables in `.env.example`:
   - AUTH_GOOGLE_ID
   - AUTH_GOOGLE_SECRET
   - AUTH_GITHUB_ID
   - AUTH_GITHUB_SECRET
   - AUTH_RESEND_KEY
   - SITE_URL

7. Add `onboardingCompleted: v.boolean()` field to the users table (if authTables creates one, extend it; otherwise create users table)
</requirements>

<implementation>
Follow Convex Auth patterns exactly:

```typescript
// convex/auth.ts pattern
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { convexAuth } from "@convex-dev/auth/server";
import { ResendOTP } from "./ResendOTP";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [GitHub, Google, ResendOTP],
});
```

For the OTP provider, implement the two-step flow:
1. User submits email -> generates and sends OTP
2. User submits OTP + email -> verifies and authenticates

Important: The callback URL pattern is `https://[deployment].convex.site/api/auth/callback/[provider]`
</implementation>

<constraints>
- DO NOT modify existing query/mutation logic yet - that's a separate prompt
- DO NOT create UI components - that's a separate prompt
- Keep the schema backward compatible by making userId optional initially (will be required after migration)
- Use pnpm for all package installations
</constraints>

<output>
Create/modify these files:
- `./convex/auth.ts` - Main auth configuration
- `./convex/ResendOTP.ts` - Custom OTP provider
- `./convex/schema.ts` - Updated schema with auth tables and userId fields
- `./convex/http.ts` - HTTP routes for auth callbacks
- `./.env.example` - Document required environment variables
</output>

<verification>
After implementation:
1. Run `pnpm convex dev` to verify schema compiles
2. Check that auth tables are generated in schema
3. Verify no TypeScript errors in convex/ directory
</verification>

<success_criteria>
- Convex Auth is configured with all 3 providers
- Schema includes authTables and userId on data tables
- ResendOTP provider is implemented with professional email template
- Environment variables are documented
- No TypeScript or Convex compilation errors
</success_criteria>
