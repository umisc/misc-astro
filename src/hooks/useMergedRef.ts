import { useCallback, type Ref, type RefCallback, type RefObject } from 'react';

/**
 * Composes a component-owned object ref with a ref supplied by its consumer.
 */
export function useMergedRef<T>(
  internalRef: RefObject<T | null>,
  forwardedRef?: Ref<T>,
): RefCallback<T> {
  return useCallback(
    (node: T | null) => {
      internalRef.current = node;

      if (typeof forwardedRef === 'function') {
        const cleanup = forwardedRef(node);
        return () => {
          internalRef.current = null;
          cleanup?.();
        };
      }

      if (forwardedRef) forwardedRef.current = node;

      return () => {
        internalRef.current = null;
        if (forwardedRef) forwardedRef.current = null;
      };
    },
    [forwardedRef, internalRef],
  );
}
