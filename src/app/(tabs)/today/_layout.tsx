import { Stack } from 'expo-router';
import { View, Text } from 'react-native';
import { theme } from '../../../theme';

function getDateString() {
  const today = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${days[today.getDay()]}, ${months[today.getMonth()]} ${today.getDate()}`;
}

export default function TodayLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitle: "Today",
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
                Today
              </Text>
              <Text style={{ fontSize: 14, color: theme.colors.textSecondary, marginTop: 4 }}>
                {getDateString()}
              </Text>
            </View>
          ),
        }}
      />
    </Stack>
  );
}
