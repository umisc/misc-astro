import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium',
  {
    variants: {
      variant: {
        default:
          'border-zinc-500/60 bg-linear-to-r from-zinc-800 via-zinc-600 to-zinc-900 bg-size-[200%_100%] text-zinc-50 motion-safe:animate-metallic-shimmer motion-reduce:animate-none',
        secondary: 'border-border bg-secondary text-secondary-foreground',
        outline: 'border-border text-foreground',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
