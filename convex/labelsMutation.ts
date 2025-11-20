import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    name: v.string(),
    color: v.string(),
  },
  handler: async (ctx, { name, color }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    return await ctx.db.insert("labels", {
      userId,
      name,
      color,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("labels"),
    name: v.optional(v.string()),
    color: v.optional(v.string()),
  },
  handler: async (ctx, { id, name, color }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const label = await ctx.db.get(id);
    if (!label) throw new Error("Label not found");
    if (label.userId !== userId) throw new Error("Unauthorized");

    await ctx.db.patch(id, {
      ...(name !== undefined && { name }),
      ...(color !== undefined && { color }),
      updatedAt: Date.now(),
    });

    return await ctx.db.get(id);
  },
});

export const delete_ = mutation({
  args: { id: v.id("labels") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const label = await ctx.db.get(id);
    if (!label) throw new Error("Label not found");
    if (label.userId !== userId) throw new Error("Unauthorized");

    // Remove label from all user's tasks
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    for (const task of tasks) {
      if (task.labels && task.labels.includes(id)) {
        const updatedLabels = task.labels.filter((labelId) => labelId !== id);
        await ctx.db.patch(task._id, {
          labels: updatedLabels,
          updatedAt: Date.now(),
        });
      }
    }

    await ctx.db.delete(id);
  },
});
