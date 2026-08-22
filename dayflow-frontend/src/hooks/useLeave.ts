import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applyLeave, getMyLeaves, getAllLeaves, updateLeaveDecision } from '../api/leave';

export const useMyLeaves = () => {
  return useQuery({
    queryKey: ['leaves', 'me'],
    queryFn: getMyLeaves,
  });
};

export const useAllLeaves = () => {
  return useQuery({
    queryKey: ['leaves', 'all'],
    queryFn: getAllLeaves,
  });
};

export const useApplyLeave = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: applyLeave,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useUpdateLeaveDecision = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, reviewer_comments }: { id: string, status: string, reviewer_comments: string }) => updateLeaveDecision(id, status, reviewer_comments),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
    },
  });
};
