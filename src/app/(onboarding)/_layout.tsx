import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        contentStyle: {
          backgroundColor: '#1f1f1f',
        },
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
