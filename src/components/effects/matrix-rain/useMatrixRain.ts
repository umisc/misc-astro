import { useCallback, useLayoutEffect } from 'react';
import { useCanvasEffect } from '../_shared/useCanvasEffect';
import { createMatrixRain } from './renderer';

type UseMatrixRainOptions = {
  active: boolean;
};

const COLOR_TOKENS = {
  primary: '--primary',
  highlight: '--foreground',
} as const;

export function useMatrixRain({ active }: UseMatrixRainOptions) {
  const create = useCallback(
    ({
      canvas,
      styles,
    }: {
      canvas: HTMLCanvasElement;
      styles: CSSStyleDeclaration;
    }) =>
      createMatrixRain(canvas, {
        primary: styles.getPropertyValue(COLOR_TOKENS.primary).trim(),
        highlight: styles.getPropertyValue(COLOR_TOKENS.highlight).trim(),
      }),
    [],
  );
  const { canvasRef, controllerRef } = useCanvasEffect({ create });

  useLayoutEffect(() => {
    controllerRef.current?.setActive(active);
  }, [active, controllerRef]);

  return { canvasRef };
}
