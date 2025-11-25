import { Stack, useGlobalSearchParams } from 'expo-router';
import { Alert, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useCallback } from 'react';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { InboxContextMenu } from '../../../components/InboxContextMenu';
import { SettingsBottomSheet } from '../../../components/SettingsBottomSheet';
import { ProjectDisplayBottomSheet } from '../../../components/ProjectDisplayBottomSheet';
import { theme } from '../../../theme';

export default function BrowseLayout() {
  // Get the current project ID from route params (when on [id] screen)
  const { id: currentProjectId } = useGlobalSearchParams<{ id?: string }>();
  const [showCompleted, setShowCompleted] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showProjectDisplay, setShowProjectDisplay] = useState(false);

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

  const openSettings = useCallback(() => {
    setShowSettings(true);
  }, []);

  const closeSettings = useCallback(() => {
    setShowSettings(false);
  }, []);

  const openProjectDisplay = useCallback(() => {
    setShowProjectDisplay(true);
  }, []);

  const closeProjectDisplay = useCallback(() => {
    setShowProjectDisplay(false);
  }, []);

  return (
    <BottomSheetModalProvider>
      <Stack
        screenOptions={{
          headerShown: true,
          headerShadowVisible: false,
          headerTransparent: true,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerTitle: '',
            headerBackButtonDisplayMode: 'generic',
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
                <TouchableOpacity onPress={openSettings}>
                  <Ionicons name="settings-outline" size={24} color={theme.colors.icon} />
                </TouchableOpacity>
              </View>
            ),
          }}
        />
        <Stack.Screen
          name="[id]"
          options={{
            headerTitle: '',
            headerShadowVisible: false,
            headerTransparent: true,
            headerBackVisible: false,
            headerLeft: () => null,
            headerRight: () => (
              <View className="flex-row items-center gap-md px-md">
                <TouchableOpacity>
                  <Ionicons name="notifications-outline" size={24} color={theme.colors.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={openProjectDisplay}>
                  <Ionicons name="options-outline" size={24} color={theme.colors.icon} />
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
      <SettingsBottomSheet visible={showSettings} onClose={closeSettings} />
      <ProjectDisplayBottomSheet
        visible={showProjectDisplay}
        projectId={currentProjectId}
        onClose={closeProjectDisplay}
      />
    </BottomSheetModalProvider>
  );
}
