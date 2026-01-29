import { cn } from '@/lib/utils/cn';
import { HTMLAttributes, forwardRef } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'blue' | 'green' | 'yellow' | 'red' | 'gray';
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          variant === 'default' && 'bg-gray-100 text-gray-800',
          variant === 'blue' && 'bg-blue-100 text-blue-800',
          variant === 'green' && 'bg-green-100 text-green-800',
          variant === 'yellow' && 'bg-yellow-100 text-yellow-800',
          variant === 'red' && 'bg-red-100 text-red-800',
          variant === 'gray' && 'bg-gray-100 text-gray-600',
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
