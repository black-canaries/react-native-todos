<objective>
Build the UI layer for an AI assistant tab in the React Native Todos app. This tab will use the SF Symbol "sparkles" icon and open a bottom sheet containing a chat interface when tapped.

The chat interface allows users to converse with an AI assistant that can help manage their tasks and projects through natural language.
</objective>

<context>
This is a React Native Expo app using:
- Expo Router v6 for file-based routing
- React Navigation bottom tabs
- @gorhom/bottom-sheet for bottom sheets
- NativeWind (Tailwind) for styling
- React Native Reanimated for animations
- Dark theme by default (#1f1f1f background, #de4c4a primary)

Read @CLAUDE.md for project conventions.

Examine these files for patterns:
- @src/app/(tabs)/_layout.tsx - existing tab configuration
- @src/components/SettingsBottomSheet.tsx - existing bottom sheet pattern
- @src/components/ProjectDisplayBottomSheet.tsx - another bottom sheet example
</context>

<requirements>
1. **AI Tab in Tab Bar**
   - Add new tab to the bottom navigation
   - Use SF Symbol "sparkles" icon (via @expo/vector-icons or expo-symbols)
   - Tab label: "AI" or "Assistant"
   - Position: rightmost tab (after Projects)

2. **Tab Behavior**
   - Tapping the AI tab should NOT navigate to a new screen
   - Instead, it should open a bottom sheet overlay
   - The previously active tab should remain visible behind the sheet
   - Use tabPress event listener to intercept and open sheet instead

3. **Chat Bottom Sheet**
   - Full-height bottom sheet (snap to ~90% screen height)
   - Drag handle at top for dismissal
   - Dark theme consistent with app design
   - Smooth open/close animations

4. **Chat Interface Components**
   - Header with title "AI Assistant" and close button
   - Scrollable message list (FlatList or ScrollView)
   - Message bubbles:
     - User messages: aligned right, accent color background
     - AI messages: aligned left, subtle dark background
     - Support for streaming text (text appears progressively)
   - Input area at bottom:
     - TextInput with placeholder "Ask me anything..."
     - Send button (disabled when empty)
     - Safe area padding for home indicator
   - Loading indicator when AI is responding
   - Auto-scroll to bottom on new messages

5. **State Management**
   - Local state for messages array: `{ id, role: 'user' | 'assistant', content, isStreaming? }`
   - Input text state
   - Loading/streaming state
   - Bottom sheet open/closed state

6. **Keyboard Handling**
   - Bottom sheet should adjust for keyboard
   - Input should remain visible above keyboard
   - Use KeyboardAvoidingView or bottom-sheet's keyboard handling
</requirements>

<implementation>
Create these files:

1. `./src/components/AIChatBottomSheet.tsx`
   - Main chat interface component
   - Accepts `ref` for bottom sheet control
   - Props: `onSendMessage: (message: string) => void`
   - Props: `messages: Message[]`
   - Props: `isLoading: boolean`

2. `./src/components/ChatMessage.tsx`
   - Individual message bubble component
   - Props: `message: Message`
   - Handle streaming state (show cursor or typing indicator)

3. `./src/types/chat.ts`
   - TypeScript interfaces for Message, ChatState

4. Update `./src/app/(tabs)/_layout.tsx`
   - Add AI tab with sparkles icon
   - Add tabPress listener to open bottom sheet
   - Wrap with bottom sheet provider if needed

Use existing theme from @src/theme/ for colors, spacing, typography.

Avoid:
- Don't create a separate screen for the AI tab (it's a bottom sheet overlay)
- Don't implement actual AI API calls (that's handled by the backend prompt)
- Don't use external chat UI libraries - build with existing components
</implementation>

<output>
Files to create/modify:
- `./src/types/chat.ts` - Chat type definitions
- `./src/components/ChatMessage.tsx` - Message bubble component
- `./src/components/AIChatBottomSheet.tsx` - Full chat bottom sheet
- `./src/app/(tabs)/_layout.tsx` - Add AI tab with sheet trigger
</output>

<verification>
Before declaring complete:
1. Run `pnpm tsc` to verify no TypeScript errors
2. Verify the AI tab appears in the tab bar with sparkles icon
3. Verify tapping AI tab opens the bottom sheet (doesn't navigate)
4. Verify chat UI renders with input field and send button
5. Verify keyboard handling works correctly
6. Test that the sheet can be dismissed by dragging down
</verification>

<success_criteria>
- AI tab visible in tab bar with sparkles icon
- Tapping tab opens bottom sheet overlay
- Chat interface renders with message list and input
- User can type messages and see them appear
- Placeholder for AI responses (actual AI integration in separate prompt)
- Smooth animations and dark theme consistency
- No TypeScript errors
</success_criteria>
