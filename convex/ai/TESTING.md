# Testing the AI Chat Backend

This guide helps you test the AI chat backend implementation.

## Prerequisites

1. Convex deployment is running (`pnpm convex dev`)
2. Environment variables are configured (see `.env.example`)
3. API key for your chosen provider (Anthropic or OpenAI)

## Manual Testing via Convex Dashboard

### 1. Test Session Creation

In the Convex dashboard, go to Functions > ai/mutations > createSession:

```json
{
  "userId": "test-user-123",
  "createdAt": 1700000000000,
  "updatedAt": 1700000000000
}
```

This should return a session ID.

### 2. Test Sending a Message

Go to Functions > ai/chat > sendMessage:

```json
{
  "message": "Create a task called 'Test task' with high priority",
  "userId": "test-user-123"
}
```

Expected response:
```json
{
  "sessionId": "...",
  "message": "I've created a task called 'Test task' with high priority.",
  "toolCalls": [...]
}
```

### 3. Test Listing Tasks

```json
{
  "message": "List all my tasks",
  "sessionId": "your-session-id",
  "userId": "test-user-123"
}
```

### 4. Test Project Creation

```json
{
  "message": "Create a project called 'Work' with blue color",
  "sessionId": "your-session-id",
  "userId": "test-user-123"
}
```

## Testing with the Frontend Hook

### Basic Usage Test

```typescript
import { useAIChat } from '@/hooks/useAIChat';

function TestChatComponent() {
  const { sendMessage, messages, isSending } = useAIChat({
    userId: 'test-user-123',
    autoLoadSession: true
  });

  return (
    <View>
      <Button
        title="Create Task"
        onPress={() => sendMessage("Create a task: Review PR")}
        disabled={isSending}
      />

      {messages.map(msg => (
        <Text key={msg._id}>{msg.role}: {msg.content}</Text>
      ))}
    </View>
  );
}
```

## Test Scenarios

### 1. Task Creation
- "Create a task called 'Buy groceries'"
- "Add a high priority task: 'Fix bug in production'"
- "Create a task 'Team meeting' for tomorrow"

### 2. Task Listing
- "Show me all my tasks"
- "List high priority tasks"
- "What tasks do I have today?"
- "Show tasks for project X"

### 3. Task Updates
- "Change the priority of task X to high"
- "Update task X description to 'Updated description'"
- "Move task X to tomorrow"

### 4. Task Completion
- "Mark task X as complete"
- "Complete the 'Buy groceries' task"

### 5. Task Deletion (should ask for confirmation)
- "Delete task X"
- "Remove the 'Old task' task"

### 6. Project Management
- "Create a project called 'Personal' with green color"
- "List all my projects"
- "Show me tasks in the Work project"
- "Delete the Old project"

### 7. Natural Language Dates
- "Create a task for today"
- "Add a task for tomorrow"
- "Create a task due next week" (should be handled naturally)

### 8. Error Handling
- Try with invalid API key
- Send very long messages
- Request non-existent tasks/projects

## Verification Checklist

- [ ] Sessions are created in the database
- [ ] Messages are saved with correct roles
- [ ] Tool calls are recorded
- [ ] Tasks are actually created/updated/deleted
- [ ] Projects are actually created/updated/deleted
- [ ] Error messages are user-friendly
- [ ] Chat history persists across sessions
- [ ] Multiple users can have separate sessions

## Performance Testing

### Message Response Time
Typical response times:
- Simple queries: 1-3 seconds
- With tool calls: 3-5 seconds
- Multiple tool calls: 5-10 seconds

### Context Window
Test with 20+ messages to verify context limiting works.

### Concurrent Users
Test multiple users sending messages simultaneously.

## Debugging

### Enable Detailed Logging

In `convex/ai/chat.ts`, add more console.logs:

```typescript
console.log("Received message:", message);
console.log("Tool calls:", toolCalls);
console.log("AI response:", response);
```

### Check Convex Logs

View logs in the Convex dashboard under Logs section.

### Common Issues

1. **"API key not found"**
   - Check `.env.local` has the correct API key
   - Verify AI_PROVIDER is set correctly

2. **Tool calls not working**
   - Check tool definitions match the expected format
   - Verify task/project IDs are valid

3. **Messages not appearing**
   - Check the session ID is consistent
   - Verify queries are polling correctly

## Next Steps

After testing:
1. Create a chat UI component
2. Add voice input support
3. Implement conversation history UI
4. Add typing indicators
5. Add message reactions/feedback
