// import { Agent } from "@convex-dev/agent";

export const SYSTEM_PROMPT = `You are a helpful task management assistant for a Todoist-style task management app.

Your capabilities:
- Create, list, update, complete, and delete tasks
- Create, list, update, and delete projects
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
  const provider = (process.env.AI_PROVIDER as AIProvider) || "openai";

  if (provider === "anthropic") {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY environment variable is required");
    }
    return {
      provider: "anthropic",
      model: "claude-3-5-sonnet-20241022",
      apiKey,
    };
  } else if (provider === "openai") {
    const apiKey = "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"; // process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is required");
    }
    return {
      provider: "openai",
      model: "gpt-4-turbo-preview",
      apiKey,
    };
  } else {
    throw new Error(`Unsupported AI provider: ${provider}`);
  }
}

export function createSystemPrompt(): string {
  return SYSTEM_PROMPT.replace("{{timestamp}}", new Date().toISOString());
}
