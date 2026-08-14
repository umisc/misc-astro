import { navigate } from 'astro:transitions/client';
import { useCallback, type MouseEvent } from 'react';

type DialogRouteHistoryState = {
  dialogRoute?: string;
};

export function useDialogRouteNavigation(basePath: string) {
  const open = useCallback(
    async (event: MouseEvent<HTMLAnchorElement>, href: string) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;

      event.preventDefault();
      const scrollPosition = { left: window.scrollX, top: window.scrollY };
      const currentState =
        window.history.state && typeof window.history.state === 'object'
          ? window.history.state
          : {};

      await navigate(href, {
        history: 'push',
        sourceElement: event.currentTarget,
        state: {
          ...currentState,
          dialogRoute: basePath,
        } satisfies DialogRouteHistoryState,
      });
      window.scrollTo({ ...scrollPosition, behavior: 'instant' });
    },
    [basePath],
  );

  const close = useCallback(
    (fallbackUrl = basePath) => {
      const historyState = window.history
        .state as DialogRouteHistoryState | null;

      if (historyState?.dialogRoute === basePath) {
        window.history.back();
        return;
      }

      navigate(fallbackUrl, { history: 'replace' });
    },
    [basePath],
  );

  return { open, close };
}
