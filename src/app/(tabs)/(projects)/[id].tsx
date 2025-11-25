import React, { useMemo, useState, useLayoutEffect } from 'react';
import { View, Text, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import * as Haptics from 'expo-haptics';
import { TaskItem } from '../../../components/TaskItem';
import { EditTaskBottomSheet } from '../../../components/EditTaskBottomSheet';
import { CreateTaskBottomSheet } from '../../../components/CreateTaskBottomSheet';
import { Task } from '../../../types';
import { useProject, useProjectTasks, useTaskMutations } from '../../../hooks';
import { convexTasksToTasks } from '../../../utils/convexAdapter';
import { theme } from '../../../theme';

export default function ProjectDetailScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();

  const projectData = useProject(id);
  const allTasksData = useProjectTasks(id);
  const { toggleComplete, deleteTask, bulkReorderTasks } = useTaskMutations();

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showCreateSheet, setShowCreateSheet] = useState(false);

  // Set dynamic header options
  useLayoutEffect(() => {
    if (projectData) {
      navigation.setOptions({
        headerTitle: () => (
          <View className="flex-1 flex-row items-center justify-center">
            <Text
              className="font-bold text-xl"
              style={{ color: projectData.color }}
            >
              #
            </Text>
            <Text className="text-lg text-text ml-sm">{projectData.name}</Text>
          </View>
        ),
        headerLeft: () => (
          <TouchableOpacity onPress={() => router.back()} className="pl-md">
            <Ionicons name="chevron-back" size={28} color={theme.colors.text} />
          </TouchableOpacity>
        ),
      });
    }
  }, [projectData, navigation, router]);

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
    console.log('[PROJECT] handleTaskReorder called with', reorderedTasks.length, 'tasks');
    try {
      const convexTasks = reorderedTasks
        .map((task, index) => ({
          id: task.id,
          newOrder: index,
        }))
        .filter((t): t is { id: string; newOrder: number } => !!t.id);

      console.log('[PROJECT] Sending bulk reorder for', convexTasks.length, 'tasks');
      if (convexTasks.length > 0) {
        await bulkReorderTasks({ tasks: convexTasks as any });
        console.log('[PROJECT] Bulk reorder completed successfully');
      }
    } catch (error) {
      console.error('[PROJECT] Failed to reorder tasks:', error);
    }
  };

  const renderTask = ({ item, drag, isActive }: RenderItemParams<Task>) => {
    return (
      <ScaleDecorator>
        <TaskItem
          task={item}
          onToggle={handleTaskToggle}
          onPress={handleTaskPress}
          onLongPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            drag();
          }}
        />
      </ScaleDecorator>
    );
  };

  // Show loading state while data is being fetched
  if (projectData === undefined || allTasksData === undefined) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center" edges={['top', 'left', 'right']}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  // Show error state if project not found
  if (!projectData) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center" edges={['top', 'left', 'right']}>
        <Text className="text-xl font-bold text-text">Project Not Found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'left', 'right']}>
      <View className="flex-1">
        {activeTasks.length > 0 || completedTasks.length > 0 ? (
          <DraggableFlatList
            data={activeTasks}
            renderItem={renderTask}
            keyExtractor={(item) => item.id}
            onDragEnd={({ data }) => {
              console.log('[PROJECT] onDragEnd triggered with', data.length, 'tasks');
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              handleTaskReorder(data);
            }}
            activationDistance={10}
            contentContainerStyle={{ paddingBottom: 48, paddingTop: 16 }}
            contentInsetAdjustmentBehavior="automatic"
            automaticallyAdjustKeyboardInsets={true}
            ListFooterComponent={
              <View>
                {/* Completed Tasks Section */}
                {completedTasks.length > 0 && (
                  completedTasks.map(task => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={handleTaskToggle}
                      onPress={handleTaskPress}
                    />
                  ))
                )}

                {/* Add Task Button */}
                <TouchableOpacity
                  onPress={() => setShowCreateSheet(true)}
                  className="mx-md mt-1 mb-lg bg-background-secondary rounded-lg py-md px-md flex-row items-center gap-md"
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
