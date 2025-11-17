import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
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

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row justify-between items-center px-md py-sm border-b border-border">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={theme.colors.text} />
        </TouchableOpacity>
        <View className="flex-1 flex-row items-center justify-center">
          <View
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: project.color }}
          />
          <Text className="text-xxl font-bold text-text ml-sm">{project.name}</Text>
        </View>
        <View className="w-7" />
      </View>

      <View className="flex-1 pb-xxl">
        {tasks.length > 0 && (
          <>
            <Text className="text-lg font-semibold text-text px-md py-md pt-lg bg-background border-b border-border">Active Tasks</Text>
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
            <Text className="text-lg font-semibold text-text px-md py-md pt-lg bg-background border-b border-border">Completed</Text>
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
