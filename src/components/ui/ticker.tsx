import { useAnimationFrame, useInView, usePageInView } from 'motion/react';
import {
  Children,
  type FocusEvent,
  type PointerEvent,
  type ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useResizeObserver } from '@/hooks/useResizeObserver';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

import { cn } from '@/lib/utils';

export type TickerProps = {
  items: readonly ReactNode[];
  /** Signed pixels per second. Positive moves left. */
  velocity?: number;
  /** Controlled pause state for a caller-owned pause button. */
  paused?: boolean;
  /** Milliseconds to coast to a stop and resume when hovered. Set to 0 for an immediate pause. */
  hoverPauseDuration?: number;
  /** Applied to the item row. Intended for Tailwind gap utilities. */
  className?: string;
};

type ItemLayout = {
  start: number;
  left: number;
  top: number;
  width: number;
  height: number;
  copies: number;
};

type Layout = {
  cycle: number;
  items: ItemLayout[];
};

const idReferenceAttributes = [
  'for',
  'aria-activedescendant',
  'aria-controls',
  'aria-describedby',
  'aria-details',
  'aria-errormessage',
  'aria-labelledby',
  'aria-owns',
];

function wrap(min: number, max: number, value: number) {
  const range = max - min;
  return range > 0 ? ((((value - min) % range) + range) % range) + min : min;
}

function prepareClone(clone: HTMLElement) {
  clone.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((link) => {
    link.tabIndex = -1;
  });
  clone.querySelectorAll<HTMLElement>('[id]').forEach((element) => {
    element.removeAttribute('id');
  });
  clone.querySelectorAll<HTMLElement>('*').forEach((element) => {
    idReferenceAttributes.forEach((attribute) => {
      element.removeAttribute(attribute);
    });
  });
}

/**
 * Headless infinite ticker.
 *
 * Each item wraps independently. An item is cloned only when the viewport can
 * display two copies of that specific item at once, so long rows use no clones.
 */
export function Ticker({
  items,
  velocity = 50,
  paused = false,
  hoverPauseDuration = 400,
  className,
}: TickerProps) {
  const children = useMemo(() => Children.toArray(items), [items]);

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const originalRefs = useRef<Array<HTMLDivElement | null>>([]);
  const itemRefs = useRef<Array<Array<HTMLDivElement | null>>>([]);

  const [layout, setLayout] = useState<Layout | null>(null);
  const layoutRef = useRef<Layout | null>(null);
  const offsetRef = useRef(0);
  const hoverVelocityFactorRef = useRef(1);

  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);

  const reducedMotion = usePrefersReducedMotion();
  const inView = useInView(viewportRef, { initial: true });
  const pageInView = usePageInView();

  const render = useCallback(() => {
    const current = layoutRef.current;
    if (!current) return;

    current.items.forEach((item, itemIndex) => {
      const range = item.copies * current.cycle;

      for (let copy = 0; copy < item.copies; copy += 1) {
        const element = itemRefs.current[itemIndex]?.[copy];
        if (!element) continue;

        const position = wrap(
          -item.width,
          range - item.width,
          item.start + offsetRef.current + copy * current.cycle,
        );

        element.style.transform = `translate3d(${position - item.start}px,0,0)`;
      }
    });
  }, []);

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const originals = children.map((_, index) => originalRefs.current[index]);

    if (!viewport || !track || originals.some((item) => !item)) return;

    const elements = originals as HTMLDivElement[];
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    const boxes = elements.map((element) => ({
      left: element.offsetLeft,
      top: element.offsetTop,
      width: element.getBoundingClientRect().width,
      height: element.getBoundingClientRect().height,
    }));

    const min = Math.min(...boxes.map((item) => item.left));
    const max = Math.max(...boxes.map((item) => item.left + item.width));
    const cycle = max - min + gap;

    if (cycle <= 0 || viewport.clientWidth <= 0) return;

    const next: Layout = {
      cycle,
      items: boxes.map((item) => ({
        ...item,
        start: item.left - min,
        // This is the minimum number of simultaneous copies that can intersect
        // the viewport for this item.
        copies: Math.max(
          1,
          Math.ceil((viewport.clientWidth + item.width) / cycle - 1e-6),
        ),
      })),
    };

    layoutRef.current = next;
    offsetRef.current %= cycle;
    render();
    setLayout(next);
  }, [children, render]);

  const getResizeTargets = useCallback(
    () => [
      viewportRef.current,
      trackRef.current,
      ...originalRefs.current.slice(0, children.length),
    ],
    [children.length],
  );

  useResizeObserver(getResizeTargets, measure);

  const reveal = useCallback(
    (element: HTMLElement) => {
      const viewport = viewportRef.current;
      if (!viewport) return;

      const item =
        element.closest<HTMLElement>('[data-ticker-original]') ?? element;
      const viewportBox = viewport.getBoundingClientRect();
      const itemBox = item.getBoundingClientRect();

      if (reducedMotion) {
        if (itemBox.left < viewportBox.left) {
          viewport.scrollLeft -= viewportBox.left - itemBox.left;
        } else if (itemBox.right > viewportBox.right) {
          viewport.scrollLeft += itemBox.right - viewportBox.right;
        }
        return;
      }

      if (itemBox.left < viewportBox.left) {
        offsetRef.current += viewportBox.left - itemBox.left;
        render();
      } else if (itemBox.right > viewportBox.right) {
        offsetRef.current -= itemBox.right - viewportBox.right;
        render();
      }
    },
    [reducedMotion, render],
  );

  const handleFocus = useCallback(
    (event: FocusEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement;
      const clone = target.closest<HTMLElement>('[data-ticker-clone]');

      if (clone) {
        const itemIndex = Number(clone.dataset.tickerItem);
        const originalLink =
          originalRefs.current[itemIndex]?.querySelector<HTMLAnchorElement>(
            'a[href]',
          );

        originalLink?.focus({ preventScroll: true });
        if (originalLink) reveal(originalLink);
        return;
      }

      setFocused(true);
      reveal(target);
    },
    [reveal],
  );

  const handleBlur = useCallback((event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget as Node | null;
    if (next && viewportRef.current?.contains(next)) return;

    setFocused(false);
  }, []);

  const moving = Boolean(
    layout &&
    velocity &&
    !paused &&
    !reducedMotion &&
    !focused &&
    inView &&
    pageInView,
  );

  const update = useCallback(
    (_time: number, delta: number) => {
      if (!moving) {
        hoverVelocityFactorRef.current = hovered ? 0 : 1;
        return;
      }

      const current = layoutRef.current;
      if (!current) return;

      const frameDelta = Math.min(delta, 64);
      const targetFactor = hovered ? 0 : 1;

      if (hoverPauseDuration <= 0) {
        hoverVelocityFactorRef.current = targetFactor;
      } else {
        const easing = 1 - Math.exp((-4.6 * frameDelta) / hoverPauseDuration);
        hoverVelocityFactorRef.current +=
          (targetFactor - hoverVelocityFactorRef.current) * easing;

        if (Math.abs(targetFactor - hoverVelocityFactorRef.current) < 0.001) {
          hoverVelocityFactorRef.current = targetFactor;
        }
      }

      offsetRef.current -=
        (velocity * hoverVelocityFactorRef.current * frameDelta) / 1000;
      if (Math.abs(offsetRef.current) > current.cycle * 10_000) {
        offsetRef.current %= current.cycle;
      }
      render();
    },
    [hovered, hoverPauseDuration, moving, render, velocity],
  );

  useAnimationFrame(update);

  if (!children.length) return null;

  return (
    <div
      ref={viewportRef}
      className={reducedMotion ? 'overflow-x-auto' : 'overflow-hidden'}
      data-slot="ticker"
      onBlurCapture={handleBlur}
      onFocusCapture={handleFocus}
      onPointerEnter={(event: PointerEvent<HTMLDivElement>) => {
        if (event.pointerType !== 'touch') setHovered(true);
      }}
      onPointerLeave={(event: PointerEvent<HTMLDivElement>) => {
        if (event.pointerType !== 'touch') setHovered(false);
      }}
    >
      <div
        ref={trackRef}
        className={cn('relative flex w-max items-center', className)}
        data-slot="ticker-track"
      >
        {children.map((child, itemIndex) => (
          <div
            key={`original-${itemIndex}`}
            ref={(element) => {
              originalRefs.current[itemIndex] = element;
              itemRefs.current[itemIndex] ??= [];
              itemRefs.current[itemIndex][0] = element;
            }}
            className="shrink-0 will-change-transform"
            data-ticker-item={itemIndex}
            data-ticker-original=""
            style={reducedMotion ? { transform: 'none' } : undefined}
          >
            {child}
          </div>
        ))}

        {!reducedMotion &&
          layout?.items.flatMap((item, itemIndex) =>
            Array.from({ length: item.copies - 1 }, (_, index) => {
              const copy = index + 1;

              return (
                <div
                  key={`clone-${itemIndex}-${copy}`}
                  ref={(element) => {
                    itemRefs.current[itemIndex] ??= [];
                    itemRefs.current[itemIndex][copy] = element;
                    if (element) {
                      // Clone links stay pointer-interactive while the original
                      // links alone remain in the accessibility tree and tab order.
                      prepareClone(element);
                      render();
                    }
                  }}
                  aria-hidden
                  className="absolute shrink-0 will-change-transform"
                  data-ticker-clone=""
                  data-ticker-item={itemIndex}
                  style={{
                    left: item.left,
                    top: item.top,
                    width: item.width,
                    height: item.height,
                  }}
                >
                  {children[itemIndex]}
                </div>
              );
            }),
          )}
      </div>
    </div>
  );
}
