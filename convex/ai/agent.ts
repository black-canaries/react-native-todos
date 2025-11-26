// @ts-nocheck - Type inference issues with Agent API
import { Agent } from "@convex-dev/agent";
import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { components } from "../_generated/api";
import { taskManagementTools } from "./tools";

export const SYSTEM_PROMPT = `You are a helpful task management assistant for a Todoist-style task management app.

Your capabilities:
- Create, list, update, complete, and delete tasks
- Create, list, update, and delete projects
- Create, list, update, and delete labels
- Search for tasks by various filters (project, status, priority, date range)
- Provide helpful, concise responses
- Ask clarifying questions when requests are ambiguous

Task priorities:
- p1: High priority (red)
- p2: Medium priority (orange)
- p3: Normal priority (blue)
- p4: Low priority (gray)

Guidelines:
- Be concise but friendly
- When creating tasks, default to p4 priority unless specified
- When deleting, always confirm the action first by asking the user
- Use relative dates naturally (today, tomorrow, next week)
- When listing tasks, format them clearly with priorities and due dates
- If a request is unclear, ask for clarification

Current timestamp: {{timestamp}}`;

export type AIProvider = "anthropic" | "openai";

export interface AgentConfig {
  provider: AIProvider;
  model: string;
  apiKey: string;
}

export function getAgentConfig(): AgentConfig {
  // Default to Anthropic (Claude)
  const provider = (process.env.AI_PROVIDER as AIProvider) || "anthropic";

  if (provider === "anthropic") {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY environment variable is required");
    }
    return {
      provider: "anthropic",
      model: process.env.ANTHROPIC_MODEL || "claude-haiku-4-5",
      apiKey,
    };
  } else if (provider === "openai") {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is required");
    }
    return {
      provider: "openai",
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      apiKey,
    };
  } else {
    throw new Error(
      `Unsupported AI provider: ${provider}. Supported: anthropic, openai`
    );
  }
}

/**
 * Get the language model based on provider configuration.
 * Defaults to Anthropic Claude. Set AI_PROVIDER=openai to use OpenAI.
 */
function getLanguageModel(config: AgentConfig) {
  if (config.provider === "openai") {
    return openai(config.model);
  }
  // Default to Anthropic
  return anthropic(config.model);
}

export function createSystemPrompt(): string {
  return SYSTEM_PROMPT.replace("{{timestamp}}", new Date().toISOString());
}

// Create the task management agent instance
export function createTaskAgent() {
  const config = getAgentConfig();

  return new Agent(components.agent, {
    name: "Task Management Assistant",
    languageModel: getLanguageModel(config),
    instructions: createSystemPrompt(),
    tools: taskManagementTools,
  });
}
