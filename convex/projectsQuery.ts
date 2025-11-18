import { query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("projects")
      .order("asc")
      .collect();
  },
});

export const get = query({
  args: { id: v.id("projects") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const listWithTaskCounts = query({
  handler: async (ctx) => {
    const projects = await ctx.db
      .query("projects")
      .order("asc")
      .collect();

    return Promise.all(
      projects.map(async (project) => {
        const tasks = await ctx.db
          .query("tasks")
          .filter((q) => q.eq(q.field("projectId"), project._id))
          .collect();

        const activeTasks = tasks.filter((t) => t.status === "active");
        const completedTasks = tasks.filter((t) => t.status === "completed");

        return {
          ...project,
          totalTasks: tasks.length,
          activeTasks: activeTasks.length,
          completedTasks: completedTasks.length,
        };
      })
    );
  },
});
