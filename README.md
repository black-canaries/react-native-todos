# Todoist Clone - React Native Expo App

A feature-rich clone of the Todoist mobile app built with React Native and Expo, featuring dark mode, drag-and-drop functionality, and comprehensive task management.

## Features

### Implemented ✅

- **Dark Mode Theme** - Beautiful dark theme as default
- **Task Management**
  - Create, view, and complete tasks
  - Task priorities (P1-P4)
  - Due dates with smart formatting
  - Task descriptions and metadata
  - Subtasks support
  - Labels and comments
- **Drag & Drop** - Reorder tasks and projects with intuitive drag-and-drop
- **Multiple Views**
  - Inbox - Default catch-all for new tasks
  - Today - Tasks due today
  - Upcoming - Tasks grouped by due date
  - Projects - Organize tasks by project
- **Projects Management**
  - Multiple projects with custom colors
  - Favorite projects
  - Project sections
  - Task count indicators
- **Mock Data** - Realistic mock data for demonstration

### Coming Soon 🚀

See [Product Roadmap](./docs/PRODUCT_ROADMAP.md) for the complete feature roadmap including:
- Board/Kanban view
- Calendar view
- Custom filters
- Recurring tasks
- Productivity tracking (Karma system)
- Templates
- And much more!

## Documentation

Comprehensive documentation is available in the [`docs/`](./docs) folder:

| Document | Description |
|----------|-------------|
| [Product Roadmap](./docs/PRODUCT_ROADMAP.md) | Feature roadmap with phases and priorities |
| [Convex Setup Guide](./docs/CONVEX_SETUP.md) | Initial Convex backend setup and configuration |
| [Convex Migration Guide](./docs/CONVEX_MIGRATION.md) | Migrating from mock data to Convex queries |
| [Convex Seeding Guide](./docs/CONVEX_SEEDING.md) | Database seeding for development and testing |
| [AI Backend Implementation](./docs/AI_BACKEND_IMPLEMENTATION.md) | AI chat assistant integration with Convex |

## Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **UI Components**: Custom components with React Native
- **Drag & Drop**: react-native-draggable-flatlist
- **Icons**: @expo/vector-icons (Ionicons)
- **Haptics**: expo-haptics for tactile feedback

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (installed automatically)

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone <repository-url>
   cd react-native-todos
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Start the development server:
   \`\`\`bash
   npm start
   \`\`\`

4. Run on your device:
   - **iOS**: Press `i` in the terminal or scan the QR code with the Camera app
   - **Android**: Press `a` in the terminal or scan the QR code with the Expo Go app
   - **Web**: Press `w` in the terminal

## Project Structure

\`\`\`
react-native-todos/
├── app/                      # Expo Router app directory
│   ├── (tabs)/              # Tab-based navigation
│   │   ├── index.tsx        # Inbox screen
│   │   ├── today.tsx        # Today screen
│   │   ├── upcoming.tsx     # Upcoming screen
│   │   └── projects.tsx     # Projects screen
│   └── _layout.tsx          # Root layout
├── convex/                   # Convex backend
│   ├── schema.ts            # Database schema
│   ├── ai/                  # AI chat backend
│   ├── queries/             # Database queries
│   └── mutations/           # Database mutations
├── docs/                     # Project documentation
│   ├── PRODUCT_ROADMAP.md   # Feature roadmap
│   ├── CONVEX_SETUP.md      # Backend setup guide
│   ├── CONVEX_MIGRATION.md  # Migration guide
│   ├── CONVEX_SEEDING.md    # Database seeding
│   └── AI_BACKEND_IMPLEMENTATION.md
├── src/
│   ├── components/          # Reusable UI components
│   ├── hooks/               # Custom React hooks
│   ├── data/                # Mock data
│   ├── theme/               # Theme configuration
│   ├── types/               # TypeScript types
│   └── utils/               # Utility functions
├── assets/                  # Images and static assets
└── package.json
\`\`\`

## Key Features

### Drag and Drop

- **Tasks**: Long-press any task to drag and reorder
- **Projects**: Reorder projects by dragging
- **Haptic Feedback**: Feel the interactions with tactile feedback

### Dark Mode

The app defaults to a beautiful dark theme inspired by Todoist:
- Background: `#1f1f1f`
- Primary: `#de4c4a` (Todoist red)
- Custom color palette for priorities and projects

### Smart Date Formatting

Tasks display intelligent due dates:
- "Today" for tasks due today
- "Tomorrow" for tasks due tomorrow
- Day name for tasks within the week
- "Mon 15" format for tasks beyond the week
- Red color for overdue tasks

## Development

### Running Tests

\`\`\`bash
npm test
\`\`\`

### Building for Production

\`\`\`bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
\`\`\`

### Creating a Build

\`\`\`bash
# Install EAS CLI
npm install -g eas-cli

# Configure your project
eas build:configure

# Create a build
eas build --platform ios
eas build --platform android
\`\`\`

## Mock Data

The app includes realistic mock data:
- 18+ sample tasks across different projects
- 5 projects with various configurations
- 6 labels for categorization
- Task priorities, due dates, and descriptions
- Subtasks, comments, and sections

All data is defined in `src/data/mockData.ts` and can be easily customized.

## Customization

### Adding New Tasks

Tasks can be added through the UI by tapping the `+` button in any view.

### Modifying Mock Data

Edit `src/data/mockData.ts` to customize:
- Initial tasks and projects
- Labels and their colors
- User information
- Productivity statistics

### Changing Theme Colors

Edit `src/theme/colors.ts` to customize the color scheme.

## Contributing

This is a demonstration project. Feel free to fork and customize for your needs!

## Roadmap

See [Product Roadmap](./docs/PRODUCT_ROADMAP.md) for the complete feature roadmap.

## License

MIT

## Acknowledgments

- Inspired by [Todoist](https://todoist.com/)
- Built with [Expo](https://expo.dev/)
- Icons by [@expo/vector-icons](https://icons.expo.fyi/)
