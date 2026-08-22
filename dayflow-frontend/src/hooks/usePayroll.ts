import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyPayroll, getSalarySlip, updatePayroll } from '../api/payroll';

export const useMyPayroll = () => {
  return useQuery({
    queryKey: ['payroll', 'me'],
    queryFn: getMyPayroll,
  });
};

export const useSalarySlip = (user_id: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ['payroll', 'slip', user_id],
    queryFn: () => getSalarySlip(user_id),
    enabled,
  });
};

export const useUpdatePayroll = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ user_id, payload }: { user_id: string, payload: any }) => updatePayroll(user_id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
    },
  });
};
