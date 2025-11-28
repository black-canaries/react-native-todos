import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    priority: v.union(
      v.literal("p1"),
      v.literal("p2"),
      v.literal("p3"),
      v.literal("p4")
    ),
    projectId: v.id("projects"),
    dueDate: v.optional(v.number()),
    labels: v.optional(v.array(v.id("labels"))),
  },
  handler: async (
    ctx,
    { title, description, priority, projectId, dueDate, labels }
  ) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Verify project ownership
    const project = await ctx.db.get(projectId);
    if (!project || project.userId !== userId) {
      throw new Error("Project not found or access denied");
    }

    const lastTask = await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .first();

    const order = lastTask ? lastTask.order + 1 : 0;

    return await ctx.db.insert("tasks", {
      title,
      description,
      status: "active",
      priority,
      projectId,
      userId,
      dueDate,
      labels,
      order,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    priority: v.optional(
      v.union(
        v.literal("p1"),
        v.literal("p2"),
        v.literal("p3"),
        v.literal("p4")
      )
    ),
    dueDate: v.optional(v.number()),
    labels: v.optional(v.array(v.id("labels"))),
  },
  handler: async (ctx, { id, title, description, priority, dueDate, labels }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const task = await ctx.db.get(id);
    if (!task) throw new Error("Task not found");
    if (task.userId !== userId) throw new Error("Access denied");

    await ctx.db.patch(id, {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(priority !== undefined && { priority }),
      ...(dueDate !== undefined && { dueDate }),
      ...(labels !== undefined && { labels }),
      updatedAt: Date.now(),
    });

    return await ctx.db.get(id);
  },
});

export const toggleComplete = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const task = await ctx.db.get(id);
    if (!task) throw new Error("Task not found");
    if (task.userId !== userId) throw new Error("Access denied");

    const newStatus = task.status === "active" ? "completed" : "active";

    await ctx.db.patch(id, {
      status: newStatus,
      ...(newStatus === "completed" && { completedAt: Date.now() }),
      ...(newStatus === "active" && { completedAt: undefined }),
      updatedAt: Date.now(),
    });

    return await ctx.db.get(id);
  },
});

export const delete_ = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const task = await ctx.db.get(id);
    if (!task) throw new Error("Task not found");
    if (task.userId !== userId) throw new Error("Access denied");

    await ctx.db.delete(id);
  },
});

export const reorder = mutation({
  args: {
    id: v.id("tasks"),
    newOrder: v.number(),
  },
  handler: async (ctx, { id, newOrder }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const task = await ctx.db.get(id);
    if (!task) throw new Error("Task not found");
    if (task.userId !== userId) throw new Error("Access denied");

    await ctx.db.patch(id, {
      order: newOrder,
      updatedAt: Date.now(),
    });

    return await ctx.db.get(id);
  },
});

export const bulkReorder = mutation({
  args: {
    tasks: v.array(
      v.object({
        id: v.id("tasks"),
        newOrder: v.number(),
      })
    ),
  },
  handler: async (ctx, { tasks }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    for (const { id, newOrder } of tasks) {
      const task = await ctx.db.get(id);
      if (task && task.userId === userId) {
        await ctx.db.patch(id, {
          order: newOrder,
          updatedAt: Date.now(),
        });
      }
    }
  },
});
