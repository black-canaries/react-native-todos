import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import * as Haptics from 'expo-haptics';
import { TaskItem } from '../../components/TaskItem';
import { EditTaskBottomSheet } from '../../components/EditTaskBottomSheet';
import { CreateTaskBottomSheet } from '../../components/CreateTaskBottomSheet';
import { Task } from '../../types';
import { useProject, useProjectTasks, useTaskMutations } from '../../hooks';
import { convexTasksToTasks } from '../../utils/convexAdapter';
import { theme } from '../../theme';

export default function ProjectDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const projectData = useProject(id);
  const allTasksData = useProjectTasks(id);
  const { toggleComplete, deleteTask, bulkReorderTasks } = useTaskMutations();

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showCreateSheet, setShowCreateSheet] = useState(false);

  // Convert Convex data to legacy format (separate active and completed)
  const { activeTasks, completedTasks } = useMemo(() => {
    if (!allTasksData) {
      return { activeTasks: [], completedTasks: [] };
    }

    const converted = convexTasksToTasks(allTasksData);
    const active = converted.filter(t => !t.completed);
    const completed = converted
      .filter(t => t.completed)
      .sort((a, b) => {
        // Sort completed by completedAt ascending (oldest first)
        return (a.completedAt ? new Date(a.completedAt).getTime() : 0) -
          (b.completedAt ? new Date(b.completedAt).getTime() : 0);
      });

    return { activeTasks: active, completedTasks: completed };
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
    setEditingTask(task);
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

  const handleTaskReorder = async (reorderedTasks: Task[]) => {
    try {
      const convexTasks = reorderedTasks
        .map((task, index) => ({
          id: task.id,
          newOrder: index,
        }))
        .filter((t): t is { id: string; newOrder: number } => !!t.id);

      if (convexTasks.length > 0) {
        await bulkReorderTasks({ tasks: convexTasks as any });
      }
    } catch (error) {
      console.error('Failed to reorder tasks:', error);
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
      <View className="flex-row justify-between items-center px-md py-sm">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={theme.colors.text} />
        </TouchableOpacity>
        <View className="flex-1 flex-row items-center justify-center">
          <View
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: projectData.color }}
          />
          <Text className="text-lg text-text ml-sm">{projectData.name}</Text>
        </View>
        <View className="w-7" />
      </View>

      <View className="flex-1">
        {activeTasks.length > 0 || completedTasks.length > 0 ? (
          <DraggableFlatList
            data={activeTasks}
            renderItem={renderTask}
            keyExtractor={(item) => item.id}
            onDragEnd={({ data }) => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              handleTaskReorder(data);
            }}
            contentContainerStyle={{ paddingBottom: 96 }}
            ListFooterComponent={
              <View>
                {/* Completed Tasks Section */}
                {completedTasks.length > 0 && (
                  <View className="mt-lg mx-md">
                    {completedTasks.map(task => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={handleTaskToggle}
                        onPress={handleTaskPress}
                      />
                    ))}
                  </View>
                )}

                {/* Add Task Button */}
                <TouchableOpacity
                  onPress={() => setShowCreateSheet(true)}
                  className="mx-md mt-lg mb-lg bg-background-secondary rounded-lg py-md px-md flex-row items-center gap-md"
                >
                  <Ionicons name="add" size={24} color={theme.colors.primary} />
                  <Text className="text-text font-semibold text-md">Add Task</Text>
                </TouchableOpacity>
              </View>
            }
          />
        ) : (
          <View className="flex-1 justify-center items-center pb-xxl">
            <Ionicons
              name="checkbox-outline"
              size={48}
              color={theme.colors.textSecondary}
            />
            <Text className="text-md text-text-secondary mt-md">No tasks in this project</Text>
            <TouchableOpacity
              onPress={() => setShowCreateSheet(true)}
              className="mx-md mt-lg bg-background-secondary rounded-lg py-md px-md flex-row items-center gap-md"
            >
              <Ionicons name="add" size={24} color={theme.colors.primary} />
              <Text className="text-text font-semibold text-md">Add Task</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <EditTaskBottomSheet
        visible={!!editingTask}
        task={editingTask}
        onClose={() => setEditingTask(null)}
      />

      <CreateTaskBottomSheet
        visible={showCreateSheet}
        projectId={projectData?._id || id || ''}
        onClose={() => setShowCreateSheet(false)}
      />
    </SafeAreaView>
  );
}
