import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../src/theme';

export default function SearchScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row justify-between items-center px-md py-sm border-b border-border">
        <Text className="text-xxl font-bold text-text">Search</Text>
      </View>

      <View className="flex-1 items-center justify-center">
        <Text className="text-text text-lg">Search coming soon</Text>
      </View>
    </SafeAreaView>
  );
}
