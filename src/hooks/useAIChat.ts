import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export interface ChatMessage {
  _id: Id<"chatMessages">;
  _creationTime: number;
  sessionId: Id<"chatSessions">;
  role: "user" | "assistant" | "system";
  content: string;
  toolCalls?: Array<{
    name: string;
    arguments: string;
    result?: string;
  }>;
  createdAt: number;
}

export interface ChatSession {
  _id: Id<"chatSessions">;
  _creationTime: number;
  userId?: string;
  title?: string;
  createdAt: number;
  updatedAt: number;
}

interface UseAIChatOptions {
  sessionId?: Id<"chatSessions">;
  userId?: string;
  autoLoadSession?: boolean;
}

interface UseAIChatReturn {
  // Current session
  session: ChatSession | undefined;
  sessionId: Id<"chatSessions"> | undefined;

  // Messages in the current session
  messages: ChatMessage[];
  isLoadingMessages: boolean;

  // Send a message
  sendMessage: (message: string) => Promise<void>;
  isSending: boolean;

  // Session management
  createNewSession: () => Promise<Id<"chatSessions"> | undefined>;
  switchSession: (newSessionId: Id<"chatSessions">) => void;
  deleteSession: (sessionIdToDelete: Id<"chatSessions">) => Promise<void>;

  // Recent sessions
  recentSessions: ChatSession[];

  // Error state
  error: string | undefined;
}

export function useAIChat(options: UseAIChatOptions = {}): UseAIChatReturn {
  const { sessionId: initialSessionId, userId, autoLoadSession = true } = options;

  const [sessionId, setSessionId] = useState<Id<"chatSessions"> | undefined>(initialSessionId);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | undefined>();

  // Get the current session
  const session = useQuery(
    api.ai.queries.getSession,
    sessionId ? { sessionId } : "skip"
  );

  // Get messages for the current session
  const messages = useQuery(
    api.ai.queries.getMessages,
    sessionId ? { sessionId } : "skip"
  ) || [];

  // Get recent sessions
  const recentSessions = useQuery(
    api.ai.queries.listSessions,
    userId ? { userId, limit: 10 } : { limit: 10 }
  ) || [];

  // Get the latest session if autoLoadSession is enabled and no sessionId is provided
  const latestSession = useQuery(
    api.ai.queries.getLatestSession,
    autoLoadSession && !sessionId && userId ? { userId } : "skip"
  ) || undefined;

  // Auto-load the latest session if available
  useEffect(() => {
    if (autoLoadSession && !sessionId && latestSession) {
      setSessionId(latestSession._id);
    }
  }, [autoLoadSession, sessionId, latestSession]);

  // Actions and mutations
  const sendMessageAction = useAction(api.ai.chat.sendMessage);
  const createSessionMutation = useMutation(api.ai.mutations.createSession);
  const deleteSessionMutation = useMutation(api.ai.mutations.deleteSession);

  // Create a new session
  const createNewSession = useCallback(async () => {
    try {
      setError(undefined);
      const now = Date.now();
      const newSessionId = await createSessionMutation({
        userId,
        createdAt: now,
        updatedAt: now,
      });
      setSessionId(newSessionId);
      return newSessionId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create session";
      setError(errorMessage);
      console.error("Error creating session:", err);
      return undefined;
    }
  }, [createSessionMutation, userId]);

  // Send a message
  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim()) {
      return;
    }

    try {
      setError(undefined);
      setIsSending(true);

      const result = await sendMessageAction({
        sessionId,
        message: message.trim(),
        userId,
      });

      // Update the session ID if it was created
      if (result.sessionId && result.sessionId !== sessionId) {
        setSessionId(result.sessionId);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send message";
      setError(errorMessage);
      console.error("Error sending message:", err);
    } finally {
      setIsSending(false);
    }
  }, [sendMessageAction, sessionId, userId]);

  // Switch to a different session
  const switchSession = useCallback((newSessionId: Id<"chatSessions">) => {
    setSessionId(newSessionId);
    setError(undefined);
  }, []);

  // Delete a session
  const deleteSession = useCallback(async (sessionIdToDelete: Id<"chatSessions">) => {
    try {
      setError(undefined);
      await deleteSessionMutation({ sessionId: sessionIdToDelete });

      // If we deleted the current session, clear it
      if (sessionIdToDelete === sessionId) {
        setSessionId(undefined);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete session";
      setError(errorMessage);
      console.error("Error deleting session:", err);
    }
  }, [deleteSessionMutation, sessionId]);

  return {
    session: session || undefined,
    sessionId,
    messages,
    isLoadingMessages: messages === undefined && sessionId !== undefined,
    sendMessage,
    isSending,
    createNewSession,
    switchSession,
    deleteSession,
    recentSessions,
    error,
  };
}

// Hook for streaming responses (future enhancement)
export function useAIChatStream(options: UseAIChatOptions = {}) {
  // TODO: Implement streaming version
  // This would use the streamMessage action and handle real-time token updates
  return useAIChat(options);
}
