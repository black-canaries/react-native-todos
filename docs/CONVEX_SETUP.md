# Convex Integration Setup Guide

A comprehensive guide for integrating Convex as the real-time backend for the React Native Todos project.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup](#detailed-setup)
  - [Step 1: Create a Convex Project](#step-1-create-a-convex-project)
  - [Step 2: Configure Environment Variables](#step-2-configure-environment-variables)
  - [Step 3: Deploy Convex Functions](#step-3-deploy-convex-functions)
  - [Step 4: Seed the Database](#step-4-seed-the-database)
  - [Step 5: Migrate from Mock Data](#step-5-migrate-from-mock-data)
- [Custom Hooks Reference](#custom-hooks-reference)
  - [Tasks Hooks](#tasks-hooks)
  - [Projects Hooks](#projects-hooks)
  - [Labels Hooks](#labels-hooks)
- [Usage Examples](#usage-examples)
  - [Fetching and Displaying Tasks](#fetching-and-displaying-tasks)
  - [Creating Tasks](#creating-tasks)
  - [Real-time Updates](#real-time-updates)
- [Database Schema](#database-schema)
  - [Projects Table](#projects-table)
  - [Tasks Table](#tasks-table)
  - [Labels Table](#labels-table)
- [API Reference](#api-reference)
  - [Task Mutations](#task-mutations)
  - [Project Mutations](#project-mutations)
  - [Label Mutations](#label-mutations)
- [File Structure](#file-structure)
- [Troubleshooting](#troubleshooting)
- [Related Documentation](#related-documentation)
- [Resources](#resources)

## Overview

Convex provides a serverless backend with real-time subscriptions, eliminating the need for mock data and enabling automatic synchronization across devices. This guide covers the complete setup process from creating your Convex project to deploying functions and migrating from mock data.

**What you'll achieve:**
- Real-time task synchronization across devices
- Type-safe database queries and mutations
- Automatic TypeScript code generation
- Serverless deployment with zero configuration

## Prerequisites

Before starting, ensure you have:

- **Node.js** (v18 or later)
- **pnpm** (v10.22.0 or later) - primary package manager for this project
- **Convex account** - sign up free at [https://convex.dev](https://convex.dev)
- **Project dependencies installed** - run `pnpm install` in project root

## Quick Start

For experienced developers, here's the 60-second setup:

```bash
# 1. Deploy Convex backend
pnpm convex deploy

# 2. Add your deployment URL to .env.local
EXPO_PUBLIC_CONVEX_URL=https://your-project.convex.cloud

# 3. Seed the database
# Run in Convex dashboard: Functions > seed:seedDatabase > Run
```

For detailed step-by-step instructions, continue to the [Detailed Setup](#detailed-setup) section.

## Detailed Setup

### Step 1: Create a Convex Project

1. Navigate to [https://dashboard.convex.dev](https://dashboard.convex.dev)
2. Sign in with your Convex account
3. Click **"Create project"**
4. Select your preferred deployment region (e.g., US East, EU West)
5. Copy your **Deployment URL** - it will look like: `https://your-project.convex.cloud`

> **Tip:** Choose a region geographically close to your users for optimal performance.

### Step 2: Configure Environment Variables

1. Open `.env.local` in your project root directory
2. Replace the placeholder URL with your actual Convex deployment URL:

```bash
EXPO_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
```

3. Save the file

> **Important:** Environment variables prefixed with `EXPO_PUBLIC_` are exposed to the client-side code in Expo applications.

### Step 3: Deploy Convex Functions

From your project root directory, run:

```bash
pnpm convex deploy
```

This command will:
- **Create database tables** (projects, tasks, labels)
- **Deploy all functions** (queries, mutations, seed functions)
- **Generate TypeScript types** in `convex/_generated/api.ts`
- **Validate your schema** and report any errors

**Expected output:**
```
✓ Deployed functions to https://your-project.convex.cloud
✓ Generated TypeScript types
```

### Step 4: Seed the Database

After successful deployment, populate your database with test data:

#### Option A: Via Convex Dashboard (Recommended)

1. Visit [https://dashboard.convex.dev](https://dashboard.convex.dev)
2. Navigate to your project
3. Go to the **"Functions"** tab
4. Find `seed:seedDatabase` in the mutations list
5. Click **"Run"** and confirm the execution

#### Option B: From Your Application

Add a seed button component (useful for development):

```tsx
import { useMutation } from 'convex/react';
import { api } from './convex/_generated/api';
import { Button } from 'react-native';

function SeedButton() {
  const seedDatabase = useMutation(api.seed.seedDatabase);

  return (
    <Button
      onPress={() => seedDatabase().then(() => console.log('Database seeded!'))}
      title="Seed Database"
    />
  );
}
```

> **Note:** See [CONVEX_SEEDING.md](./CONVEX_SEEDING.md) for detailed information about the seeding process and data structure.

### Step 5: Migrate from Mock Data

Replace static mock data imports with Convex real-time hooks throughout your application.

#### Before (Mock Data)

```tsx
import { mockTasks } from '../data/mockData';
import { useState } from 'react';

function InboxScreen() {
  const [tasks, setTasks] = useState(mockTasks);

  // Manual state updates required
  return <TaskList tasks={tasks} />;
}
```

#### After (Convex)

```tsx
import { useAllTasks } from '../hooks';

function InboxScreen() {
  const tasks = useAllTasks();

  // Auto-updates on data changes
  // Returns undefined while loading
  return <TaskList tasks={tasks} />;
}
```

> **Migration Guide:** For comprehensive migration instructions, see [CONVEX_MIGRATION.md](./CONVEX_MIGRATION.md).

## Custom Hooks Reference

All hooks are located in `src/hooks/` and re-exported from `src/hooks/index.ts`.

### Tasks Hooks

#### Query Hooks

```typescript
// Fetch all tasks
const tasks = useAllTasks();

// Fetch active (incomplete) tasks only
const activeTasks = useActivesTasks();

// Fetch completed tasks only
const completedTasks = useCompletedTasks();

// Fetch tasks due today
const todayTasks = useTodayTasks();

// Fetch tasks in the next 7 days
const upcomingTasks = useUpcomingTasks();

// Fetch tasks for a specific project
const projectTasks = useProjectTasks(projectId);

// Fetch a single task by ID
const task = useTask(taskId);
```

#### Mutation Hooks

```typescript
const {
  createTask,        // Create a new task
  updateTask,        // Update task properties
  toggleComplete,    // Toggle task completion status
  deleteTask,        // Delete a task permanently
  reorderTask,       // Update task order (single)
  bulkReorderTasks   // Update multiple task orders
} = useTaskMutations();
```

### Projects Hooks

#### Query Hooks

```typescript
// Fetch all projects
const projects = useAllProjects();

// Fetch projects with task counts
const projectsWithCounts = useProjectsWithTaskCounts();

// Fetch a single project by ID
const project = useProject(projectId);
```

#### Mutation Hooks

```typescript
const {
  createProject,   // Create a new project
  updateProject,   // Update project properties
  deleteProject,   // Delete a project permanently
  reorderProject   // Update project order
} = useProjectMutations();
```

### Labels Hooks

#### Query Hooks

```typescript
// Fetch all labels
const labels = useAllLabels();

// Fetch a single label by ID
const label = useLabel(labelId);
```

#### Mutation Hooks

```typescript
const {
  createLabel,   // Create a new label
  updateLabel,   // Update label properties
  deleteLabel    // Delete a label permanently
} = useLabelMutations();
```

## Usage Examples

### Fetching and Displaying Tasks

```tsx
import { useAllTasks, useTaskMutations } from '../hooks';
import { FlatList, View, Text, Button } from 'react-native';

function TaskList() {
  const tasks = useAllTasks();
  const { toggleComplete, deleteTask } = useTaskMutations();

  // Handle loading state
  if (tasks === undefined) {
    return <Text>Loading tasks...</Text>;
  }

  // Handle empty state
  if (tasks.length === 0) {
    return <Text>No tasks found</Text>;
  }

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item._id}
      renderItem={({ item: task }) => (
        <View>
          <Text>{task.title}</Text>
          <Text>Priority: {task.priority}</Text>
          <Button
            title={task.status === 'active' ? 'Complete' : 'Reopen'}
            onPress={() => toggleComplete({ id: task._id })}
          />
          <Button
            title="Delete"
            onPress={() => deleteTask({ id: task._id })}
          />
        </View>
      )}
    />
  );
}
```

### Creating Tasks

```tsx
import { useTaskMutations, useAllProjects } from '../hooks';
import { useState } from 'react';
import { View, TextInput, Button } from 'react-native';

function AddTaskForm() {
  const { createTask } = useTaskMutations();
  const projects = useAllProjects();
  const [title, setTitle] = useState('');

  const handleAdd = async () => {
    if (!title.trim() || !projects?.[0]) return;

    await createTask({
      title,
      priority: 'p2',
      projectId: projects[0]._id, // Use first project
      dueDate: Date.now() + 86400000, // Tomorrow
      labels: [],
    });

    setTitle(''); // Clear form
  };

  return (
    <View>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Enter task title"
      />
      <Button
        title="Add Task"
        onPress={handleAdd}
        disabled={!title.trim()}
      />
    </View>
  );
}
```

### Real-time Updates

Convex hooks automatically subscribe to real-time database changes:

```tsx
import { useAllTasks } from '../hooks';
import { Text } from 'react-native';

function TaskCounter() {
  const tasks = useAllTasks();

  // Component automatically re-renders when:
  // - Tasks are created
  // - Tasks are updated
  // - Tasks are deleted
  // - Even changes from other devices!

  return (
    <Text>
      {tasks?.length ?? 0} total tasks
    </Text>
  );
}
```

> **Note:** Real-time subscriptions work automatically across all devices using the same Convex deployment.

## Database Schema

### Projects Table

```typescript
{
  _id: Id<"projects">,       // Auto-generated unique ID
  name: string,              // Project name (e.g., "Personal", "Work")
  color: string,             // Hex color code (e.g., "#de4c4a")
  isFavorite: boolean,       // Favorite status for quick access
  order: number,             // Display order (for sorting)
  createdAt: number,         // Unix timestamp (milliseconds)
  updatedAt: number,         // Unix timestamp (milliseconds)
}
```

### Tasks Table

```typescript
{
  _id: Id<"tasks">,          // Auto-generated unique ID
  title: string,             // Task title
  description?: string,      // Optional task description
  status: "active" | "completed",
  priority: "p1" | "p2" | "p3" | "p4",  // P1 = highest
  projectId: Id<"projects">, // Parent project reference
  dueDate?: number,          // Optional due date (Unix timestamp)
  labels?: Id<"labels">[],   // Optional label references
  order: number,             // Display order within project
  createdAt: number,         // Unix timestamp (milliseconds)
  updatedAt: number,         // Unix timestamp (milliseconds)
}
```

### Labels Table

```typescript
{
  _id: Id<"labels">,         // Auto-generated unique ID
  name: string,              // Label name (e.g., "urgent", "review")
  color: string,             // Hex color code (e.g., "#4073ff")
  createdAt: number,         // Unix timestamp (milliseconds)
  updatedAt: number,         // Unix timestamp (milliseconds)
}
```

> **Data Types:** All IDs are Convex-generated strings. Timestamps are Unix epoch in milliseconds.

## API Reference

### Task Mutations

#### `createTask(args)`

Create a new task with the specified properties.

**Arguments:**
```typescript
{
  title: string,                        // Required
  description?: string,                 // Optional
  priority: "p1" | "p2" | "p3" | "p4", // Required
  projectId: Id<"projects">,            // Required
  dueDate?: number,                     // Optional (Unix timestamp)
  labels?: Id<"labels">[]              // Optional (array of label IDs)
}
```

**Returns:** `Id<"tasks">` - The newly created task ID

#### `updateTask(args)`

Update an existing task's properties.

**Arguments:**
```typescript
{
  id: Id<"tasks">,                      // Required
  title?: string,
  description?: string,
  priority?: "p1" | "p2" | "p3" | "p4",
  dueDate?: number,
  labels?: Id<"labels">[]
}
```

**Returns:** `void`

#### `toggleComplete(args)`

Toggle a task between "active" and "completed" status.

**Arguments:**
```typescript
{
  id: Id<"tasks">  // Required
}
```

**Returns:** `void`

#### `deleteTask(args)`

Permanently delete a task from the database.

**Arguments:**
```typescript
{
  id: Id<"tasks">  // Required
}
```

**Returns:** `void`

#### `reorderTask(args)`

Update a single task's display order.

**Arguments:**
```typescript
{
  id: Id<"tasks">,   // Required
  newOrder: number   // Required
}
```

**Returns:** `void`

#### `bulkReorderTasks(args)`

Update multiple tasks' display orders in a single operation (optimized for drag-and-drop).

**Arguments:**
```typescript
{
  tasks: Array<{
    id: Id<"tasks">,
    newOrder: number
  }>
}
```

**Returns:** `void`

### Project Mutations

#### `createProject(args)`

```typescript
{
  name: string,
  color: string,
  isFavorite?: boolean
}
```

#### `updateProject(args)`

```typescript
{
  id: Id<"projects">,
  name?: string,
  color?: string,
  isFavorite?: boolean
}
```

#### `deleteProject(args)`

```typescript
{
  id: Id<"projects">
}
```

#### `reorderProject(args)`

```typescript
{
  id: Id<"projects">,
  newOrder: number
}
```

### Label Mutations

#### `createLabel(args)`

```typescript
{
  name: string,
  color: string
}
```

#### `updateLabel(args)`

```typescript
{
  id: Id<"labels">,
  name?: string,
  color?: string
}
```

#### `deleteLabel(args)`

```typescript
{
  id: Id<"labels">
}
```

## File Structure

```
convex/
├── schema.ts                 # Database schema definition
├── seed.ts                   # Seed mutation for test data
├── tsconfig.json             # TypeScript configuration
├── queries/
│   ├── tasks.ts              # Task query functions
│   ├── projects.ts           # Project query functions
│   └── labels.ts             # Label query functions
├── mutations/
│   ├── tasks.ts              # Task mutation functions
│   ├── projects.ts           # Project mutation functions
│   └── labels.ts             # Label mutation functions
└── _generated/
    ├── api.ts                # Auto-generated API types
    ├── dataModel.ts          # Auto-generated data model
    └── server.ts             # Auto-generated server types

src/
└── hooks/
    ├── useTasks.ts           # Task hooks (queries + mutations)
    ├── useProjects.ts        # Project hooks (queries + mutations)
    ├── useLabels.ts          # Label hooks (queries + mutations)
    └── index.ts              # Re-exports all hooks
```

> **Important:** Files in `convex/_generated/` are auto-generated. Never edit them manually.

## Troubleshooting

### "Cannot find module 'convex/_generated/api'"

**Cause:** TypeScript types haven't been generated yet.

**Solution:**
```bash
pnpm convex deploy
```

Ensure `.env.local` contains a valid `EXPO_PUBLIC_CONVEX_URL`.

### "ConvexProvider is not wrapping the app"

**Cause:** The Convex provider is missing or incorrectly configured.

**Solution:** Verify `app/_layout.tsx` wraps your app with `ConvexProvider`:

```tsx
import { ConvexProvider, ConvexReactClient } from 'convex/react';

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

export default function RootLayout() {
  return (
    <ConvexProvider client={convex}>
      {/* Your app content */}
    </ConvexProvider>
  );
}
```

### Tasks not loading / Undefined data

**Possible causes:**
- Seed data hasn't been created
- Invalid Convex URL
- Network connectivity issues

**Solutions:**
1. Verify seed data in Convex dashboard (Data tab)
2. Check browser/device console for errors
3. Confirm `EXPO_PUBLIC_CONVEX_URL` is correct
4. Restart Expo dev server after changing environment variables

### Changes not syncing across devices

**Expected behavior:** Convex real-time subscriptions sync automatically.

**Solutions:**
1. Verify all devices use the same `EXPO_PUBLIC_CONVEX_URL`
2. Check network connectivity on all devices
3. Confirm Convex dashboard shows active connections (Data tab > Live Queries)

### Deployment fails with schema errors

**Cause:** Schema validation errors in `convex/schema.ts`.

**Solution:** Review error messages carefully. Common issues:
- Mismatched field types
- Missing required fields
- Invalid index definitions

## Related Documentation

- **[CONVEX_MIGRATION.md](./CONVEX_MIGRATION.md)** - Step-by-step guide for migrating from mock data to Convex
- **[CONVEX_SEEDING.md](./CONVEX_SEEDING.md)** - Detailed seeding documentation and data structure
- **[AI_BACKEND_IMPLEMENTATION.md](./AI_BACKEND_IMPLEMENTATION.md)** - AI-powered features and backend implementation
- **[PRODUCT_ROADMAP.md](./PRODUCT_ROADMAP.md)** - Future features and development roadmap

## Resources

**Official Documentation:**
- [Convex Documentation](https://docs.convex.dev) - Comprehensive guides and tutorials
- [Convex React API](https://docs.convex.dev/api/react) - React hooks reference
- [Database Queries](https://docs.convex.dev/database/queries) - Query patterns and best practices
- [Mutations](https://docs.convex.dev/database/mutations) - Data modification patterns

**Community & Support:**
- [Convex Discord](https://convex.dev/community) - Community support and discussions
- [Convex GitHub](https://github.com/get-convex/convex-js) - Source code and issue tracking
