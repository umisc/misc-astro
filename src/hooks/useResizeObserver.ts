import { useLayoutEffect } from 'react';

type ResizeTargets = () => Iterable<Element | null | undefined>;

/**
 * Observes a dynamic set of elements and batches resize work into one animation
 * frame. Keep `getTargets` and `onResize` stable so observation is only rebuilt
 * when their behavior changes.
 */
export function useResizeObserver(
  getTargets: ResizeTargets,
  onResize: () => void,
) {
  useLayoutEffect(() => {
    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(onResize);
    };

    schedule();

    const observer = new ResizeObserver(schedule);
    for (const target of getTargets()) {
      if (target) observer.observe(target);
    }

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [getTargets, onResize]);
}
