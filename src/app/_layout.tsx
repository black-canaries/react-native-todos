// import at the top
import "react-native-gesture-handler";

import { Platform } from 'react-native'
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { ConvexReactClient } from 'convex/react';
import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import * as SecureStore from 'expo-secure-store';
import '../../global.css';


// Initialize Convex client
const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

// Secure storage adapter for React Native
const secureStorage = {
  getItem: SecureStore.getItemAsync,
  setItem: SecureStore.setItemAsync,
  removeItem: SecureStore.deleteItemAsync,
};

export default function RootLayout() {
  return (
    <ConvexAuthProvider 
      client={convex} 
      storage={
        Platform.OS === "android" || Platform.OS === "ios"
          ? secureStorage
          : undefined
      }
    >
      <SafeAreaProvider>
        <GestureHandlerRootView className="flex-1 bg-background">
          <BottomSheetModalProvider>
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="ai-chat"
                options={{
                  presentation: 'fullScreenModal',
                  headerShown: true,
                  animation: 'slide_from_bottom',
                }}
              />
            </Stack>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ConvexAuthProvider>
  );
}
