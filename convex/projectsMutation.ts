import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    name: v.string(),
    color: v.string(),
    isFavorite: v.boolean(),
  },
  handler: async (ctx, { name, color, isFavorite }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const lastProject = await ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .first();

    const order = lastProject ? lastProject.order + 1 : 0;

    return await ctx.db.insert("projects", {
      userId,
      name,
      color,
      isFavorite,
      order,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("projects"),
    name: v.optional(v.string()),
    color: v.optional(v.string()),
    isFavorite: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, name, color, isFavorite }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const project = await ctx.db.get(id);
    if (!project) throw new Error("Project not found");
    if (project.userId !== userId) throw new Error("Unauthorized");

    await ctx.db.patch(id, {
      ...(name !== undefined && { name }),
      ...(color !== undefined && { color }),
      ...(isFavorite !== undefined && { isFavorite }),
      updatedAt: Date.now(),
    });

    return await ctx.db.get(id);
  },
});

export const delete_ = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const project = await ctx.db.get(id);
    if (!project) throw new Error("Project not found");
    if (project.userId !== userId) throw new Error("Unauthorized");

    // Delete all tasks in this project
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_user_and_project", (q) =>
        q.eq("userId", userId).eq("projectId", id)
      )
      .collect();

    for (const task of tasks) {
      await ctx.db.delete(task._id);
    }

    await ctx.db.delete(id);
  },
});

export const reorder = mutation({
  args: {
    id: v.id("projects"),
    newOrder: v.number(),
  },
  handler: async (ctx, { id, newOrder }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const project = await ctx.db.get(id);
    if (!project) throw new Error("Project not found");
    if (project.userId !== userId) throw new Error("Unauthorized");

    await ctx.db.patch(id, {
      order: newOrder,
      updatedAt: Date.now(),
    });

    return await ctx.db.get(id);
  },
});
