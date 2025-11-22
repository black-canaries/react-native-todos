import { Stack } from 'expo-router';
import { View, Text } from 'react-native';
import { theme } from '../../../theme';

export default function UpcomingLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.primary,
        headerShadowVisible: true,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: () => (
            <View>
              <Text style={{ fontSize: 20, fontWeight: '500', color: theme.colors.text, textAlign: 'center' }}>
                Upcoming
              </Text>
            </View>
          ),
        }}
      />
    </Stack>
  );
}
