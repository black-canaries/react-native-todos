# AI Chat Backend

This directory contains the Convex AI backend implementation for the task management chat assistant.

## Overview

The AI backend enables natural language interaction with your tasks and projects through a conversational interface. It supports both Anthropic's Claude and OpenAI's GPT models.

## Architecture

### Files

- **agent.ts** - AI agent configuration, system prompt, and provider selection
- **tools.ts** - Tool definitions and implementations for CRUD operations
- **chat.ts** - Chat actions for sending messages and handling responses
- **mutations.ts** - Database mutations for sessions and messages
- **queries.ts** - Database queries for sessions and messages

### Database Schema

**chatSessions**
- Stores conversation sessions
- Links to optional userId for multi-user support
- Tracks creation and update timestamps

**chatMessages**
- Stores individual messages in conversations
- Supports user, assistant, and system roles
- Records tool calls and their results

## Setup

### 1. Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Choose your AI provider: "anthropic" or "openai"
AI_PROVIDER=anthropic

# For Anthropic (Claude)
ANTHROPIC_API_KEY=your_api_key_here

# For OpenAI (GPT)
OPENAI_API_KEY=your_api_key_here
```

### 2. Deploy Schema

```bash
pnpm convex dev
```

This will deploy the updated schema with chat tables.

### 3. Verify Deployment

Check the Convex dashboard to ensure:
- `chatSessions` table exists
- `chatMessages` table exists
- All AI functions are deployed

## Available Tools

The AI assistant can perform these operations:

### Task Management
- **createTask** - Create a new task
- **listTasks** - List tasks with filters
- **updateTask** - Update task properties
- **completeTask** - Mark a task as complete
- **deleteTask** - Delete a task

### Project Management
- **createProject** - Create a new project
- **listProjects** - List all projects
- **updateProject** - Update project properties
- **deleteProject** - Delete a project
- **getProjectTasks** - Get tasks in a project

## Usage

### Frontend Hook

Use the `useAIChat` hook in your React Native components:

```typescript
import { useAIChat } from '@/hooks/useAIChat';

function ChatScreen() {
  const {
    messages,
    sendMessage,
    isSending,
    session,
    error
  } = useAIChat();

  // Send a message
  await sendMessage("Create a task called 'Review code'");
}
```

### Direct API Usage

Or call the Convex actions directly:

```typescript
import { useAction } from "convex/react";
import { api } from "../convex/_generated/api";

const sendMessage = useAction(api.ai.chat.sendMessage);

const result = await sendMessage({
  message: "List all high priority tasks",
  userId: "user123",
});
```

## System Prompt

The assistant is configured with capabilities to:
- Create, update, and manage tasks
- Create and organize projects
- Search and filter tasks
- Understand natural language dates (today, tomorrow, next week)
- Confirm before destructive operations

## Streaming Support

The `streamMessage` action is available for real-time token streaming. Currently, it collects the full response before returning, but the infrastructure is in place for true streaming in future updates.

## Error Handling

The system includes:
- Graceful API error handling
- User-friendly error messages
- Error logging for debugging
- Automatic error message saving to chat history

## Extending the System

### Adding New Tools

1. Define the tool in `tools.ts`:

```typescript
export const toolDefinitions = [
  // ... existing tools
  {
    name: "yourNewTool",
    description: "What the tool does",
    parameters: {
      type: "object",
      properties: {
        // ... parameter definitions
      },
      required: ["param1"],
    },
  },
];
```

2. Implement the execution function:

```typescript
export async function executeYourNewTool(ctx: ActionCtx, params: any) {
  // Implementation
}
```

3. Add to the router in `executeTool()`:

```typescript
case "yourNewTool":
  return executeYourNewTool(ctx, params);
```

### Customizing the System Prompt

Edit the `SYSTEM_PROMPT` in `agent.ts` to change the assistant's behavior and capabilities.

### Supporting Additional AI Providers

1. Add provider type to `AIProvider` in `agent.ts`
2. Update `getAgentConfig()` to handle the new provider
3. Add provider-specific logic in `chat.ts` sendMessage handler

## Limitations

- Context window limited to last 20 messages (configurable)
- Tool calls are not streamed in real-time yet
- No conversation branching or forking
- Single-turn tool execution (tools called once per user message)

## Future Enhancements

- True streaming with tool calls
- Multi-turn tool execution
- Conversation branching
- Conversation summaries for long contexts
- Voice input/output support
- Attachment analysis
