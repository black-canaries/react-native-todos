import { mutation } from "./_generated/server";
import { v } from "convex/values";

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
    const lastTask = await ctx.db
      .query("tasks")
      .order("desc")
      .first();

    const order = lastTask ? lastTask.order + 1 : 0;

    return await ctx.db.insert("tasks", {
      title,
      description,
      status: "active",
      priority,
      projectId,
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
    const task = await ctx.db.get(id);
    if (!task) throw new Error("Task not found");

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
    const task = await ctx.db.get(id);
    if (!task) throw new Error("Task not found");

    const newStatus = task.status === "active" ? "completed" : "active";

    await ctx.db.patch(id, {
      status: newStatus,
      updatedAt: Date.now(),
    });

    return await ctx.db.get(id);
  },
});

export const delete_ = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, { id }) => {
    const task = await ctx.db.get(id);
    if (!task) throw new Error("Task not found");

    await ctx.db.delete(id);
  },
});

export const reorder = mutation({
  args: {
    id: v.id("tasks"),
    newOrder: v.number(),
  },
  handler: async (ctx, { id, newOrder }) => {
    const task = await ctx.db.get(id);
    if (!task) throw new Error("Task not found");

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
    for (const { id, newOrder } of tasks) {
      const task = await ctx.db.get(id);
      if (task) {
        await ctx.db.patch(id, {
          order: newOrder,
          updatedAt: Date.now(),
        });
      }
    }
  },
});
