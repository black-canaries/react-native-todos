export type Priority = 1 | 2 | 3 | 4;

export type TaskStatus = 'active' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string; // ISO string
  createdAt: string; // ISO string
  projectId: string;
  sectionId?: string;
  labels: string[];
  subtasks: Task[];
  parentId?: string;
  order: number;
  assignedTo?: string; // Mock user id
  comments: Comment[];
  attachments: Attachment[];
}

export interface Project {
  id: string;
  name: string;
  color: string;
  icon?: string;
  isFavorite: boolean;
  isArchived: boolean;
  order: number;
  sections: Section[];
  viewType: 'list' | 'board' | 'calendar';
}

export interface Section {
  id: string;
  name: string;
  projectId: string;
  order: number;
  collapsed: boolean;
}

export interface Label {
  id: string;
  name: string;
  color: string;
  order: number;
}

export interface Filter {
  id: string;
  name: string;
  query: string;
  color: string;
  isFavorite: boolean;
  order: number;
}

export interface Comment {
  id: string;
  taskId: string;
  content: string;
  userId: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  taskId: string;
  fileName: string;
  fileUrl: string; // Mocked URL
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface ProductivityStats {
  tasksCompletedToday: number;
  tasksCompletedThisWeek: number;
  tasksCompletedThisMonth: number;
  currentStreak: number;
  longestStreak: number;
  karmaScore: number;
  dailyGoal: number;
  weeklyGoal: number;
}

export type ViewType = 'list' | 'board' | 'calendar';

export type SortBy = 'dueDate' | 'priority' | 'dateAdded' | 'alphabetical';

export type GroupBy = 'none' | 'project' | 'priority' | 'label' | 'dueDate';
