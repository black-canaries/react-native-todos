import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const createSession = mutation({
  args: {
    userId: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  },
  handler: async (ctx, { userId, createdAt, updatedAt }) => {
    return await ctx.db.insert("chatSessions", {
      userId,
      createdAt,
      updatedAt,
    });
  },
});

export const updateSession = mutation({
  args: {
    sessionId: v.id("chatSessions"),
    title: v.optional(v.string()),
  },
  handler: async (ctx, { sessionId, title }) => {
    const session = await ctx.db.get(sessionId);
    if (!session) throw new Error("Session not found");

    await ctx.db.patch(sessionId, {
      ...(title !== undefined && { title }),
      updatedAt: Date.now(),
    });

    return await ctx.db.get(sessionId);
  },
});

export const saveMessage = mutation({
  args: {
    sessionId: v.id("chatSessions"),
    role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
    content: v.string(),
    toolCalls: v.optional(
      v.array(
        v.object({
          name: v.string(),
          arguments: v.string(),
          result: v.optional(v.string()),
        })
      )
    ),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("chatMessages", args);
  },
});

export const deleteSession = mutation({
  args: {
    sessionId: v.id("chatSessions"),
  },
  handler: async (ctx, { sessionId }) => {
    const session = await ctx.db.get(sessionId);
    if (!session) throw new Error("Session not found");

    // Delete all messages in this session
    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
      .collect();

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    // Delete the session
    await ctx.db.delete(sessionId);
  },
});
