# Convex Patterns Reference

Advanced patterns and best practices for Convex backend integration in React Native/Expo apps.

## Database Schema Patterns

### Defining Tables

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  tasks: defineTable({
    userId: v.id("users"),
    text: v.string(),
    completed: v.boolean(),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    dueDate: v.optional(v.number()),
    tags: v.array(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_user_completed", ["userId", "completed"])
    .index("by_due_date", ["dueDate"]),

  comments: defineTable({
    taskId: v.id("tasks"),
    userId: v.id("users"),
    text: v.string(),
    createdAt: v.number(),
  })
    .index("by_task", ["taskId"])
    .index("by_user", ["userId"]),
});
```

### Relationships

```typescript
// One-to-many: Get user's tasks
export const getUserTasks = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

// Many-to-one: Get task with user
export const getTaskWithUser = query({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, { taskId }) => {
    const task = await ctx.db.get(taskId);
    if (!task) return null;
    
    const user = await ctx.db.get(task.userId);
    return { ...task, user };
  },
});

// Many-to-many: Tags system
export const tasksWithTags = query({
  args: { tags: v.array(v.string()) },
  handler: async (ctx, { tags }) => {
    const tasks = await ctx.db.query("tasks").collect();
    return tasks.filter(task => 
      tags.some(tag => task.tags.includes(tag))
    );
  },
});
```

## Authentication Patterns

### Role-Based Access Control

```typescript
// convex/users.ts
import { query } from "./_generated/server";
import { auth } from "./auth.config";

export const current = query({
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;
    return await ctx.db.get(userId);
  },
});

export const isAdmin = query({
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return false;
    
    const user = await ctx.db.get(userId);
    return user?.role === "admin";
  },
});

// Protected mutation with role check
export const deleteUser = mutation({
  args: { targetUserId: v.id("users") },
  handler: async (ctx, { targetUserId }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const user = await ctx.db.get(userId);
    if (user?.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }
    
    await ctx.db.delete(targetUserId);
  },
});
```

### User Ownership Validation

```typescript
export const updateTask = mutation({
  args: {
    taskId: v.id("tasks"),
    updates: v.object({
      text: v.optional(v.string()),
      completed: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, { taskId, updates }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const task = await ctx.db.get(taskId);
    if (!task) throw new Error("Task not found");
    
    if (task.userId !== userId) {
      throw new Error("Unauthorized: Not task owner");
    }
    
    await ctx.db.patch(taskId, updates);
  },
});
```

## Real-time Subscriptions

### Live Query with Auto-refresh

```tsx
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

function LiveTaskList() {
  // Automatically updates when data changes
  const tasks = useQuery(api.tasks.list);
  
  return (
    <FlatList
      data={tasks ?? []}
      renderItem={({ item }) => <TaskItem task={item} />}
    />
  );
}
```

### Conditional Queries

```tsx
function ConditionalData({ userId }: { userId?: string }) {
  // Query skipped when userId is undefined
  const userData = useQuery(
    api.users.get,
    userId ? { userId } : "skip"
  );
  
  if (userData === undefined) return <Loading />;
  if (!userData) return <NotFound />;
  return <UserProfile data={userData} />;
}
```

### Paginated Queries

```typescript
export const listPaginated = query({
  args: {
    cursor: v.optional(v.string()),
    limit: v.number(),
  },
  handler: async (ctx, { cursor, limit }) => {
    const results = await ctx.db
      .query("tasks")
      .order("desc")
      .paginate({ 
        cursor: cursor ?? null,
        numItems: limit,
      });
    
    return {
      items: results.page,
      cursor: results.continueCursor,
      isDone: results.isDone,
    };
  },
});
```

### Client-side Pagination

```tsx
function PaginatedList() {
  const [cursor, setCursor] = useState<string | undefined>();
  const data = useQuery(api.tasks.listPaginated, {
    cursor,
    limit: 20,
  });
  
  const loadMore = () => {
    if (data?.cursor) {
      setCursor(data.cursor);
    }
  };
  
  return (
    <FlatList
      data={data?.items ?? []}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
    />
  );
}
```

## Optimistic Updates

```tsx
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

function TaskItem({ task }) {
  const toggleTask = useMutation(api.tasks.toggle);
  const [optimisticCompleted, setOptimisticCompleted] = useState(task.completed);
  
  const handleToggle = async () => {
    // Immediately update UI
    setOptimisticCompleted(!optimisticCompleted);
    
    try {
      await toggleTask({ taskId: task._id });
    } catch (error) {
      // Revert on error
      setOptimisticCompleted(task.completed);
      Alert.alert("Error", "Failed to update task");
    }
  };
  
  return (
    <Pressable onPress={handleToggle}>
      <Text>{optimisticCompleted ? "✓" : "○"} {task.text}</Text>
    </Pressable>
  );
}
```

## File Storage

### Storing Files

```typescript
// convex/files.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const saveFile = mutation({
  args: {
    storageId: v.id("_storage"),
    name: v.string(),
    type: v.string(),
  },
  handler: async (ctx, { storageId, name, type }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    await ctx.db.insert("files", {
      storageId,
      name,
      type,
      userId,
      uploadedAt: Date.now(),
    });
  },
});
```

### Client Upload

```tsx
import * as ImagePicker from 'expo-image-picker';
import { useMutation } from "convex/react";

function ImageUploader() {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const saveFile = useMutation(api.files.saveFile);
  
  const pickAndUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    });
    
    if (result.canceled) return;
    
    const imageUri = result.assets[0].uri;
    const uploadUrl = await generateUploadUrl();
    
    const response = await fetch(imageUri);
    const blob = await response.blob();
    
    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      body: blob,
      headers: { "Content-Type": result.assets[0].mimeType },
    });
    
    const { storageId } = await uploadResponse.json();
    
    await saveFile({
      storageId,
      name: result.assets[0].fileName,
      type: result.assets[0].mimeType,
    });
  };
  
  return (
    <Button title="Upload Image" onPress={pickAndUpload} />
  );
}
```

### Retrieving Files

```typescript
export const getFileUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    return await ctx.storage.getUrl(storageId);
  },
});
```

## Scheduled Functions

```typescript
// convex/crons.ts
import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "delete old items",
  { hours: 24 },
  internal.tasks.deleteOldCompleted
);

crons.daily(
  "send daily summary",
  { hourUTC: 9, minuteUTC: 0 },
  internal.notifications.sendDailySummary
);

export default crons;

// convex/tasks.ts
export const deleteOldCompleted = internalMutation({
  handler: async (ctx) => {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const oldTasks = await ctx.db
      .query("tasks")
      .filter((q) => q.and(
        q.eq(q.field("completed"), true),
        q.lt(q.field("completedAt"), thirtyDaysAgo)
      ))
      .collect();
    
    for (const task of oldTasks) {
      await ctx.db.delete(task._id);
    }
  },
});
```

## Search Patterns

### Full-text Search

```typescript
export const searchTasks = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, { searchTerm }) => {
    const tasks = await ctx.db.query("tasks").collect();
    
    const searchLower = searchTerm.toLowerCase();
    return tasks.filter(task =>
      task.text.toLowerCase().includes(searchLower) ||
      task.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  },
});
```

### Search with Index

```typescript
export const searchByTag = query({
  args: { tag: v.string() },
  handler: async (ctx, { tag }) => {
    return await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("tags"), tag))
      .collect();
  },
});
```

## Aggregations

```typescript
export const getStats = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.completed).length,
      byPriority: {
        high: tasks.filter(t => t.priority === "high").length,
        medium: tasks.filter(t => t.priority === "medium").length,
        low: tasks.filter(t => t.priority === "low").length,
      },
    };
  },
});
```

## Error Handling

### Client-side Error Handling

```tsx
function TaskCreator() {
  const createTask = useMutation(api.tasks.create);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleCreate = async (text: string) => {
    setIsLoading(true);
    try {
      await createTask({ text });
      Alert.alert("Success", "Task created");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Error", error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return <TaskForm onSubmit={handleCreate} loading={isLoading} />;
}
```

### Server-side Validation

```typescript
export const create = mutation({
  args: {
    text: v.string(),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
  },
  handler: async (ctx, { text, priority }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    if (text.trim().length === 0) {
      throw new Error("Task text cannot be empty");
    }
    
    if (text.length > 500) {
      throw new Error("Task text too long (max 500 characters)");
    }
    
    const taskId = await ctx.db.insert("tasks", {
      userId,
      text: text.trim(),
      priority,
      completed: false,
      createdAt: Date.now(),
      tags: [],
    });
    
    return taskId;
  },
});
```

## Performance Optimization

### Minimize Query Scope

```typescript
// ❌ Bad: Fetches all tasks
export const getUserTask = query({
  args: { userId: v.id("users"), taskId: v.id("tasks") },
  handler: async (ctx, { userId, taskId }) => {
    const tasks = await ctx.db.query("tasks").collect();
    return tasks.find(t => t._id === taskId && t.userId === userId);
  },
});

// ✅ Good: Direct lookup
export const getUserTask = query({
  args: { userId: v.id("users"), taskId: v.id("tasks") },
  handler: async (ctx, { userId, taskId }) => {
    const task = await ctx.db.get(taskId);
    if (task?.userId !== userId) return null;
    return task;
  },
});
```

### Use Indexes Effectively

```typescript
// Add indexes to schema
tasks: defineTable({
  userId: v.id("users"),
  status: v.string(),
  createdAt: v.number(),
})
  .index("by_user_status", ["userId", "status"])
  .index("by_created", ["createdAt"]),

// Query with index
export const getActiveUserTasks = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_user_status", (q) =>
        q.eq("userId", userId).eq("status", "active")
      )
      .collect();
  },
});
```

### Batch Operations

```typescript
export const bulkComplete = mutation({
  args: { taskIds: v.array(v.id("tasks")) },
  handler: async (ctx, { taskIds }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    // Batch the updates
    await Promise.all(
      taskIds.map(async (taskId) => {
        const task = await ctx.db.get(taskId);
        if (task?.userId === userId) {
          await ctx.db.patch(taskId, { 
            completed: true,
            completedAt: Date.now(),
          });
        }
      })
    );
  },
});
```

## Testing Patterns

### Mock Data Setup

```typescript
// convex/testData.ts
export const seedTestData = internalMutation({
  handler: async (ctx) => {
    const userId = await ctx.db.insert("users", {
      name: "Test User",
      email: "test@example.com",
      createdAt: Date.now(),
    });
    
    await ctx.db.insert("tasks", {
      userId,
      text: "Test task 1",
      completed: false,
      priority: "high",
      tags: ["test"],
    });
  },
});
```

## Common Gotchas

1. **Mutations don't return queries** - Mutations can't return live data
2. **IDs are strings** - Use `v.id("tableName")` not `v.string()`
3. **Indexes need time** - New indexes won't work on old data immediately
4. **Auth in mutations** - Always validate userId in mutations
5. **Storage URLs expire** - Cache storage URLs appropriately
