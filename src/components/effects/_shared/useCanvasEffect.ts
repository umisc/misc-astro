import {
  useCallback,
  useLayoutEffect,
  useRef,
  type RefCallback,
  type RefObject,
} from 'react';
import { useDocumentVisible } from '@/hooks/useDocumentVisible';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

export interface CanvasEffectController {
  resize(width: number, height: number): void;
  setReducedMotion(reduced: boolean): void;
  setDocumentVisible(visible: boolean): void;
  destroy(): void;
}

export type CanvasEffectFactoryContext = {
  canvas: HTMLCanvasElement;
  styles: CSSStyleDeclaration;
};

type UseCanvasEffectOptions<T extends CanvasEffectController> = {
  create: (context: CanvasEffectFactoryContext) => T | null;
};

export function useCanvasEffect<T extends CanvasEffectController>({
  create,
}: UseCanvasEffectOptions<T>): {
  canvasRef: RefCallback<HTMLCanvasElement>;
  controllerRef: RefObject<T | null>;
} {
  const controllerRef = useRef<T | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const documentVisible = useDocumentVisible();
  const reducedMotionRef = useRef(reducedMotion);
  const documentVisibleRef = useRef(documentVisible);
  reducedMotionRef.current = reducedMotion;
  documentVisibleRef.current = documentVisible;

  const canvasRef = useCallback<RefCallback<HTMLCanvasElement>>(
    (canvas) => {
      if (!canvas) return;

      const controller = create({
        canvas,
        styles: getComputedStyle(canvas),
      });
      if (!controller) return undefined;

      controllerRef.current = controller;
      controller.setReducedMotion(reducedMotionRef.current);
      controller.setDocumentVisible(documentVisibleRef.current);

      const resize = () => {
        const { width, height } = canvas.getBoundingClientRect();
        controller.resize(width, height);
      };
      resize();

      const observer = new ResizeObserver(resize);
      observer.observe(canvas);

      return () => {
        observer.disconnect();
        controller.destroy();
        if (controllerRef.current === controller) controllerRef.current = null;
      };
    },
    [create],
  );

  useLayoutEffect(() => {
    controllerRef.current?.setReducedMotion(reducedMotion);
  }, [reducedMotion]);

  useLayoutEffect(() => {
    controllerRef.current?.setDocumentVisible(documentVisible);
  }, [documentVisible]);

  return { canvasRef, controllerRef };
}
