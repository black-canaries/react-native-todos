// import at the top
import "react-native-gesture-handler";

import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import '../../global.css';

// Initialize Convex client
const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL || '';
const convex = new ConvexReactClient(convexUrl);

export default function RootLayout() {
  return (
    <ConvexProvider client={convex}>
      <GestureHandlerRootView className="flex-1 bg-background">
        <BottomSheetModalProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShadowVisible: false,
              headerTransparent: true
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </ConvexProvider>
  );
}
