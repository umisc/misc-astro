import { Field as FieldPrimitive } from '@base-ui/react/field';
import type {
  ComponentProps,
  ComponentPropsWithoutRef,
  ReactNode,
} from 'react';
import { cn } from '@/lib/utils';

export function FieldGroup({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>) {
  return <div className={cn('grid gap-content', className)} {...props} />;
}

export function Field({
  className,
  ...props
}: ComponentProps<typeof FieldPrimitive.Root>) {
  return (
    <FieldPrimitive.Root className={cn('grid gap-2', className)} {...props} />
  );
}

export function FieldLabel({
  className,
  ...props
}: ComponentProps<typeof FieldPrimitive.Label>) {
  return (
    <FieldPrimitive.Label
      className={cn('text-sm text-foreground', className)}
      {...props}
    />
  );
}

export function FieldDescription({
  className,
  ...props
}: ComponentProps<typeof FieldPrimitive.Description>) {
  return (
    <FieldPrimitive.Description
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

export function FieldError({
  className,
  children,
  ...props
}: ComponentProps<typeof FieldPrimitive.Error> & { children?: ReactNode }) {
  if (!children) return null;
  return (
    <FieldPrimitive.Error
      role="alert"
      className={cn('text-sm text-destructive', className)}
      {...props}
    >
      {children}
    </FieldPrimitive.Error>
  );
}

export function FieldSet({
  className,
  ...props
}: ComponentPropsWithoutRef<'fieldset'>) {
  return <fieldset className={cn('grid gap-content', className)} {...props} />;
}

export function FieldLegend({
  className,
  ...props
}: ComponentPropsWithoutRef<'legend'>) {
  return (
    <legend
      className={cn('font-display text-lg font-bold', className)}
      {...props}
    />
  );
}
