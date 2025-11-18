import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import * as Haptics from 'expo-haptics';
import { ProjectItem } from '../../src/components/ProjectItem';
import { Project } from '../../src/types';
import { useAllProjects, useAllTasks, useProjectMutations } from '../../src/hooks';
import { theme } from '../../src/theme';

export default function ProjectsScreen() {
  const router = useRouter();
  const projectsData = useAllProjects();
  const tasksData = useAllTasks();
  const { reorderProject } = useProjectMutations();

  // Helper to bulk reorder projects after drag & drop
  const handleProjectReorder = async (reorderedProjects: any[]) => {
    try {
      // Update order for each project based on new positions
      const reorderPromises = reorderedProjects.map((project, index) =>
        reorderProject({ id: project._id, newOrder: index })
      );

      if (reorderPromises.length > 0) {
        await Promise.all(reorderPromises);
      }
    } catch (error) {
      console.error('Failed to reorder projects:', error);
    }
  };

  const projects = useMemo(() => {
    if (!projectsData) return [];
    // Filter out Inbox and archived projects
    return projectsData.filter(p => p.name !== 'Inbox').sort((a, b) => a.order - b.order);
  }, [projectsData]);

  const getTaskCount = (projectId: string): number => {
    if (!tasksData) return 0;
    return tasksData.filter(t => t.projectId === projectId && t.status === 'active').length;
  };

  const handleProjectPress = (projectId: string) => {
    router.push(`/project/${projectId}`);
  };

  const renderProject = ({ item, drag, isActive }: RenderItemParams<any>) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            drag();
          }}
          disabled={isActive}
          className={isActive ? 'opacity-70' : ''}
        >
          <ProjectItem
            project={{
              id: item._id,
              name: item.name,
              color: item.color,
              isFavorite: item.isFavorite,
              order: item.order,
              isArchived: false,
              sections: [],
              viewType: 'list',
            }}
            taskCount={getTaskCount(item._id)}
            onPress={() => handleProjectPress(item._id)}
          />
        </TouchableOpacity>
      </ScaleDecorator>
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
      <View className="flex-row justify-between items-center px-md py-sm border-b border-border">
        <Text className="text-xxl font-bold text-text">Projects</Text>
        <TouchableOpacity onPress={() => Alert.alert('Add Project', 'This feature is coming soon!')}>
          <Ionicons
            name="add"
            size={28}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>

      <View className="flex-1 pb-xxl">
        {favoriteProjects.length > 0 && (
          <>
            <Text className="text-lg font-semibold text-text px-md py-md pt-lg bg-background border-b border-border">Favorites</Text>
            <DraggableFlatList
              data={favoriteProjects}
              renderItem={renderProject}
              keyExtractor={(item) => item._id}
              onDragEnd={({ data }) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                handleProjectReorder(data);
              }}
              scrollEnabled={false}
            />
          </>
        )}

        {otherProjects.length > 0 && (
          <>
            <Text className="text-lg font-semibold text-text px-md py-md pt-lg bg-background border-b border-border">
              {favoriteProjects.length > 0 ? 'Other Projects' : 'All Projects'}
            </Text>
            <DraggableFlatList
              data={otherProjects}
              renderItem={renderProject}
              keyExtractor={(item) => item._id}
              onDragEnd={({ data }) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                handleProjectReorder(data);
              }}
              scrollEnabled={false}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
