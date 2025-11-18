# Convex Migration Guide

This guide shows how to migrate from mock data to Convex queries in your existing screens.

## Step-by-Step Migration

### 1. Inbox Screen (`app/(tabs)/index.tsx`)

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
import { useActivesTasks, useCompletedTasks, useTaskMutations } from '../../src/hooks';
import { ActivityIndicator } from 'react-native';

export default function InboxScreen() {
  const activeTasks = useActivesTasks();
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
- Replace `useState(mockTasks)` with `useActivesTasks()` and `useCompletedTasks()`
- Tasks are now automatically filtered by status in Convex queries
- Use `item._id` instead of `item.id` (Convex convention)
- Handle `undefined` loading state
- Use mutation hooks for user interactions

---

### 2. Today Screen (`app/(tabs)/today.tsx`)

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

---

### 3. Upcoming Screen (`app/(tabs)/upcoming.tsx`)

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
- Convex returns only relevant tasks
- Keep your date grouping/display logic on the client side

---

### 4. Projects Screen (`app/(tabs)/projects.tsx`)

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
- `useProjectsWithTaskCounts()` includes task counts (avoid N+1 queries)
- Filtering logic stays on client side
- Use `item.activeTasks` for the task count (computed by Convex)
- Filtering and sorting stay in your component

---

### 5. Project Detail Screen (`app/project/[id].tsx`)

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
  onComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function TaskItem({ task, onComplete, onDelete }: TaskItemProps) {
  return (
    <Pressable
      onPress={() => onComplete?.(task._id)}
    >
      <Text
        style={{
          textDecorationLine: task.status === 'completed' ? 'line-through' : 'none'
        }}
      >
        {task.title}
      </Text>
      <Text>{task.priority}</Text>
      <Button
        title="Delete"
        onPress={() => onDelete?.(task._id)}
      />
    </Pressable>
  );
}
```

**Key Changes:**
- Use `Doc<'tasks'>` type for type safety (generated from schema)
- Change `completed` boolean to `status` field
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
  onDelete?: (id: string) => void;
}
```

---

## Common Patterns

### Creating a New Task

```tsx
import { useTaskMutations, useProjectTasks } from '../hooks';
import { useState } from 'react';

export function AddTaskForm({ projectId }: { projectId: string }) {
  const [title, setTitle] = useState('');
  const { createTask } = useTaskMutations();

  const handleAdd = async () => {
    try {
      await createTask({
        title,
        priority: 'p2',
        projectId,
        dueDate: undefined,
        labels: [],
      });
      setTitle('');
    } catch (error) {
      console.error('Failed to create task:', error);
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

function DraggableTaskList({ tasks }) {
  const { bulkReorderTasks } = useTaskMutations();

  const handleDragEnd = async (result) => {
    const newOrder = Array.from(tasks);
    const [removed] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, removed);

    const reorderData = newOrder.map((task, index) => ({
      id: task._id,
      newOrder: index,
    }));

    await bulkReorderTasks({ tasks: reorderData });
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
import { ActivityIndicator, FlatList } from 'react-native';

function TaskList() {
  const tasks = useAllTasks();

  if (tasks === undefined) {
    return <ActivityIndicator />;
  }

  if (tasks.length === 0) {
    return <Text>No tasks yet</Text>;
  }

  return (
    <FlatList
      data={tasks}
      renderItem={({ item }) => <TaskItem task={item} />}
    />
  );
}
```

---

## Testing After Migration

### Checklist

- [ ] All screens load without errors
- [ ] Tasks display correctly
- [ ] Task counts are accurate
- [ ] Creating a new task works
- [ ] Completing/uncompleting a task works
- [ ] Deleting a task works
- [ ] Reordering tasks works (if implemented)
- [ ] Real-time updates work (changes on one device appear on others)
- [ ] Loading states display correctly
- [ ] Error states are handled gracefully

### Testing Real-time Updates

1. Open the app on two devices/emulators
2. Create a task on one device
3. Verify it appears on the other device automatically
4. Complete a task on one device
5. Verify the status updates on the other device

---

## Rollback Plan

If you encounter issues during migration:

1. Keep the old mock data file (`src/data/mockData.ts`)
2. You can always revert to using mock data by switching imports
3. Test one screen at a time before moving to the next

---

## Next Steps

1. Start migrating the simplest screen (e.g., Today)
2. Test thoroughly before moving to the next screen
3. Once all screens are migrated, remove mock data imports
4. Delete `src/data/mockData.ts` (optional - keep for reference)
5. Implement additional features like authentication and sync

## Performance Tips

- **Memoize components** that don't change often:
  ```tsx
  const TaskItem = React.memo(function TaskItem({ task }) {
    return <View>{task.title}</View>;
  });
  ```

- **Use pagination** for large task lists:
  ```tsx
  const [cursor, setCursor] = useState(null);
  const tasks = useQuery(api.tasks.listPaginated, { cursor });
  ```

- **Optimize re-renders** by splitting queries:
  ```tsx
  // Instead of one big query
  const allData = useQuery(api.data.all);

  // Fetch separately
  const tasks = useAllTasks();
  const projects = useAllProjects();
  ```
