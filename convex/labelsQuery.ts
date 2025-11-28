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
      .query("labels")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("asc")
      .collect();
  },
});

export const get = query({
  args: { id: v.id("labels") },
  handler: async (ctx, { id }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const label = await ctx.db.get(id);
    if (!label || label.userId !== userId) {
      return null;
    }

    return label;
  },
});
