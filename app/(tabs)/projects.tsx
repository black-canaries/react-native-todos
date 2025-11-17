import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
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
import { mockProjects, mockTasks } from '../../src/data/mockData';
import { theme } from '../../src/theme';

export default function ProjectsScreen() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(
    mockProjects.filter(p => !p.isArchived && p.id !== 'inbox').sort((a, b) => a.order - b.order)
  );

  const getTaskCount = (projectId: string): number => {
    return mockTasks.filter(t => t.projectId === projectId && !t.completed).length;
  };

  const handleProjectPress = (project: Project) => {
    router.push(`/project/${project.id}`);
  };

  const renderProject = ({ item, drag, isActive }: RenderItemParams<Project>) => {
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
            project={item}
            taskCount={getTaskCount(item.id)}
            onPress={handleProjectPress}
          />
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

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
              keyExtractor={(item) => item.id}
              onDragEnd={({ data }) => {
                const updatedProjects = [...data, ...otherProjects];
                setProjects(updatedProjects);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
              keyExtractor={(item) => item.id}
              onDragEnd={({ data }) => {
                const updatedProjects = [...favoriteProjects, ...data];
                setProjects(updatedProjects);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              scrollEnabled={false}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
