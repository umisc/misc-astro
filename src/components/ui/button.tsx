import { cva, type VariantProps } from 'class-variance-authority';
import { mergeProps } from '@base-ui/react/merge-props';
import {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react';
import { CircleNotchIcon } from '@phosphor-icons/react';
import { useHoverFocusWithin } from '@/hooks/useHoverFocusWithin';
import { cn } from '@/lib/utils';
import { MatrixRain } from '@/components/effects/matrix-rain/MatrixRain';
const buttonStyles = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-bold tracking-wide whitespace-nowrap uppercase transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none motion-reduce:transition-none',
  {
    variants: {
      variant: {
        default:
          'border border-primary font-display text-primary shadow-[0_0_18px_oklch(0.82_0.14_175/0.22)] transition-all hover:bg-primary hover:text-primary-foreground hover:brightness-120',
        gradient: '',
        matrix:
          'group relative isolate overflow-hidden border border-primary/70 bg-background font-display text-primary shadow-[inset_0_0_14px] shadow-primary/15 transition-[color,border-color,box-shadow,transform,background-color] hover:border-primary hover:bg-card hover:font-bold hover:shadow-[inset_0_0_20px,0_0_18px] hover:shadow-primary/20 hover:brightness-120 motion-reduce:transform-none',
        outline:
          'border border-border bg-transparent font-display text-foreground hover:bg-secondary',
        ghost: 'font-display text-foreground hover:bg-muted-foreground/15',
        destructive:
          'bg-destructive font-display text-destructive-foreground hover:bg-destructive/85',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'min-h-10 px-3 py-2 text-sm',
        default: 'min-h-11 px-4 py-2.5 text-sm',
        lg: 'min-h-12 px-6 py-3 text-base',
        icon: 'size-11 p-0',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

type ButtonVariant = NonNullable<VariantProps<typeof buttonStyles>['variant']>;
type ButtonSize = NonNullable<VariantProps<typeof buttonStyles>['size']>;

export type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string | undefined;
  children?: ReactNode;
  ref?: Ref<HTMLElement>;
} & (
  | (Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & {
      href?: never;
      loading?: boolean;
    })
  | (Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'> & {
      href: string;
      loading?: never;
    })
);

/** @deprecated Prefer the descriptive `ButtonProps` name. */
export type Props = ButtonProps;

type CommonOptions = Pick<ButtonProps, 'variant' | 'size' | 'className'>;

export function buttonVariants({
  variant = 'default',
  size = 'default',
  className,
}: CommonOptions = {}) {
  return cn(buttonStyles({ variant, size }), className);
}

function Button({
  variant = 'default',
  size = 'default',
  className,
  children,
  href,
  type,
  ref,
  loading = false,
  ...props
}: ButtonProps) {
  const { hovered, focusWithin, interactionProps } = useHoverFocusWithin();
  const classes = cn(
    buttonVariants({ variant, size, className }),
    loading && 'pointer-events-none',
  );

  if (href !== undefined) {
    const anchorProps = mergeProps<'a'>(
      props as AnchorHTMLAttributes<HTMLAnchorElement>,
      interactionProps,
    );
    return (
      <a
        ref={ref as Ref<HTMLAnchorElement>}
        href={href}
        className={classes}
        {...anchorProps}
      >
        {variant === 'matrix' && <MatrixRain active={hovered || focusWithin} />}
        {children}
      </a>
    );
  }

  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>;
  const disabled = loading || buttonProps.disabled;
  const mergedButtonProps = mergeProps<'button'>(buttonProps, interactionProps);

  return (
    <button
      ref={ref as Ref<HTMLButtonElement>}
      type={type ?? 'button'}
      className={classes}
      {...mergedButtonProps}
      disabled={disabled}
      aria-busy={loading || undefined}
    >
      {variant === 'matrix' && (
        <MatrixRain active={hovered || focusWithin} visible={!disabled} />
      )}
      {loading && (
        <CircleNotchIcon
          className="size-4 motion-safe:animate-spin"
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
}

export default Button;
