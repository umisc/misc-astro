import { type MouseEventHandler, type PointerEventHandler } from 'react';
import type { Point } from '@/types/geometry';

export function useActivationOrigin(onActivate: (origin: Point) => void) {
  const onPointerDown: PointerEventHandler<HTMLElement> = (event) => {
    if (event.button === 0) {
      const rect = event.currentTarget.getBoundingClientRect();
      onActivate({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    }
  };
  const onClick: MouseEventHandler<HTMLElement> = (event) => {
    if (event.detail === 0) {
      const rect = event.currentTarget.getBoundingClientRect();
      onActivate({ x: rect.width / 2, y: rect.height / 2 });
    }
  };

  return { onPointerDown, onClick };
}
