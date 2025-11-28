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
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("asc")
      .collect();
  },
});

export const get = query({
  args: { id: v.id("tasks") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const task = await ctx.db.get(id);
    if (!task || task.userId !== userId) {
      return null;
    }

    return task;
  },
});

export const listByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("tasks")
      .withIndex("by_user_and_project", (q) =>
        q.eq("userId", userId).eq("projectId", projectId)
      )
      .order("asc")
      .collect();
  },
});

export const listActive = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .order("asc")
      .collect();
  },
});

export const listCompleted = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("status"), "completed"))
      .order("asc")
      .collect();
  },
});

export const listByDate = query({
  args: { startDate: v.number(), endDate: v.number() },
  handler: async (ctx, { startDate, endDate }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();

    return tasks.filter(
      (task) => task.dueDate && task.dueDate >= startDate && task.dueDate <= endDate
    );
  },
});

export const listByToday = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const now = Date.now();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const startOfDay = today.getTime();

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const startOfNextDay = tomorrow.getTime();

    return await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect()
      .then((tasks) =>
        tasks.filter(
          (task) =>
            task.dueDate &&
            task.dueDate >= startOfDay &&
            task.dueDate < startOfNextDay
        )
      );
  },
});

export const listByUpcoming = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const now = Date.now();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const startOfDay = today.getTime();

    const sevenDaysLater = new Date(today);
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
    sevenDaysLater.setHours(23, 59, 59, 999);
    const endDate = sevenDaysLater.getTime();

    return await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect()
      .then((tasks) =>
        tasks.filter(
          (task) =>
            task.dueDate &&
            task.dueDate >= startOfDay &&
            task.dueDate <= endDate
        )
      );
  },
});
