import { query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("labels")
      .order("asc")
      .collect();
  },
});

export const get = query({
  args: { id: v.id("labels") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});
