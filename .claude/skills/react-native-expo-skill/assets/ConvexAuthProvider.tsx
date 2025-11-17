// ConvexAuthProvider.tsx
// Template for integrating Convex with authentication
// Copy this to your components/ folder and customize as needed

import React from 'react';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { ConvexProviderWithAuth } from 'convex/react';

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

interface ConvexAuthProviderProps {
  children: React.ReactNode;
}

export function ConvexAuthProvider({ children }: ConvexAuthProviderProps) {
  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  );
}

// Usage in app/_layout.tsx:
/*
import { ConvexAuthProvider } from './components/ConvexAuthProvider';

export default function RootLayout() {
  return (
    <ConvexAuthProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </ConvexAuthProvider>
  );
}
*/

// Example auth screen component:
/*
import { useAuthActions } from '@convex-dev/auth/react';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import AnimatedButton from './AnimatedButton';

function AuthScreen() {
  const { signIn, signOut } = useAuthActions();
  const user = useQuery(api.users.current);

  if (user === undefined) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (user) {
    return (
      <View className="flex-1 items-center justify-center p-4 bg-white dark:bg-gray-900">
        <Text className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          Welcome, {user.name}!
        </Text>
        <Text className="text-gray-600 dark:text-gray-400 mb-8">
          {user.email}
        </Text>
        <AnimatedButton
          title="Sign Out"
          variant="outline"
          onPress={() => signOut()}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center p-4 bg-white dark:bg-gray-900">
      <Text className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        Welcome
      </Text>
      
      <AnimatedButton
        title="Sign in with GitHub"
        variant="primary"
        className="w-full max-w-xs mb-4"
        onPress={() => signIn('github')}
      />
      
      <AnimatedButton
        title="Sign in with Google"
        variant="secondary"
        className="w-full max-w-xs"
        onPress={() => signIn('google')}
      />
    </View>
  );
}
*/
