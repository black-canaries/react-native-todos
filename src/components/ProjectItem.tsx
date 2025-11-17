import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
      className="bg-background-secondary py-sm px-md mx-md my-xs border border-border rounded-md min-h-[52px] justify-center"
      onPress={() => onPress(project)}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center">
        <View
          className="w-3 h-3 rounded-full mr-md"
          style={{ backgroundColor: project.color }}
        />
        <View className="flex-1 flex-row items-center">
          <Text className="text-md font-semibold text-text flex-1">{project.name}</Text>
          {taskCount > 0 && (
            <Text className="text-md font-semibold text-text-secondary ml-sm">{taskCount}</Text>
          )}
        </View>
        {project.isFavorite && (
          <Ionicons
            name="star"
            size={16}
            color={theme.colors.warning}
            className="ml-sm"
          />
        )}
      </View>
    </TouchableOpacity>
  );
};
