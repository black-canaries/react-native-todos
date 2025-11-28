import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { DynamicColorIOS } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuthToken } from '@convex-dev/auth/react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';

export default function TabLayout() {
  const today = new Date().getDate();
  const token = useAuthToken();
  const isAuthenticated = token !== null;
  const currentUser = useQuery(api.users.getCurrentUser);

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  // If authenticated, check if user needs to complete onboarding
  if (isAuthenticated && currentUser !== undefined) {
    if (!currentUser?.onboardingCompleted) {
      return <Redirect href="/(onboarding)" />;
    }
  }

  // Wait for user data to load before showing tabs
  if (currentUser === undefined) {
    return null; // Loading state
  }

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
