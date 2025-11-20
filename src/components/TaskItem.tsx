import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '../types';
import { theme } from '../theme';
import { formatDueDate, isOverdue } from '../utils/dateUtils';

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onPress: (task: Task) => void;
  onLongPress?: () => void;
  isActive?: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onPress, onLongPress, isActive }) => {
  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return theme.colors.priority1;
      case 2:
        return theme.colors.priority2;
      case 3:
        return theme.colors.priority3;
      default:
        return theme.colors.priority4;
    }
  };

  const showPriorityFlag = task.priority < 4;
  const dueDateColor =
    task.dueDate && isOverdue(task.dueDate)
      ? theme.colors.overdue
      : theme.colors.textSecondary;

  return (
    <TouchableOpacity
      className={`bg-background-secondary px-md py-sm mx-md my-xs border border-border rounded-md ${
        task.completed ? 'opacity-50' : ''
      } ${isActive ? 'opacity-70' : ''}`}
      onPress={() => onPress(task)}
      onLongPress={onLongPress}
      disabled={isActive}
      activeOpacity={0.7}
    >
      <View className="flex-row items-start">
        <TouchableOpacity
          className={`w-6 h-6 rounded-full border-2 border-text-secondary items-center justify-center mr-md mt-[2px] ${
            task.completed ? 'bg-success border-success' : ''
          }`}
          onPress={() => onToggle(task.id)}
        >
          {task.completed && (
            <Ionicons name="checkmark" size={18} color={theme.colors.background} />
          )}
        </TouchableOpacity>

        <View className="flex-1">
          <View className="flex-row items-center mb-xs">
            <Text
              className={`text-md font-semibold text-text flex-1 ${
                task.completed ? 'line-through text-text-secondary' : ''
              }`}
              numberOfLines={2}
            >
              {task.title}
            </Text>
            {showPriorityFlag && (
              <Ionicons
                name="flag"
                size={16}
                color={getPriorityColor(task.priority)}
                className="ml-sm"
              />
            )}
          </View>

          {task.description && (
            <Text className="text-sm text-text-secondary mb-xs" numberOfLines={1}>
              {task.description}
            </Text>
          )}

          <View className="flex-row flex-wrap mt-xs">
            {task.dueDate && (
              <View className="flex-row items-center mr-md mt-xs">
                <Ionicons
                  name="calendar-outline"
                  size={14}
                  color={dueDateColor}
                />
                <Text className="text-xs text-text-secondary ml-[4px]">
                  {formatDueDate(task.dueDate)}
                </Text>
              </View>
            )}

            {task.labels.length > 0 && (
              <View className="flex-row items-center mr-md mt-xs">
                <Ionicons
                  name="pricetag-outline"
                  size={14}
                  color={theme.colors.textSecondary}
                />
                <Text className="text-xs text-text-secondary ml-[4px]">{task.labels.length}</Text>
              </View>
            )}

            {task.subtasks.length > 0 && (
              <View className="flex-row items-center mr-md mt-xs">
                <Ionicons
                  name="list-outline"
                  size={14}
                  color={theme.colors.textSecondary}
                />
                <Text className="text-xs text-text-secondary ml-[4px]">
                  {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}
                </Text>
              </View>
            )}

            {task.comments.length > 0 && (
              <View className="flex-row items-center mr-md mt-xs">
                <Ionicons
                  name="chatbubble-outline"
                  size={14}
                  color={theme.colors.textSecondary}
                />
                <Text className="text-xs text-text-secondary ml-[4px]">{task.comments.length}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
