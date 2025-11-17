import React, { useState } from 'react';
import {
  View,
  Text,
  SectionList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { TaskItem } from '../../src/components/TaskItem';
import { Task } from '../../src/types';
import { mockTasks } from '../../src/data/mockData';
import { getUpcomingTasks, formatDueDate, isToday, isTomorrow } from '../../src/utils/dateUtils';
import { theme } from '../../src/theme';

interface TaskSection {
  title: string;
  data: Task[];
}

export default function UpcomingScreen() {
  const [tasks, setTasks] = useState<Task[]>(
    getUpcomingTasks(mockTasks).filter(t => !t.completed)
  );

  const handleToggleTask = (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks.filter(t => !t.completed));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleTaskPress = (task: Task) => {
    Alert.alert(
      task.title,
      task.description || 'No description',
      [{ text: 'OK' }]
    );
  };

  const groupTasksByDate = (): TaskSection[] => {
    const grouped: { [key: string]: Task[] } = {};

    tasks.forEach(task => {
      if (task.dueDate) {
        const dateKey = task.dueDate.split('T')[0];
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
        }
      />
    </SafeAreaView>
  );
}
