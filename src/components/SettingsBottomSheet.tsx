import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { Host, Button, Image } from '@expo/ui/swift-ui';
import { glassEffect, clipShape, frame } from '@expo/ui/swift-ui/modifiers';
import { theme } from '../theme';

interface SettingsBottomSheetProps {
  visible: boolean;
  onClose: () => void;
}

interface SettingsItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  isLast?: boolean;
}

function SettingsItem({ icon, label, value, onPress, isLast = false }: SettingsItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center justify-between py-md px-md ${
        !isLast ? 'border-b border-border' : ''
      }`}
    >
      <View className="flex-row items-center gap-md">
        <Ionicons name={icon} size={22} color={theme.colors.primary} />
        <Text className="text-md text-text">{label}</Text>
      </View>
      <View className="flex-row items-center gap-sm">
        {value && <Text className="text-md text-text-secondary">{value}</Text>}
        <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );
}

interface SettingsSectionProps {
  title?: string;
  children: React.ReactNode;
}

function SettingsSection({ title, children }: SettingsSectionProps) {
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

export function SettingsBottomSheet({ visible, onClose }: SettingsBottomSheetProps) {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['92%'], []);

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
        <View className="flex-row justify-center items-center px-lg py-md relative">
          <Text className="text-xl font-bold text-text">Settings</Text>
          <View className="absolute right-lg">
            <Host matchContents>
              <Button
                onPress={onClose}
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
        </View>

        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}
        >
          {/* Pro Plan Banner */}
          <View className="mb-lg">
            <TouchableOpacity className="bg-background-secondary rounded-lg p-md flex-row items-center justify-between">
              <View className="flex-row items-center gap-md">
                <View className="w-10 h-10 rounded-lg bg-warning/20 items-center justify-center">
                  <Ionicons name="star" size={20} color={theme.colors.warning} />
                </View>
                <View>
                  <Text className="text-md font-semibold text-text">Pro Plan</Text>
                  <Text className="text-sm text-text-secondary">Until 30 Oct 2026</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Main Settings */}
          <SettingsSection>
            <SettingsItem icon="person-outline" label="Account" />
            <SettingsItem icon="settings-outline" label="General" />
            <SettingsItem icon="calendar-outline" label="Calendar" isLast />
          </SettingsSection>

          {/* Personalization */}
          <SettingsSection title="Personalization">
            <SettingsItem icon="color-palette-outline" label="Theme" value="Dark" />
            <SettingsItem icon="apps-outline" label="App Icon" value="Todoist" />
            <SettingsItem icon="list-outline" label="Navigation" />
            <SettingsItem icon="add-circle-outline" label="Quick Add" isLast />
          </SettingsSection>

          {/* Productivity */}
          <SettingsSection title="Productivity">
            <SettingsItem icon="trending-up-outline" label="Productivity" isLast />
          </SettingsSection>

          {/* About */}
          <SettingsSection title="About">
            <SettingsItem icon="help-circle-outline" label="Help & Feedback" />
            <SettingsItem icon="information-circle-outline" label="About" isLast />
          </SettingsSection>
        </BottomSheetScrollView>
      </SafeAreaView>
    </BottomSheetModal>
  );
}
