import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { DynamicColorIOS } from 'react-native';

export default function TabLayout() {
  const today = new Date().getDate();

  return (
    <NativeTabs
      disableTransparentOnScrollEdge
      minimizeBehavior="onScrollDown"
      tintColor={DynamicColorIOS({
        light: '#de4c4a',
        dark: '#de4c4a',
      })}
    >
      <NativeTabs.Trigger name='(projects)'>
        <Icon sf="list.bullet" />
        <Label>Projects</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name='today'>
        <Icon sf={`${today}.calendar` as any} />
        <Label>Today</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name='upcoming'>
        <Icon sf="calendar.badge.clock" />
        <Label>Upcoming</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name='inbox'>
        <Icon sf="tray" />
        <Label>Inbox</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name='ai'>
        <Icon sf="sparkles" />
        <Label>AI</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
