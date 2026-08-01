import { useSyncExternalStore } from 'react';

export function useMediaQuery(query: string, serverFallback = false) {
  return useSyncExternalStore(
    (onChange) => {
      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener('change', onChange);
      return () => mediaQuery.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverFallback,
  );
}

export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
