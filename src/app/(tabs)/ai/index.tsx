import { useCallback, useRef } from 'react';
import { View } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';

export default function AITabPlaceholder() {
  const router = useRouter();
  const hasNavigated = useRef(false);

  useFocusEffect(
    useCallback(() => {
      // Only navigate once per focus cycle
      if (!hasNavigated.current) {
        hasNavigated.current = true;
        router.push('/ai-chat');
      }

      // Reset the flag when the screen loses focus
      return () => {
        hasNavigated.current = false;
      };
    }, [router])
  );

  // Return empty view - user will see the modal immediately
  return <View className="flex-1 bg-background" />;
}
