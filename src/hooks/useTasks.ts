import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

/**
 * Hook to fetch all active tasks
 */
export function useActivesTasks() {
  const tasks = useQuery(api.tasksQuery.listActive);
  return tasks;
}

/**
 * Hook to fetch all completed tasks
 */
export function useCompletedTasks() {
  const tasks = useQuery(api.tasksQuery.listCompleted);
  return tasks;
}

/**
 * Hook to fetch all tasks
 */
export function useAllTasks() {
  const tasks = useQuery(api.tasksQuery.list);
  return tasks;
}

/**
 * Hook to fetch tasks for today
 */
export function useTodayTasks() {
  const tasks = useQuery(api.tasksQuery.listByToday);
  return tasks;
}

/**
 * Hook to fetch tasks for the upcoming 7 days
 */
export function useUpcomingTasks() {
  const tasks = useQuery(api.tasksQuery.listByUpcoming);
  return tasks;
}

/**
 * Hook to fetch tasks for a specific project
 */
export function useProjectTasks(projectId: string | undefined) {
  const tasks = useQuery(
    api.tasksQuery.listByProject,
    projectId ? { projectId: projectId as any } : 'skip'
  );
  return tasks;
}

/**
 * Hook to fetch a single task by ID
 */
export function useTask(taskId: string | undefined) {
  const task = useQuery(api.tasksQuery.get, taskId ? { id: taskId as any } : 'skip');
  return task;
}

/**
 * Hook for task mutations (create, update, delete, etc.)
 */
export function useTaskMutations() {
  const createTask = useMutation(api.tasksMutation.create);
  const updateTask = useMutation(api.tasksMutation.update);
  const toggleComplete = useMutation(api.tasksMutation.toggleComplete);
  const deleteTask = useMutation(api.tasksMutation.delete_);
  const reorderTask = useMutation(api.tasksMutation.reorder);
  const bulkReorderTasks = useMutation(api.tasksMutation.bulkReorder);

  return {
    createTask,
    updateTask,
    toggleComplete,
    deleteTask,
    reorderTask,
    bulkReorderTasks,
  };
}
