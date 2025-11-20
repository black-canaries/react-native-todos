---
name: react-native-expo
description: React Native development with Expo, NativeWind (Tailwind for React Native), Reanimated for smooth animations, Convex backend with auth, and pnpm workflow. Use when working with React Native/Expo projects, mobile animations, Tailwind styling in React Native, Convex backend integration, or when managing dependencies with pnpm in Expo apps.
---

<objective>
Provide comprehensive guidance for building modern React Native applications using Expo with NativeWind (Tailwind CSS), Reanimated (high-performance animations), Convex (real-time backend), and pnpm (package management). Enable developers to quickly implement styling, animations, and backend features following best practices.
</objective>

<quick_start>
**Get started in 3 steps:**

1. Install dependencies: `pnpm install`
2. Start dev server: `pnpm expo start` (use `pnpm`, never `npm`)
3. Start backend: `pnpm convex dev`

**Root layout setup (app/_layout.tsx):**
```tsx
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ConvexProvider client={convex}>
        <Stack />
      </ConvexProvider>
    </GestureHandlerRootView>
  );
}
```

See `<stack>` and `<configuration_requirements>` sections for detailed setup.
</quick_start>

<stack>
**Core Technologies:**
- **Expo**: React Native framework with managed workflow and file-based routing (Expo Router)
- **NativeWind v4**: Tailwind CSS for React Native using `className` prop
- **Reanimated v3+**: UI-thread animations with worklets for 60fps performance
- **Convex**: Real-time backend with automatic sync, type-safe queries, and built-in auth
- **pnpm**: Fast, disk-efficient package manager (required for this stack)

**Common commands:**
- `pnpm expo start` - Start dev server
- `pnpm expo start --ios/android/web` - Platform-specific
- `pnpm expo start -c` - Clear cache (after config changes)
- `pnpm convex dev` - Start Convex backend
</stack>

<nativewind_essentials>
<basic_usage>
NativeWind brings Tailwind CSS to React Native via the `className` prop:

```tsx
import { View, Text } from 'react-native';

export default function Component() {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900 p-4">
      <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Hello NativeWind
      </Text>
      <View className="w-full max-w-md bg-gray-100 dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <Text className="text-base text-gray-600 dark:text-gray-400">
          Card content
        </Text>
      </View>
    </View>
  );
}
```
</basic_usage>

<common_patterns>
**Card:**
```tsx
<View className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md border border-gray-200 dark:border-gray-700">
  {/* content */}
</View>
```

**Button:**
```tsx
<Pressable className="bg-blue-500 active:bg-blue-600 px-6 py-3 rounded-lg">
  <Text className="text-white font-semibold text-center">Press Me</Text>
</Pressable>
```

**Input:**
```tsx
<TextInput
  className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white"
  placeholderTextColor="#9CA3AF"
/>
```

**List Item:**
```tsx
<View className="flex-row items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
  {/* content */}
</View>
```
</common_patterns>

<responsive_and_dark_mode>
**Responsive:** `w-full md:w-1/2 lg:w-1/3` `text-base sm:text-lg md:text-xl`

**Dark Mode:** `bg-white dark:bg-gray-900` `text-gray-900 dark:text-white`

**Platform-Specific:** `ios:pt-12 android:pt-4 web:cursor-pointer`
</responsive_and_dark_mode>
</nativewind_essentials>

<reanimated_essentials>
<basic_animations>
Reanimated runs animations on the UI thread using worklets for 60fps performance:

```tsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import { Pressable } from 'react-native';

function AnimatedButton() {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => { scale.value = withSpring(0.95); }}
      onPressOut={() => { scale.value = withSpring(1); }}
    >
      <Animated.View style={animatedStyle} className="bg-blue-500 px-6 py-3 rounded-lg">
        <Text className="text-white font-semibold">Press Me</Text>
      </Animated.View>
    </Pressable>
  );
}
```
</basic_animations>

<gesture_handling>
Use Gesture Handler for interactive animations:

```tsx
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

function DraggableBox() {
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onChange((event) => {
      offsetX.value += event.changeX;
      offsetY.value += event.changeY;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: offsetX.value },
      { translateY: offsetY.value },
    ],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={animatedStyle} className="w-20 h-20 bg-red-500 rounded-lg">
        {/* content */}
      </Animated.View>
    </GestureDetector>
  );
}
```
</gesture_handling>

<layout_animations>
Built-in entering/exiting animations:

```tsx
import Animated, { FadeIn, FadeOut, Layout, SlideInLeft } from 'react-native-reanimated';

<Animated.View
  entering={FadeIn.duration(300)}
  exiting={FadeOut.duration(300)}
  layout={Layout.springify()}
  className="p-4"
>
  {/* content */}
</Animated.View>

<Animated.View entering={SlideInLeft.delay(200).springify()}>
  {/* Delayed slide-in */}
</Animated.View>
```

**Available animations:** FadeIn/Out, SlideIn/Out, ZoomIn/Out, BounceIn/Out, FlipIn/Out
</layout_animations>

<worklets>
Functions marked with 'worklet' run on UI thread. Use `runOnUI(() => {})` for UI thread execution from JS, and `runOnJS(fn)()` for JS thread execution from worklets.
</worklets>
</reanimated_essentials>

<convex_essentials>
<setup>
**1. Install and initialize:**
```bash
pnpm add convex
pnpm convex dev
```

**2. Environment variable (.env):**
```
EXPO_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
```

**3. Provider setup (see quick_start above)**
</setup>

<queries_and_mutations>
**Define schema (convex/schema.ts):**
```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    userId: v.id("users"),
    text: v.string(),
    completed: v.boolean(),
    dueDate: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_completed", ["userId", "completed"]),
});
```

**Server functions (convex/tasks.ts):**
```typescript
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth.config";

export const list = query({
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const add = mutation({
  args: { text: v.string() },
  handler: async (ctx, { text }) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    await ctx.db.insert("tasks", {
      userId,
      text,
      completed: false,
    });
  },
});

export const toggle = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, { taskId }) => {
    const task = await ctx.db.get(taskId);
    if (!task) throw new Error("Task not found");

    await ctx.db.patch(taskId, { completed: !task.completed });
  },
});
```

**Client usage:**
```tsx
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

function TaskList() {
  const tasks = useQuery(api.tasks.list);
  const addTask = useMutation(api.tasks.add);
  const toggleTask = useMutation(api.tasks.toggle);

  if (tasks === undefined) return <ActivityIndicator />;

  return (
    <FlatList
      data={tasks}
      renderItem={({ item }) => (
        <Pressable onPress={() => toggleTask({ taskId: item._id })}>
          <Text>{item.completed ? "✓" : "○"} {item.text}</Text>
        </Pressable>
      )}
    />
  );
}
```
</queries_and_mutations>

<authentication>
**Setup (convex/auth.config.ts):**
```typescript
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [GitHub, Google],
});
```

**Client usage:**
```tsx
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

function AuthScreen() {
  const { signIn, signOut } = useAuthActions();
  const user = useQuery(api.users.current);

  return (
    <View className="flex-1 items-center justify-center p-4">
      {user ? (
        <>
          <Text className="text-xl mb-4">Hello {user.name}</Text>
          <Button title="Sign Out" onPress={() => signOut()} />
        </>
      ) : (
        <Button title="Sign in with GitHub" onPress={() => signIn("github")} />
      )}
    </View>
  );
}
```

**Protected queries:**
```typescript
export const myTasks = query({
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    return await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
  },
});
```
</authentication>

<realtime_updates>
Queries automatically update when data changes. Use `"skip"` to conditionally skip queries when parameters are undefined.
</realtime_updates>
</convex_essentials>

<configuration_requirements>
<babel_config>
**babel.config.js** (critical for NativeWind + Reanimated):

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      'react-native-reanimated/plugin', // MUST BE LAST!
    ],
  };
};
```

**Rules:**
1. `react-native-reanimated/plugin` MUST be the last plugin
2. After changes, clear cache: `pnpm expo start -c`
</babel_config>

<metro_config>
**metro.config.js** (required for Convex):

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push('cjs'); // Required for Convex

module.exports = config;
```
</metro_config>

<tailwind_config>
**tailwind.config.js:** Must include `presets: [require("nativewind/preset")]` and content paths for `app/**`, `src/**`, and `components/**` directories.
</tailwind_config>
</configuration_requirements>


<troubleshooting>
**Reanimated:** Check `react-native-reanimated/plugin` is LAST in babel.config.js, clear cache with `pnpm expo start -c`

**NativeWind:** Verify tailwind.config.js content paths and `nativewind/babel` plugin

**Convex:** Check `EXPO_PUBLIC_CONVEX_URL` in .env, ensure `sourceExts.push('cjs')` in metro.config.js

**Dependencies:** `rm -rf node_modules pnpm-lock.yaml && pnpm install`
</troubleshooting>

<performance_best_practices>
1. **Use worklets for animations** - Keep heavy calculations on UI thread
2. **Memoize expensive components** - Use `React.memo()` for list items
3. **Optimize Convex queries** - Use indexes and limit query scope
4. **Lazy load screens** - Use `React.lazy()` for code splitting
5. **Minimize runOnJS calls** - Reduce JS/UI thread communication
6. **Cancel animations on unmount** - Use `cancelAnimation()` in cleanup
7. **Use FlatList optimizations** - `windowSize`, `maxToRenderPerBatch`, `getItemLayout`
8. **Optimize images** - Specify dimensions, use appropriate resizeMode
</performance_best_practices>

<success_criteria>
You've successfully implemented this stack when:

- ✅ Tailwind classes work in `className` props (NativeWind configured)
- ✅ Animations run smoothly at 60fps (Reanimated working)
- ✅ Gestures respond without lag (Gesture Handler integrated)
- ✅ Data updates in real-time (Convex connected)
- ✅ Authentication works (Convex Auth configured)
- ✅ Dark mode switches correctly (Theme-aware styling)
- ✅ All dependencies installed via pnpm (Consistent package management)
- ✅ TypeScript has no errors (Types generated and configured)
- ✅ Metro bundles without warnings (Configuration correct)
</success_criteria>

<reference_documentation>
**Detailed guides:**
- [NativeWind API](references/nativewind-api.md) - Complete utility classes, custom theming, platform modifiers
- [Reanimated API](references/reanimated-api.md) - Hooks, gestures, interpolation, easing functions
- [Convex Patterns](references/convex-patterns.md) - Database optimization, auth, file storage, pagination
- [Configuration](references/configuration.md) - Babel, Metro, Tailwind, TypeScript, environment variables
- [Troubleshooting](references/troubleshooting.md) - Detailed error messages and solutions
- [Common Workflows](references/workflows.md) - Animated lists, haptic buttons, scroll animations

**Official docs:** [Expo](https://docs.expo.dev) | [NativeWind](https://www.nativewind.dev) | [Reanimated](https://docs.swmansion.com/react-native-reanimated) | [Convex](https://docs.convex.dev)
</reference_documentation>
