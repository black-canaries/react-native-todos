<objective>
Implement the Convex AI backend that powers the chat assistant. The AI should be able to perform CRUD operations on tasks and projects through natural language conversation, using Convex's AI capabilities with streaming responses.

This creates the intelligent backend that interprets user requests and executes appropriate database operations.
</objective>

<context>
This is a React Native Expo app with Convex backend:
- Convex for serverless backend and real-time data
- Existing task and project schemas in Convex
- Need to integrate Convex AI package for LLM-powered assistant
- Support for multiple AI providers (Claude/OpenAI) via configuration

Read @CLAUDE.md for project conventions.

Examine these files:
- @convex/schema.ts - existing database schema for tasks and projects
- @convex/projectsMutation.ts - existing project mutations
- @convex/*.ts - other Convex functions for patterns
- @convex.json - Convex configuration
</context>

<requirements>
1. **Convex AI Setup**
   - Install and configure @convex-dev/agent or equivalent Convex AI package
   - Set up environment variables for API keys (ANTHROPIC_API_KEY, OPENAI_API_KEY)
   - Create .env.example documenting required variables

2. **AI Agent Configuration**
   - Create configurable agent that can use Claude or OpenAI
   - System prompt defining the assistant's capabilities:
     - Task management (create, list, update, complete, delete tasks)
     - Project management (create, list, update, delete projects)
     - Helpful, concise responses
     - Confirm destructive actions before executing
   - Enable streaming responses

3. **Tool Definitions for CRUD Operations**
   Define these tools the AI can call:

   **Task Tools:**
   - `createTask` - Create a new task with title, optional description, priority, due date, project assignment
   - `listTasks` - List tasks with optional filters (project, status, priority, date range)
   - `updateTask` - Update task properties (title, description, priority, due date, project)
   - `completeTask` - Mark a task as complete
   - `deleteTask` - Delete a task (with confirmation)

   **Project Tools:**
   - `createProject` - Create new project with name, color, optional description
   - `listProjects` - List all projects with task counts
   - `updateProject` - Update project properties
   - `deleteProject` - Delete a project (warn about contained tasks)
   - `getProjectTasks` - Get all tasks in a specific project

4. **Chat Session Management**
   - Store chat messages in Convex for persistence
   - Create schema for chat sessions and messages
   - Support conversation history for context
   - Limit context window appropriately

5. **Streaming Response Handler**
   - Implement streaming action that yields tokens
   - Frontend can subscribe to streaming updates
   - Handle tool calls within the stream

6. **Error Handling**
   - Graceful handling of API failures
   - User-friendly error messages
   - Rate limiting consideration
</requirements>

<implementation>
Create these Convex files:

1. `./convex/ai/agent.ts`
   - AI agent configuration
   - System prompt definition
   - Provider selection logic

2. `./convex/ai/tools.ts`
   - Tool definitions for task CRUD
   - Tool definitions for project CRUD
   - Input validation schemas

3. `./convex/ai/chat.ts`
   - Convex actions for chat:
     - `sendMessage` - Send user message, get AI response
     - `streamMessage` - Streaming version
   - Message storage mutations

4. `./convex/schema.ts` (update)
   - Add chatSessions table
   - Add chatMessages table

5. `./convex/ai/queries.ts`
   - Query chat history
   - Query active session

6. `./.env.example` (update or create)
   - Document ANTHROPIC_API_KEY
   - Document OPENAI_API_KEY
   - Document AI_PROVIDER preference

7. `./src/hooks/useAIChat.ts`
   - React hook for chat functionality
   - Handles sending messages
   - Subscribes to streaming responses
   - Manages local optimistic updates

Install required packages:
```bash
pnpm add @convex-dev/agent
```

Tool implementation pattern:
- Each tool should validate inputs
- Return clear success/failure messages
- Include relevant data in responses (e.g., created task ID)
- Use existing mutation patterns from the codebase

System prompt should:
- Identify as a task management assistant
- Explain available capabilities clearly
- Be concise but helpful
- Ask clarifying questions when requests are ambiguous
- Confirm before destructive operations (delete)
</implementation>

<output>
Files to create/modify:
- `./convex/ai/agent.ts` - Agent configuration
- `./convex/ai/tools.ts` - CRUD tool definitions
- `./convex/ai/chat.ts` - Chat actions and mutations
- `./convex/ai/queries.ts` - Chat queries
- `./convex/schema.ts` - Add chat tables
- `./.env.example` - Document required env vars
- `./src/hooks/useAIChat.ts` - Frontend hook for AI chat
</output>

<verification>
Before declaring complete:
1. Run `pnpm tsc` to verify no TypeScript errors
2. Run `pnpm convex dev` to verify Convex schema and functions deploy
3. Test that chat tables are created in Convex dashboard
4. Verify tool definitions are properly typed
5. Test a simple message flow (may need API key configured)
</verification>

<success_criteria>
- Convex AI agent configured with system prompt
- All CRUD tools defined for tasks and projects
- Chat session and message storage implemented
- Streaming response capability ready
- useAIChat hook provides clean interface for frontend
- Environment variables documented
- No TypeScript errors
- Convex functions deploy successfully
</success_criteria>
