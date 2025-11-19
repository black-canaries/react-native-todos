import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import BottomSheet, { BottomSheetModal, BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { Task } from '../types';
import { useTaskMutations, useAllProjects } from '../hooks';
import { theme } from '../theme';

interface CreateTaskBottomSheetProps {
  visible: boolean;
  projectId: string; // 'inbox' or project-specific ID
  onClose: () => void;
  presetDueDate?: Date | null; // For "Today" screen, etc.
}

export function CreateTaskBottomSheet({
  visible,
  projectId,
  onClose,
  presetDueDate,
}: CreateTaskBottomSheetProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { createTask } = useTaskMutations();
  const projectsData = useAllProjects();

  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState<'p1' | 'p2' | 'p3' | 'p4'>('p4');
  const [taskDueDate, setTaskDueDate] = useState<Date | null>(presetDueDate || null);
  const [showDateOptions, setShowDateOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Snap points for the bottom sheet
  const snapPoints = useMemo(() => ['50%', '90%'], []);

  // Update due date when presetDueDate changes
  useEffect(() => {
    if (presetDueDate) {
      setTaskDueDate(presetDueDate);
    }
  }, [presetDueDate]);

  // Handle visibility changes
  useEffect(() => {
    if (visible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [visible]);

  // Reset form when sheet closes
  useEffect(() => {
    if (!visible) {
      setTaskTitle('');
      setTaskDescription('');
      setTaskPriority('p4');
      setTaskDueDate(presetDueDate || null);
      setShowDateOptions(false);
    }
  }, [visible, presetDueDate]);

  const projectName = useMemo(() => {
    if (!projectsData) return 'Inbox';
    const project = projectsData.find(p => p._id === projectId);
    return project?.name || 'Inbox';
  }, [projectsData, projectId]);

  const priorityLabels = {
    p1: 'Urgent',
    p2: 'High',
    p3: 'Medium',
    p4: 'Low',
  };

  const priorityColors = {
    p1: theme.colors.priority1,
    p2: theme.colors.priority2,
    p3: theme.colors.priority3,
    p4: theme.colors.priority4,
  };

  const handleDateSelect = (daysFromNow: number) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + daysFromNow);
    newDate.setHours(0, 0, 0, 0);
    setTaskDueDate(newDate);
    setShowDateOptions(false);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'No due date';
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleCreate = async () => {
    if (!taskTitle.trim()) {
      Alert.alert('Error', 'Task title cannot be empty');
      return;
    }

    try {
      setIsLoading(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await createTask({
        title: taskTitle.trim(),
        description: taskDescription.trim() || undefined,
        priority: taskPriority,
        projectId: projectId as any,
        dueDate: taskDueDate ? taskDueDate.getTime() : undefined,
        labels: [],
      });
      onClose();
    } catch (error) {
      console.error('Failed to create task:', error);
      Alert.alert('Error', 'Failed to create task');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    }
  }, [onClose]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.8}
        pressBehavior="close"
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      enableDismissOnClose
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      backgroundStyle={{
        backgroundColor: theme.colors.backgroundSecondary,
      }}
      handleIndicatorStyle={{
        backgroundColor: theme.colors.border,
      }}
    >
      <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
        {/* Header */}
        <View className="flex-row justify-between items-center px-lg py-md border-b border-border">
          <TouchableOpacity onPress={onClose} disabled={isLoading}>
            <Ionicons name="close" size={28} color={theme.colors.text} />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-text flex-1 ml-md">Add Task</Text>
          <TouchableOpacity onPress={handleCreate} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color={theme.colors.primary} />
            ) : (
              <Ionicons name="checkmark" size={28} color={theme.colors.primary} />
            )}
          </TouchableOpacity>
        </View>

        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}
        >
          {/* Task Title */}
          <View className="mb-lg">
            <Text className="text-md font-semibold text-text mb-sm">Title</Text>
            <TextInput
              className="bg-background border border-border rounded-lg px-md py-sm text-md text-text min-h-[44px]"
              placeholder="Task name"
              placeholderTextColor={theme.colors.textTertiary}
              value={taskTitle}
              onChangeText={setTaskTitle}
              editable={!isLoading}
              autoFocus
            />
          </View>

          {/* Project Display */}
          <View className="mb-lg flex-row items-center gap-sm">
            <Ionicons name="folder-outline" size={20} color={theme.colors.textSecondary} />
            <Text className="text-sm text-text-secondary">{projectName}</Text>
          </View>

          {/* Priority */}
          <View className="mb-lg">
            <Text className="text-md font-semibold text-text mb-sm">Priority</Text>
            <View className="flex-row gap-sm">
              {(['p1', 'p2', 'p3', 'p4'] as const).map((priority) => (
                <TouchableOpacity
                  key={priority}
                  onPress={() => setTaskPriority(priority)}
                  className={`flex-1 rounded-lg py-sm border-2 ${
                    taskPriority === priority ? 'border-primary' : 'border-border'
                  }`}
                  style={{ backgroundColor: priorityColors[priority] + '20' }}
                  disabled={isLoading}
                >
                  <Text
                    className="text-sm font-semibold text-center"
                    style={{ color: priorityColors[priority] }}
                  >
                    {priorityLabels[priority]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Due Date */}
          <View className="mb-lg">
            <Text className="text-md font-semibold text-text mb-sm">Due Date</Text>
            <TouchableOpacity
              onPress={() => setShowDateOptions(!showDateOptions)}
              className="bg-background border border-border rounded-lg px-md py-sm min-h-[44px] justify-center"
              disabled={isLoading}
            >
              <View className="flex-row items-center justify-between">
                <Text className={taskDueDate ? 'text-text' : 'text-text-tertiary'}>
                  {formatDate(taskDueDate)}
                </Text>
                <Ionicons name={showDateOptions ? 'chevron-up' : 'chevron-down'} size={20} color={theme.colors.textSecondary} />
              </View>
            </TouchableOpacity>

            {showDateOptions && (
              <View className="bg-background border border-border rounded-lg mt-sm p-sm gap-xs">
                <TouchableOpacity
                  onPress={() => handleDateSelect(0)}
                  className="px-md py-sm rounded-lg bg-background-tertiary"
                >
                  <Text className="text-text">Today</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDateSelect(1)}
                  className="px-md py-sm rounded-lg bg-background-tertiary"
                >
                  <Text className="text-text">Tomorrow</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDateSelect(7)}
                  className="px-md py-sm rounded-lg bg-background-tertiary"
                >
                  <Text className="text-text">Next week</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDateSelect(30)}
                  className="px-md py-sm rounded-lg bg-background-tertiary"
                >
                  <Text className="text-text">Next month</Text>
                </TouchableOpacity>
              </View>
            )}

            {taskDueDate && (
              <TouchableOpacity
                onPress={() => setTaskDueDate(null)}
                className="mt-sm flex-row items-center justify-center gap-xs py-sm"
              >
                <Ionicons name="close-circle" size={16} color={theme.colors.textTertiary} />
                <Text className="text-sm text-text-tertiary">Clear date</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Description */}
          <View className="mb-lg">
            <Text className="text-md font-semibold text-text mb-sm">Description</Text>
            <TextInput
              className="bg-background border border-border rounded-lg px-md py-sm text-md text-text min-h-[100px]"
              placeholder="Add a description..."
              placeholderTextColor={theme.colors.textTertiary}
              value={taskDescription}
              onChangeText={setTaskDescription}
              multiline
              textAlignVertical="top"
              editable={!isLoading}
            />
          </View>
        </BottomSheetScrollView>
      </SafeAreaView>
    </BottomSheetModal>
  );
}
