import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
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
          style={[isActive && styles.dragging]}
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Projects</Text>
        <TouchableOpacity onPress={() => Alert.alert('Add Project', 'This feature is coming soon!')}>
          <Ionicons
            name="add"
            size={28}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {favoriteProjects.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Favorites</Text>
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
            <Text style={styles.sectionTitle}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  content: {
    flex: 1,
    paddingBottom: theme.spacing.xxl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  dragging: {
    opacity: 0.7,
  },
});
