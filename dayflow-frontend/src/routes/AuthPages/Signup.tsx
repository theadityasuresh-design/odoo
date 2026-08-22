import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signup as signupApi } from '../../api/auth';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const signupSchema = z.object({
  employee_id: z.string().min(1, 'Employee ID is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm_password: z.string().min(1, 'Confirm your password'),
  role: z.enum(['employee', 'admin']),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
});

type SignupValues = z.infer<typeof signupSchema>;

export default function Signup() {
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: 'employee' }
  });

  const onSubmit = async (data: SignupValues) => {
    try {
      setError('');
      setSuccess('');
      const res = await signupApi(data);
      setSuccess(res.message);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Sign Up</h2>
        
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">{success}</div>}
        
        {!success && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Employee ID" {...register('employee_id')} error={errors.employee_id?.message} />
            <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select {...register('role')} className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <Input label="Password" type="password" {...register('password')} error={errors.password?.message} />
            <Input label="Confirm Password" type="password" {...register('confirm_password')} error={errors.confirm_password?.message} />
            <Button type="submit" isLoading={isSubmitting} className="w-full">Create Account</Button>
          </form>
        )}
        
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
