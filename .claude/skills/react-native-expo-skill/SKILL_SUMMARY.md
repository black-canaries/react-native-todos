# React Native Expo Skill - Creation Summary

## ✅ What Was Created

A comprehensive Agent Skill for React Native/Expo development with your complete tech stack.

### 📁 Skill Structure

```
react-native-expo-skill/
├── SKILL.md                       # Main skill documentation (13KB)
├── README.md                      # Installation & usage guide
├── QUICK_REFERENCE.md            # Cheat sheet for quick reference
├── references/                    # Detailed API documentation
│   ├── nativewind-api.md         # NativeWind utility classes (7KB)
│   ├── reanimated-api.md         # Reanimated hooks & animations (10KB)
│   └── convex-patterns.md        # Convex patterns & best practices (14KB)
├── scripts/                       # Automation scripts
│   └── setup-expo-project.sh     # New project setup script
└── assets/                        # Template components
    ├── AnimatedButton.tsx         # Example animated button
    └── ConvexAuthProvider.tsx     # Auth provider template
```

## 🎯 Tech Stack Coverage

### ✅ Expo & React Native
- File-based routing (Expo Router)
- Platform-specific configurations
- Environment variables
- Development workflow

### ✅ NativeWind (Tailwind for RN)
- Complete utility class reference
- Dark mode support
- Responsive design patterns
- Platform-specific styling
- Custom values and combinations

### ✅ Reanimated
- All hooks (useSharedValue, useAnimatedStyle, etc.)
- Animation functions (withSpring, withTiming, withSequence)
- Worklets and UI thread optimization
- Gesture handling with react-native-gesture-handler
- Layout animations (entering/exiting)
- Performance patterns

### ✅ Convex Backend
- Client setup and provider configuration
- Queries and mutations (real-time)
- Authentication with Convex Auth
- Database schema patterns
- File storage
- Scheduled functions (crons)
- Advanced patterns (pagination, relationships, RBAC)

### ✅ Configuration
- Babel config (with proper plugin ordering)
- Metro bundler setup
- Tailwind configuration
- Environment variables
- TypeScript support

### ✅ pnpm Package Management
- All commands for Expo workflow
- Dependency management
- Troubleshooting conflicts

## 🚀 Key Features

### 1. Automatic Triggering
Claude will automatically load this skill when you mention:
- React Native, Expo, mobile development
- NativeWind, Tailwind styling
- Reanimated, animations, worklets
- Convex, backend, authentication
- pnpm commands
- Configuration (Babel, Metro)

### 2. Progressive Disclosure
- Minimal token usage (description always loaded)
- Full instructions loaded only when triggered
- Reference files loaded only when needed
- Efficient context window management

### 3. Practical Resources
- Setup script for new projects
- Template components ready to use
- Comprehensive examples
- Troubleshooting guides

### 4. Best Practices Built-in
- Proper Babel plugin ordering
- Performance optimization tips
- Error handling patterns
- Security considerations
- Real-world usage examples

## 📖 How to Use

### Installation Options

**1. Project Skill (Recommended for teams)**
```bash
mkdir -p .claude/skills
cp -r react-native-expo-skill .claude/skills/
git add .claude/skills/react-native-expo-skill
git commit -m "Add React Native Expo skill"
```

**2. Personal Skill (For individual use)**
```bash
mkdir -p ~/.claude/skills
cp -r react-native-expo-skill ~/.claude/skills/
```

### Usage Examples

Once installed, just ask Claude naturally:

```
"Create a new screen with NativeWind styling and fade-in animation"
"Set up Convex authentication with GitHub provider"
"Build an animated card component with pan gestures"
"Help me fix my Babel config for Reanimated"
"Create a real-time task list with Convex"
```

Claude will automatically:
1. Detect that the skill is relevant
2. Load the main SKILL.md instructions
3. Load specific reference files if needed
4. Provide accurate, context-aware guidance

## 🎨 Customization

The skill is designed to be easily customizable:

1. **Add your patterns**: Edit SKILL.md to include your team's conventions
2. **Custom components**: Add more templates to `assets/`
3. **Team workflows**: Update references with your processes
4. **Additional scripts**: Add automation to `scripts/`

## 📚 Documentation Breakdown

### SKILL.md (Main File) - 13KB
- Tech stack overview
- pnpm workflow
- NativeWind styling basics
- Reanimated animation patterns
- Convex integration
- Configuration files
- Common patterns
- Troubleshooting

### Reference Files (31KB total)
- **nativewind-api.md**: Every utility class, responsive design, dark mode
- **reanimated-api.md**: All hooks, animations, gestures, worklets
- **convex-patterns.md**: Authentication, real-time, file storage, advanced patterns

### Supporting Files
- **README.md**: Installation and setup guide
- **QUICK_REFERENCE.md**: Cheat sheet for quick lookup
- **Scripts**: Project initialization automation
- **Assets**: Ready-to-use component templates

## ✨ Benefits

1. **Consistency**: Team uses same patterns and best practices
2. **Speed**: Faster development with ready templates and examples
3. **Quality**: Built-in best practices and performance tips
4. **Learning**: Comprehensive reference for all team members
5. **Maintenance**: Easy to update and extend

## 🔄 Next Steps

1. **Install the skill** using one of the methods above
2. **Test it** by asking Claude to help with a React Native task
3. **Customize** the skill with your team's specific patterns
4. **Share** with your team by committing to git (if project skill)
5. **Iterate** - update the skill as you discover new patterns

## 💡 Tips

- The skill respects progressive disclosure - references are only loaded when needed
- Keep SKILL.md under 500 lines for optimal performance
- Add new patterns to SKILL.md, detailed docs to references/
- Use the setup script to quickly bootstrap new projects
- Commit the skill to git for team-wide access

## 📊 Token Efficiency

- **Skill description**: ~100 tokens (always loaded)
- **SKILL.md**: ~4,000 tokens (loaded when triggered)
- **Each reference**: ~3,000-5,000 tokens (loaded as needed)
- **Total potential**: ~15,000 tokens (but only what's needed is loaded)

This design ensures Claude has access to comprehensive knowledge without wasting context window space.

---

**Created**: November 17, 2025  
**Tech Stack**: Expo, NativeWind v4, Reanimated v3, Convex, pnpm  
**Skill Version**: 1.0
