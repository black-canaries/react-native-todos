import React, { useMemo, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import BottomSheet, { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { TaskItem } from '../../components/TaskItem';
import { CreateTaskBottomSheet } from '../../components/CreateTaskBottomSheet';
import { Task } from '../../types';
import { useUpcomingTasks, useTaskMutations, useAllProjects } from '../../hooks';
import { convexTasksToTasks } from '../../utils/convexAdapter';
import { formatDueDate, isToday, isTomorrow } from '../../utils/dateUtils';
import { theme } from '../../theme';

interface TaskSection {
  title: string;
  data: Task[];
}

export default function UpcomingScreen() {
  const upcomingTasksData = useUpcomingTasks();
  const { toggleComplete } = useTaskMutations();
  const projectsData = useAllProjects();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCreateSheet, setShowCreateSheet] = useState(false);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // Get the inbox project ID
  const inboxProject = useMemo(() => {
    if (!projectsData || projectsData.length === 0) return null;
    return projectsData.find((p) => p.name === 'Inbox') || projectsData[0];
  }, [projectsData]);

  const { activeTasks, completedTasks } = useMemo(() => {
    if (!upcomingTasksData) return { activeTasks: [], completedTasks: [] };
    const converted = convexTasksToTasks(upcomingTasksData);
    return {
      activeTasks: converted.filter(t => !t.completed),
      completedTasks: converted
        .filter(t => t.completed)
        .sort((a, b) => {
          // Sort completed by completedAt ascending (oldest first)
          return (a.completedAt ? new Date(a.completedAt).getTime() : 0) -
            (b.completedAt ? new Date(b.completedAt).getTime() : 0);
        }),
    };
  }, [upcomingTasksData]);

  // Find original Convex task by converted ID to get the actual Convex ID
  const getConvexTaskId = (taskId: string) => {
    if (!upcomingTasksData) return null;
    const convexTask = upcomingTasksData.find(t => t._id === taskId);
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

  const handleTaskPress = useCallback((task: Task) => {
    setSelectedTask(task);
    bottomSheetModalRef.current?.present();
  }, []);

  const groupTasksByDate = (): TaskSection[] => {
    const grouped: { [key: string]: Task[] } = {};

    // Only group active tasks by date
    activeTasks.forEach(task => {
      if (task.dueDate) {
        // Handle both ISO string and numeric timestamps
        const dateStr = typeof task.dueDate === 'string'
          ? task.dueDate
          : new Date(task.dueDate).toISOString();
        const dateKey = dateStr.split('T')[0];
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(task);
      }
    });

    const sections: TaskSection[] = Object.keys(grouped)
      .sort()
      .map(dateKey => {
        const date = new Date(dateKey);
        let title = formatDueDate(dateKey);

        if (isToday(dateKey)) {
          title = 'Today';
        } else if (isTomorrow(dateKey)) {
          title = 'Tomorrow';
        } else {
          const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          title = `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
        }

        return {
          title,
          data: grouped[dateKey].sort((a, b) => a.priority - b.priority),
        };
      });

    return sections;
  };

  const sections = groupTasksByDate();

  // Show loading state while data is being fetched
  if (upcomingTasksData === undefined) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center" edges={['top']}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row justify-between items-center px-md py-sm border-b border-border">
        <Text className="text-xxl font-bold text-text">Upcoming</Text>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 96 }}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggle={handleToggleTask}
            onPress={handleTaskPress}
          />
        )}
        renderSectionHeader={({ section: { title, data } }) => (
          <View className="flex-row justify-between items-center bg-background px-md py-md pt-lg border-b border-border">
            <Text className="text-lg font-semibold text-text">{title}</Text>
            <Text className="text-md font-semibold text-text-secondary">{data.length}</Text>
          </View>
        )}
        stickySectionHeadersEnabled
        ListEmptyComponent={
          activeTasks.length === 0 && completedTasks.length === 0 ? (
            <View className="items-center justify-center py-xxl px-md">
              <Ionicons
                name="calendar-outline"
                size={64}
                color={theme.colors.textTertiary}
              />
              <Text className="text-xl font-semibold text-text-secondary mt-md">No upcoming tasks</Text>
              <Text className="text-md text-text-tertiary mt-sm">
                You're all caught up!
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          <View>
            {/* Completed Tasks Section */}
            {completedTasks.length > 0 && (
              <View className="mt-lg mx-md">
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

      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={['25%']}
        enablePanDownToClose
        backgroundStyle={{
          backgroundColor: theme.colors.backgroundSecondary,
        }}
        handleIndicatorStyle={{
          backgroundColor: theme.colors.border,
        }}
      >
        <BottomSheetView style={{ flex: 1, paddingHorizontal: 16, paddingBottom: 16 }}>
          {selectedTask && (
            <View>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: theme.colors.text,
                  marginBottom: 12,
                }}
              >
                {selectedTask.title}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: theme.colors.textSecondary,
                  lineHeight: 22,
                }}
              >
                {selectedTask.description || 'No description'}
              </Text>
            </View>
          )}
        </BottomSheetView>
      </BottomSheetModal>

      <CreateTaskBottomSheet
        visible={showCreateSheet}
        projectId={inboxProject?._id || 'inbox'}
        onClose={() => setShowCreateSheet(false)}
      />
    </SafeAreaView>
  );
}
