import React from 'react';
import { View, Text } from 'react-native';
import { Message } from '../types/chat';
import { theme } from '../theme';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <View
      className={`mb-md ${isUser ? 'items-end' : 'items-start'}`}
    >
      <View
        className={`max-w-[80%] rounded-2xl px-lg py-md ${
          isUser
            ? 'bg-primary rounded-tr-sm'
            : 'bg-background-secondary rounded-tl-sm'
        }`}
      >
        <Text
          className={`text-md ${
            isUser ? 'text-white' : 'text-text'
          }`}
        >
          {message.content}
          {message.isStreaming && (
            <Text className="text-text-tertiary"> |</Text>
          )}
        </Text>
      </View>
      <Text className="text-xs text-text-tertiary mt-xs px-sm">
        {formatTime(message.timestamp)}
      </Text>
    </View>
  );
}

function formatTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${displayHours}:${displayMinutes} ${ampm}`;
}
