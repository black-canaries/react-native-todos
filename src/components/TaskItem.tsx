import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '../types';
import { theme } from '../theme';
import { formatDueDate, isOverdue } from '../utils/dateUtils';

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onPress: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onPress }) => {
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
      style={styles.container}
      onPress={() => onPress(task)}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <TouchableOpacity
          style={[
            styles.checkbox,
            task.completed && styles.checkboxCompleted,
          ]}
          onPress={() => onToggle(task.id)}
        >
          {task.completed && (
            <Ionicons name="checkmark" size={18} color={theme.colors.background} />
          )}
        </TouchableOpacity>

        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text
              style={[
                styles.title,
                task.completed && styles.titleCompleted,
              ]}
              numberOfLines={2}
            >
              {task.title}
            </Text>
            {showPriorityFlag && (
              <Ionicons
                name="flag"
                size={16}
                color={getPriorityColor(task.priority)}
                style={styles.priorityFlag}
              />
            )}
          </View>

          {task.description && (
            <Text style={styles.description} numberOfLines={1}>
              {task.description}
            </Text>
          )}

          <View style={styles.metaRow}>
            {task.dueDate && (
              <View style={styles.metaItem}>
                <Ionicons
                  name="calendar-outline"
                  size={14}
                  color={dueDateColor}
                />
                <Text style={[styles.metaText, { color: dueDateColor }]}>
                  {formatDueDate(task.dueDate)}
                </Text>
              </View>
            )}

            {task.labels.length > 0 && (
              <View style={styles.metaItem}>
                <Ionicons
                  name="pricetag-outline"
                  size={14}
                  color={theme.colors.textSecondary}
                />
                <Text style={styles.metaText}>{task.labels.length}</Text>
              </View>
            )}

            {task.subtasks.length > 0 && (
              <View style={styles.metaItem}>
                <Ionicons
                  name="list-outline"
                  size={14}
                  color={theme.colors.textSecondary}
                />
                <Text style={styles.metaText}>
                  {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}
                </Text>
              </View>
            )}

            {task.comments.length > 0 && (
              <View style={styles.metaItem}>
                <Ionicons
                  name="chatbubble-outline"
                  size={14}
                  color={theme.colors.textSecondary}
                />
                <Text style={styles.metaText}>{task.comments.length}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: theme.borderRadius.full,
    borderWidth: 2,
    borderColor: theme.colors.textSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
    marginTop: 2,
  },
  checkboxCompleted: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  title: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    flex: 1,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: theme.colors.textSecondary,
  },
  priorityFlag: {
    marginLeft: theme.spacing.sm,
  },
  description: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    marginTop: theme.spacing.xs,
  },
  metaText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
});
