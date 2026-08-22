import React from 'react';
import { useForm } from 'react-form-hook';
import { z } from 'zod';
import { useForm as useHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const leaveSchema = z.object({
  leave_type: z.enum(['sick', 'casual', 'annual', 'unpaid']),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  remarks: z.string().optional(),
});

type LeaveFormValues = z.infer<typeof leaveSchema>;

interface LeaveFormProps {
  onSubmit: (data: LeaveFormValues) => void;
  isLoading?: boolean;
}

export function LeaveForm({ onSubmit, isLoading }: LeaveFormProps) {
  const { register, handleSubmit, formState: { errors } } = useHookForm<LeaveFormValues>({
    resolver: zodResolver(leaveSchema),
    defaultValues: { leave_type: 'casual' }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
        <select 
          {...register('leave_type')} 
          className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="casual">Casual</option>
          <option value="sick">Sick</option>
          <option value="annual">Annual</option>
          <option value="unpaid">Unpaid</option>
        </select>
        {errors.leave_type && <p className="mt-1 text-sm text-red-500">{errors.leave_type.message}</p>}
      </div>
      <Input label="Start Date" type="date" {...register('start_date')} error={errors.start_date?.message} />
      <Input label="End Date" type="date" {...register('end_date')} error={errors.end_date?.message} />
      <Input label="Remarks" {...register('remarks')} error={errors.remarks?.message} />
      <Button type="submit" isLoading={isLoading} className="w-full">Apply</Button>
    </form>
  );
}
