import { query } from "../_generated/server";
import { v } from "convex/values";

export const getSession = query({
  args: {
    sessionId: v.id("chatSessions"),
  },
  handler: async (ctx, { sessionId }) => {
    return await ctx.db.get(sessionId);
  },
});

export const listSessions = query({
  args: {
    userId: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { userId, limit = 50 }) => {
    if (userId) {
      return await ctx.db
        .query("chatSessions")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .order("desc")
        .take(limit);
    }

    return await ctx.db
      .query("chatSessions")
      .order("desc")
      .take(limit);
  },
});

export const getMessages = query({
  args: {
    sessionId: v.id("chatSessions"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { sessionId, limit = 50 }) => {
    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .order("asc")
      .collect();

    // Return the most recent messages, limited by the limit parameter
    if (messages.length > limit) {
      return messages.slice(-limit);
    }

    return messages;
  },
});

export const getLatestSession = query({
  args: {
    userId: v.optional(v.string()),
  },
  handler: async (ctx, { userId }) => {
    if (userId) {
      return await ctx.db
        .query("chatSessions")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .order("desc")
        .first();
    }

    return await ctx.db
      .query("chatSessions")
      .order("desc")
      .first();
  },
});
