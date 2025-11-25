import React from 'react';
import {
  Button,
  ContextMenu,
  Host,
  Switch,
} from '@expo/ui/swift-ui';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

interface InboxContextMenuProps {
  showCompleted: boolean;
  onToggleShowCompleted: (value: boolean) => void;
  onSelectMultipleTasks: () => void;
  onAddSection: () => void;
}

export function InboxContextMenu({
  showCompleted,
  onToggleShowCompleted,
  onSelectMultipleTasks,
  onAddSection,
}: InboxContextMenuProps) {
  return (
    <Host>
      <ContextMenu>
        <ContextMenu.Items>
          {/* Add Section */}
          <Button
            systemImage="distribute.vertical"
            onPress={() => {
              console.log('Add section pressed');
              onAddSection();
            }}
          >
            Add Section
          </Button>

          {/* Show/Hide Completed Tasks Toggle */}
          <Switch
            value={showCompleted}
            label="Show Completed"
            variant="checkbox"
            onValueChange={onToggleShowCompleted}
          />

          {/* Select Multiple Tasks */}
          <Button
            systemImage="checkmark.circle"
            onPress={() => {
              console.log('Select multiple tasks pressed');
              onSelectMultipleTasks();
            }}
          >
            Select Multiple
          </Button>
        </ContextMenu.Items>

        <ContextMenu.Trigger>
          <Ionicons name="settings-outline" size={24} color={theme.colors.icon} />
        </ContextMenu.Trigger>
      </ContextMenu>
    </Host>
  );
}
