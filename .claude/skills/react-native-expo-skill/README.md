# React Native Expo Skill Installation Guide

This skill provides comprehensive guidance for React Native development with Expo, NativeWind, Reanimated, Convex, and pnpm.

## Installation

### Option 1: Project Skill (Recommended for team projects)

1. Copy the `react-native-expo-skill` folder to your project:
   ```bash
   mkdir -p .claude/skills
   cp -r react-native-expo-skill .claude/skills/
   ```

2. Commit to git so team members have access:
   ```bash
   git add .claude/skills/react-native-expo-skill
   git commit -m "Add React Native Expo skill"
   ```

3. The skill will now be automatically available when anyone uses Claude Code in this project.

### Option 2: Personal Skill (For use across all your projects)

1. Copy the skill to your personal skills directory:
   ```bash
   mkdir -p ~/.claude/skills
   cp -r react-native-expo-skill ~/.claude/skills/
   ```

2. The skill will now be available in all your Claude Code projects.

## What's Included

### Main Skill File
- **SKILL.md** - Complete guide covering:
  - NativeWind styling with Tailwind CSS classes
  - Reanimated animations with worklets
  - Convex backend integration and authentication
  - Configuration files (Babel, Metro, Tailwind)
  - Common patterns and troubleshooting
  - pnpm package management

### Reference Files
- **references/nativewind-api.md** - Complete NativeWind class reference
- **references/reanimated-api.md** - Reanimated hooks, animations, and gestures
- **references/convex-patterns.md** - Advanced Convex patterns and best practices

### Scripts
- **scripts/setup-expo-project.sh** - Automated project setup script

### Template Components
- **assets/AnimatedButton.tsx** - Button with NativeWind + Reanimated
- **assets/ConvexAuthProvider.tsx** - Convex authentication setup

## Usage

Once installed, Claude will automatically use this skill when you:
- Ask about React Native or Expo development
- Work with NativeWind styling
- Create animations with Reanimated
- Integrate Convex backend or auth
- Need help with Babel, Metro, or pnpm configuration

### Example Prompts

```
"Create a new screen with NativeWind styling and a smooth fade-in animation"

"Help me set up Convex authentication with GitHub and Google"

"Build an animated card component using Reanimated gestures"

"Create a real-time task list with Convex queries"

"Fix my Babel config for Reanimated worklets"

"Set up a new Expo project with all dependencies"
```

## Quick Start Script

Use the included setup script to initialize a new project:

```bash
chmod +x .claude/skills/react-native-expo-skill/scripts/setup-expo-project.sh
.claude/skills/react-native-expo-skill/scripts/setup-expo-project.sh my-app
```

This will:
- Create a new Expo project with TypeScript
- Install all necessary dependencies (NativeWind, Reanimated, Convex)
- Configure Babel, Metro, and Tailwind
- Set up environment file templates

## Skill Structure

```
react-native-expo-skill/
├── SKILL.md                          # Main skill instructions
├── references/                        # Detailed API references
│   ├── nativewind-api.md             # NativeWind utilities
│   ├── reanimated-api.md             # Reanimated hooks/animations
│   └── convex-patterns.md            # Convex patterns
├── scripts/                          # Helper scripts
│   └── setup-expo-project.sh         # Project setup automation
└── assets/                           # Template components
    ├── AnimatedButton.tsx            # Example button component
    └── ConvexAuthProvider.tsx        # Auth provider template
```

## Key Features

### Automatic Skill Triggering
Claude automatically loads this skill when you mention:
- React Native, Expo, or mobile development
- NativeWind, Tailwind styling
- Reanimated, animations, or worklets
- Convex, backend, or authentication
- pnpm commands
- Babel or Metro configuration

### Progressive Disclosure
- The skill description is always in context (minimal tokens)
- Full instructions load only when the skill is triggered
- Reference files load only when needed for specific APIs
- Scripts and templates available but not loaded unless used

## Customization

Feel free to modify the skill to match your team's conventions:

1. Edit `SKILL.md` to add your company's specific patterns
2. Add custom components to `assets/`
3. Update `references/` with your API documentation
4. Add team-specific scripts to `scripts/`

## Support

If you encounter issues:
1. Check the Troubleshooting section in SKILL.md
2. Ensure all dependencies are installed via pnpm
3. Clear caches: `pnpm expo start -c`
4. Rebuild: `pnpm expo prebuild --clean`

## Version

This skill is compatible with:
- Expo SDK 51+
- NativeWind v4
- Reanimated v3
- Convex latest
- React Native 0.74+
