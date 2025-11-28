import { useCallback, useRef, useEffect } from 'react';
import { View } from 'react-native';
import { useRouter, useFocusEffect, usePathname } from 'expo-router';

export default function AITabPlaceholder() {
  const router = useRouter();
  const pathname = usePathname();
  const hasNavigated = useRef(false);
  const isReturningFromModal = useRef(false);

  // Track when we're navigating away to the modal
  useEffect(() => {
    if (pathname === '/ai-chat') {
      isReturningFromModal.current = true;
    }
  }, [pathname]);

  useFocusEffect(
    useCallback(() => {
      // If returning from the modal, redirect to Today tab to break the loop
      if (isReturningFromModal.current) {
        isReturningFromModal.current = false;
        hasNavigated.current = false;
        router.replace('/(tabs)/today');
        return;
      }

      // Only navigate once per focus cycle
      if (!hasNavigated.current) {
        hasNavigated.current = true;
        router.push('/ai-chat');
      }
    }, [router])
  );

  // Return empty view - user will see the modal immediately
  return <View className="flex-1 bg-background" />;
}
