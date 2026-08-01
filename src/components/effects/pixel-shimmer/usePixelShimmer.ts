import { useCallback, useLayoutEffect } from 'react';
import type { Point } from '@/types/geometry';
import { useCanvasEffect } from '../_shared/useCanvasEffect';
import { createPixelShimmer } from './renderer';

type UsePixelShimmerOptions = {
  active: boolean;
  entryOrigin: Point | undefined;
  gap?: number;
  colorTokens?: readonly `--${string}`[];
};

const DEFAULT_COLOR_TOKENS = [
  '--primary',
  '--muted-foreground',
  '--foreground',
] as const;

export function usePixelShimmer({
  active,
  entryOrigin,
  gap = 8,
  colorTokens = DEFAULT_COLOR_TOKENS,
}: UsePixelShimmerOptions) {
  const create = useCallback(
    ({
      canvas,
      styles,
    }: {
      canvas: HTMLCanvasElement;
      styles: CSSStyleDeclaration;
    }) => {
      const colors = colorTokens
        .map((token) => styles.getPropertyValue(token).trim())
        .filter(Boolean);
      return createPixelShimmer(canvas, colors, gap);
    },
    [colorTokens, gap],
  );
  const { canvasRef, controllerRef } = useCanvasEffect({ create });

  const burstAt = useCallback(
    (origin: Point) => {
      controllerRef.current?.burstAt(origin.x, origin.y);
    },
    [controllerRef],
  );

  useLayoutEffect(() => {
    controllerRef.current?.setActive(active, entryOrigin);
  }, [active, controllerRef, entryOrigin]);

  return { canvasRef, burstAt };
}
