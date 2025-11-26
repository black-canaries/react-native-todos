// @ts-nocheck - Type inference issues with Agent API
import { action } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { createTaskAgent } from "./agent";

const MAX_CONTEXT_MESSAGES = 20;

// Helper to get or create a session
async function getOrCreateSession(
  ctx: any,
  sessionId: Id<"chatSessions"> | undefined,
  userId: string | undefined
): Promise<Id<"chatSessions">> {
  if (sessionId) {
    const session = await ctx.runQuery(api.ai.queries.getSession, {
      sessionId,
    });
    if (session) {
      return sessionId;
    }
  }

  // Create new session
  const now = Date.now();
  return await ctx.runMutation(api.ai.mutations.createSession, {
    userId,
    createdAt: now,
    updatedAt: now,
  });
}

// Send a message and get a response using Convex Agent
export const sendMessage = action({
  args: {
    sessionId: v.optional(v.id("chatSessions")),
    message: v.string(),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, { sessionId, message, userId }) => {
    try {
      // Get or create session
      const activeSessionId = await getOrCreateSession(ctx, sessionId, userId);

      // Create the agent
      const agent = createTaskAgent();

      // Create or continue thread
      let threadId: string;
      const session = await ctx.runQuery(api.ai.queries.getSession, {
        sessionId: activeSessionId,
      });

      if (session?.title) {
        // Use existing thread ID stored in session title field (temporary storage)
        threadId = session.title;
      } else {
        // Create new thread
        const { threadId: newThreadId } = await agent.createThread(ctx, {
          userId: userId ?? undefined,
        });
        threadId = newThreadId;

        // Store thread ID in session for future use
        await ctx.runMutation(api.ai.mutations.updateSession, {
          sessionId: activeSessionId,
          title: threadId,
        });
      }

      // Continue the thread
      const { thread } = await agent.continueThread(ctx, {
        threadId,
        userId: userId ?? undefined,
      });

      // Generate response
      const result = await thread.generateText({
        prompt: message,
      });

      // Save user message to our chat messages table
      await ctx.runMutation(api.ai.mutations.saveMessage, {
        sessionId: activeSessionId,
        role: "user",
        content: message,
        createdAt: Date.now(),
      });

      // Save assistant response to our chat messages table
      await ctx.runMutation(api.ai.mutations.saveMessage, {
        sessionId: activeSessionId,
        role: "assistant",
        content: result.text,
        createdAt: Date.now(),
      });

      return {
        sessionId: activeSessionId,
        message: result.text,
        threadId,
      };
    } catch (error) {
      console.error("AI Error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";

      // Try to save error if we have a session
      if (sessionId) {
        try {
          await ctx.runMutation(api.ai.mutations.saveMessage, {
            sessionId,
            role: "assistant",
            content: `I apologize, but I encountered an error: ${errorMessage}`,
            createdAt: Date.now(),
          });
        } catch (saveError) {
          console.error("Failed to save error message:", saveError);
        }
      }

      return {
        sessionId: sessionId ?? undefined,
        message: `I apologize, but I encountered an error: ${errorMessage}`,
      };
    }
  },
});

// Streaming version of sendMessage
export const streamMessage = action({
  args: {
    sessionId: v.optional(v.id("chatSessions")),
    message: v.string(),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, { sessionId, message, userId }) => {
    try {
      // Get or create session
      const activeSessionId = await getOrCreateSession(ctx, sessionId, userId);

      // Create the agent
      const agent = createTaskAgent();

      // Create or continue thread
      let threadId: string;
      const session = await ctx.runQuery(api.ai.queries.getSession, {
        sessionId: activeSessionId,
      });

      if (session?.title) {
        // Use existing thread ID stored in session title field (temporary storage)
        threadId = session.title;
      } else {
        // Create new thread
        const { threadId: newThreadId } = await agent.createThread(ctx, {
          userId: userId ?? undefined,
        });
        threadId = newThreadId;

        // Store thread ID in session for future use
        await ctx.runMutation(api.ai.mutations.updateSession, {
          sessionId: activeSessionId,
          title: threadId,
        });
      }

      // Continue the thread
      const { thread } = await agent.continueThread(ctx, {
        threadId,
        userId: userId ?? undefined,
      });

      // Stream response
      const result = await thread.streamText(
        {
          prompt: message,
        },
        {
          saveStreamDeltas: true, // Save streaming deltas to database
        }
      );

      // Consume the stream to completion
      await result.consumeStream();
      const fullText = await result.text;

      // Save user message to our chat messages table
      await ctx.runMutation(api.ai.mutations.saveMessage, {
        sessionId: activeSessionId,
        role: "user",
        content: message,
        createdAt: Date.now(),
      });

      // Save assistant response to our chat messages table
      await ctx.runMutation(api.ai.mutations.saveMessage, {
        sessionId: activeSessionId,
        role: "assistant",
        content: fullText,
        createdAt: Date.now(),
      });

      return {
        sessionId: activeSessionId,
        message: fullText,
        threadId,
      };
    } catch (error) {
      console.error("AI Error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";

      const errorResponse = `I apologize, but I encountered an error: ${errorMessage}`;

      // Try to save error if we have a session
      if (sessionId) {
        try {
          await ctx.runMutation(api.ai.mutations.saveMessage, {
            sessionId,
            role: "assistant",
            content: errorResponse,
            createdAt: Date.now(),
          });
        } catch (saveError) {
          console.error("Failed to save error message:", saveError);
        }
      }

      return {
        sessionId: sessionId ?? undefined,
        message: errorResponse,
      };
    }
  },
});
