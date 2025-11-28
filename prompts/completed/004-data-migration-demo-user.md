<objective>
Update all Convex queries and mutations to be user-scoped, and create a demo user (hello@iamjonathan.me) with existing data assigned to them.

This is the final step that makes the app fully multi-user ready while preserving existing functionality.
</objective>

<context>
The app now has Convex Auth configured with userId fields in the schema. All existing queries and mutations need to be updated to:
1. Require authentication
2. Filter data by the current user's ID
3. Assign new data to the current user

A demo user needs to be created that owns all the existing/seed data.

@convex/schema.ts - Schema with userId fields
@convex/tasksQuery.ts - Task queries to update
@convex/tasksMutation.ts - Task mutations to update
@convex/projectsQuery.ts - Project queries to update
@convex/projectsMutation.ts - Project mutations to update
@convex/labelsQuery.ts - Label queries to update
@convex/labelsMutation.ts - Label mutations to update
@convex/init.ts - Seed script to update
@CLAUDE.md - Project conventions
</context>

<research>
Read all existing query and mutation files to understand current patterns:
@convex/tasksQuery.ts
@convex/tasksMutation.ts
@convex/projectsQuery.ts
@convex/projectsMutation.ts
@convex/ai/queries.ts
@convex/ai/mutations.ts
</research>

<requirements>
1. Create user helper in `convex/users.ts`:
   - `getCurrentUser` query - returns current authenticated user
   - `getOrCreateDemoUser` internal function for seeding

2. Update all queries to be user-scoped:
   - Import `getAuthUserId` from "@convex-dev/auth/server"
   - Get userId at start of each query handler
   - Filter results by userId
   - Return empty array for unauthenticated requests (or throw)

3. Update all mutations to be user-scoped:
   - Require authentication (throw if not authenticated)
   - Add userId to all created entities
   - Verify ownership before updates/deletes

4. Update `convex/init.ts` seed script:
   - Create demo user with email: hello@iamjonathan.me
   - Set onboardingCompleted: true for demo user
   - Assign all seed data (projects, tasks, labels) to demo user
   - Make seed script idempotent (check if demo user exists)

5. Create a password for the demo user:
   - Use Convex Auth's password provider OR
   - Create a specific "demo" OAuth bypass OR
   - Document that demo user logs in via OTP to hello@iamjonathan.me

6. Update AI chat queries/mutations for user scope:
   - chatSessions should be user-scoped
   - chatMessages inherit scope from their session
</requirements>

<implementation>
Pattern for protected queries:

```typescript
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return []; // Or throw new Error("Not authenticated")
    }

    return await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("asc")
      .collect();
  },
});
```

Pattern for protected mutations:

```typescript
import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: { title: v.string(), /* ... */ },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.insert("tasks", {
      ...args,
      userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});
```

For the demo user seed:

```typescript
// In convex/init.ts
import { internal } from "./_generated/api";

// Create demo user via internal auth API or direct DB insert
const demoUser = await ctx.db
  .query("users")
  .filter((q) => q.eq(q.field("email"), "hello@iamjonathan.me"))
  .first();

if (!demoUser) {
  // Create the demo user - implementation depends on auth setup
}
```
</implementation>

<constraints>
- Make queries gracefully handle unauthenticated state (return empty, don't crash)
- Mutations MUST require authentication and throw clear errors
- Don't break existing functionality - the app should work exactly as before for authenticated users
- Ensure demo user can log in via OTP to hello@iamjonathan.me
- Update all indexes to include userId for query performance
- Chat functionality should remain working for the demo user
</constraints>

<output>
Modify these files:
- `./convex/users.ts` - User queries and helpers
- `./convex/tasksQuery.ts` - User-scoped task queries
- `./convex/tasksMutation.ts` - User-scoped task mutations
- `./convex/projectsQuery.ts` - User-scoped project queries
- `./convex/projectsMutation.ts` - User-scoped project mutations
- `./convex/labelsQuery.ts` - User-scoped label queries
- `./convex/labelsMutation.ts` - User-scoped label mutations
- `./convex/init.ts` - Updated seed with demo user
- `./convex/ai/queries.ts` - User-scoped chat queries
- `./convex/ai/mutations.ts` - User-scoped chat mutations
- `./convex/schema.ts` - Add by_user indexes if not present
</output>

<verification>
1. Run `pnpm convex dev` - no errors
2. Run seed script: `pnpm seed:dev`
3. Log in as demo user via OTP to hello@iamjonathan.me
4. Verify demo user sees all seed data
5. Create a second test account - should see empty state
6. Create data as second user - verify isolation from demo user
7. Test all CRUD operations work correctly
</verification>

<success_criteria>
- All queries filter by authenticated userId
- All mutations require authentication and set userId
- Demo user (hello@iamjonathan.me) owns all seed data
- Demo user can log in via OTP
- New users start with empty state
- Data is properly isolated between users
- No regressions in existing functionality
- AI chat is properly user-scoped
</success_criteria>
