<objective>
Convert the existing AI tool calling implementation to use the Convex Agents package (@convex-dev/agent) for CRUD operations with direct Convex integration.

This is a production-ready migration that replaces custom Anthropic/OpenAI tool call logic with Convex Agents, enabling the AI to directly interact with your Convex backend for managing tasks, projects, labels, and all entities in the data model.
</objective>

<context>
This is a React Native Todoist clone using:
- Convex backend (v1.29.3)
- @convex-dev/agent package (v0.3.0) already installed
- @anthropic-ai/sdk (v0.71.0) and openai (v6.9.1) for AI providers
- Full data model: Tasks, Projects, Labels, Sections, and related entities

The current implementation uses custom API-specific tool calls for both Anthropic and OpenAI. This needs to be converted to use Convex Agents which provides:
- Built-in tool definitions that integrate directly with Convex mutations/queries
- Unified agent interface regardless of AI provider
- Persistent conversation threads
- Native Convex integration for data operations
</context>

<research>
Before implementing, thoroughly examine:

1. Current AI implementation:
   @convex/ai/* - All existing AI-related files
   @convex/schema.ts - Full data model schema

2. Convex Agents documentation (fetch this):
   !WebFetch https://docs.convex.dev/agents - Core concepts and setup

3. Existing Convex mutations and queries that handle CRUD:
   @convex/*.ts - All Convex functions that modify data
</research>

<requirements>
1. **Agent Definition**: Create a Convex Agent with tools for full CRUD operations:
   - Tasks: create, read, update, delete, complete, uncomplete, reorder
   - Projects: create, read, update, delete, favorite/unfavorite
   - Labels: create, read, update, delete
   - Sections: create, read, update, delete
   - Any other entities in your schema

2. **Tool Implementation**: Each tool should:
   - Accept properly typed parameters
   - Call existing Convex mutations/queries directly
   - Return meaningful results to the agent
   - Handle errors gracefully with informative messages

3. **Agent Configuration**:
   - Configure the agent with appropriate system prompt for a task management assistant
   - Set up conversation threading for persistent context
   - Configure the AI model (Anthropic Claude or OpenAI GPT based on existing setup)

4. **Integration Points**:
   - Replace all existing custom tool call logic with Convex Agent invocations
   - Ensure the chat/conversation UI works with the new agent
   - Maintain any existing conversation history or migrate it appropriately

5. **Type Safety**: Full TypeScript types for:
   - Tool parameters and return types
   - Agent configuration
   - Conversation messages
</requirements>

<implementation>
Follow this approach:

1. **Define the Agent** in `convex/ai/agent.ts`:
   - Use `defineAgent` from @convex-dev/agent
   - Create tools using `defineTool` for each CRUD operation
   - Tools should call your existing mutations/queries internally

2. **Create Agent Entry Points** in Convex:
   - HTTP action or mutation for starting conversations
   - Action for sending messages to the agent
   - Query for retrieving conversation history

3. **Update Frontend Integration**:
   - Modify the chat component to use the new Convex agent endpoints
   - Handle streaming responses if supported
   - Update any tool result rendering

4. **Remove Legacy Code**:
   - Remove custom Anthropic tool definitions
   - Remove custom OpenAI function definitions
   - Remove any manual tool execution logic
   - Keep only the Convex Agent implementation

Why Convex Agents over custom tool calls:
- Direct database integration without HTTP round-trips
- Built-in conversation persistence
- Unified API regardless of underlying AI model
- Type-safe tool definitions with Convex validators
</implementation>

<output>
Create/modify these files:

- `./convex/ai/agent.ts` - Main agent definition with all tools
- `./convex/ai/tools.ts` - Tool definitions for CRUD operations (if separating concerns)
- `./convex/ai/chat.ts` - Chat actions/mutations using the agent
- Any frontend files that interact with AI chat functionality

Remove or significantly modify:
- Any files with custom Anthropic/OpenAI tool call implementations
</output>

<verification>
Before declaring complete, verify:

1. **Agent loads without errors**:
   - Run `pnpm convex dev` and confirm no type errors
   - Agent is properly registered

2. **Tools work correctly**:
   - Test creating a task via chat: "Create a task called 'Test task' for today"
   - Test reading data: "What tasks do I have today?"
   - Test updating: "Mark 'Test task' as high priority"
   - Test deleting: "Delete 'Test task'"

3. **Full data model coverage**:
   - Verify tools exist for Tasks, Projects, Labels, Sections
   - All CRUD operations available for each entity type

4. **Legacy code removed**:
   - No custom tool definitions remain
   - All AI interactions go through Convex Agent

5. **Type safety**:
   - No TypeScript errors
   - All tool parameters properly validated
</verification>

<success_criteria>
- Convex Agent defined with comprehensive CRUD tools for full data model
- All AI interactions use @convex-dev/agent instead of custom implementations
- Chat functionality works end-to-end through the new agent
- Zero TypeScript errors
- Legacy custom tool call code removed
- Production-ready error handling and user feedback
</success_criteria>
