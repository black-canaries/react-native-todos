import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

/**
 * Hook to fetch all projects
 */
export function useAllProjects() {
  const projects = useQuery(api.projectsQuery.list);
  return projects;
}

/**
 * Hook to fetch all projects with task counts
 */
export function useProjectsWithTaskCounts() {
  const projects = useQuery(api.projectsQuery.listWithTaskCounts);
  return projects;
}

/**
 * Hook to fetch a single project by ID
 */
export function useProject(projectId: string | undefined) {
  const project = useQuery(api.projectsQuery.get, projectId ? { id: projectId as any } : 'skip');
  return project;
}

/**
 * Hook for project mutations (create, update, delete, reorder, display settings)
 */
export function useProjectMutations() {
  const createProject = useMutation(api.projectsMutation.create);
  const updateProject = useMutation(api.projectsMutation.update);
  const deleteProject = useMutation(api.projectsMutation.delete_);
  const reorderProject = useMutation(api.projectsMutation.reorder);
  const updateDisplaySettings = useMutation(api.projectsMutation.updateDisplaySettings);

  return {
    createProject,
    updateProject,
    deleteProject,
    reorderProject,
    updateDisplaySettings,
  };
}
