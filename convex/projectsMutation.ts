import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    name: v.string(),
    color: v.string(),
    isFavorite: v.boolean(),
  },
  handler: async (ctx, { name, color, isFavorite }) => {
    const lastProject = await ctx.db
      .query("projects")
      .order("desc")
      .first();

    const order = lastProject ? lastProject.order + 1 : 0;

    return await ctx.db.insert("projects", {
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
    const project = await ctx.db.get(id);
    if (!project) throw new Error("Project not found");

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
    const project = await ctx.db.get(id);
    if (!project) throw new Error("Project not found");

    // Delete all tasks in this project
    const tasks = await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("projectId"), id))
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
    const project = await ctx.db.get(id);
    if (!project) throw new Error("Project not found");

    await ctx.db.patch(id, {
      order: newOrder,
      updatedAt: Date.now(),
    });

    return await ctx.db.get(id);
  },
});
