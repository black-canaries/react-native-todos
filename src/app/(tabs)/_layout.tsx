import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  const today = new Date().getDate();

  return (
    <NativeTabs>
      <NativeTabs.Trigger name='browse'>
        <Label>Browse</Label>
        <Icon sf="list.bullet" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name='today'>
        <Label>Today</Label>
        <Icon sf={`${today}.calendar` as any} />
      </NativeTabs.Trigger>
      
      <NativeTabs.Trigger name='upcoming'>
        <Label>Upcoming</Label>
        <Icon sf="calendar.badge.clock" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name='(inbox)'>
        <Label>Inbox</Label>
        <Icon sf="tray" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
