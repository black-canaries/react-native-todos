/**
 * Adapter to convert Convex data format to the existing Task/Project types
 * This allows us to migrate screens incrementally without updating all components
 */

import { Doc } from '../../convex/_generated/dataModel';
import { Task, Project } from '../types';

/**
 * Convert a Convex task to the old Task format
 */
export function convexTaskToTask(convexTask: Doc<'tasks'>): Task {
  return {
    id: convexTask._id,
    title: convexTask.title,
    description: convexTask.description,
    completed: convexTask.status === 'completed',
    priority: convexTaskPriorityToNumber(convexTask.priority) as any,
    dueDate: convexTask.dueDate ? new Date(convexTask.dueDate).toISOString() : undefined,
    createdAt: new Date(convexTask.createdAt).toISOString(),
    projectId: convexTask.projectId,
    labels: convexTask.labels || [],
    subtasks: [], // Not yet implemented in Convex
    parentId: undefined,
    order: convexTask.order,
    assignedTo: undefined,
    sectionId: undefined,
    comments: [], // Not yet implemented in Convex
    attachments: [], // Not yet implemented in Convex
  };
}

/**
 * Convert multiple Convex tasks to Task format
 */
export function convexTasksToTasks(convexTasks: Doc<'tasks'>[]): Task[] {
  return convexTasks.map(convexTaskToTask);
}

/**
 * Convert a Convex project to the old Project format
 */
export function convexProjectToProject(convexProject: Doc<'projects'>): Project {
  return {
    id: convexProject._id,
    name: convexProject.name,
    color: convexProject.color,
    isFavorite: convexProject.isFavorite,
    isArchived: false, // Not in Convex schema
    order: convexProject.order,
    sections: [], // Not yet implemented in Convex
    viewType: 'list', // Not in Convex schema
  };
}

/**
 * Convert Convex priority string to old priority number
 */
function convexTaskPriorityToNumber(priority: string): number {
  switch (priority) {
    case 'p1':
      return 1;
    case 'p2':
      return 2;
    case 'p3':
      return 3;
    case 'p4':
      return 4;
    default:
      return 4;
  }
}

/**
 * Convert old priority number to Convex priority string
 */
export function taskPriorityToConvex(priority: number): 'p1' | 'p2' | 'p3' | 'p4' {
  switch (priority) {
    case 1:
      return 'p1';
    case 2:
      return 'p2';
    case 3:
      return 'p3';
    default:
      return 'p4';
  }
}

/**
 * Convert old completed boolean to Convex status
 */
export function taskStatusToConvex(completed: boolean): 'active' | 'completed' {
  return completed ? 'completed' : 'active';
}

/**
 * Extract numeric task ID from Convex string ID if needed
 */
export function extractTaskId(convexId: string): string {
  return convexId;
}
