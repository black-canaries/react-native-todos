import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Task } from '../types';
import { useTaskMutations, useAllProjects } from '../hooks';
import { theme } from '../theme';

interface EditTaskModalProps {
  visible: boolean;
  task: Task | null;
  onClose: () => void;
}

export function EditTaskModal({ visible, task, onClose }: EditTaskModalProps) {
  const { updateTask } = useTaskMutations();
  const projectsData = useAllProjects();

  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedPriority, setEditedPriority] = useState<'p1' | 'p2' | 'p3' | 'p4'>('p4');
  const [editedDueDate, setEditedDueDate] = useState<Date | null>(null);
  const [showDateOptions, setShowDateOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form when task changes
  React.useEffect(() => {
    if (task) {
      setEditedTitle(task.title);
      setEditedDescription(task.description || '');
      setEditedPriority((task.priority as any) || 'p4');
      setEditedDueDate(task.dueDate ? new Date(task.dueDate) : null);
    }
  }, [task, visible]);

  const projectName = useMemo(() => {
    if (!projectsData || !task) return 'Inbox';
    const project = projectsData.find(p => p._id === task.projectId);
    return project?.name || 'Inbox';
  }, [projectsData, task]);

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
    setEditedDueDate(newDate);
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

  const handleSave = async () => {
    if (!task || !editedTitle.trim()) {
      Alert.alert('Error', 'Task title cannot be empty');
      return;
    }

    try {
      setIsLoading(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await updateTask({
        id: task.id as any,
        title: editedTitle.trim(),
        description: editedDescription.trim() || undefined,
        priority: editedPriority,
        dueDate: editedDueDate ? editedDueDate.getTime() : undefined,
      });
      onClose();
    } catch (error) {
      console.error('Failed to update task:', error);
      Alert.alert('Error', 'Failed to update task');
    } finally {
      setIsLoading(false);
    }
  };

  if (!task) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-black/80" edges={['top', 'bottom']}>
        <View className="flex-1 justify-end">
          {/* Modal Content */}
          <View className="bg-background-secondary rounded-t-3xl max-h-[90%]">
            {/* Header */}
            <View className="flex-row justify-between items-center px-lg py-md border-b border-border">
              <TouchableOpacity onPress={onClose} disabled={isLoading}>
                <Ionicons name="close" size={28} color={theme.colors.text} />
              </TouchableOpacity>
              <Text className="text-lg font-semibold text-text flex-1 ml-md">Edit Task</Text>
              <TouchableOpacity onPress={handleSave} disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color={theme.colors.primary} />
                ) : (
                  <Ionicons name="checkmark" size={28} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="px-lg py-md">
              {/* Task Title */}
              <View className="mb-lg">
                <Text className="text-md font-semibold text-text mb-sm">Title</Text>
                <TextInput
                  className="bg-background border border-border rounded-lg px-md py-sm text-md text-text min-h-[44px]"
                  placeholder="Task name"
                  placeholderTextColor={theme.colors.textTertiary}
                  value={editedTitle}
                  onChangeText={setEditedTitle}
                  editable={!isLoading}
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
                      onPress={() => setEditedPriority(priority)}
                      className={`flex-1 rounded-lg py-sm border-2 ${
                        editedPriority === priority ? 'border-primary' : 'border-border'
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
                    <Text className={editedDueDate ? 'text-text' : 'text-text-tertiary'}>
                      {formatDate(editedDueDate)}
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

                {editedDueDate && (
                  <TouchableOpacity
                    onPress={() => setEditedDueDate(null)}
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
                  value={editedDescription}
                  onChangeText={setEditedDescription}
                  multiline
                  textAlignVertical="top"
                  editable={!isLoading}
                />
              </View>

              {/* Delete Button */}
              <TouchableOpacity
                className="bg-red-900/30 rounded-lg py-sm mt-lg mb-lg border border-red-500/50"
                disabled={isLoading}
              >
                <Text className="text-red-500 text-center font-semibold">Delete Task</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
