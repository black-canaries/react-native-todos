# Todoist Clone - Product Roadmap

## Project Overview
A React Native Expo clone of the Todoist mobile app with dark mode as default theme and mocked data.

---

## Phase 1: Foundation (MVP) ✅ In Progress

### Core Infrastructure
- [x] Project initialization with Expo
- [x] Dark mode theme system
- [x] Navigation structure (React Navigation)
- [x] Mock data layer
- [x] TypeScript configuration

### Basic Task Management
- [ ] Create tasks with title
- [ ] Edit tasks
- [ ] Delete tasks
- [ ] Mark tasks as complete/incomplete
- [ ] Task descriptions/notes
- [ ] Due dates
- [ ] Priority levels (P1-P4)

### Core Views
- [ ] Inbox view (default catch-all)
- [ ] Today view (tasks due today)
- [ ] Upcoming view (upcoming tasks)

### Basic UI Components
- [ ] Task list component
- [ ] Task item component
- [ ] Add task button/input
- [ ] Bottom navigation
- [ ] Dark theme styling

---

## Phase 2: Organization & Structure

### Projects
- [ ] Create projects
- [ ] Edit projects
- [ ] Delete projects
- [ ] Project colors
- [ ] View tasks by project
- [ ] Favorite projects
- [ ] Archive projects

### Sections
- [ ] Create sections within projects
- [ ] Edit sections
- [ ] Delete sections
- [ ] Organize tasks into sections
- [ ] Reorder sections
- [ ] Collapse/expand sections

### Labels
- [ ] Create custom labels
- [ ] Edit labels
- [ ] Delete labels
- [ ] Label colors
- [ ] Assign labels to tasks
- [ ] Multiple labels per task
- [ ] Filter by labels

---

## Phase 3: Advanced Task Features

### Subtasks
- [ ] Create subtasks under parent tasks
- [ ] Nest multiple levels of subtasks
- [ ] Independent due dates for subtasks
- [ ] Independent priorities for subtasks
- [ ] Expand/collapse subtasks

### Recurring Tasks
- [ ] Daily recurring tasks
- [ ] Weekly recurring tasks
- [ ] Monthly recurring tasks
- [ ] Custom recurring patterns
- [ ] Natural language date parsing (e.g., "every Monday")

### Task Details
- [ ] Task comments
- [ ] File attachments (mocked)
- [ ] Task history/activity log
- [ ] Task assignee (mocked)
- [ ] Estimated duration

---

## Phase 4: Views & Filters

### Alternative Views
- [ ] List view (default)
- [ ] Board view (Kanban)
- [ ] Calendar view
- [ ] Switch between views

### Custom Filters
- [ ] Create custom filters
- [ ] Filter by priority
- [ ] Filter by label
- [ ] Filter by project
- [ ] Filter by due date
- [ ] Filter by assignee (mocked)
- [ ] Combine multiple filter criteria
- [ ] Save favorite filters

---

## Phase 5: Drag & Drop ✅ Priority

### Task Reordering
- [ ] Drag and drop tasks within a list
- [ ] Drag tasks between sections
- [ ] Drag tasks between projects
- [ ] Visual feedback during drag
- [ ] Haptic feedback

### Project & Section Management
- [ ] Drag and drop to reorder projects
- [ ] Drag and drop to reorder sections
- [ ] Drag tasks to change priority
- [ ] Drag tasks to change due date (calendar view)

---

## Phase 6: Productivity & Gamification

### Karma System
- [ ] Points for completing tasks
- [ ] Daily goal tracking
- [ ] Weekly goal tracking
- [ ] Productivity trends visualization
- [ ] Streak tracking
- [ ] Karma levels/badges

### Statistics
- [ ] Tasks completed today/week/month
- [ ] Tasks by project breakdown
- [ ] Tasks by priority breakdown
- [ ] Productivity charts
- [ ] Most productive days/times

---

## Phase 7: Collaboration (Mocked)

### Shared Projects
- [ ] Mock shared projects with collaborators
- [ ] Display mock avatars
- [ ] Mock assigned tasks
- [ ] Mock collaboration notifications

### Comments
- [ ] Add comments to tasks
- [ ] Mock user mentions
- [ ] Mock comment notifications
- [ ] Display mock timestamps

---

## Phase 8: Notifications & Reminders

### Reminders
- [ ] Due date reminders
- [ ] Custom time-based reminders
- [ ] Location-based reminders (mocked)
- [ ] Multiple reminders per task

### Notifications
- [ ] Push notifications for reminders
- [ ] Push notifications for due tasks
- [ ] Mock collaboration notifications
- [ ] Notification settings/preferences

---

## Phase 9: Templates & Quick Actions

### Project Templates
- [ ] Meeting agenda template
- [ ] Weekly planning template
- [ ] Project kickoff template
- [ ] Personal GTD template
- [ ] Custom template creation

### Quick Actions
- [ ] Quick add with natural language
- [ ] Task duplication
- [ ] Bulk task operations
- [ ] Keyboard shortcuts
- [ ] Swipe actions (complete, delete, reschedule)

---

## Phase 10: Polish & Enhancement

### User Experience
- [ ] Onboarding flow
- [ ] Empty states
- [ ] Loading states
- [ ] Error handling
- [ ] Offline mode support
- [ ] Data persistence (AsyncStorage)
- [ ] Search functionality
- [ ] Sort options (date, priority, alphabetical)

### Animations & Microinteractions
- [ ] Task completion animation
- [ ] Smooth transitions
- [ ] Pull to refresh
- [ ] Skeleton loaders
- [ ] Toast notifications
- [ ] Modal animations

### Settings
- [ ] Dark/light mode toggle (with dark as default)
- [ ] Language preferences (mocked)
- [ ] Notification preferences
- [ ] Default project settings
- [ ] Date & time format
- [ ] First day of week

---

## Phase 11: Advanced Features

### Smart Features
- [ ] Smart date suggestions
- [ ] Smart project suggestions
- [ ] Smart label suggestions
- [ ] Task insights
- [ ] Overdue task management

### Integrations (Mocked)
- [ ] Mock calendar integration
- [ ] Mock email integration
- [ ] Mock voice input
- [ ] Mock Google Drive/Dropbox

---

## Technical Debt & Optimization

### Performance
- [ ] List virtualization for large task lists
- [ ] Image optimization
- [ ] Code splitting
- [ ] Reduce bundle size
- [ ] Memory optimization

### Code Quality
- [ ] Unit tests for utilities
- [ ] Component tests
- [ ] Integration tests
- [ ] Code documentation
- [ ] ESLint/Prettier configuration
- [ ] Accessibility improvements

---

## Feature Priority Matrix

### High Priority (Phase 1-2)
- Core task CRUD operations
- Projects and sections
- Inbox, Today, Upcoming views
- Dark mode theme
- Basic navigation

### Medium Priority (Phase 3-5)
- Subtasks
- Labels
- Filters
- Board/Calendar views
- Drag and drop

### Low Priority (Phase 6-11)
- Karma system
- Templates
- Advanced filters
- Collaboration features (mocked)
- Integrations (mocked)

---

## Success Metrics

- [ ] App launches successfully on iOS and Android
- [ ] All core task operations work smoothly
- [ ] Drag and drop functionality is intuitive
- [ ] UI matches Todoist design patterns
- [ ] Dark mode is visually appealing
- [ ] Performance: 60fps animations
- [ ] Mock data is realistic and comprehensive

---

## Notes

- All data is mocked (no backend required)
- Focus on UI/UX fidelity to Todoist
- Dark mode is the default theme
- Use React Native best practices
- Prioritize mobile-first experience
- Keep dependencies minimal

---

**Last Updated:** 2025-11-15
**Current Phase:** Phase 1 - Foundation (MVP)
**Next Milestone:** Complete core task management
