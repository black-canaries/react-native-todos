import { Stack } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
        headerShadowVisible: false,
        headerTransparent: true
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
          headerRight: () => (
            <View className="flex-row items-center gap-md px-md">
              <TouchableOpacity>
                <Ionicons name="notifications-outline" size={24} color={theme.colors.icon} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="settings-outline" size={24} color={theme.colors.icon} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
    </Stack>
  );
}
