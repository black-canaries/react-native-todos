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
import { TaskItem } from '../../src/components/TaskItem';
import { EditTaskModal } from '../../src/components/EditTaskModal';
import { Task } from '../../src/types';
import { useTodayTasks, useTaskMutations, useAllProjects } from '../../src/hooks';
import { convexTaskToTask, convexTasksToTasks, taskPriorityToConvex } from '../../src/utils/convexAdapter';
import { theme } from '../../src/theme';

export default function TodayScreen() {
  const todayTasksData = useTodayTasks();
  const { toggleComplete, createTask, deleteTask, bulkReorderTasks } = useTaskMutations();

  // Helper to bulk reorder tasks after drag & drop
  const handleTaskReorder = async (reorderedTasks: Task[]) => {
    try {
      const convexTasks = reorderedTasks
        .map((task, index) => ({
          id: getConvexTaskId(task.id),
          newOrder: index,
        }))
        .filter((t): t is { id: any; newOrder: number } => t.id !== null);

      if (convexTasks.length > 0) {
        await bulkReorderTasks({ tasks: convexTasks as any });
      }
    } catch (error) {
      console.error('Failed to reorder tasks:', error);
    }
  };
  const projectsData = useAllProjects();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Get the inbox project ID (fallback to first project if not found)
  const inboxProject = useMemo(() => {
    if (!projectsData || projectsData.length === 0) return null;
    return projectsData[0]; // First project or could filter by name
  }, [projectsData]);

  // Separate active and completed tasks
  const { activeTasks, completedTasks } = useMemo(() => {
    if (!todayTasksData) {
      return { activeTasks: [], completedTasks: [] };
    }

    const convertedTasks = convexTasksToTasks(todayTasksData);
    return {
      activeTasks: convertedTasks.filter(t => !t.completed),
      completedTasks: convertedTasks.filter(t => t.completed),
    };
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

  const handleAddTask = async () => {
    if (newTaskTitle.trim() && inboxProject) {
      try {
        await createTask({
          title: newTaskTitle.trim(),
          priority: 'p4',
          projectId: inboxProject._id,
          dueDate: Date.now(),
          description: undefined,
          labels: [],
        });
        setNewTaskTitle('');
        setShowInput(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        console.error('Failed to create task:', error);
        Alert.alert('Error', 'Failed to create task');
      }
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
            onToggle={handleToggleTask}
            onPress={handleTaskPress}
          />
        </TouchableOpacity>
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
        <TouchableOpacity onPress={() => setShowInput(!showInput)}>
          <Ionicons
            name={showInput ? 'close' : 'add'}
            size={28}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>

      {showInput && (
        <View className="flex-row px-md py-md border-b border-border bg-background gap-sm">
          <TextInput
            className="flex-1 bg-background-secondary border border-border rounded-md px-md py-sm text-md text-text min-h-[44px]"
            placeholder="Task name"
            placeholderTextColor={theme.colors.textTertiary}
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
            onSubmitEditing={handleAddTask}
            autoFocus
          />
          <TouchableOpacity onPress={handleAddTask} className="bg-primary px-lg py-sm rounded-lg justify-center min-h-[44px]">
            <Text className="text-white text-md font-semibold">Add</Text>
          </TouchableOpacity>
        </View>
      )}

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
        }
        ListFooterComponent={
          completedTasks.length > 0 ? (
            <View className="mt-lg mx-md border-t border-border pt-md">
              <Text className="text-sm font-semibold text-text-secondary py-sm mb-sm uppercase tracking-widest">
                Completed ({completedTasks.length})
              </Text>
              {completedTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={handleToggleTask}
                  onPress={handleTaskPress}
                />
              ))}
            </View>
          ) : null
        }
      />

      <EditTaskModal
        visible={!!editingTask}
        task={editingTask}
        onClose={() => setEditingTask(null)}
      />
    </SafeAreaView>
  );
}
