import { Stack, Redirect } from 'expo-router';
import { useAuthToken } from '@convex-dev/auth/react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export default function AuthLayout() {
  const token = useAuthToken();
  const isAuthenticated = token !== null;
  const currentUser = useQuery(api.users.getCurrentUser);

  // If authenticated, check onboarding status
  if (isAuthenticated) {
    // Wait for user data to load
    if (currentUser === undefined) {
      return null; // Loading state
    }

    // If user hasn't completed onboarding, redirect to onboarding
    if (!currentUser?.onboardingCompleted) {
      return <Redirect href="/(onboarding)" />;
    }

    // Otherwise, redirect to main app
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen name="otp-verify" options={{ headerShown: false }} />
    </Stack>
  );
}
