import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import * as Haptics from 'expo-haptics';
import { TaskItem } from '../../src/components/TaskItem';
import { Task, Project } from '../../src/types';
import { mockProjects, mockTasks } from '../../src/data/mockData';
import { theme } from '../../src/theme';

export default function ProjectDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const project = useMemo(
    () => mockProjects.find(p => p.id === id),
    [id]
  );

  const [tasks, setTasks] = useState<Task[]>(
    mockTasks
      .filter(t => t.projectId === id && !t.completed)
      .sort((a, b) => a.order - b.order)
  );

  const [completedTasks, setCompletedTasks] = useState<Task[]>(
    mockTasks
      .filter(t => t.projectId === id && t.completed)
      .sort((a, b) => a.order - b.order)
  );

  if (!project) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Project Not Found</Text>
          <View style={{ width: 28 }} />
        </View>
      </SafeAreaView>
    );
  }

  const handleTaskToggle = (taskId: string) => {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      const task = tasks[taskIndex];
      const updatedTask = { ...task, completed: true };
      const newTasks = tasks.filter((_, i) => i !== taskIndex);
      setTasks(newTasks);
      setCompletedTasks([...completedTasks, updatedTask]);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const handleTaskPress = (task: Task) => {
    Alert.alert(
      task.title,
      task.description || 'No description',
      [{ text: 'OK' }]
    );
  };

  const renderTask = ({ item, drag, isActive }: RenderItemParams<Task>) => {
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
          <TaskItem
            task={item}
            onToggle={handleTaskToggle}
            onPress={handleTaskPress}
          />
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={theme.colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View
            style={[
              styles.projectColor,
              { backgroundColor: project.color },
            ]}
          />
          <Text style={styles.headerTitle}>{project.name}</Text>
        </View>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        {tasks.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Active Tasks</Text>
            <DraggableFlatList
              data={tasks}
              renderItem={renderTask}
              keyExtractor={(item) => item.id}
              onDragEnd={({ data }) => {
                setTasks(data);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              scrollEnabled={false}
            />
          </>
        )}

        {completedTasks.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Completed</Text>
            <View>
              {completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() => {}}
                  onPress={handleTaskPress}
                />
              ))}
            </View>
          </>
        )}

        {tasks.length === 0 && completedTasks.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons
              name="checkbox-outline"
              size={48}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.emptyStateText}>No tasks in this project</Text>
          </View>
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
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  projectColor: {
    width: 12,
    height: 12,
    borderRadius: theme.borderRadius.full,
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
});
