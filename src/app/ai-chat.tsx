import React, { useCallback, useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ChatMessage } from '../components/ChatMessage';
import { Message } from '../types/chat';
import { theme } from '../theme';
import { useAIChat } from '../hooks/useAIChat';

export default function AIScreen() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);
  const [inputText, setInputText] = useState('');

  // Connect to Convex AI backend
  const {
    messages: convexMessages,
    sendMessage,
    isSending,
    error,
  } = useAIChat({
    autoLoadSession: true,
  });

  // Transform Convex messages to UI format
  const messages: Message[] = useMemo(() => {
    return convexMessages
      .filter((msg) => msg.role !== 'system')
      .map((msg) => ({
        id: msg._id,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        timestamp: new Date(msg.createdAt),
      }));
  }, [convexMessages]);

  const handleClose = useCallback(() => {
    // Navigate to Today tab instead of back() to avoid reopening the modal
    // (the AI tab placeholder auto-redirects here, causing a loop if we go back to it)
    router.replace('/(tabs)/today');
  }, [router]);

  const handleSendMessage = useCallback(async () => {
    if (!inputText.trim() || isSending) return;

    const messageText = inputText.trim();
    setInputText('');

    await sendMessage(messageText);
  }, [inputText, isSending, sendMessage]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const renderMessage = useCallback(
    ({ item }: { item: Message }) => <ChatMessage message={item} />,
    []
  );

  const renderEmpty = useCallback(
    () => (
      <View className="flex-1 items-center justify-center py-xxl">
        <View className="w-20 h-20 rounded-full bg-primary/20 items-center justify-center mb-lg">
          <Ionicons name="sparkles" size={40} color={theme.colors.primary} />
        </View>
        <Text className="text-xl font-bold text-text mb-sm">AI Assistant</Text>
        <Text className="text-md text-text-secondary text-center px-xxl">
          Ask me anything about your tasks and projects. I can help you create, update, and manage your work.
        </Text>
      </View>
    ),
    []
  );

  const keyExtractor = useCallback((item: Message) => item.id, []);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'AI Assistant',
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={handleClose} className="p-sm">
              <Ionicons name="close" size={28} color={theme.colors.text} />
            </TouchableOpacity>
          ),
          presentation: 'fullScreenModal',
        }}
      />
      <KeyboardAvoidingView
        className="flex-1 bg-background"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <SafeAreaView edges={['bottom']} className="flex-1">
          {/* Messages List */}
          <View className="flex-1">
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={keyExtractor}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingTop: 16,
                paddingBottom: 16,
                flexGrow: 1,
              }}
              ListEmptyComponent={renderEmpty}
              showsVerticalScrollIndicator={false}
              keyboardDismissMode="interactive"
              keyboardShouldPersistTaps="handled"
            />
          </View>

          {/* Error Display */}
          {error && (
            <View className="px-lg pb-sm">
              <View className="flex-row items-center gap-md bg-red-900/20 rounded-2xl px-lg py-md">
                <Ionicons name="alert-circle" size={20} color="#ef4444" />
                <Text className="text-md text-red-400 flex-1">{error}</Text>
              </View>
            </View>
          )}

          {/* Loading Indicator */}
          {isSending && (
            <View className="px-lg pb-sm">
              <View className="flex-row items-center gap-md bg-background-secondary rounded-2xl px-lg py-md max-w-[50%]">
                <ActivityIndicator size="small" color={theme.colors.primary} />
                <Text className="text-md text-text-secondary">Thinking...</Text>
              </View>
            </View>
          )}

          {/* Input Area */}
          <View className="px-lg py-md border-t border-border bg-background">
            <View className="flex-row items-center gap-sm">
              <View className="flex-1 bg-background-secondary rounded-full px-lg py-sm border border-border">
                <TextInput
                  ref={inputRef}
                  className="text-md text-text min-h-[40px]"
                  placeholder="Ask me anything..."
                  placeholderTextColor={theme.colors.textTertiary}
                  value={inputText}
                  onChangeText={setInputText}
                  multiline
                  maxLength={1000}
                  editable={!isSending}
                  onSubmitEditing={handleSendMessage}
                  blurOnSubmit={false}
                  submitBehavior="submit"
                  returnKeyType="send"
                />
              </View>
              <TouchableOpacity
                onPress={handleSendMessage}
                disabled={!inputText.trim() || isSending}
                className={`w-12 h-12 rounded-full items-center justify-center ${
                  inputText.trim() && !isSending
                    ? 'bg-primary'
                    : 'bg-background-secondary'
                }`}
              >
                <Ionicons
                  name="arrow-up"
                  size={24}
                  color={
                    inputText.trim() && !isSending
                      ? '#ffffff'
                      : theme.colors.textTertiary
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </>
  );
}
