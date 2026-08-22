import React from 'react';
import { cn } from './Button';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'green' | 'yellow' | 'red' | 'blue' | 'gray';
}

export function Badge({ children, variant = 'gray', className, ...props }: BadgeProps) {
  const variants = {
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
    blue: 'bg-blue-100 text-blue-800',
    gray: 'bg-gray-100 text-gray-800',
  };

  return (
    <span
      className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", variants[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
}
