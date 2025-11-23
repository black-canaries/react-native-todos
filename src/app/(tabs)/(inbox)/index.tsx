import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
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
import { TaskItem } from '../../../components/TaskItem';
import { EditTaskBottomSheet } from '../../../components/EditTaskBottomSheet';
import { CreateTaskBottomSheet } from '../../../components/CreateTaskBottomSheet';
import { Task } from '../../../types';
import { useAllTasks, useTaskMutations, useAllProjects } from '../../../hooks';
import { convexTasksToTasks } from '../../../utils/convexAdapter';
import { theme } from '../../../theme';

export default function InboxScreen() {
  const allTasksData = useAllTasks();
  const { toggleComplete, createTask, bulkReorderTasks } = useTaskMutations();
  const projectsData = useAllProjects();

  const [showCreateSheet, setShowCreateSheet] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Helper to bulk reorder tasks after drag & drop
  const handleTaskReorder = async (reorderedTasks: Task[]) => {
    console.log('[INBOX] handleTaskReorder called with', reorderedTasks.length, 'tasks');
    try {
      const convexTasks = reorderedTasks
        .map((task, index) => ({
          id: task.id,
          newOrder: index,
        }))
        .filter((t): t is { id: string; newOrder: number } => !!t.id);

      console.log('[INBOX] Sending bulk reorder for', convexTasks.length, 'tasks');
      if (convexTasks.length > 0) {
        await bulkReorderTasks({ tasks: convexTasks as any });
        console.log('[INBOX] Bulk reorder completed successfully');
      }
    } catch (error) {
      console.error('[INBOX] Failed to reorder tasks:', error);
    }
  };

  // Get the inbox project ID
  const inboxProject = useMemo(() => {
    if (!projectsData || projectsData.length === 0) return null;
    return projectsData.find((p) => p.name === 'Inbox') || projectsData[0];
  }, [projectsData]);

  // Get active and completed tasks for the inbox project
  const { activeTasks, completedTasks } = useMemo(() => {
    if (!allTasksData || !inboxProject) {
      return { activeTasks: [], completedTasks: [] };
    }

    const inboxTasks = allTasksData.filter((t) => t.projectId === inboxProject._id);
    const convertedTasks = convexTasksToTasks(inboxTasks);

    const active = convertedTasks.filter(t => !t.completed);
    const completed = convertedTasks
      .filter(t => t.completed)
      .sort((a, b) => {
        // Sort completed by completedAt ascending (oldest first)
        return (a.completedAt ? new Date(a.completedAt).getTime() : 0) -
          (b.completedAt ? new Date(b.completedAt).getTime() : 0);
      });

    return { activeTasks: active, completedTasks: completed };
  }, [allTasksData, inboxProject]);

  // Find original Convex task by converted ID to get the actual Convex ID
  const getConvexTaskId = (taskId: string) => {
    if (!allTasksData) return null;
    const convexTask = allTasksData.find(t => t._id === taskId);
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

  const renderTask = ({ item, drag, isActive }: RenderItemParams<Task>) => {
    return (
      <ScaleDecorator>
        <TaskItem
          task={item}
          onToggle={handleToggleTask}
          onPress={handleTaskPress}
          onLongPress={() => {
            console.log('[INBOX] Long press detected on task:', item.title);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            drag();
            console.log('[INBOX] Drag initiated');
          }}
        />
      </ScaleDecorator>
    );
  };

  // Show loading state while data is being fetched
  if (allTasksData === undefined) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <DraggableFlatList
        data={activeTasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        onDragEnd={({ data }) => {
          console.log('[INBOX] onDragEnd triggered with', data.length, 'tasks');
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          handleTaskReorder(data);
        }}
        activationDistance={10}
        contentContainerStyle={{ paddingBottom: 96, paddingTop: 68 }}
        ListEmptyComponent={
          activeTasks.length === 0 && completedTasks.length === 0 ? (
            <View className="items-center justify-center py-xxl px-md">
              <Ionicons
                name="checkmark-circle-outline"
                size={64}
                color={theme.colors.textTertiary}
              />
              <Text className="text-xl font-semibold text-text-secondary mt-md">All done!</Text>
              <Text className="text-md text-text-tertiary mt-sm">
                Tap + to add a new task
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          <View>
            {/* Completed Tasks Section */}
            {completedTasks.length > 0 && (
              completedTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={handleToggleTask}
                  onPress={handleTaskPress}
                />
              )
              )
            )
            }

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

      <EditTaskBottomSheet
        visible={!!editingTask}
        task={editingTask}
        onClose={() => setEditingTask(null)}
      />

      <CreateTaskBottomSheet
        visible={showCreateSheet}
        projectId={inboxProject?._id || 'inbox'}
        onClose={() => setShowCreateSheet(false)}
      />
    </SafeAreaView>
  );
}
