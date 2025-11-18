# Convex Database Seeding Guide

This project follows the **official Convex-recommended approach** for database seeding using `internalMutation` in `convex/init.ts`.

## Why This Approach?

✅ **Type-safe** - Seed data automatically stays in sync with your schema
✅ **Secure** - Uses `internalMutation` (prevents client-side calls)
✅ **Idempotent** - Safe to run multiple times
✅ **Reusable** - Share helper functions between seed and production code

Reference: [Convex Seeding Best Practices](https://stack.convex.dev/seeding-data-for-preview-deployments)

## How to Seed Your Database

### Option 1: Seed Once (Recommended for Development)

```bash
pnpm seed
```

This runs the `init:init` internalMutation once to populate your dev deployment. ✓ Already seeded!

### Option 2: Re-Seed During Development

```bash
pnpm seed
```

Run this if you want to re-seed the database with fresh test data. The function is idempotent - if data already exists, it will skip.

To force a fresh start:
```bash
# Delete and recreate your dev deployment
pnpm convex deploy --delete-project
# Re-seed with fresh data
pnpm seed
```

### Option 3: Seed Preview Deployment

```bash
pnpm seed:preview
```

This deploys to a new preview environment and automatically seeds it. Perfect for testing with fresh data.

## What Gets Seeded?

Running `pnpm seed` will populate your database with:

- **6 Projects**: Inbox, Work Projects, Personal Goals, Shopping List, Home Improvement, Learning & Development
- **6 Labels**: Work, Personal, Urgent, Waiting, Home, Shopping
- **18+ Tasks**: Sample tasks across all projects with varied priorities, due dates, and statuses

### Sample Data Structure

```
Projects:
  ├── Inbox (3 active tasks, 0 completed)
  ├── Work Projects (3 active tasks, 1 completed)
  ├── Personal Goals (3 active tasks, 0 completed)
  ├── Shopping List (3 active tasks, 1 completed)
  ├── Home Improvement (2 active tasks, 0 completed)
  └── Learning & Development (1 active task, 1 completed)

Labels:
  ├── Work
  ├── Personal
  ├── Urgent
  ├── Waiting
  ├── Home
  └── Shopping
```

## Understanding the Implementation

### Seed File Location

```
convex/init.ts
```

This is the official Convex pattern - the `init` function is a special reserved name that serves as your project's initialization entry point.

### Type Safety Example

```typescript
// Seed data is type-checked against your schema
ctx.db.insert("tasks", {
  title: "Learn React Native",  // ✓ string
  priority: "p1",                // ✓ matches union type
  status: "active",              // ✓ matches "active" | "completed"
  dueDate: Date.now(),           // ✓ number (timestamp)
  // TypeScript catches any schema mismatches at compile time!
})
```

## When to Run Seeding

| Scenario | Command | When to Use |
|----------|---------|------------|
| First time setup | `pnpm seed` | After deploying schema, before testing |
| Fresh start | `pnpm seed` | To reset database to initial state |
| Development | `pnpm seed:dev` | When actively developing with real data |
| Preview Deploy | `pnpm seed:preview` | Creating a staging environment with data |

## Customizing Seed Data

To modify the seed data:

1. Edit `convex/init.ts`
2. Update the data in the handler function
3. Run `pnpm seed` to apply changes

Example - Adding a new label:

```typescript
// In convex/init.ts
const labels = await Promise.all([
  ctx.db.insert("labels", {
    name: "Work",
    color: "#4073ff",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }),
  // Add new label:
  ctx.db.insert("labels", {
    name: "Review",
    color: "#ff00ff",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }),
  // ... rest of labels
]);
```

## Idempotency - Safe to Run Multiple Times

The seed function checks if data already exists before inserting:

```typescript
const existingProjects = await ctx.db.query("projects").collect();
if (existingProjects.length > 0) {
  return { success: true, message: "Database already seeded" };
}
```

This means `pnpm seed` won't create duplicate data if you run it twice. ✓

## Production Deployments

For production, you have options:

### Option A: Seed Only New Projects
Use `pnpm seed` to initialize data only on first deployment

### Option B: Use a Separate Admin UI
Create a separate admin interface with a protected mutation to seed production data

### Option C: No Auto-Seeding
Let users create their own data through the app's UI

For now, development uses the CLI-based approach. Production seeding strategy can be decided later based on your app's needs.

## Troubleshooting

### "Database already seeded" message

This is expected behavior - the function is idempotent and won't create duplicate data.

To start fresh:
1. Delete your Convex deployment: `pnpm convex deploy --delete-project`
2. Recreate and seed: `pnpm seed`

### Command not found: pnpm seed

Ensure you're running from the project root and have run `pnpm install` first.

### "Cannot find module" errors

Ensure `convex/init.ts` exists and follows the official pattern with `internalMutation`.

## Files Involved

- **convex/init.ts** - Seed definition (official Convex pattern)
- **package.json** - Seed npm scripts
- **convex/schema.ts** - Database schema that seed must match
- **src/components/DatabaseSeeder.tsx** - Placeholder for future init logic

## Next Steps

1. ✓ Run `pnpm seed` to populate your development database
2. Run `pnpm start` to start the app and verify data loads
3. Follow `CONVEX_MIGRATION.md` to update screens to use Convex queries
4. Test real-time updates across the app
