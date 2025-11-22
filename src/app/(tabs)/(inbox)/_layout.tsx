import { Stack } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../theme';

export default function InboxLayout() {
  return (
    <Stack
      screenOptions={{
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
                Inbox
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
