# React Native Expo Skill - Quick Reference

## Installation

**Project Skill (Team):**
```bash
mkdir -p .claude/skills
cp -r react-native-expo-skill .claude/skills/
git add .claude/skills/react-native-expo-skill
git commit -m "Add React Native Expo skill"
```

**Personal Skill (Individual):**
```bash
mkdir -p ~/.claude/skills
cp -r react-native-expo-skill ~/.claude/skills/
```

## pnpm Commands

```bash
# Install & Run
pnpm install
pnpm expo start
pnpm expo start --ios
pnpm expo start --android

# Add Packages
pnpm add <package>
pnpm add -D <dev-package>

# Build
pnpm expo prebuild
pnpm expo run:ios
pnpm expo run:android

# Clear Cache
pnpm expo start -c
pnpm expo prebuild --clean
```

## NativeWind Quick Reference

```tsx
// Layout
<View className="flex-1 flex-row items-center justify-between p-4">

// Styling
<Text className="text-xl font-bold text-gray-900 dark:text-white">

// Spacing
<View className="p-4 mx-2 gap-4">

// Responsive
<View className="w-full md:w-1/2 lg:w-1/3">

// Colors
<View className="bg-blue-500 border border-gray-200 rounded-lg">
```

## Reanimated Quick Reference

```tsx
import Animated, { 
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming 
} from 'react-native-reanimated';

// Basic Animation
const offset = useSharedValue(0);

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ translateX: offset.value }],
}));

offset.value = withSpring(100);

<Animated.View style={animatedStyle} />
```

## Convex Quick Reference

```tsx
// Client Setup
import { ConvexProvider, ConvexReactClient } from "convex/react";
const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

// Query (real-time)
const data = useQuery(api.tasks.list);

// Mutation
const addTask = useMutation(api.tasks.add);
await addTask({ text: "New task" });

// Server Function
export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});
```

## Configuration Files

**babel.config.js:**
```javascript
plugins: [
  'nativewind/babel',
  'react-native-reanimated/plugin', // MUST BE LAST
]
```

**tailwind.config.js:**
```javascript
content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
presets: [require("nativewind/preset")],
```

**metro.config.js:**
```javascript
config.resolver.sourceExts.push('cjs');
```

## Common Patterns

**Animated Button:**
```tsx
const scale = useSharedValue(1);
const handlePress = () => {
  scale.value = withSpring(0.95);
  setTimeout(() => scale.value = withSpring(1), 100);
};
```

**Real-time List:**
```tsx
const items = useQuery(api.items.list);
<FlatList data={items ?? []} />
```

**Protected Route:**
```typescript
const userId = await auth.getUserId(ctx);
if (!userId) throw new Error("Not authenticated");
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Reanimated not working | Check Babel plugin is LAST, clear cache |
| NativeWind not applying | Verify tailwind.config paths, restart Metro |
| Convex connection fails | Check EXPO_PUBLIC_CONVEX_URL in .env |
| pnpm conflicts | `rm -rf node_modules pnpm-lock.yaml && pnpm install` |

## File Structure

```
project/
├── app/                 # Expo Router screens
├── components/          # React components
├── convex/             # Backend functions
│   ├── auth.config.ts
│   └── *.ts
├── babel.config.js     # NativeWind + Reanimated
├── metro.config.js     # Metro bundler
├── tailwind.config.js  # Tailwind/NativeWind
└── .env               # EXPO_PUBLIC_CONVEX_URL
```

## Example Prompts for Claude

- "Create an animated card with NativeWind styling"
- "Build a login screen with Convex auth"
- "Add a pan gesture to this component"
- "Set up real-time data synchronization"
- "Create a smooth fade-in animation"
- "Help me configure Babel for Reanimated"

## Resources

- **SKILL.md** - Complete documentation
- **references/** - Detailed API references
- **assets/** - Template components
- **scripts/** - Setup automation

---

**Skill Version:** 1.0  
**Compatible:** Expo 51+, NativeWind v4, Reanimated v3, Convex latest
