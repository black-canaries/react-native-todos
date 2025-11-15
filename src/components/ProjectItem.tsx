import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Project } from '../types';
import { theme } from '../theme';

interface ProjectItemProps {
  project: Project;
  taskCount?: number;
  onPress: (project: Project) => void;
}

export const ProjectItem: React.FC<ProjectItemProps> = ({
  project,
  taskCount = 0,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(project)}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={[styles.colorDot, { backgroundColor: project.color }]} />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{project.name}</Text>
          {taskCount > 0 && <Text style={styles.count}>{taskCount}</Text>}
        </View>
        {project.isFavorite && (
          <Ionicons
            name="star"
            size={16}
            color={theme.colors.warning}
            style={styles.favoriteIcon}
          />
        )}
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
    alignItems: 'center',
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.md,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    flex: 1,
  },
  count: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
  },
  favoriteIcon: {
    marginLeft: theme.spacing.sm,
  },
});
