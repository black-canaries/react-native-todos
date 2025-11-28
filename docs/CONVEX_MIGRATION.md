# Convex Migration Guide

A comprehensive guide for migrating your React Native todo app from mock data to Convex real-time backend.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Migration Strategy](#migration-strategy)
- [Screen-by-Screen Migration](#screen-by-screen-migration)
  - [1. Inbox Screen](#1-inbox-screen)
  - [2. Today Screen](#2-today-screen)
  - [3. Upcoming Screen](#3-upcoming-screen)
  - [4. Projects Screen](#4-projects-screen)
  - [5. Project Detail Screen](#5-project-detail-screen)
- [Component Updates](#component-updates)
  - [TaskItem Component](#taskitem-component)
  - [ProjectItem Component](#projectitem-component)
- [Common Patterns](#common-patterns)
  - [Creating a New Task](#creating-a-new-task)
  - [Drag and Drop with Reorder](#drag-and-drop-with-reorder)
  - [Loading States](#loading-states)
- [Testing Your Migration](#testing-your-migration)
- [Performance Optimization](#performance-optimization)
- [Rollback Plan](#rollback-plan)
- [Related Documentation](#related-documentation)

## Overview

This guide demonstrates how to replace mock data with Convex queries and mutations in your existing screens. Convex provides:

- **Real-time updates** - Changes sync automatically across devices
- **Type-safe queries** - Generated TypeScript types from your schema
- **Server-side filtering** - Efficient data fetching with computed fields
- **Optimistic updates** - Instant UI feedback while mutations process

## Prerequisites

Before starting the migration, ensure you have:

- [ ] Completed [Convex Setup](./CONVEX_SETUP.md)
- [ ] Convex schema defined and deployed
- [ ] Custom hooks created (`useActiveTasks`, `useTaskMutations`, etc.)
- [ ] ConvexProvider configured in your app root
- [ ] Tested connection to Convex backend

## Quick Start

Follow this recommended migration order:

1. **Start Simple** - Begin with the Today screen (single query, clear scope)
2. **Test Thoroughly** - Verify each screen before moving to the next
3. **Keep Fallbacks** - Preserve mock data files until all screens are migrated
4. **One at a Time** - Complete one screen fully before starting another

## Migration Strategy

### Key Principles

- **Replace state with queries** - Replace `useState(mockData)` with Convex hooks
- **Use generated types** - Replace custom types with `Doc<'tasks'>` from Convex
- **Handle loading states** - Always check for `undefined` before rendering
- **Leverage server-side filtering** - Move complex filtering logic to Convex queries
- **Add mutation handlers** - Connect UI actions to Convex mutations

### Common Pattern

```tsx
// Before: Mock data with local state
const [tasks, setTasks] = useState(mockTasks);

// After: Convex query with loading state
const tasks = useActiveTasks();
if (tasks === undefined) {
  return <ActivityIndicator />;
}
```

## Screen-by-Screen Migration

### 1. Inbox Screen

**Location:** `app/(tabs)/index.tsx`

**Before (Mock Data):**
```tsx
import { mockTasks } from '../../src/data/mockData';
import { useState } from 'react';

export default function InboxScreen() {
  const [tasks, setTasks] = useState(mockTasks);
  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <View>
      <FlatList
        data={activeTasks}
        renderItem={({ item }) => <TaskItem task={item} />}
      />
    </View>
  );
}
```

**After (Convex):**
```tsx
import { useActiveTasks, useCompletedTasks, useTaskMutations } from '../../src/hooks';
import { ActivityIndicator } from 'react-native';

export default function InboxScreen() {
  const activeTasks = useActiveTasks();
  const completedTasks = useCompletedTasks();
  const { toggleComplete } = useTaskMutations();

  if (activeTasks === undefined) {
    return <ActivityIndicator />;
  }

  return (
    <View>
      <FlatList
        data={activeTasks}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onComplete={() => toggleComplete({ id: item._id })}
          />
        )}
      />
    </View>
  );
}
```

**Key Changes:**
- Replace `useState(mockTasks)` with `useActiveTasks()` and `useCompletedTasks()`
- Tasks are now automatically filtered by status in Convex queries
- Use `item._id` instead of `item.id` (Convex convention)
- Handle `undefined` loading state before rendering
- Use mutation hooks for user interactions

---

### 2. Today Screen

**Location:** `app/(tabs)/today.tsx`

**Before (Mock Data):**
```tsx
import { mockTasks } from '../../src/data/mockData';
import { format, isToday } from 'date-fns';

export default function TodayScreen() {
  const todayTasks = mockTasks.filter(task => {
    if (!task.dueDate || task.completed) return false;
    return isToday(new Date(task.dueDate));
  });

  return (
    <View>
      <Text>{todayTasks.length} tasks for today</Text>
      {/* render tasks */}
    </View>
  );
}
```

**After (Convex):**
```tsx
import { useTodayTasks, useTaskMutations } from '../../src/hooks';
import { ActivityIndicator } from 'react-native';

export default function TodayScreen() {
  const todayTasks = useTodayTasks();
  const { toggleComplete, deleteTask } = useTaskMutations();

  if (todayTasks === undefined) {
    return <ActivityIndicator />;
  }

  return (
    <View>
      <Text>{todayTasks.length} tasks for today</Text>
      <FlatList
        data={todayTasks}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onComplete={() => toggleComplete({ id: item._id })}
            onDelete={() => deleteTask({ id: item._id })}
          />
        )}
      />
    </View>
  );
}
```

**Key Changes:**
- Replace date filtering logic with `useTodayTasks()` hook
- Convex handles the date filtering server-side
- More efficient - only fetches today's tasks from the database
- No need to import date-fns for filtering (still use for display)

---

### 3. Upcoming Screen

**Location:** `app/(tabs)/upcoming.tsx`

**Before (Mock Data):**
```tsx
import { mockTasks } from '../../src/data/mockData';

export default function UpcomingScreen() {
  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const upcomingTasks = mockTasks.filter(task => {
    if (!task.dueDate || task.completed) return false;
    const dueDate = new Date(task.dueDate);
    return dueDate > now && dueDate <= sevenDaysFromNow;
  });

  // Group by date...
}
```

**After (Convex):**
```tsx
import { useUpcomingTasks, useTaskMutations } from '../../src/hooks';
import { ActivityIndicator } from 'react-native';

export default function UpcomingScreen() {
  const upcomingTasks = useUpcomingTasks();
  const { toggleComplete } = useTaskMutations();

  if (upcomingTasks === undefined) {
    return <ActivityIndicator />;
  }

  // Group by date on the client (date display logic stays the same)
  const groupedTasks = groupTasksByDate(upcomingTasks);

  return (
    <View>
      {Object.entries(groupedTasks).map(([date, tasks]) => (
        <View key={date}>
          <Text>{date}</Text>
          <FlatList
            data={tasks}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TaskItem task={item} />
            )}
          />
        </View>
      ))}
    </View>
  );
}
```

**Key Changes:**
- `useUpcomingTasks()` replaces complex date filtering
- Convex returns only relevant tasks (next 7 days)
- Keep your date grouping/display logic on the client side
- Server handles filtering, client handles presentation

---

### 4. Projects Screen

**Location:** `app/(tabs)/projects.tsx`

**Before (Mock Data):**
```tsx
import { mockProjects } from '../../src/data/mockData';
import { mockTasks } from '../../src/data/mockData';

export default function ProjectsScreen() {
  const favorites = mockProjects.filter(p => p.isFavorite);
  const others = mockProjects.filter(p => !p.isFavorite);

  const getTaskCount = (projectId: string) => {
    return mockTasks.filter(t => t.projectId === projectId).length;
  };

  return (
    <View>
      <FlatList
        data={[...favorites, ...others]}
        renderItem={({ item }) => (
          <ProjectItem
            project={item}
            taskCount={getTaskCount(item.id)}
          />
        )}
      />
    </View>
  );
}
```

**After (Convex):**
```tsx
import { useProjectsWithTaskCounts, useProjectMutations } from '../../src/hooks';
import { ActivityIndicator } from 'react-native';

export default function ProjectsScreen() {
  const projects = useProjectsWithTaskCounts();
  const { deleteProject } = useProjectMutations();

  if (projects === undefined) {
    return <ActivityIndicator />;
  }

  const favorites = projects.filter(p => p.isFavorite);
  const others = projects.filter(p => !p.isFavorite);

  return (
    <View>
      <FlatList
        data={[...favorites, ...others]}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ProjectItem
            project={item}
            taskCount={item.activeTasks}
            onDelete={() => deleteProject({ id: item._id })}
          />
        )}
      />
    </View>
  );
}
```

**Key Changes:**
- `useProjectsWithTaskCounts()` includes task counts (avoids N+1 queries)
- Use `item.activeTasks` for the task count (computed by Convex)
- Filtering and sorting stay in your component
- Much more efficient than calculating counts per-project

---

### 5. Project Detail Screen

**Location:** `app/project/[id].tsx`

**Before (Mock Data):**
```tsx
import { useLocalSearchParams } from 'expo-router';
import { mockTasks } from '../../src/data/mockData';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams();
  const tasks = mockTasks.filter(t => t.projectId === id && !t.completed);
  const completed = mockTasks.filter(t => t.projectId === id && t.completed);

  return (
    <View>
      {/* render tasks and completed */}
    </View>
  );
}
```

**After (Convex):**
```tsx
import { useLocalSearchParams } from 'expo-router';
import { useProjectTasks, useTaskMutations } from '../../src/hooks';
import { ActivityIndicator } from 'react-native';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams();
  const allTasks = useProjectTasks(id as string);
  const { toggleComplete, deleteTask } = useTaskMutations();

  if (allTasks === undefined) {
    return <ActivityIndicator />;
  }

  const tasks = allTasks.filter(t => t.status === 'active');
  const completed = allTasks.filter(t => t.status === 'completed');

  return (
    <View>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onComplete={() => toggleComplete({ id: item._id })}
          />
        )}
      />
      <Collapsible title="Completed">
        <FlatList
          data={completed}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TaskItem task={item} />
          )}
        />
      </Collapsible>
    </View>
  );
}
```

**Key Changes:**
- `useProjectTasks(id)` fetches only tasks for this project
- Filter by `status` instead of `completed` boolean
- Real-time updates when tasks change
- Type-safe with route parameters

---

## Component Updates

### TaskItem Component

**Before:**
```tsx
interface TaskItemProps {
  task: Task; // id, title, completed, priority, dueDate
}

export function TaskItem({ task }: TaskItemProps) {
  return (
    <View>
      <Text>{task.title}</Text>
      <Text>{task.priority}</Text>
    </View>
  );
}
```

**After:**
```tsx
import { Doc } from '../../convex/_generated/dataModel';

interface TaskItemProps {
  task: Doc<'tasks'>;
  onComplete?: () => void;
  onDelete?: () => void;
}

export function TaskItem({ task, onComplete, onDelete }: TaskItemProps) {
  return (
    <Pressable onPress={onComplete}>
      <Text
        style={{
          textDecorationLine: task.status === 'completed' ? 'line-through' : 'none'
        }}
      >
        {task.title}
      </Text>
      <Text>{task.priority}</Text>
      {onDelete && (
        <Button title="Delete" onPress={onDelete} />
      )}
    </Pressable>
  );
}
```

**Key Changes:**
- Use `Doc<'tasks'>` type for type safety (generated from schema)
- Change `completed` boolean to `status` field ('active' | 'completed')
- Use `_id` instead of `id`
- Accept callback props for interactions
- Update UI based on `status` field

### ProjectItem Component

**Before:**
```tsx
interface ProjectItemProps {
  project: Project;
  taskCount: number;
}
```

**After:**
```tsx
import { Doc } from '../../convex/_generated/dataModel';

interface ProjectItemProps {
  project: Doc<'projects'>;
  taskCount?: number;
  onDelete?: () => void;
}
```

**Key Changes:**
- Use `Doc<'projects'>` for generated type
- Make `taskCount` optional (can come from `project.activeTasks`)
- Add mutation callbacks as optional props

---

## Common Patterns

### Creating a New Task

```tsx
import { useTaskMutations } from '../hooks';
import { useState } from 'react';
import { View, TextInput, Button } from 'react-native';

export function AddTaskForm({ projectId }: { projectId: string }) {
  const [title, setTitle] = useState('');
  const { createTask } = useTaskMutations();

  const handleAdd = async () => {
    if (!title.trim()) return;

    try {
      await createTask({
        title,
        priority: 'p2',
        projectId,
        dueDate: undefined,
        labels: [],
      });
      setTitle(''); // Clear input on success
    } catch (error) {
      console.error('Failed to create task:', error);
      // Show error toast/alert to user
    }
  };

  return (
    <View>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Add a task..."
      />
      <Button title="Add" onPress={handleAdd} />
    </View>
  );
}
```

### Drag and Drop with Reorder

```tsx
import { useTaskMutations } from '../hooks';
import { DragDropContext } from '@hello-pangea/dnd';

function DraggableTaskList({ tasks }) {
  const { bulkReorderTasks } = useTaskMutations();

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    // Optimistic update: reorder locally
    const newOrder = Array.from(tasks);
    const [removed] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, removed);

    // Prepare mutation data
    const reorderData = newOrder.map((task, index) => ({
      id: task._id,
      newOrder: index,
    }));

    try {
      await bulkReorderTasks({ tasks: reorderData });
    } catch (error) {
      console.error('Reorder failed:', error);
      // Revert optimistic update if needed
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {/* render draggable items */}
    </DragDropContext>
  );
}
```

### Loading States

```tsx
import { useAllTasks } from '../hooks';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

function TaskList() {
  const tasks = useAllTasks();

  // Loading state
  if (tasks === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Empty state
  if (tasks.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No tasks yet. Create your first task!</Text>
      </View>
    );
  }

  // Data state
  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => <TaskItem task={item} />}
    />
  );
}
```

---

## Testing Your Migration

### Testing Checklist

After migrating each screen, verify the following:

- [ ] Screen loads without errors
- [ ] Tasks/projects display correctly
- [ ] Task counts are accurate
- [ ] Creating a new task works
- [ ] Completing/uncompleting a task works
- [ ] Deleting a task works
- [ ] Reordering tasks works (if implemented)
- [ ] Real-time updates work across devices
- [ ] Loading states display correctly
- [ ] Error states are handled gracefully
- [ ] Empty states show helpful messages

### Testing Real-time Updates

1. Open the app on two devices/emulators simultaneously
2. Create a task on device A
3. Verify it appears automatically on device B
4. Complete a task on device B
5. Verify the status updates on device A
6. Test with poor network conditions
7. Verify offline behavior and sync recovery

### Manual Test Script

```bash
# Terminal 1: Start Convex dev server
npx convex dev

# Terminal 2: Run iOS simulator
pnpm ios

# Terminal 3: Run Android emulator
pnpm android

# Test real-time sync between both platforms
```

---

## Performance Optimization

### Memoize Components

Prevent unnecessary re-renders of list items:

```tsx
import React from 'react';

export const TaskItem = React.memo(function TaskItem({ task, onComplete }) {
  return (
    <View>
      <Text>{task.title}</Text>
      <Button title="Complete" onPress={onComplete} />
    </View>
  );
});
```

### Use Pagination for Large Lists

Implement cursor-based pagination for better performance:

```tsx
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { useState } from 'react';

function PaginatedTaskList() {
  const [cursor, setCursor] = useState(null);
  const result = useQuery(api.tasks.listPaginated, { cursor, limit: 20 });

  if (!result) return <ActivityIndicator />;

  return (
    <>
      <FlatList
        data={result.tasks}
        renderItem={({ item }) => <TaskItem task={item} />}
      />
      {result.hasMore && (
        <Button
          title="Load More"
          onPress={() => setCursor(result.nextCursor)}
        />
      )}
    </>
  );
}
```

### Split Queries for Better Granularity

Instead of one large query, fetch data separately:

```tsx
// Avoid: One large query that re-fetches everything
const allData = useQuery(api.data.everything);

// Better: Split into focused queries
const tasks = useActiveTasks();
const projects = useAllProjects();
const labels = useLabels();

// Only the changed data will trigger re-renders
```

### Optimize Convex Queries

In your Convex functions, use indexes and limit results:

```ts
// convex/tasks.ts
export const listActive = query({
  handler: async (ctx) => {
    return await ctx.db
      .query('tasks')
      .withIndex('by_status', (q) => q.eq('status', 'active'))
      .order('desc')
      .take(100); // Limit results
  },
});
```

---

## Rollback Plan

If you encounter critical issues during migration:

### Keep Mock Data as Backup

1. Do not delete `src/data/mockData.ts` until fully migrated
2. Create feature flags to toggle between mock and Convex:

```tsx
// src/config.ts
export const USE_CONVEX = process.env.USE_CONVEX === 'true';

// In your screens
import { USE_CONVEX } from '../config';

export default function InboxScreen() {
  const tasks = USE_CONVEX
    ? useActiveTasks()
    : useState(mockTasks)[0].filter(t => !t.completed);

  // ...
}
```

### Migrate Incrementally

- Test one screen at a time before moving to the next
- Keep git commits small and focused per screen
- Tag stable versions before major changes

### Rollback Commands

```bash
# Revert last migration commit
git revert HEAD

# Return to pre-migration state
git checkout <previous-stable-commit>

# Create rollback branch
git checkout -b rollback-convex-migration
```

---

## Related Documentation

- [Convex Setup Guide](./CONVEX_SETUP.md) - Initial Convex configuration
- [Convex Seeding Guide](./CONVEX_SEEDING.md) - Populate your database with test data
- [AI Backend Implementation](./AI_BACKEND_IMPLEMENTATION.md) - Add AI features to your app
- [Product Roadmap](./PRODUCT_ROADMAP.md) - Future features and enhancements
- [Project Guide](../CLAUDE.md) - Overall project architecture and conventions

---

## Next Steps

Once your migration is complete:

1. Remove all mock data imports from screens
2. Delete or archive `src/data/mockData.ts`
3. Add authentication (see [Convex Setup](./CONVEX_SETUP.md))
4. Implement offline support with optimistic updates
5. Add error boundaries and retry logic
6. Set up monitoring and analytics
7. Deploy to production with environment variables
