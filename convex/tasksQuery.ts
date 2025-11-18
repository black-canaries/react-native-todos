import { query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("tasks")
      .order("asc")
      .collect();
  },
});

export const get = query({
  args: { id: v.id("tasks") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const listByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    return await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("projectId"), projectId))
      .order("asc")
      .collect();
  },
});

export const listActive = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("status"), "active"))
      .order("asc")
      .collect();
  },
});

export const listCompleted = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("status"), "completed"))
      .order("asc")
      .collect();
  },
});

export const listByDate = query({
  args: { startDate: v.number(), endDate: v.number() },
  handler: async (ctx, { startDate, endDate }) => {
    const tasks = await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();

    return tasks.filter(
      (task) => task.dueDate && task.dueDate >= startDate && task.dueDate <= endDate
    );
  },
});

export const listByToday = query({
  handler: async (ctx) => {
    const now = Date.now();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const startOfDay = today.getTime();

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const startOfNextDay = tomorrow.getTime();

    return await ctx.db
      .query("tasks")
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
