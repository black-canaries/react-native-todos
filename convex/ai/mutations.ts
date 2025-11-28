import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createSession = mutation({
  args: {
    createdAt: v.number(),
    updatedAt: v.number(),
  },
  handler: async (ctx, { createdAt, updatedAt }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

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
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const session = await ctx.db.get(sessionId);
    if (!session) throw new Error("Session not found");
    if (session.userId !== userId) throw new Error("Access denied");

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
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Verify session ownership
    const session = await ctx.db.get(args.sessionId);
    if (!session || session.userId !== userId) {
      throw new Error("Session not found or access denied");
    }

    return await ctx.db.insert("chatMessages", args);
  },
});

export const deleteSession = mutation({
  args: {
    sessionId: v.id("chatSessions"),
  },
  handler: async (ctx, { sessionId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const session = await ctx.db.get(sessionId);
    if (!session) throw new Error("Session not found");
    if (session.userId !== userId) throw new Error("Access denied");

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
