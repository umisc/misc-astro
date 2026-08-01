import {
  useState,
  type FocusEventHandler,
  type PointerEventHandler,
} from 'react';
import type { Point } from '@/types/geometry';

type HoverFocusWithinState = Readonly<{
  hovered: boolean;
  focusWithin: boolean;
  entryOrigin: Point | undefined;
  interactionProps: {
    onPointerEnter: PointerEventHandler<HTMLElement>;
    onPointerLeave: PointerEventHandler<HTMLElement>;
    onFocus: FocusEventHandler<HTMLElement>;
    onBlur: FocusEventHandler<HTMLElement>;
  };
}>;

export function useHoverFocusWithin(): HoverFocusWithinState {
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [entryOrigin, setEntryOrigin] = useState<Point>();

  return {
    hovered,
    focusWithin,
    entryOrigin,
    interactionProps: {
      onPointerEnter: (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setEntryOrigin({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
        setHovered(true);
      },
      onPointerLeave: () => {
        setHovered(false);
        setEntryOrigin(undefined);
      },
      onFocus: () => setFocusWithin(true),
      onBlur: (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setFocusWithin(false);
        }
      },
    },
  };
}
