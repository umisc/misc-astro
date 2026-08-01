import { useSyncExternalStore } from 'react';

const subscribe = (onChange: () => void) => {
  document.addEventListener('visibilitychange', onChange);
  return () => document.removeEventListener('visibilitychange', onChange);
};

const getSnapshot = () => document.visibilityState !== 'hidden';
const getServerSnapshot = () => true;

/** Whether the browser document is currently visible. */
export function useDocumentVisible(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
