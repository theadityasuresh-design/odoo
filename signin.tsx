import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../../api/auth';

// ─── Validation Schema ────────────────────────────────────────────────────────

const signupSchema = z
  .object({
    employee_id: z
      .string()
      .min(3, 'Employee ID must be at least 3 characters')
      .max(20, 'Employee ID must be at most 20 characters'),
    email: z.string().email('Enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirm_password: z.string(),
    role: z.enum(['employee', 'admin'], {
      errorMap: () => ({ message: 'Please select a valid role' }),
    }),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ['confirm_password'],
    message: 'Passwords do not match',
  });

type SignupFormValues = z.infer<typeof signupSchema>;

// ─── Sub-components ───────────────────────────────────────────────────────────

interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
  registration: ReturnType<typeof useForm>['register'];
}

function InputField({
  id,
  label,
  type = 'text',
  placeholder,
  error,
  registration,
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        {...registration}
        className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm outline-none transition focus:ring-2 focus:ring-indigo-500 ${
          error
            ? 'border-red-400 bg-red-50 focus:ring-red-400'
            : 'border-gray-300 bg-white focus:border-indigo-500'
        }`}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Signup() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: 'employee' },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    setServerError(null);
    setSuccessMessage(null);

    try {
      await signup({
        employee_id: data.employee_id,
        email: data.email,
        password: data.password,
        role: data.role,
      });
      setSuccessMessage(
        'Account created! Check your email for a verification link.'
      );
      // Optionally redirect to login after a short delay
      setTimeout(() => navigate('/login'), 4000);
    } catch (err: any) {
      const detail =
        err?.response?.data?.detail ??
        'Something went wrong. Please try again.';
      setServerError(detail);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100 px-4 py-12">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-xl">

        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600">
            {/* Simple HR icon */}
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-4a4 4 0 100-8 4 4 0 000 8zm6 4a2 2 0 11-4 0 2 2 0 014 0zM5 18a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Dayflow HRMS
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Create your employee account
          </p>
        </div>

        {/* Success Banner */}
        {successMessage && (
          <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Banner */}
        {serverError && (
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
            <span>{serverError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <InputField
            id="employee_id"
            label="Employee ID"
            placeholder="e.g. EMP-001"
            error={errors.employee_id?.message}
            registration={register('employee_id')}
          />

          <InputField
            id="email"
            label="Work Email"
            type="email"
            placeholder="you@company.com"
            error={errors.email?.message}
            registration={register('email')}
          />

          <InputField
            id="password"
            label="Password"
            type="password"
            placeholder="Min 8 chars, 1 uppercase, 1 number"
            error={errors.password?.message}
            registration={register('password')}
          />

          <InputField
            id="confirm_password"
            label="Confirm Password"
            type="password"
            placeholder="Re-enter your password"
            error={errors.confirm_password?.message}
            registration={register('confirm_password')}
          />

          {/* Role Select */}
          <div className="flex flex-col gap-1">
            <label htmlFor="role" className="text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              id="role"
              {...register('role')}
              className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:ring-2 focus:ring-indigo-500 ${
                errors.role
                  ? 'border-red-400 bg-red-50 focus:ring-red-400'
                  : 'border-gray-300 bg-white focus:border-indigo-500'
              }`}
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && (
              <p className="text-xs text-red-500">{errors.role.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !!successMessage}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Creating account…
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
