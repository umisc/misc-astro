import { cn } from '@/lib/utils';
import { useMatrixRain } from './useMatrixRain';

type MatrixRainProps = {
  active: boolean;
  className?: string;
  visible?: boolean;
};

export function MatrixRain({
  active,
  className,
  visible = true,
}: MatrixRainProps) {
  const { canvasRef } = useMatrixRain({ active });

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 -z-20 size-full transition-opacity duration-150 motion-reduce:hidden motion-reduce:transition-none',
        visible ? (active ? 'opacity-90' : 'opacity-40') : 'hidden',
        className,
      )}
    />
  );
}
