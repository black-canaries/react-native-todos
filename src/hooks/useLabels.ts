import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

/**
 * Hook to fetch all labels
 */
export function useAllLabels() {
  const labels = useQuery(api.labelsQuery.list);
  return labels;
}

/**
 * Hook to fetch a single label by ID
 */
export function useLabel(labelId: string | undefined) {
  const label = useQuery(api.labelsQuery.get, labelId ? { id: labelId as any } : 'skip');
  return label;
}

/**
 * Hook for label mutations (create, update, delete)
 */
export function useLabelMutations() {
  const createLabel = useMutation(api.labelsMutation.create);
  const updateLabel = useMutation(api.labelsMutation.update);
  const deleteLabel = useMutation(api.labelsMutation.delete_);

  return {
    createLabel,
    updateLabel,
    deleteLabel,
  };
}
