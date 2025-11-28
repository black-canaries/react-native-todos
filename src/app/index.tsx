import { Redirect } from 'expo-router';
import { useAuthToken } from '@convex-dev/auth/react';
import { View, ActivityIndicator } from 'react-native';
import { theme } from '../theme';

export default function Index() {
  const token = useAuthToken();

  // While auth state is being determined, show loading
  if (token === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Redirect based on auth state
  if (token === null) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(tabs)" />;
}
