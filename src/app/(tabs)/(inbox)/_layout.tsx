import { Stack } from 'expo-router';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { InboxContextMenu } from '../../../components/InboxContextMenu';
import { theme } from '../../../theme';

export default function InboxLayout() {
  const [showCompleted, setShowCompleted] = useState(true);

  const handleToggleShowCompleted = (value: boolean) => {
    setShowCompleted(value);
    console.log('Show completed tasks:', value);
    // TODO: Implement show/hide completed tasks functionality
  };

  const handleSelectMultipleTasks = () => {
    Alert.alert('Select Multiple Tasks', 'This feature will be implemented soon');
    // TODO: Implement multiple task selection
  };

  const handleAddSection = () => {
    Alert.alert('Add Section', 'This feature will be implemented soon');
    // TODO: Implement section creation
  };

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
              <InboxContextMenu
                showCompleted={showCompleted}
                onToggleShowCompleted={handleToggleShowCompleted}
                onSelectMultipleTasks={handleSelectMultipleTasks}
                onAddSection={handleAddSection}
              />
            </View>
          ),
        }}
      />
    </Stack>
  );
}
