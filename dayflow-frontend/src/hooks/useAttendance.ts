import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyAttendance, getAllAttendance, checkIn, checkOut } from '../api/attendance';

export const useMyAttendance = () => {
  return useQuery({
    queryKey: ['attendance', 'me'],
    queryFn: getMyAttendance,
  });
};

export const useAllAttendance = () => {
  return useQuery({
    queryKey: ['attendance', 'all'],
    queryFn: getAllAttendance,
  });
};

export const useCheckIn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: checkIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

export const useCheckOut = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: checkOut,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};
