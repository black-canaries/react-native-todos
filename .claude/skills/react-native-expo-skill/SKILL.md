---
name: react-native-expo
description: React Native development with Expo, NativeWind (Tailwind for React Native), Reanimated for smooth animations, Convex backend with auth, and pnpm workflow. Use when working with React Native/Expo projects, mobile animations, Tailwind styling in React Native, Convex backend integration, or when managing dependencies with pnpm in Expo apps.
---

<objective>
Provide comprehensive guidance for building modern React Native applications using Expo with NativeWind (Tailwind CSS), Reanimated (high-performance animations), Convex (real-time backend), and pnpm (package management). Enable developers to quickly implement styling, animations, and backend features following best practices.
</objective>

<quick_start>
<stack>
**Core Technologies:**
- **Expo**: React Native framework with managed workflow and file-based routing (Expo Router)
- **NativeWind v4**: Tailwind CSS for React Native using `className` prop
- **Reanimated v3+**: UI-thread animations with worklets for 60fps performance
- **Convex**: Real-time backend with automatic sync, type-safe queries, and built-in auth
- **pnpm**: Fast, disk-efficient package manager (required for this stack)
</stack>

<development_commands>
```bash
# Install dependencies
pnpm install

# Start development server
pnpm expo start

# Platform-specific
pnpm expo start --ios
pnpm expo start --android
pnpm expo start --web

# Clear cache (when config changes)
pnpm expo start -c

# Start Convex backend
pnpm convex dev
```

**Critical:** Always use `pnpm` (never `npm` or `npx`). All Expo commands must be prefixed with `pnpm`.
</development_commands>

<project_structure>
```
project-root/
├── app/                          # Expo Router (file-based routing)
│   ├── (tabs)/                   # Tab navigation group
│   │   ├── index.tsx             # Inbox/home screen
│   │   ├── _layout.tsx           # Tab config
│   │   └── ...                   # Other tabs
│   ├── _layout.tsx               # Root layout (GestureHandlerRootView + ConvexProvider)
│   └── [dynamic].tsx             # Dynamic routes
├── src/
│   ├── components/               # Reusable UI components
│   ├── utils/                    # Utility functions
│   ├── theme/                    # Design tokens
│   └── types/                    # TypeScript types
├── convex/                       # Convex backend
│   ├── _generated/               # Auto-generated types
│   ├── schema.ts                 # Database schema
│   ├── auth.config.ts            # Auth setup
│   └── *.ts                      # Server functions (queries/mutations)
├── babel.config.js               # Babel config (NativeWind + Reanimated plugins)
├── metro.config.js               # Metro bundler config (CJS support)
├── tailwind.config.js            # NativeWind/Tailwind config
└── app.json                      # Expo configuration
```
</project_structure>

<essential_setup>
**Root Layout (app/_layout.tsx):**

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

**Key Requirements:**
1. Wrap app in `GestureHandlerRootView` for Reanimated gestures
2. Wrap app in `ConvexProvider` for backend connectivity
3. Use Expo Router's `Stack` or `Tabs` for navigation
</essential_setup>
</quick_start>

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
**Responsive Design:**
```tsx
<View className="w-full md:w-1/2 lg:w-1/3 p-4">
  <Text className="text-base sm:text-lg md:text-xl">Responsive</Text>
</View>
```

**Dark Mode:**
```tsx
<View className="bg-white dark:bg-gray-900">
  <Text className="text-gray-900 dark:text-white">Theme-aware</Text>
</View>
```

**Platform-Specific (NativeWind v4):**
```tsx
<View className="ios:pt-12 android:pt-4 web:cursor-pointer">
  {/* content */}
</View>
```
</responsive_and_dark_mode>

<advanced_reference>
For complete NativeWind API, custom theming, and advanced patterns:
→ [references/nativewind-api.md](references/nativewind-api.md)
</advanced_reference>
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
Functions marked with 'worklet' run on UI thread:

```tsx
const calculateOffset = (input: number) => {
  'worklet';
  return input * 2 + 10;
};

const animatedStyle = useAnimatedStyle(() => {
  return {
    transform: [{ translateX: calculateOffset(offset.value) }],
  };
});
```

**Communication between threads:**
- `runOnUI(() => {})` - Execute on UI thread from JS
- `runOnJS(jsFunction)()` - Execute on JS thread from worklet
</worklets>

<advanced_reference>
For complete Reanimated API, gestures, interpolation, and performance patterns:
→ [references/reanimated-api.md](references/reanimated-api.md)
</advanced_reference>
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
Queries automatically update when data changes:

```tsx
function LiveTaskList() {
  // Automatically re-renders when tasks change in database
  const tasks = useQuery(api.tasks.list);

  return <FlatList data={tasks ?? []} />;
}
```

**Conditional queries:**
```tsx
function ConditionalData({ userId }: { userId?: string }) {
  // Skip query when userId is undefined
  const userData = useQuery(
    api.users.get,
    userId ? { userId } : "skip"
  );

  if (userData === undefined) return <Loading />;
  return <UserProfile data={userData} />;
}
```
</realtime_updates>

<advanced_reference>
For database patterns, file storage, pagination, optimistic updates, and search:
→ [references/convex-patterns.md](references/convex-patterns.md)
</advanced_reference>
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
**tailwind.config.js:**

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")], // MUST BE INCLUDED
  theme: {
    extend: {
      // Custom colors, spacing, etc.
    },
  },
  plugins: [],
}
```
</tailwind_config>

<complete_configuration_reference>
For app.json, TypeScript, environment variables, and Git setup:
→ [references/configuration.md](references/configuration.md)
</complete_configuration_reference>
</configuration_requirements>

<common_workflows>
<animated_list_with_backend>
Combine Reanimated animations with Convex real-time data:

```tsx
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { FlatList } from 'react-native';
import Animated, { FadeIn, Layout } from 'react-native-reanimated';

function AnimatedTaskList() {
  const tasks = useQuery(api.tasks.list);

  if (tasks === undefined) return <ActivityIndicator />;

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item._id}
      renderItem={({ item, index }) => (
        <Animated.View
          entering={FadeIn.delay(index * 50)}
          layout={Layout.springify()}
          className="p-4 border-b border-gray-200 dark:border-gray-700"
        >
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">
            {item.text}
          </Text>
        </Animated.View>
      )}
    />
  );
}
```
</animated_list_with_backend>

<interactive_button_with_haptics>
```tsx
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';

function HapticButton({ onPress, children }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withSpring(0.95);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      onPress={onPress}
    >
      <Animated.View style={animatedStyle} className="bg-blue-500 px-6 py-3 rounded-lg">
        {children}
      </Animated.View>
    </Pressable>
  );
}
```
</interactive_button_with_haptics>

<scroll_animations>
```tsx
import { useAnimatedScrollHandler } from 'react-native-reanimated';
import Animated, { useSharedValue, useAnimatedStyle, interpolate } from 'react-native-reanimated';

function ScrollAnimations() {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 100], [1, 0]);
    return { opacity };
  });

  return (
    <>
      <Animated.View style={headerStyle} className="absolute top-0 left-0 right-0 z-10">
        <Text>Fades out on scroll</Text>
      </Animated.View>
      <Animated.ScrollView onScroll={scrollHandler} scrollEventThrottle={16}>
        {/* content */}
      </Animated.ScrollView>
    </>
  );
}
```
</scroll_animations>
</common_workflows>

<troubleshooting_quick_reference>
<common_issues>
**Reanimated not working:**
1. Check `react-native-reanimated/plugin` is LAST in babel.config.js
2. Clear cache: `pnpm expo start -c`
3. Rebuild: `pnpm expo prebuild --clean`

**NativeWind styles not applying:**
1. Verify tailwind.config.js content paths include your files
2. Check `nativewind/babel` is in babel.config.js
3. Restart Metro: `pnpm expo start -c`

**Convex connection issues:**
1. Verify `EXPO_PUBLIC_CONVEX_URL` in .env
2. Ensure `sourceExts.push('cjs')` in metro.config.js
3. Check ConvexProvider wraps your app
4. Run `pnpm convex dev`

**pnpm dependency conflicts:**
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```
</common_issues>

<complete_troubleshooting_guide>
For detailed error messages, debugging tips, and solutions:
→ [references/troubleshooting.md](references/troubleshooting.md)
</complete_troubleshooting_guide>
</troubleshooting_quick_reference>

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
- [NativeWind API Reference](references/nativewind-api.md) - Complete utility class reference, custom theming
- [Reanimated API Reference](references/reanimated-api.md) - Hooks, gestures, interpolation, easing
- [Convex Patterns](references/convex-patterns.md) - Database, auth, file storage, optimization
- [Configuration Reference](references/configuration.md) - Babel, Metro, Tailwind, TypeScript, env vars
- [Troubleshooting Guide](references/troubleshooting.md) - Common errors and solutions

**Official documentation:**
- Expo: https://docs.expo.dev
- NativeWind: https://www.nativewind.dev
- Reanimated: https://docs.swmansion.com/react-native-reanimated
- Convex: https://docs.convex.dev
</reference_documentation>
