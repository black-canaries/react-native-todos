<objective>
Create login and signup UI screens for the React Native Expo app with Google OAuth, GitHub OAuth, and Email OTP authentication flows.

These screens are the entry point for users and should follow the app's existing dark theme design system.
</objective>

<context>
This is a React Native Expo app using:
- Expo Router v6 for file-based routing
- NativeWind/Tailwind for styling
- Dark theme by default (#1f1f1f bg, #de4c4a primary)
- React Native Reanimated for animations

The Convex Auth backend is already configured (from previous prompt).

@src/theme/colors.ts - Color definitions
@src/theme/spacing.ts - Spacing scale
@src/app/_layout.tsx - Root layout structure
@CLAUDE.md - Project conventions
</context>

<research>
Read existing screen implementations to match the styling patterns:
@src/app/(tabs)/inbox/index.tsx
@src/app/(tabs)/(projects)/index.tsx

Understand how the app structures layouts and uses SafeAreaView.
</research>

<requirements>
1. Update `src/app/_layout.tsx`:
   - Replace ConvexProvider with ConvexAuthProvider
   - Add auth state checking to conditionally show auth screens vs main app
   - Import from "@convex-dev/auth/react"

2. Create auth route group `src/app/(auth)/`:
   - `_layout.tsx` - Auth stack layout
   - `login.tsx` - Login screen
   - `signup.tsx` - Signup screen
   - `otp-verify.tsx` - OTP verification screen

3. Login screen (`login.tsx`):
   - App logo/title at top
   - "Sign in with Google" button with Google icon
   - "Sign in with GitHub" button with GitHub icon
   - Divider with "or continue with email"
   - Email input field
   - "Send OTP" button
   - Link to signup screen at bottom

4. Signup screen (`signup.tsx`):
   - Similar layout to login
   - Same OAuth buttons
   - Email input for OTP registration
   - "Create account" button
   - Link back to login

5. OTP Verification screen (`otp-verify.tsx`):
   - Display the email OTP was sent to
   - 8-digit OTP input (can be single input or split boxes)
   - "Verify" button
   - "Resend OTP" link with countdown timer
   - Back button to return to login/signup

6. Implement auth hooks:
   - useAuthActions for signIn/signOut
   - Proper loading states during auth operations
   - Error handling with user-friendly messages
</requirements>

<implementation>
Use the useAuthActions hook pattern:

```typescript
import { useAuthActions } from "@convex-dev/auth/react";

const { signIn } = useAuthActions();

// OAuth sign in
await signIn("google");
await signIn("github");

// OTP flow - step 1: request code
await signIn("resend-otp", { email });

// OTP flow - step 2: verify code
await signIn("resend-otp", { email, code });
```

For checking auth state, use Authenticated/Unauthenticated components or check token:

```typescript
import { useAuthToken } from "@convex-dev/auth/react";
const token = useAuthToken();
const isAuthenticated = token !== null;
```

Style buttons to match the app's design:
- Rounded corners (borderRadius from spacing.ts)
- Dark backgrounds with subtle borders
- Proper touch feedback with opacity changes
</implementation>

<constraints>
- Follow existing NativeWind/Tailwind patterns in the codebase
- Use Ionicons from @expo/vector-icons for icons
- Match the dark theme aesthetic exactly
- Do not add new dependencies beyond what's already installed
- Handle keyboard avoiding properly on iOS
- After successful login, DO NOT navigate to onboarding - that logic comes later
</constraints>

<output>
Create/modify these files:
- `./src/app/_layout.tsx` - Updated with ConvexAuthProvider and auth routing
- `./src/app/(auth)/_layout.tsx` - Auth stack layout
- `./src/app/(auth)/login.tsx` - Login screen
- `./src/app/(auth)/signup.tsx` - Signup screen
- `./src/app/(auth)/otp-verify.tsx` - OTP verification screen
</output>

<verification>
1. Run the app and verify:
   - Unauthenticated users see login screen
   - OAuth buttons trigger native auth flows
   - OTP email input works and navigates to verify screen
   - Successful auth redirects to main app
2. Test error states (invalid OTP, network errors)
3. Verify keyboard doesn't cover inputs
</verification>

<success_criteria>
- All auth screens render without errors
- OAuth flows work (Google, GitHub)
- OTP flow works (email -> verify code)
- Proper loading and error states
- Consistent styling with rest of app
- Smooth navigation between auth screens
</success_criteria>
