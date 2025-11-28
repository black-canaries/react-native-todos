import { query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("asc")
      .collect();
  },
});

export const get = query({
  args: { id: v.id("projects") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const project = await ctx.db.get(id);
    if (!project || project.userId !== userId) {
      return null;
    }

    return project;
  },
});

export const listWithTaskCounts = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const projects = await ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("asc")
      .collect();

    return Promise.all(
      projects.map(async (project) => {
        const tasks = await ctx.db
          .query("tasks")
          .withIndex("by_user_and_project", (q) =>
            q.eq("userId", userId).eq("projectId", project._id)
          )
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
