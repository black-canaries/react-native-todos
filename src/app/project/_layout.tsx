import { Stack } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';

export default function ProjectDetailsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerTransparent: true,
        headerBackButtonDisplayMode: 'minimal'
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{
          headerTitle: '',
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
