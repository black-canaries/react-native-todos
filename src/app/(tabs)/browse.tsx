import React, { useMemo, useState, useRef, useCallback, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { BottomSheetModal, BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useAllProjects, useAllTasks, useProjectMutations } from '../../hooks';
import { theme } from '../../theme';

export default function BrowseScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const projectsData = useAllProjects();
  const tasksData = useAllTasks();
  const { createProject } = useProjectMutations();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [projectName, setProjectName] = useState('');
  const [selectedColor, setSelectedColor] = useState(theme.colors.projectColors[0]);
  const [expandedFavorites, setExpandedFavorites] = useState(true);
  const [expandedMyProjects, setExpandedMyProjects] = useState(true);

  // Configure header with user info on left and icons on right
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerLeft: () => (
        <View className="flex-row items-center gap-md pl-md">
          <View className="w-10 h-10 rounded-full bg-primary items-center justify-center border-2 border-primary">
            <Text className="text-white font-bold text-sm">J</Text>
          </View>
          <Text className="text-lg font-semibold text-text">Jonathan</Text>
        </View>
      ),
      headerRight: () => (
        <View className="flex-row items-center gap-md pr-md">
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  // Open/close handlers for BottomSheetModal
  const openModal = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const closeModal = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  // Backdrop component for bottom sheet
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.8}
      />
    ),
    []
  );

  const projects = useMemo(() => {
    if (!projectsData) return [];
    return projectsData.filter(p => p.name !== 'Inbox').sort((a, b) => a.order - b.order);
  }, [projectsData]);

  const getTaskCount = (projectId: string): number => {
    if (!tasksData) return 0;
    return tasksData.filter(t => t.projectId === projectId && t.status === 'active').length;
  };

  const handleProjectPress = (projectId: string) => {
    router.push(`/project/${projectId}`);
  };

  const handleInboxPress = () => {
    router.push('/(tabs)');
  };

  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      Alert.alert('Error', 'Please enter a project name');
      return;
    }

    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await createProject({
        name: projectName.trim(),
        color: selectedColor,
        isFavorite: false,
      });
      setProjectName('');
      setSelectedColor(theme.colors.projectColors[0]);
      closeModal();
    } catch (error) {
      console.error('Failed to create project:', error);
      Alert.alert('Error', 'Failed to create project');
    }
  };

  const renderProjectItem = (project: any, onPress: () => void) => {
    const taskCount = getTaskCount(project._id);
    const colorIndex = theme.colors.projectColors.indexOf(project.color);
    const colors = ['#de4c4a', '#ffa900', '#ff8d00', '#25b84c', '#4073ff', '#884dff', '#ff40a6'];
    const projectColor = colors[colorIndex % colors.length];

    return (
      <TouchableOpacity
        key={project._id}
        onPress={onPress}
        className="flex-row items-center justify-between px-md py-sm"
      >
        <View className="flex-row items-center gap-md flex-1">
          <Text style={{ color: projectColor }} className="text-xl font-semibold">
            #
          </Text>
          <Text className="text-lg font-semibold text-text">{project.name}</Text>
        </View>
        <Text className="text-sm text-text-secondary">{taskCount}</Text>
      </TouchableOpacity>
    );
  };

  // Show loading state while data is being fetched
  if (projectsData === undefined || tasksData === undefined) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center" edges={['top']}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  const favoriteProjects = projects.filter(p => p.isFavorite);
  const otherProjects = projects.filter(p => !p.isFavorite);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1" contentContainerStyle={{ paddingBottom: 48 }}>

        {/* Search and Filters sections */}
        <View className="mt-md mx-md bg-background-secondary/50 rounded-lg">
          <TouchableOpacity onPress={handleInboxPress} className="flex-row items-center justify-between px-md py-sm">
            <View className="flex-row items-center gap-md">
              <Ionicons name="search" size={28} color={theme.colors.primary} />
              <Text className="text-lg font-semibold text-text">Search</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between px-md py-sm">
            <View className="flex-row items-center gap-md">
              <Ionicons name="apps" size={28} color={theme.colors.primary} />
              <Text className="text-lg font-semibold text-text">Filters & Labels</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Favorites Section */}
        {favoriteProjects.length > 0 && (
          <View className="mt-md mx-md">
            <TouchableOpacity
              onPress={() => setExpandedFavorites(!expandedFavorites)}
              className="flex-row items-center justify-between px-md py-md"
            >
              <Text className="text-xl font-semibold text-text">Favorites</Text>
              <Ionicons
                name={expandedFavorites ? 'chevron-down' : 'chevron-forward'}
                size={24}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
            {expandedFavorites && (
              <View className="bg-background-secondary/50 rounded-lg">
                {favoriteProjects.map(project =>
                  renderProjectItem(project, () => handleProjectPress(project._id))
                )}
              </View>
            )}
          </View>
        )}

        {/* My Projects Section */}
        <View className="mt-md mx-md">
          <View className="flex-row items-center justify-between px-md py-md">
            <TouchableOpacity
              onPress={() => setExpandedMyProjects(!expandedMyProjects)}
              className="flex-row items-center flex-1 gap-sm"
            >
              <Text className="text-xl font-semibold text-text">My Projects</Text>
              <Ionicons name="chevron-forward" size={16} color={theme.colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={openModal}
              className="flex-row items-center"
            >
              <Ionicons name="add" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setExpandedMyProjects(!expandedMyProjects)}>
              <Ionicons
                name={expandedMyProjects ? 'chevron-down' : 'chevron-forward'}
                size={24}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
          {expandedMyProjects && (
            <View className="bg-background-secondary/50 rounded-lg">
              {otherProjects.map(project =>
                renderProjectItem(project, () => handleProjectPress(project._id))
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Create Project Bottom Sheet */}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={['45%']}
        enablePanDownToClose
        enableDismissOnClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: theme.colors.backgroundSecondary }}
        handleIndicatorStyle={{ backgroundColor: theme.colors.textTertiary }}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
      >
        <BottomSheetView style={{ flex: 1, padding: 24 }}>
          {/* Header */}
          <View className="flex-row justify-between items-center mb-lg border-b border-border pb-md">
            <Text className="text-xl font-bold text-text">Create Project</Text>
            <TouchableOpacity onPress={closeModal}>
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Project Name Input */}
            <View className="mb-lg">
              <Text className="text-md font-semibold text-text mb-sm">Project Name</Text>
              <TextInput
                className="bg-background border border-border rounded-lg px-md py-sm text-md text-text min-h-[44px]"
                placeholder="Enter project name"
                placeholderTextColor={theme.colors.textTertiary}
                value={projectName}
                onChangeText={setProjectName}
                autoFocus
              />
            </View>

            {/* Color Picker */}
            <View className="mb-lg">
              <Text className="text-md font-semibold text-text mb-sm">Color</Text>
              <View className="flex-row flex-wrap gap-sm">
                {theme.colors.projectColors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    onPress={() => setSelectedColor(color)}
                    className="flex-row items-center mb-sm"
                  >
                    <View
                      className={`w-12 h-12 rounded-lg border-2 ${selectedColor === color ? 'border-primary' : 'border-transparent'
                        }`}
                      style={{ backgroundColor: color }}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Create Button */}
            <TouchableOpacity
              onPress={handleCreateProject}
              className="bg-primary rounded-lg py-md mt-lg"
            >
              <Text className="text-white text-lg font-bold text-center">Create Project</Text>
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              onPress={closeModal}
              className="bg-background-tertiary rounded-lg py-md mt-sm"
            >
              <Text className="text-text text-lg font-semibold text-center">Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </BottomSheetView>
      </BottomSheetModal>
    </SafeAreaView>
  );
}
