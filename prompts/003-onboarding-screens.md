<objective>
Create a 3-step full-screen onboarding flow that appears ONLY for newly registered users. The onboarding showcases app features and should feel polished and engaging.

This onboarding helps new users understand the app's capabilities before they start using it.
</objective>

<context>
This is a React Native Expo app with:
- Expo Router v6 for file-based routing
- NativeWind/Tailwind styling
- React Native Reanimated for animations
- Dark theme (#1f1f1f bg, #de4c4a primary)
- Convex Auth for user authentication

The user schema has an `onboardingCompleted` boolean field to track completion status.

@src/theme/colors.ts - Color definitions
@src/theme/spacing.ts - Spacing scale
@CLAUDE.md - Project conventions
</context>

<research>
Read the app's design patterns:
@src/app/(tabs)/_layout.tsx - Tab structure
@src/components/TaskItem.tsx - Component styling patterns
</research>

<requirements>
1. Create onboarding route group `src/app/(onboarding)/`:
   - `_layout.tsx` - Onboarding stack layout (no header, full screen)
   - `index.tsx` - Onboarding container with page indicator
   - Or use individual screens: `step1.tsx`, `step2.tsx`, `step3.tsx`

2. Three onboarding screens covering app features:

   **Screen 1: Task Management**
   - Illustration or icon representing tasks
   - Title: "Organize Your Tasks"
   - Description: Explain task creation, priorities (P1-P4), due dates
   - Visual hint of the task interface

   **Screen 2: Projects & Labels**
   - Illustration for organization
   - Title: "Stay Organized with Projects"
   - Description: Color-coded projects, favorites, labels
   - Visual representation of project organization

   **Screen 3: Smart Views**
   - Illustration for calendar/views
   - Title: "Never Miss a Deadline"
   - Description: Today view, Upcoming (7-day), smart filtering
   - Visual of the different views

3. Navigation UI:
   - Page indicator dots at bottom
   - "Next" button on screens 1-2
   - "Get Started" button on final screen
   - Optional "Skip" link on all screens

4. Animations:
   - Smooth transitions between screens (use Reanimated)
   - Subtle entrance animations for content
   - Page indicator animates with current page

5. Completion logic:
   - On "Get Started" tap, call Convex mutation to set `onboardingCompleted: true`
   - Navigate to main app tabs after completion
   - Create mutation in `convex/users.ts`: `completeOnboarding`

6. Update root layout to check onboarding status:
   - After auth, check if `onboardingCompleted === false`
   - If false, show onboarding flow
   - If true, show main app
</requirements>

<implementation>
For the onboarding flow, consider using a horizontal FlatList or ScrollView with pagination:

```typescript
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring
} from 'react-native-reanimated';

// Track current page
const currentPage = useSharedValue(0);

// Animated page indicator
const indicatorStyle = useAnimatedStyle(() => ({
  transform: [{ translateX: withSpring(currentPage.value * 20) }]
}));
```

For the completion mutation:

```typescript
// convex/users.ts
export const completeOnboarding = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    await ctx.db.patch(userId, { onboardingCompleted: true });
  },
});
```

Illustrations can be:
- Simple icon compositions using Ionicons
- Gradient backgrounds with expo-mesh-gradient (already installed)
- Abstract shapes using View components
</implementation>

<constraints>
- Onboarding ONLY shows for new registrations (onboardingCompleted: false)
- Existing users bypass onboarding entirely
- Must work on both iOS and Android
- Keep animations performant (use native driver via Reanimated)
- Don't add illustration packages - use existing icons or simple shapes
- Match the dark theme aesthetic
</constraints>

<output>
Create/modify these files:
- `./src/app/(onboarding)/_layout.tsx` - Onboarding layout
- `./src/app/(onboarding)/index.tsx` - Main onboarding container
- `./convex/users.ts` - User mutations including completeOnboarding
- `./src/app/_layout.tsx` - Update to check onboarding status
</output>

<verification>
1. Create a new user account and verify onboarding appears
2. Navigate through all 3 screens
3. Verify "Get Started" completes onboarding and shows main app
4. Log out and back in - onboarding should NOT appear again
5. Test animations are smooth (no jank)
</verification>

<success_criteria>
- 3 engaging onboarding screens with feature descriptions
- Smooth Reanimated transitions between screens
- Page indicator shows current position
- "Get Started" saves completion and navigates to app
- New users see onboarding, returning users don't
- Consistent dark theme styling
</success_criteria>
