---
name: react-native-expo
description: React Native development with Expo, NativeWind (Tailwind for React Native), Reanimated for smooth animations, Convex backend with auth, and pnpm workflow. Use when working with React Native/Expo projects, mobile animations, Tailwind styling in React Native, Convex backend integration, or when managing dependencies with pnpm in Expo apps.
---

# React Native Expo Development

This skill provides comprehensive guidance for React Native development using Expo with modern tooling: NativeWind for styling, Reanimated for animations, Convex for backend, and pnpm for package management.

## Core Stack

- **Expo**: React Native framework with managed workflow
- **NativeWind**: Tailwind CSS for React Native styling
- **Reanimated**: High-performance animations with worklets
- **Convex**: Real-time backend with built-in authentication
- **pnpm**: Fast, disk-efficient package manager

## Package Management with pnpm

Always use pnpm commands for Expo projects to maintain dependency compatibility:

```bash
# Install dependencies
pnpm install

# Add new packages
pnpm add <package-name>
pnpm add -D <dev-package>

# Start development server
pnpm expo start

# Platform-specific commands
pnpm expo start --ios
pnpm expo start --android
pnpm expo start --web

# Build commands
pnpm expo prebuild
pnpm expo run:ios
pnpm expo run:android
```

**Critical**: Never use `npm` or `npx` directly. Always prefix with `pnpm` (e.g., `pnpm expo install` not `npx expo install`).

## Project Structure

```
project-root/
├── app/                    # Expo Router file-based routing
│   ├── (tabs)/            # Tab navigation
│   ├── (auth)/            # Auth screens
│   └── _layout.tsx        # Root layout
├── components/            # React components
├── convex/               # Convex backend functions
│   ├── auth.config.ts    # Auth configuration
│   └── *.ts              # Server functions
├── babel.config.js       # Babel configuration
├── metro.config.js       # Metro bundler config
├── tailwind.config.js    # NativeWind/Tailwind config
└── app.json             # Expo configuration
```

## NativeWind Styling

NativeWind brings Tailwind CSS utility classes to React Native. Use `className` prop with Tailwind classes.

### Setup Check

Ensure these are in your dependencies:
- `nativewind@^4.0.0` (or latest v4)
- `tailwindcss`

### Basic Usage

```tsx
import { View, Text } from 'react-native';

export default function Component() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-gray-900">
        Hello NativeWind
      </Text>
    </View>
  );
}
```

### Responsive Design

```tsx
<View className="w-full md:w-1/2 lg:w-1/3 p-4">
  <Text className="text-base sm:text-lg md:text-xl">
    Responsive Text
  </Text>
</View>
```

### Dark Mode

```tsx
<View className="bg-white dark:bg-gray-900">
  <Text className="text-gray-900 dark:text-white">
    Theme-aware text
  </Text>
</View>
```

### Custom Styles

When Tailwind classes aren't sufficient, combine with StyleSheet:

```tsx
import { View, StyleSheet } from 'react-native';

<View className="flex-1 p-4" style={styles.custom}>
  {/* content */}
</View>

const styles = StyleSheet.create({
  custom: {
    // Platform-specific or complex styles
  }
});
```

## Reanimated Animations

Reanimated provides smooth, high-performance animations using worklets that run on the UI thread.

### Setup Requirements

Ensure these packages are installed:
- `react-native-reanimated`
- `react-native-gesture-handler`

### Basic Animations

```tsx
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming 
} from 'react-native-reanimated';

function AnimatedComponent() {
  const offset = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  const handlePress = () => {
    offset.value = withSpring(offset.value + 50);
  };

  return (
    <Animated.View style={animatedStyles} className="w-20 h-20 bg-blue-500">
      {/* content */}
    </Animated.View>
  );
}
```

### Worklets

Worklets are functions that run on the UI thread for smooth animations:

```tsx
import { runOnUI } from 'react-native-reanimated';

// Mark function as worklet
const animateValue = () => {
  'worklet';
  // This runs on UI thread
  return someSharedValue.value * 2;
};

// Or use runOnUI
const handleGesture = () => {
  runOnUI(() => {
    // UI thread code
    offset.value = withTiming(100);
  })();
};
```

### Gesture Handling

```tsx
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle 
} from 'react-native-reanimated';

function DraggableBox() {
  const offset = useSharedValue(0);

  const pan = Gesture.Pan()
    .onChange((event) => {
      offset.value += event.changeX;
    });

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={animatedStyles} className="w-20 h-20 bg-red-500">
        {/* content */}
      </Animated.View>
    </GestureDetector>
  );
}
```

### Layout Animations

```tsx
import Animated, { Layout, FadeIn, FadeOut } from 'react-native-reanimated';

<Animated.View
  entering={FadeIn.duration(300)}
  exiting={FadeOut.duration(300)}
  layout={Layout.springify()}
  className="p-4"
>
  {/* content */}
</Animated.View>
```

## Convex Backend Integration

Convex provides real-time backend with automatic synchronization and built-in authentication.

### Project Setup

Ensure convex is configured:

```bash
pnpm add convex
pnpm convex dev
```

### Client Setup

```tsx
// app/_layout.tsx or root component
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

export default function RootLayout() {
  return (
    <ConvexProvider client={convex}>
      {/* Your app */}
    </ConvexProvider>
  );
}
```

### Queries and Mutations

```tsx
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

function TaskList() {
  // Real-time query
  const tasks = useQuery(api.tasks.list);
  
  // Mutation
  const addTask = useMutation(api.tasks.add);

  const handleAddTask = async () => {
    await addTask({ text: "New task" });
  };

  if (tasks === undefined) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      {tasks.map(task => (
        <Text key={task._id}>{task.text}</Text>
      ))}
    </View>
  );
}
```

### Convex Functions

```typescript
// convex/tasks.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});

export const add = mutation({
  args: { text: v.string() },
  handler: async (ctx, { text }) => {
    await ctx.db.insert("tasks", { text, completed: false });
  },
});
```

## Convex Authentication

Convex Auth provides simple authentication with multiple providers.

### Auth Setup

```typescript
// convex/auth.config.ts
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    GitHub,
    Google,
  ],
});
```

### Client Auth Usage

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
        <>
          <Button 
            title="Sign in with GitHub" 
            onPress={() => signIn("github")} 
          />
          <Button 
            title="Sign in with Google" 
            onPress={() => signIn("google")} 
          />
        </>
      )}
    </View>
  );
}
```

### Protected Routes

```typescript
// convex/tasks.ts
import { query } from "./_generated/server";
import { auth } from "./auth.config";

export const myTasks = query({
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    return await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
  },
});
```

## Configuration Files

### babel.config.js

Essential Babel plugins for Reanimated and NativeWind:

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      'react-native-reanimated/plugin', // Must be last
    ],
  };
};
```

**Critical**: `react-native-reanimated/plugin` MUST be the last plugin in the array.

### metro.config.js

Metro bundler configuration for proper module resolution:

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push('cjs');

module.exports = config;
```

### tailwind.config.js

NativeWind requires Tailwind configuration:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## Common Patterns

### Animated Button with Haptics

```tsx
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring 
} from 'react-native-reanimated';
import { Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';

function AnimatedButton({ onPress, children }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <Pressable 
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View 
        style={animatedStyle}
        className="bg-blue-500 px-6 py-3 rounded-lg"
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}
```

### Real-time Data List

```tsx
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { FlatList } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

function DataList() {
  const items = useQuery(api.items.list);

  if (items === undefined) {
    return <ActivityIndicator />;
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item._id}
      renderItem={({ item, index }) => (
        <Animated.View
          entering={FadeIn.delay(index * 100)}
          className="p-4 border-b border-gray-200"
        >
          <Text className="text-lg font-semibold">{item.title}</Text>
        </Animated.View>
      )}
    />
  );
}
```

## Troubleshooting

### Reanimated not working

1. Check `babel.config.js` - ensure `react-native-reanimated/plugin` is LAST
2. Clear cache: `pnpm expo start -c`
3. Rebuild: `pnpm expo prebuild --clean`

### NativeWind styles not applying

1. Verify `tailwind.config.js` content paths include your files
2. Check `babel.config.js` includes `nativewind/babel`
3. Restart Metro: `pnpm expo start -c`

### Convex connection issues

1. Verify `EXPO_PUBLIC_CONVEX_URL` in environment
2. Check `convex dev` is running
3. Ensure ConvexProvider wraps your app

### pnpm dependency conflicts

```bash
# Remove lock file and node_modules
rm -rf node_modules pnpm-lock.yaml

# Reinstall
pnpm install

# If issues persist, use legacy peer deps
pnpm install --legacy-peer-deps
```

## Performance Best Practices

1. **Use worklets for animations** - Keep UI thread responsive
2. **Memoize expensive components** - Use `React.memo()` for heavy lists
3. **Optimize Convex queries** - Use indexes and limit results
4. **Lazy load screens** - Use React.lazy() for route-based splitting
5. **Image optimization** - Use Expo's image optimization features

## Environment Variables

Create `.env` file:

```
EXPO_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
EXPO_PUBLIC_API_KEY=your-api-key
```

Access in code:

```tsx
const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;
```

## Additional Resources

For detailed API documentation, see:
- [references/nativewind-api.md](references/nativewind-api.md) - Complete NativeWind class reference
- [references/reanimated-api.md](references/reanimated-api.md) - Reanimated hooks and utilities
- [references/convex-patterns.md](references/convex-patterns.md) - Advanced Convex patterns
