import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';
import { metallicTextClassName } from './MetallicText';

export function PageTitle({
  className,
  ...props
}: ComponentPropsWithoutRef<'h1'>) {
  return (
    <h1
      className={cn(
        'font-display text-4xl leading-tight font-bold sm:text-6xl',
        metallicTextClassName,
        className,
      )}
      {...props}
    />
  );
}

export function SectionTitle({
  className,
  ...props
}: ComponentPropsWithoutRef<'h2'>) {
  return (
    <h2
      className={cn(
        'font-display text-3xl leading-tight font-bold sm:text-4xl',
        className,
      )}
      {...props}
    />
  );
}
