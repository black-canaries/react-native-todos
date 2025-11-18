import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import * as Haptics from 'expo-haptics';
import { TaskItem } from '../../src/components/TaskItem';
import { Task } from '../../src/types';
import { useProject, useProjectTasks, useTaskMutations } from '../../src/hooks';
import { convexTasksToTasks } from '../../src/utils/convexAdapter';
import { theme } from '../../src/theme';

export default function ProjectDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const projectData = useProject(id);
  const allTasksData = useProjectTasks(id);
  const { toggleComplete, deleteTask } = useTaskMutations();

  // Convert Convex data to legacy format
  const { activeTasks, completedTasks } = useMemo(() => {
    if (!allTasksData) {
      return { activeTasks: [], completedTasks: [] };
    }

    const converted = convexTasksToTasks(allTasksData);
    return {
      activeTasks: converted.filter(t => !t.completed),
      completedTasks: converted.filter(t => t.completed),
    };
  }, [allTasksData]);

  // Get Convex task ID for mutations
  const getConvexTaskId = (taskId: string) => {
    if (!allTasksData) return null;
    const convexTask = allTasksData.find(t => t._id === taskId);
    return convexTask?._id || null;
  };

  const handleTaskToggle = async (taskId: string) => {
    try {
      const convexId = getConvexTaskId(taskId);
      if (!convexId) {
        Alert.alert('Error', 'Task not found');
        return;
      }
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await toggleComplete({ id: convexId });
    } catch (error) {
      console.error('Failed to toggle task:', error);
      Alert.alert('Error', 'Failed to update task');
    }
  };

  const handleTaskPress = (task: Task) => {
    Alert.alert(
      task.title,
      task.description || 'No description',
      [{ text: 'OK' }]
    );
  };

  const handleTaskDelete = async (taskId: string) => {
    try {
      const convexId = getConvexTaskId(taskId);
      if (!convexId) {
        Alert.alert('Error', 'Task not found');
        return;
      }
      await deleteTask({ id: convexId });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Failed to delete task:', error);
      Alert.alert('Error', 'Failed to delete task');
    }
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
          className={isActive ? 'opacity-70' : ''}
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

  // Show loading state while data is being fetched
  if (projectData === undefined || allTasksData === undefined) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center" edges={['top']}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  // Show error state if project not found
  if (!projectData) {
    return (
      <SafeAreaView className="flex-1 bg-background" edges={['top']}>
        <View className="flex-row justify-between items-center px-md py-sm border-b border-border">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color={theme.colors.text} />
          </TouchableOpacity>
          <Text className="text-xxl font-bold text-text">Project Not Found</Text>
          <View className="w-7" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row justify-between items-center px-md py-sm border-b border-border">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={theme.colors.text} />
        </TouchableOpacity>
        <View className="flex-1 flex-row items-center justify-center">
          <View
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: projectData.color }}
          />
          <Text className="text-xxl font-bold text-text ml-sm">{projectData.name}</Text>
        </View>
        <View className="w-7" />
      </View>

      <View className="flex-1 pb-xxl">
        {activeTasks.length > 0 && (
          <>
            <Text className="text-lg font-semibold text-text px-md py-md pt-lg bg-background border-b border-border">Active Tasks</Text>
            <DraggableFlatList
              data={activeTasks}
              renderItem={renderTask}
              keyExtractor={(item) => item.id}
              onDragEnd={({ data }) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                // Tasks are automatically reordered in Convex via subscriptions
              }}
              scrollEnabled={false}
            />
          </>
        )}

        {completedTasks.length > 0 && (
          <>
            <Text className="text-lg font-semibold text-text px-md py-md pt-lg bg-background border-b border-border">Completed</Text>
            <View>
              {completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={handleTaskToggle}
                  onPress={handleTaskPress}
                />
              ))}
            </View>
          </>
        )}

        {activeTasks.length === 0 && completedTasks.length === 0 && (
          <View className="flex-1 justify-center items-center">
            <Ionicons
              name="checkbox-outline"
              size={48}
              color={theme.colors.textSecondary}
            />
            <Text className="text-md text-text-secondary mt-md">No tasks in this project</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
