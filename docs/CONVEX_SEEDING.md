# Convex Database Seeding Guide

Comprehensive guide for seeding your Convex database with test data using the official Convex-recommended approach.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Seeding Commands](#seeding-commands)
  - [Development Seeding](#development-seeding)
  - [Preview Deployment Seeding](#preview-deployment-seeding)
  - [Force Re-Seeding](#force-re-seeding)
- [Seed Data Structure](#seed-data-structure)
- [Implementation Details](#implementation-details)
  - [File Location](#file-location)
  - [Type Safety](#type-safety)
  - [Idempotency](#idempotency)
- [Customizing Seed Data](#customizing-seed-data)
- [Production Strategy](#production-strategy)
- [Troubleshooting](#troubleshooting)
- [Related Documentation](#related-documentation)

---

## Overview

This project follows the **official Convex-recommended approach** for database seeding using `internalMutation` in `convex/init.ts`.

### Why This Approach?

- **Type-safe** - Seed data automatically stays in sync with your schema
- **Secure** - Uses `internalMutation` (prevents client-side calls)
- **Idempotent** - Safe to run multiple times without creating duplicates
- **Reusable** - Share helper functions between seed and production code

**Reference**: [Convex Seeding Best Practices](https://stack.convex.dev/seeding-data-for-preview-deployments)

---

## Prerequisites

Before seeding your database, ensure:

1. You have a Convex project deployed (`pnpm convex dev` or `pnpm convex deploy`)
2. Your database schema is defined in `convex/schema.ts`
3. You've run `pnpm install` to install all dependencies
4. The `convex/init.ts` file exists with your seed data

See [CONVEX_SETUP.md](./CONVEX_SETUP.md) for initial project configuration.

---

## Quick Start

For first-time setup, simply run:

```bash
pnpm seed
```

This populates your development deployment with sample projects, labels, and tasks.

---

## Seeding Commands

### Development Seeding

**Seed once (recommended for initial setup):**

```bash
pnpm seed
```

Runs the `init:init` internal mutation to populate your dev deployment. The function is idempotent—if data already exists, it will skip seeding and return a "Database already seeded" message.

**Seed during active development:**

```bash
pnpm seed:dev
```

Use this when actively developing and testing with real data.

### Preview Deployment Seeding

**Deploy to preview environment with seed data:**

```bash
pnpm seed:preview
```

Creates a new preview deployment and automatically seeds it with test data. Perfect for testing features in isolation or staging environments.

### Force Re-Seeding

To start with a completely fresh database:

```bash
# Delete and recreate your dev deployment
pnpm convex deploy --delete-project

# Re-seed with fresh data
pnpm seed
```

**Warning**: This permanently deletes all data in your deployment.

---

## Seed Data Structure

Running `pnpm seed` populates your database with:

- **6 Projects**: Inbox, Work Projects, Personal Goals, Shopping List, Home Improvement, Learning & Development
- **6 Labels**: Work, Personal, Urgent, Waiting, Home, Shopping
- **18+ Tasks**: Sample tasks across all projects with varied priorities, due dates, and statuses

### Data Hierarchy

```
Projects:
  ├── Inbox (3 active tasks, 0 completed)
  ├── Work Projects (3 active tasks, 1 completed)
  ├── Personal Goals (3 active tasks, 0 completed)
  ├── Shopping List (3 active tasks, 1 completed)
  ├── Home Improvement (2 active tasks, 0 completed)
  └── Learning & Development (1 active task, 1 completed)

Labels:
  ├── Work (#4073ff)
  ├── Personal (#ff6b6b)
  ├── Urgent (#ff4757)
  ├── Waiting (#ffa502)
  ├── Home (#26de81)
  └── Shopping (#a29bfe)
```

---

## Implementation Details

### File Location

All seed data is defined in:

```
convex/init.ts
```

The `init` function is a **special reserved name** in Convex that serves as your project's initialization entry point.

### Type Safety

Seed data is fully type-checked against your schema at compile time:

```typescript
// Example: Type-checked task insertion
ctx.db.insert("tasks", {
  title: "Learn React Native",  // ✓ string
  priority: "p1",                // ✓ matches union type "p1" | "p2" | "p3" | "p4"
  status: "active",              // ✓ matches "active" | "completed"
  dueDate: Date.now(),           // ✓ number (timestamp)
  projectId: projectIds[0],      // ✓ Id<"projects">
  // TypeScript catches any schema mismatches at compile time!
})
```

If your seed data doesn't match the schema, you'll get a TypeScript error before deployment.

### Idempotency

The seed function checks if data already exists before inserting:

```typescript
const existingProjects = await ctx.db.query("projects").collect();
if (existingProjects.length > 0) {
  return { success: true, message: "Database already seeded" };
}
```

This means:
- `pnpm seed` won't create duplicate data if run multiple times
- Safe to include in CI/CD pipelines
- No manual cleanup required between runs

---

## Customizing Seed Data

### Adding New Data

Edit `convex/init.ts` to modify seed data:

```typescript
// Example: Adding a new label
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

### Workflow

1. Edit `convex/init.ts`
2. Update the data in the handler function
3. Run `pnpm seed` to apply changes

**Note**: Due to idempotency, you may need to force re-seed (delete deployment) to see new changes if data already exists.

---

## Production Strategy

For production deployments, consider these options:

### Option A: Seed Only New Projects
Use `pnpm seed` to initialize data only on first deployment. The idempotency check ensures existing production data won't be affected.

### Option B: Separate Admin UI
Create a protected admin interface with its own mutation to seed production data. This gives you more control over when and what data is seeded.

### Option C: No Auto-Seeding
Let users create their own data through the app's UI. Most appropriate for multi-tenant applications.

**Current Status**: Development uses the CLI-based approach. Production seeding strategy can be decided based on your app's specific needs.

---

## Troubleshooting

### "Database already seeded" message

**Cause**: The idempotent check detected existing data.

**Solution**: This is expected behavior. To start fresh, delete and recreate your deployment:

```bash
pnpm convex deploy --delete-project
pnpm seed
```

### Command not found: pnpm seed

**Cause**: Running from wrong directory or dependencies not installed.

**Solution**:
1. Ensure you're in the project root directory
2. Run `pnpm install` to install dependencies
3. Verify `package.json` contains the `seed` script

### "Cannot find module" errors

**Cause**: Missing or incorrectly structured seed file.

**Solution**:
1. Verify `convex/init.ts` exists
2. Ensure it exports an `internalMutation` named `init`
3. Check for TypeScript compilation errors

### Type errors in seed data

**Cause**: Seed data doesn't match schema definitions.

**Solution**:
1. Review `convex/schema.ts` for required fields and types
2. Update `convex/init.ts` to match schema requirements
3. Run TypeScript type checking: `pnpm tsc --noEmit`

---

## Related Documentation

- **[CONVEX_SETUP.md](./CONVEX_SETUP.md)** - Initial Convex project configuration
- **[CONVEX_MIGRATION.md](./CONVEX_MIGRATION.md)** - Migrating screens to use Convex queries
- **[AI_BACKEND_IMPLEMENTATION.md](./AI_BACKEND_IMPLEMENTATION.md)** - Backend architecture details
- **[PRODUCT_ROADMAP.md](./PRODUCT_ROADMAP.md)** - Feature planning and priorities

### Next Steps

1. Run `pnpm seed` to populate your development database
2. Start the development server: `pnpm start`
3. Verify data loads correctly in the app
4. Follow [CONVEX_MIGRATION.md](./CONVEX_MIGRATION.md) to update screens to use Convex queries
5. Test real-time updates across the app

---

## Command Reference

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `pnpm seed` | Seed dev deployment once | After deploying schema, before testing |
| `pnpm seed:dev` | Seed during development | When actively developing with real data |
| `pnpm seed:preview` | Deploy & seed preview environment | Creating staging environment with test data |
| `pnpm convex deploy --delete-project` | Delete deployment | Force fresh start (WARNING: deletes all data) |

## Files Involved

- **`convex/init.ts`** - Seed data definition (internalMutation)
- **`package.json`** - Seed npm scripts configuration
- **`convex/schema.ts`** - Database schema that seed must match
- **`src/components/DatabaseSeeder.tsx`** - Placeholder for future initialization logic
