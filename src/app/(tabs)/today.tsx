import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
import { useTodayTasks, useTaskMutations, useAllProjects } from '../../hooks';
import { convexTaskToTask, convexTasksToTasks, taskPriorityToConvex } from '../../utils/convexAdapter';
import { theme } from '../../theme';

export default function TodayScreen() {
  const todayTasksData = useTodayTasks();
  const { toggleComplete, createTask, deleteTask, bulkReorderTasks } = useTaskMutations();

  // Helper to bulk reorder tasks after drag & drop
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
  const projectsData = useAllProjects();

  const [showCreateSheet, setShowCreateSheet] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Get the inbox project ID (fallback to first project if not found)
  const inboxProject = useMemo(() => {
    if (!projectsData || projectsData.length === 0) return null;
    return projectsData[0]; // First project or could filter by name
  }, [projectsData]);

  // Get active and completed tasks for today
  const { activeTasks, completedTasks } = useMemo(() => {
    if (!todayTasksData) {
      return { activeTasks: [], completedTasks: [] };
    }

    const convertedTasks = convexTasksToTasks(todayTasksData);

    const active = convertedTasks.filter(t => !t.completed);
    const completed = convertedTasks
      .filter(t => t.completed)
      .sort((a, b) => {
        // Sort completed by completedAt ascending (oldest first)
        return (a.completedAt ? new Date(a.completedAt).getTime() : 0) -
          (b.completedAt ? new Date(b.completedAt).getTime() : 0);
      });

    return { activeTasks: active, completedTasks: completed };
  }, [todayTasksData]);

  // Find original Convex task by converted ID to get the actual Convex ID
  const getConvexTaskId = (taskId: string) => {
    if (!todayTasksData) return null;
    const convexTask = todayTasksData.find(t => t._id === taskId);
    return convexTask?._id || null;
  };

  const handleToggleTask = async (taskId: string) => {
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

  const renderTask = ({ item, drag, isActive }: RenderItemParams<Task>) => {
    return (
      <ScaleDecorator>
        <TaskItem
          task={item}
          onToggle={handleToggleTask}
          onPress={handleTaskPress}
          onLongPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            drag();
          }}
          isActive={isActive}
        />
      </ScaleDecorator>
    );
  };

  const getDateString = () => {
    const today = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[today.getDay()]}, ${months[today.getMonth()]} ${today.getDate()}`;
  };

  // Show loading state while data is being fetched
  if (todayTasksData === undefined) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center" edges={['top']}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row justify-between items-center px-md py-sm border-b border-border">
        <View>
          <Text className="text-xxl font-bold text-text">Today</Text>
          <Text className="text-sm text-text-secondary mt-[4px]">{getDateString()}</Text>
        </View>
      </View>

      <DraggableFlatList
        data={activeTasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        onDragEnd={({ data }) => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          handleTaskReorder(data);
        }}
        contentContainerStyle={{ paddingBottom: 96 }}
        ListEmptyComponent={
          activeTasks.length === 0 && completedTasks.length === 0 ? (
            <View className="items-center justify-center py-xxl px-md">
              <Ionicons
                name="sunny-outline"
                size={64}
                color={theme.colors.textTertiary}
              />
              <Text className="text-xl font-semibold text-text-secondary mt-md">No tasks for today</Text>
              <Text className="text-md text-text-tertiary mt-sm">
                Enjoy your free time!
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          <View>
            {/* Completed Tasks Section */}
            {completedTasks.length > 0 && (
              <View className="">
                {completedTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={handleToggleTask}
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

      <EditTaskBottomSheet
        visible={!!editingTask}
        task={editingTask}
        onClose={() => setEditingTask(null)}
      />

      <CreateTaskBottomSheet
        visible={showCreateSheet}
        projectId={inboxProject?._id || 'inbox'}
        onClose={() => setShowCreateSheet(false)}
        presetDueDate={new Date()}
      />
    </SafeAreaView>
  );
}
