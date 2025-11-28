import { query } from "../_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getSession = query({
  args: {
    sessionId: v.id("chatSessions"),
  },
  handler: async (ctx, { sessionId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const session = await ctx.db.get(sessionId);
    if (!session || session.userId !== userId) {
      return null;
    }

    return session;
  },
});

export const listSessions = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { limit = 50 }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("chatSessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
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
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    // Verify session ownership
    const session = await ctx.db.get(sessionId);
    if (!session || session.userId !== userId) {
      return [];
    }

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
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    return await ctx.db
      .query("chatSessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .first();
  },
});
