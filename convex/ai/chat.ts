import { action } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";
import { Id } from "../_generated/dataModel";
import { getAgentConfig, createSystemPrompt } from "./agent";
import { toolDefinitions, executeTool } from "./tools";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

const MAX_CONTEXT_MESSAGES = 20;

interface Message {
  role: "user" | "assistant";
  content: string;
}

async function getOrCreateSessionHelper(
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

async function saveMessageHelper(
  ctx: any,
  args: {
    sessionId: Id<"chatSessions">;
    role: "user" | "assistant" | "system";
    content: string;
    toolCalls?: Array<{
      name: string;
      arguments: string;
      result?: string;
    }>;
  }
): Promise<Id<"chatMessages">> {
  return await ctx.runMutation(api.ai.mutations.saveMessage, {
    ...args,
    createdAt: Date.now(),
  });
}

// Send a message and get a response
export const sendMessage = action({
  args: {
    sessionId: v.optional(v.id("chatSessions")),
    message: v.string(),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, { sessionId, message, userId }) => {
    // Get or create session
    const activeSessionId = await getOrCreateSessionHelper(ctx, sessionId, userId);

    // Save user message
    await saveMessageHelper(ctx, {
      sessionId: activeSessionId,
      role: "user",
      content: message,
    });

    // Get conversation history
    const history = await ctx.runQuery(api.ai.queries.getMessages, {
      sessionId: activeSessionId,
      limit: MAX_CONTEXT_MESSAGES,
    });

    // Get AI configuration
    const config = getAgentConfig();
    const systemPrompt = createSystemPrompt();

    // Build messages for the AI (filter out system messages from history)
    const messages: Message[] = [
      ...history
        .filter((msg) => msg.role !== "system")
        .map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
      { role: "user", content: message },
    ];

    try {
      let response: string;
      let toolCalls: any[] = [];

      if (config.provider === "anthropic") {
        const anthropic = new Anthropic({ apiKey: config.apiKey });

        const result = await anthropic.messages.create({
          model: config.model,
          max_tokens: 4096,
          messages,
          system: systemPrompt,
          tools: toolDefinitions as any,
        });

        // Process tool calls if any
        if (result.content.some((block) => block.type === "tool_use")) {
          for (const block of result.content) {
            if (block.type === "tool_use") {
              const toolResult = await executeTool(
                ctx,
                block.name,
                block.input
              );
              toolCalls.push({
                name: block.name,
                arguments: JSON.stringify(block.input),
                result: JSON.stringify(toolResult),
              });
            }
          }

          // Get final response with tool results
          const followUp = await anthropic.messages.create({
            model: config.model,
            max_tokens: 4096,
            messages: [
              ...messages,
              {
                role: "assistant",
                content: result.content as any,
              },
              {
                role: "user",
                content: toolCalls
                  .map((tc) => `Tool ${tc.name} result: ${tc.result}`)
                  .join("\n"),
              },
            ],
            system: systemPrompt,
          });

          response = followUp.content
            .filter((block) => block.type === "text")
            .map((block: any) => block.text)
            .join("\n");
        } else {
          response = result.content
            .filter((block) => block.type === "text")
            .map((block: any) => block.text)
            .join("\n");
        }
      } else {
        // OpenAI implementation
        const openai = new OpenAI({ apiKey: config.apiKey });

        const result = await openai.chat.completions.create({
          model: config.model,
          messages: messages as any,
          tools: toolDefinitions.map((tool) => ({
            type: "function" as const,
            function: {
              name: tool.name,
              description: tool.description,
              parameters: tool.parameters,
            },
          })),
        });

        const firstMessage = result.choices[0].message;

        // Process tool calls if any
        if (firstMessage.tool_calls && firstMessage.tool_calls.length > 0) {
          for (const toolCall of firstMessage.tool_calls) {
            if (toolCall.type === "function") {
              const toolResult = await executeTool(
                ctx,
                toolCall.function.name,
                JSON.parse(toolCall.function.arguments)
              );
              toolCalls.push({
                name: toolCall.function.name,
                arguments: toolCall.function.arguments,
                result: JSON.stringify(toolResult),
              });
            }
          }

          // Get final response with tool results
          const followUp = await openai.chat.completions.create({
            model: config.model,
            messages: [
              ...messages,
              firstMessage as any,
              ...toolCalls.map((tc) => ({
                role: "tool" as const,
                content: tc.result,
              })),
            ],
          });

          response = followUp.choices[0].message.content || "No response";
        } else {
          response = firstMessage.content || "No response";
        }
      }

      // Save assistant response
      await saveMessageHelper(ctx, {
        sessionId: activeSessionId,
        role: "assistant",
        content: response,
        toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
      });

      return {
        sessionId: activeSessionId,
        message: response,
        toolCalls,
      };
    } catch (error) {
      console.error("AI Error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";

      // Save error as assistant message
      await saveMessageHelper(ctx, {
        sessionId: activeSessionId,
        role: "assistant",
        content: `I apologize, but I encountered an error: ${errorMessage}`,
      });

      return {
        sessionId: activeSessionId,
        message: `I apologize, but I encountered an error: ${errorMessage}`,
        toolCalls: [],
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
    // Get or create session
    const activeSessionId = await getOrCreateSessionHelper(ctx, sessionId, userId);

    // Save user message
    await saveMessageHelper(ctx, {
      sessionId: activeSessionId,
      role: "user",
      content: message,
    });

    // Get conversation history
    const history = await ctx.runQuery(api.ai.queries.getMessages, {
      sessionId: activeSessionId,
      limit: MAX_CONTEXT_MESSAGES,
    });

    // Get AI configuration
    const config = getAgentConfig();
    const systemPrompt = createSystemPrompt();

    // Build messages for the AI
    const messages: Message[] = [
      ...history
        .filter((msg) => msg.role !== "system")
        .map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
      { role: "user", content: message },
    ];

    try {
      let fullResponse = "";
      const toolCalls: any[] = [];

      if (config.provider === "anthropic") {
        const anthropic = new Anthropic({ apiKey: config.apiKey });

        const stream = await anthropic.messages.stream({
          model: config.model,
          max_tokens: 4096,
          messages,
          system: systemPrompt,
          tools: toolDefinitions as any,
        });

        // Note: Streaming with tool calls is complex
        // For now, we'll collect the full response and handle tools after
        const result = await stream.finalMessage();

        // Process tool calls if any
        if (result.content.some((block) => block.type === "tool_use")) {
          for (const block of result.content) {
            if (block.type === "tool_use") {
              const toolResult = await executeTool(
                ctx,
                block.name,
                block.input
              );
              toolCalls.push({
                name: block.name,
                arguments: JSON.stringify(block.input),
                result: JSON.stringify(toolResult),
              });
            }
          }

          // Get final response with tool results
          const followUp = await anthropic.messages.create({
            model: config.model,
            max_tokens: 4096,
            messages: [
              ...messages,
              {
                role: "assistant",
                content: result.content as any,
              },
              {
                role: "user",
                content: toolCalls
                  .map((tc) => `Tool ${tc.name} result: ${tc.result}`)
                  .join("\n"),
              },
            ],
            system: systemPrompt,
          });

          fullResponse = followUp.content
            .filter((block) => block.type === "text")
            .map((block: any) => block.text)
            .join("\n");
        } else {
          fullResponse = result.content
            .filter((block) => block.type === "text")
            .map((block: any) => block.text)
            .join("\n");
        }
      } else {
        // OpenAI streaming
        const openai = new OpenAI({ apiKey: config.apiKey });

        const stream = await openai.chat.completions.create({
          model: config.model,
          messages: messages as any,
          tools: toolDefinitions.map((tool) => ({
            type: "function" as const,
            function: {
              name: tool.name,
              description: tool.description,
              parameters: tool.parameters,
            },
          })),
          stream: false, // For simplicity, we'll use non-streaming for tool calls
        });

        const firstMessage = stream.choices[0].message;

        // Process tool calls if any
        if (firstMessage.tool_calls && firstMessage.tool_calls.length > 0) {
          for (const toolCall of firstMessage.tool_calls) {
            if (toolCall.type === "function") {
              const toolResult = await executeTool(
                ctx,
                toolCall.function.name,
                JSON.parse(toolCall.function.arguments)
              );
              toolCalls.push({
                name: toolCall.function.name,
                arguments: toolCall.function.arguments,
                result: JSON.stringify(toolResult),
              });
            }
          }

          // Get final response with tool results
          const followUp = await openai.chat.completions.create({
            model: config.model,
            messages: [
              ...messages,
              firstMessage as any,
              ...toolCalls.map((tc) => ({
                role: "tool" as const,
                content: tc.result,
              })),
            ],
          });

          fullResponse = followUp.choices[0].message.content || "No response";
        } else {
          fullResponse = firstMessage.content || "No response";
        }
      }

      // Save assistant response
      await saveMessageHelper(ctx, {
        sessionId: activeSessionId,
        role: "assistant",
        content: fullResponse,
        toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
      });

      return {
        sessionId: activeSessionId,
        message: fullResponse,
        toolCalls,
      };
    } catch (error) {
      console.error("AI Error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";

      const errorResponse = `I apologize, but I encountered an error: ${errorMessage}`;

      // Save error as assistant message
      await saveMessageHelper(ctx, {
        sessionId: activeSessionId,
        role: "assistant",
        content: errorResponse,
      });

      return {
        sessionId: activeSessionId,
        message: errorResponse,
        toolCalls: [],
      };
    }
  },
});
