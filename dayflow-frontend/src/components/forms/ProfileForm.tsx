import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const profileSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  phone: z.string().min(1, "Phone is required"),
  address: z.string().min(1, "Address is required"),
  job_title: z.string().min(1, "Job title is required"),
  department: z.string().min(1, "Department is required"),
  profile_picture_url: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  initialData: any;
  isAdmin: boolean;
  onSubmit: (data: ProfileFormValues) => void;
  isLoading?: boolean;
}

export function ProfileForm({ initialData, isAdmin, onSubmit, isLoading }: ProfileFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Full Name" {...register('full_name')} error={errors.full_name?.message} disabled={!isAdmin} />
      <Input label="Job Title" {...register('job_title')} error={errors.job_title?.message} disabled={!isAdmin} />
      <Input label="Department" {...register('department')} error={errors.department?.message} disabled={!isAdmin} />
      
      <Input label="Phone" {...register('phone')} error={errors.phone?.message} />
      <Input label="Address" {...register('address')} error={errors.address?.message} />
      <Input label="Profile Picture URL" {...register('profile_picture_url')} error={errors.profile_picture_url?.message} />
      
      <Button type="submit" isLoading={isLoading}>Save Profile</Button>
    </form>
  );
}
