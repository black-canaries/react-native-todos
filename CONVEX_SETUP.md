# Convex Integration Setup Guide

This guide walks you through setting up and deploying Convex in the React Native Todos project.

## Prerequisites

- Node.js and pnpm installed
- A Convex account (free at https://convex.dev)
- Your React Native Todos project cloned and dependencies installed

## Step 1: Create a Convex Project

1. Visit https://dashboard.convex.dev and sign in with your account
2. Click "Create project"
3. Select your deployment region (e.g., US)
4. Copy your **Deployment URL** (format: `https://your-project.convex.cloud`)

## Step 2: Configure Environment Variables

1. Open `.env.local` in your project root
2. Replace the placeholder URL with your actual Convex deployment URL:
   ```
   EXPO_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
   ```
3. Save the file

## Step 3: Deploy Convex Functions

From your project root, deploy the Convex backend:

```bash
pnpm convex deploy
```

This will:
- Create the database schema (projects, tasks, labels)
- Deploy all query and mutation functions
- Generate TypeScript types in `convex/_generated/api.ts`

## Step 4: Seed the Database

Once deployment is complete, you can seed the database with test data:

1. Visit your Convex dashboard at https://dashboard.convex.dev
2. Navigate to your project
3. Go to the "Functions" tab
4. Find and run the `seed:seedDatabase` mutation
5. Click "Run" and confirm

Alternatively, you can call the seed mutation from your app:

```tsx
import { useMutation } from 'convex/react';
import { api } from './convex/_generated/api';

function SeedButton() {
  const seedDatabase = useMutation(api.seed.seedDatabase);

  return (
    <Button
      onPress={() => seedDatabase().then(() => console.log('Seeded!'))}
      title="Seed Database"
    />
  );
}
```

## Step 5: Start Using Convex Queries

Replace mock data imports with Convex hooks. Example:

### Before (Mock Data)
```tsx
import { mockTasks } from '../data/mockData';

function InboxScreen() {
  const [tasks, setTasks] = useState(mockTasks);
  // ...
}
```

### After (Convex)
```tsx
import { useAllTasks } from '../hooks';

function InboxScreen() {
  const tasks = useAllTasks();
  // tasks is undefined while loading, then real data
  // ...
}
```

## Available Custom Hooks

### Tasks Hooks
```typescript
// Fetch hooks
useAllTasks()              // All tasks
useActivesTasks()          // Only active tasks
useCompletedTasks()        // Only completed tasks
useTodayTasks()           // Tasks due today
useUpcomingTasks()        // Tasks for next 7 days
useProjectTasks(id)       // Tasks for specific project
useTask(id)               // Single task by ID

// Mutation hooks
useTaskMutations() // Returns: {
//   createTask,
//   updateTask,
//   toggleComplete,
//   deleteTask,
//   reorderTask,
//   bulkReorderTasks
// }
```

### Projects Hooks
```typescript
// Fetch hooks
useAllProjects()              // All projects
useProjectsWithTaskCounts()   // Projects with task counts
useProject(id)                // Single project by ID

// Mutation hooks
useProjectMutations() // Returns: {
//   createProject,
//   updateProject,
//   deleteProject,
//   reorderProject
// }
```

### Labels Hooks
```typescript
// Fetch hooks
useAllLabels()    // All labels
useLabel(id)      // Single label by ID

// Mutation hooks
useLabelMutations() // Returns: {
//   createLabel,
//   updateLabel,
//   deleteLabel
// }
```

## Usage Examples

### Fetching Tasks
```tsx
import { useAllTasks, useTaskMutations } from '../hooks';

function TaskList() {
  const tasks = useAllTasks();
  const { toggleComplete, deleteTask } = useTaskMutations();

  if (tasks === undefined) {
    return <Text>Loading...</Text>;
  }

  return (
    <FlatList
      data={tasks}
      renderItem={({ item: task }) => (
        <View>
          <Text>{task.title}</Text>
          <Button
            title="Complete"
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

### Creating a Task
```tsx
import { useTaskMutations, useProjectTasks } from '../hooks';

function AddTaskForm() {
  const { createTask } = useTaskMutations();
  const [title, setTitle] = useState('');

  const handleAdd = async () => {
    await createTask({
      title,
      priority: 'p2',
      projectId: 'project-id',
      dueDate: Date.now() + 86400000, // Tomorrow
      labels: [],
    });
    setTitle('');
  };

  return (
    <View>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Task title"
      />
      <Button title="Add" onPress={handleAdd} />
    </View>
  );
}
```

### Real-time Updates
Convex hooks automatically subscribe to real-time updates:

```tsx
function TaskCounter() {
  const tasks = useAllTasks();

  // This component re-renders whenever tasks change in the database
  // Thanks to Convex real-time subscriptions
  return <Text>{tasks?.length ?? 0} tasks</Text>;
}
```

## Troubleshooting

### "Cannot find module 'convex/_generated/api'"
- Run `pnpm convex deploy` to generate the API types
- Make sure `.env.local` has a valid `EXPO_PUBLIC_CONVEX_URL`

### "ConvexProvider is not wrapping the app"
- Check `app/_layout.tsx` to ensure `ConvexProvider` wraps your app
- Verify Convex URL is set in environment variables

### Tasks not loading
- Verify seed data was created in Convex dashboard
- Check browser console for errors
- Ensure `EXPO_PUBLIC_CONVEX_URL` is correct

### Changes not syncing to other devices
- Convex real-time subscriptions work automatically
- Verify all instances are using the same Convex project URL

## Next Steps

1. **Replace all mock data imports** with the Convex hooks throughout your screens
2. **Update TaskItem and ProjectItem components** to accept Convex data types
3. **Implement drag-and-drop** updates using the `bulkReorderTasks` mutation
4. **Add error handling** for mutations with try-catch blocks
5. **Set up authentication** using `@convex-dev/auth` for multi-user support

## Database Schema

### Projects Table
```typescript
{
  _id: Id<"projects">,
  name: string,
  color: string,           // e.g., "#de4c4a"
  isFavorite: boolean,
  order: number,
  createdAt: number,       // timestamp
  updatedAt: number,       // timestamp
}
```

### Tasks Table
```typescript
{
  _id: Id<"tasks">,
  title: string,
  description?: string,
  status: "active" | "completed",
  priority: "p1" | "p2" | "p3" | "p4",
  projectId: Id<"projects">,
  dueDate?: number,        // timestamp
  labels?: Id<"labels">[],
  order: number,
  createdAt: number,       // timestamp
  updatedAt: number,       // timestamp
}
```

### Labels Table
```typescript
{
  _id: Id<"labels">,
  name: string,
  color: string,           // e.g., "#4073ff"
  createdAt: number,       // timestamp
  updatedAt: number,       // timestamp
}
```

## File Structure

```
convex/
├── schema.ts              # Database schema definition
├── seed.ts                # Seed mutation for test data
├── tsconfig.json          # TypeScript config
├── queries/
│   ├── tasks.ts
│   ├── projects.ts
│   └── labels.ts
└── mutations/
    ├── tasks.ts
    ├── projects.ts
    └── labels.ts

src/
└── hooks/
    ├── useTasks.ts        # Task queries and mutations
    ├── useProjects.ts     # Project queries and mutations
    ├── useLabels.ts       # Label queries and mutations
    └── index.ts           # Re-exports all hooks
```

## API Reference

### Task Mutations

#### `createTask(args)`
```typescript
{
  title: string,
  description?: string,
  priority: "p1" | "p2" | "p3" | "p4",
  projectId: Id<"projects">,
  dueDate?: number,
  labels?: Id<"labels">[]
}
```

#### `updateTask(args)`
```typescript
{
  id: Id<"tasks">,
  title?: string,
  description?: string,
  priority?: "p1" | "p2" | "p3" | "p4",
  dueDate?: number,
  labels?: Id<"labels">[]
}
```

#### `toggleComplete({ id })`
Toggles task between "active" and "completed" status.

#### `deleteTask({ id })`
Permanently deletes a task.

#### `reorderTask({ id, newOrder })`
Updates task order for sorting/dragging.

#### `bulkReorderTasks({ tasks })`
```typescript
{
  tasks: Array<{
    id: Id<"tasks">,
    newOrder: number
  }>
}
```

## Resources

- [Convex Documentation](https://docs.convex.dev)
- [Convex React API](https://docs.convex.dev/api/react)
- [Database Queries](https://docs.convex.dev/database/queries)
- [Mutations](https://docs.convex.dev/database/mutations)
