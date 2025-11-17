import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import * as Haptics from 'expo-haptics';
import { TaskItem } from '../../src/components/TaskItem';
import { Task } from '../../src/types';
import { mockTasks } from '../../src/data/mockData';
import { theme } from '../../src/theme';

export default function InboxScreen() {
  const [tasks, setTasks] = useState<Task[]>(
    mockTasks.filter(t => t.projectId === 'inbox' && !t.completed)
  );
  const [completedTasks, setCompletedTasks] = useState<Task[]>(
    mockTasks.filter(t => t.projectId === 'inbox' && t.completed)
  );
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleToggleTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setTasks(tasks.filter(t => t.id !== taskId));
      setCompletedTasks([{ ...task, completed: true }, ...completedTasks]);
    } else {
      const completedTask = completedTasks.find(t => t.id === taskId);
      if (completedTask) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setCompletedTasks(completedTasks.filter(t => t.id !== taskId));
        setTasks([...tasks, { ...completedTask, completed: false }]);
      }
    }
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title: newTaskTitle.trim(),
        completed: false,
        priority: 4,
        createdAt: new Date().toISOString(),
        projectId: 'inbox',
        labels: [],
        subtasks: [],
        order: tasks.length,
        comments: [],
        attachments: [],
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      setShowInput(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
            onToggle={handleToggleTask}
            onPress={handleTaskPress}
          />
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <View className="flex-row justify-between items-center px-md py-sm border-b border-border">
        <Text className="text-xxl font-bold text-text">Inbox</Text>
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
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        onDragEnd={({ data }) => {
          setTasks(data);
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
        contentContainerStyle={{ paddingBottom: 96 }}
        ListEmptyComponent={
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
    </SafeAreaView>
  );
}
