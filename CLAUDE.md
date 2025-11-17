# React Native Todos Project Guide

## Project Overview
A modern Todoist-inspired task management app built with React Native and Expo. Features file-based routing, drag-and-drop task management, and a professional dark-theme design system.

## Technology Stack
- **Framework**: React Native (v0.81.5) with Expo (v54.0.23)
- **Language**: TypeScript (v5.9.3) with strict mode enabled
- **Package Manager**: pnpm (v10.22.0) - primary package manager
- **Routing**: Expo Router v6 (file-based routing)
- **Navigation**: React Navigation (native-stack + bottom-tabs)
- **Animations**: React Native Reanimated (v4+) + Gesture Handler
- **Icons**: Expo Vector Icons (Ionicons)

## Project Structure
```
app/                          # Expo Router file-based routing
├── (tabs)/                   # Tab navigation group
│   ├── index.tsx             # Inbox screen
│   ├── today.tsx             # Today tasks view
│   ├── upcoming.tsx          # Upcoming tasks (7-day grouping)
│   ├── projects.tsx          # Projects list (Favorites + Others)
│   └── _layout.tsx           # Tab navigation config
├── project/[id].tsx          # Dynamic project detail page
└── _layout.tsx               # Root layout (GestureHandlerRootView)

src/                          # Core application code
├── components/               # Reusable UI components
│   ├── TaskItem.tsx          # Task list item with priority/metadata
│   └── ProjectItem.tsx       # Project item with color indicator
├── data/
│   └── mockData.ts           # Complete mock dataset (18+ tasks, 5 projects)
├── theme/                    # Design system
│   ├── colors.ts             # Dark/light theme definitions
│   ├── spacing.ts            # Spacing scale (xs-xxl) + border radius
│   ├── typography.ts         # Font sizes & weights
│   └── index.ts              # Theme exports
├── types/
│   └── index.ts              # TypeScript interfaces (Task, Project, Label, etc.)
└── utils/
    └── dateUtils.ts          # Date formatting & filtering utilities
```

## Key Features
- **4 Main Views**: Inbox, Today, Upcoming (7-day), Projects
- **Task Management**: Create, complete, prioritize (P1-P4), assign due dates, add descriptions
- **Drag & Drop**: Reorder tasks and projects with haptic feedback
- **Project Organization**: Color-coded projects, favorites, task counts, sections
- **Smart Dates**: Overdue detection, "Today"/"Tomorrow" formatting, day grouping
- **Dark Theme by Default**: Todoist-inspired color palette (#1f1f1f bg, #de4c4a primary)
- **Completed Tasks**: Collapsible section showing finished tasks per view
- **Subtasks & Metadata**: Display completion ratios, labels, comments, attachments

## Development Workflow
```bash
pnpm install                  # Install dependencies
pnpm start                    # Start Expo dev server
pnpm ios                      # Run on iOS simulator/device
pnpm android                  # Run on Android emulator/device
pnpm web                      # Run web version
```

## Architecture & Patterns
- **File-based Routing**: Expo Router with dynamic routes (`[id]`)
- **State Management**: Local component state (useState) with props drilling
- **Design System**: Centralized theme with spacing/color/typography scales
- **Data Source**: Static mockData.ts (no persistence or backend yet)
- **Component Types**: Stateless presentational components + screen containers
- **Type Safety**: Full TypeScript interfaces for all domain models

## Important Notes
- Uses **pnpm** exclusively (not npm or yarn)
- TypeScript strict mode enabled in all files
- No external state management library (Redux, Zustand, Context API)
- No persistence layer yet (mock data only)
- Tab navigation group uses `(tabs)` folder convention
- Safe area context for notch/dynamic island handling
- Gesture handler root wrapper required for all interactions

## Future Roadmap
- Board/Kanban view
- Calendar view
- Custom filters and search
- Recurring tasks
- Karma/productivity system
- Task templates