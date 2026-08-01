import {
  createContext,
  useContext,
  useRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type Ref,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { mergeProps } from '@base-ui/react/merge-props';
import { useInView } from 'motion/react';
import { useActivationOrigin } from '@/hooks/useActivationOrigin';
import { useHoverFocusWithin } from '@/hooks/useHoverFocusWithin';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useMergedRef } from '@/hooks/useMergedRef';
import { cn } from '@/lib/utils';
import { PixelShimmer } from '@/components/effects/pixel-shimmer/PixelShimmer';
import { usePixelShimmer } from '@/components/effects/pixel-shimmer/usePixelShimmer';

const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)';

export const cardVariants = cva(
  'relative overflow-hidden rounded-2xl border transition duration-200 ease-out motion-reduce:transition-none',
  {
    variants: {
      variant: {
        default: 'border-border bg-card shadow-sm',
        glass:
          'border-glass-border bg-glass shadow-[0_4px_30px_rgba(0,0,0,.18)] backdrop-blur-sm',
        interactive:
          'border-border bg-card shadow-sm hover:shadow-lg motion-safe:hover:-translate-y-1',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

type CardDensity = 'compact' | 'default' | 'spacious';
type CardEffect = 'pixel-shimmer';
type CardOwnProps = VariantProps<typeof cardVariants> & {
  density?: CardDensity;
  effect?: CardEffect;
  children?: ReactNode;
};
export type CardProps =
  | (ComponentPropsWithoutRef<'div'> &
      CardOwnProps & { as?: 'div'; ref?: Ref<HTMLDivElement> })
  | (ComponentPropsWithoutRef<'article'> &
      CardOwnProps & { as: 'article'; ref?: Ref<HTMLElement> })
  | (Omit<ComponentPropsWithoutRef<'a'>, 'href'> &
      CardOwnProps & { as: 'a'; href: string; ref?: Ref<HTMLAnchorElement> });

const CardDensityContext = createContext<CardDensity>('default');
const densityClasses: Record<CardDensity, string> = {
  compact: 'p-card-compact',
  default: 'p-card',
  spacious: 'p-card-spacious',
};

export function Card({ ref, ...props }: CardProps) {
  const cardProps = { ref, ...props } as CardProps;

  if (props.effect === 'pixel-shimmer') {
    return <PixelShimmerCard {...cardProps} />;
  }

  return <CardRoot {...cardProps} />;
}

function PixelShimmerCard({ ref, ...props }: CardProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const mergedRef = useMergedRef(rootRef, ref as Ref<HTMLElement> | undefined);
  const { hovered, focusWithin, entryOrigin, interactionProps } =
    useHoverFocusWithin();
  const hasFinePointer = useMediaQuery(FINE_POINTER_QUERY, true);
  const inView = useInView(rootRef, { amount: 0.55 });
  const active = focusWithin || (hasFinePointer ? hovered : inView);
  const { canvasRef, burstAt } = usePixelShimmer({ active, entryOrigin });
  const activationProps = useActivationOrigin(burstAt);
  const mergedProps = mergeProps<'div'>(
    props as ComponentPropsWithoutRef<'div'>,
    interactionProps,
    activationProps,
  );

  return (
    <CardRoot
      {...(mergedProps as CardProps)}
      ref={mergedRef}
      effect="pixel-shimmer"
    >
      <PixelShimmer active={active} canvasRef={canvasRef} />
      {props.children}
    </CardRoot>
  );
}

function CardRoot({ ref, ...props }: CardProps) {
  const effect = props.effect;
  const density = props.density ?? 'default';
  const effectClasses =
    effect === 'pixel-shimmer'
      ? 'group/pixel-shimmer isolate text-shadow-[0_2px_4px_rgb(0_0_0/0.9),0_2px_4px_rgb(0_0_0/0.9)]'
      : undefined;
  const children = <>{props.children}</>;

  if (props.as === 'a') {
    const anchorProps: ComponentPropsWithoutRef<'a'> & {
      as?: 'a';
      variant?: CardOwnProps['variant'];
      density?: CardDensity;
      effect?: CardEffect;
    } = { ...props };
    delete anchorProps.as;
    delete anchorProps.variant;
    delete anchorProps.density;
    delete anchorProps.effect;
    delete anchorProps.children;
    delete anchorProps.className;
    return (
      <CardDensityContext value={density}>
        <a
          ref={ref as Ref<HTMLAnchorElement>}
          data-density={density}
          className={cn(
            cardVariants({ variant: props.variant }),
            'group cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none',
            effectClasses,
            props.className,
          )}
          {...anchorProps}
        >
          {children}
        </a>
      </CardDensityContext>
    );
  }

  if (props.as === 'article') {
    const articleProps: ComponentPropsWithoutRef<'article'> & {
      as?: 'article';
      variant?: CardOwnProps['variant'];
      density?: CardDensity;
      effect?: CardEffect;
    } = { ...props };
    delete articleProps.as;
    delete articleProps.variant;
    delete articleProps.density;
    delete articleProps.effect;
    delete articleProps.children;
    delete articleProps.className;
    return (
      <CardDensityContext value={density}>
        <article
          ref={ref as Ref<HTMLElement>}
          data-density={density}
          className={cn(
            cardVariants({ variant: props.variant }),
            effectClasses,
            props.className,
          )}
          {...articleProps}
        >
          {children}
        </article>
      </CardDensityContext>
    );
  }

  const divProps = { ...props };
  delete divProps.as;
  delete divProps.variant;
  delete divProps.density;
  delete divProps.effect;
  delete divProps.children;
  delete divProps.className;
  return (
    <CardDensityContext value={density}>
      <div
        ref={ref as Ref<HTMLDivElement>}
        data-density={density}
        className={cn(
          cardVariants({ variant: props.variant }),
          effectClasses,
          props.className,
        )}
        {...divProps}
      >
        {children}
      </div>
    </CardDensityContext>
  );
}

type CardSectionProps = ComponentPropsWithoutRef<'div'> & {
  density?: CardDensity;
};

export function CardHeader({
  className,
  density: densityOverride,
  ...props
}: CardSectionProps) {
  const inheritedDensity = useContext(CardDensityContext);
  const density = densityOverride ?? inheritedDensity;
  return (
    <div
      className={cn(
        'flex flex-col gap-1.5',
        densityClasses[density],
        className,
      )}
      {...props}
    />
  );
}
export function CardContent({
  className,
  density: densityOverride,
  ...props
}: CardSectionProps) {
  const inheritedDensity = useContext(CardDensityContext);
  const density = densityOverride ?? inheritedDensity;
  return (
    <div
      className={cn(densityClasses[density], 'pt-0', className)}
      {...props}
    />
  );
}
export function CardFooter({
  className,
  density: densityOverride,
  ...props
}: CardSectionProps) {
  const inheritedDensity = useContext(CardDensityContext);
  const density = densityOverride ?? inheritedDensity;
  return (
    <div
      className={cn(
        'flex items-center',
        densityClasses[density],
        'pt-0',
        className,
      )}
      {...props}
    />
  );
}
type CardTitleProps = ComponentPropsWithoutRef<'h3'> & {
  as?: 'h2' | 'h3';
};

export function CardTitle({
  as: Component = 'h3',
  className,
  ...props
}: CardTitleProps) {
  return (
    <Component
      className={cn(
        'font-display text-xl font-bold transition-colors group-hover:text-primary group-focus-visible:text-primary motion-reduce:transition-none',
        className,
      )}
      {...props}
    />
  );
}
export function CardDescription({
  className,
  ...props
}: ComponentPropsWithoutRef<'p'>) {
  return (
    <p className={cn('text-sm text-muted-foreground', className)} {...props} />
  );
}
