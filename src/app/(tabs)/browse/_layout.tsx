import { Stack } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../theme';

export default function BrowseLayout() {
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
          headerTitle: '',
          headerLeft: () => (
            <View className="flex-row items-center gap-md px-md">
              <View className="w-8 h-8 rounded-full bg-primary items-center justify-center border-2 border-primary">
                <Text className="text-white font-bold text-sm">J</Text>
              </View>
              <Text className="text-lg font-normal text-text">Jonathan</Text>
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
