import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { Host, Button, Image } from '@expo/ui/swift-ui';
import { glassEffect, clipShape, frame } from '@expo/ui/swift-ui/modifiers';
import { useProject, useProjectMutations } from '../hooks';
import { theme } from '../theme';

interface ProjectDisplayBottomSheetProps {
  visible: boolean;
  projectId: string | undefined;
  onClose: () => void;
}

type LayoutType = 'list' | 'board' | 'calendar';
type GroupingType = 'none' | 'date' | 'priority' | 'label';
type SortingType = 'manual' | 'date' | 'priority' | 'name';
type FilterValue = 'all' | 'today' | 'week' | 'month';

interface DisplaySettingsItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  isLast?: boolean;
  rightElement?: React.ReactNode;
}

function DisplaySettingsItem({ icon, label, value, onPress, isLast = false, rightElement }: DisplaySettingsItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress && !rightElement}
      className={`flex-row items-center justify-between py-md px-md ${
        !isLast ? 'border-b border-border' : ''
      }`}
    >
      <View className="flex-row items-center gap-md">
        <Ionicons name={icon} size={22} color={theme.colors.textSecondary} />
        <Text className="text-md text-text">{label}</Text>
      </View>
      {rightElement ? (
        rightElement
      ) : (
        <View className="flex-row items-center gap-sm">
          {value && <Text className="text-md text-text-secondary">{value}</Text>}
          {onPress && <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />}
        </View>
      )}
    </TouchableOpacity>
  );
}

interface DisplaySectionProps {
  title?: string;
  children: React.ReactNode;
}

function DisplaySection({ title, children }: DisplaySectionProps) {
  return (
    <View className="mb-lg">
      {title && (
        <Text className="text-md font-semibold text-text-secondary px-md mb-sm">{title}</Text>
      )}
      <View className="bg-background-secondary rounded-lg overflow-hidden">
        {children}
      </View>
    </View>
  );
}

interface LayoutOptionProps {
  type: LayoutType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  isSelected: boolean;
  onSelect: () => void;
}

function LayoutOption({ type, label, icon, isSelected, onSelect }: LayoutOptionProps) {
  return (
    <TouchableOpacity
      onPress={onSelect}
      className="flex-1 items-center py-md"
    >
      <View
        className={`w-16 h-16 rounded-lg items-center justify-center mb-sm ${
          isSelected ? 'border-2 border-primary' : 'border border-border'
        }`}
        style={isSelected ? { backgroundColor: theme.colors.primary + '20' } : undefined}
      >
        <Ionicons
          name={icon}
          size={28}
          color={isSelected ? theme.colors.primary : theme.colors.textSecondary}
        />
      </View>
      {isSelected ? (
        <View className="bg-primary rounded-md px-sm py-xs">
          <Text className="text-sm font-semibold text-white">{label}</Text>
        </View>
      ) : (
        <Text className="text-sm text-text-secondary">{label}</Text>
      )}
    </TouchableOpacity>
  );
}

export function ProjectDisplayBottomSheet({ visible, projectId, onClose }: ProjectDisplayBottomSheetProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['92%'], []);

  // Fetch project data and mutations
  const projectData = useProject(projectId);
  const { updateDisplaySettings } = useProjectMutations();

  // Display settings state (local for UI, synced with Convex)
  const [layout, setLayout] = useState<LayoutType>('board');
  const [showCompleted, setShowCompleted] = useState(false);
  const [grouping, setGrouping] = useState<GroupingType>('none');
  const [sorting, setSorting] = useState<SortingType>('manual');
  const [dateFilter, setDateFilter] = useState<FilterValue>('all');
  const [deadlineFilter, setDeadlineFilter] = useState<FilterValue>('all');
  const [priorityFilter, setPriorityFilter] = useState<FilterValue>('all');

  // Sync local state with project data when it loads
  useEffect(() => {
    if (projectData) {
      setShowCompleted(projectData.showCompletedTasks ?? true);
    }
  }, [projectData]);

  useEffect(() => {
    if (visible) {
      bottomSheetModalRef.current?.present();
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [visible]);

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

  const handleShowCompletedChange = useCallback(async (value: boolean) => {
    setShowCompleted(value);
    if (projectId) {
      try {
        await updateDisplaySettings({
          id: projectId as any,
          showCompletedTasks: value,
        });
      } catch (error) {
        console.error('Failed to update display settings:', error);
        // Revert on error
        setShowCompleted(!value);
      }
    }
  }, [projectId, updateDisplaySettings]);

  const handleSave = useCallback(() => {
    console.log('Saving display settings:', {
      layout,
      showCompleted,
      grouping,
      sorting,
      dateFilter,
      deadlineFilter,
      priorityFilter,
    });
    onClose();
  }, [layout, showCompleted, grouping, sorting, dateFilter, deadlineFilter, priorityFilter, onClose]);

  const formatGrouping = (value: GroupingType): string => {
    const labels: Record<GroupingType, string> = {
      none: 'None',
      date: 'Date',
      priority: 'Priority',
      label: 'Label',
    };
    return labels[value];
  };

  const formatSorting = (value: SortingType): string => {
    const labels: Record<SortingType, string> = {
      manual: 'Manual',
      date: 'Date',
      priority: 'Priority',
      name: 'Name',
    };
    return labels[value];
  };

  const formatFilter = (value: FilterValue): string => {
    const labels: Record<FilterValue, string> = {
      all: 'All',
      today: 'Today',
      week: 'This Week',
      month: 'This Month',
    };
    return labels[value];
  };

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      enableDismissOnClose
      backgroundStyle={{
        backgroundColor: theme.colors.background,
      }}
      handleIndicatorStyle={{
        backgroundColor: theme.colors.textTertiary,
      }}
    >
      <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
        {/* Header */}
        <View className="flex-row justify-between items-center px-lg py-md">
          <Host matchContents>
            <Button
              onPress={onClose}
              modifiers={[
                frame({ width: 44, height: 44 }),
                clipShape('circle'),
                glassEffect({ glass: { variant: 'regular' } }),
              ]}
            >
              <Image systemName="xmark" size={20} color={theme.colors.text} />
            </Button>
          </Host>
          <Text className="text-xl font-bold text-text">Display</Text>
          <Host matchContents>
            <Button
              onPress={handleSave}
              modifiers={[
                frame({ width: 44, height: 44 }),
                clipShape('circle'),
                glassEffect({ glass: { variant: 'regular', tint: theme.colors.primary } }),
              ]}
            >
              <Image systemName="checkmark" size={22} color="#ffffff" />
            </Button>
          </Host>
        </View>

        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}
        >
          {/* Layout Section */}
          <DisplaySection title="Layout">
            <View className="flex-row py-md border-b border-border">
              <LayoutOption
                type="list"
                label="List"
                icon="list-outline"
                isSelected={layout === 'list'}
                onSelect={() => setLayout('list')}
              />
              <LayoutOption
                type="board"
                label="Board"
                icon="grid-outline"
                isSelected={layout === 'board'}
                onSelect={() => setLayout('board')}
              />
              <LayoutOption
                type="calendar"
                label="Calendar"
                icon="calendar-outline"
                isSelected={layout === 'calendar'}
                onSelect={() => setLayout('calendar')}
              />
            </View>
            <DisplaySettingsItem
              icon="checkmark-circle-outline"
              label="Completed Tasks"
              rightElement={
                <Switch
                  value={showCompleted}
                  onValueChange={handleShowCompletedChange}
                  trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                  thumbColor="#ffffff"
                />
              }
            />
            <DisplaySettingsItem
              icon="chatbox-outline"
              label="Completed Tasks Feedback"
              onPress={() => {
                // TODO: Implement feedback settings
              }}
              isLast
            />
          </DisplaySection>

          {/* Sort Section */}
          <DisplaySection title="Sort">
            <DisplaySettingsItem
              icon="layers-outline"
              label="Grouping"
              value={formatGrouping(grouping)}
              onPress={() => {
                // TODO: Implement grouping picker
              }}
            />
            <DisplaySettingsItem
              icon="swap-vertical-outline"
              label="Sorting"
              value={formatSorting(sorting)}
              onPress={() => {
                // TODO: Implement sorting picker
              }}
              isLast
            />
          </DisplaySection>

          {/* Filter Section */}
          <DisplaySection title="Filter">
            <DisplaySettingsItem
              icon="calendar-outline"
              label="Date"
              value={formatFilter(dateFilter)}
              onPress={() => {
                // TODO: Implement date filter picker
              }}
            />
            <DisplaySettingsItem
              icon="time-outline"
              label="Deadline"
              value={formatFilter(deadlineFilter)}
              onPress={() => {
                // TODO: Implement deadline filter picker
              }}
            />
            <DisplaySettingsItem
              icon="flag-outline"
              label="Priority"
              value={formatFilter(priorityFilter)}
              onPress={() => {
                // TODO: Implement priority filter picker
              }}
              isLast
            />
          </DisplaySection>
        </BottomSheetScrollView>
      </SafeAreaView>
    </BottomSheetModal>
  );
}
