import type { Ref } from 'react';

type PixelShimmerProps = {
  active: boolean;
  canvasRef: Ref<HTMLCanvasElement>;
};

export function PixelShimmer({ active, canvasRef }: PixelShimmerProps) {
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 size-full transition-opacity ease-out motion-reduce:transition-none ${
        active ? `opacity-53 duration-500` : 'opacity-0 duration-300'
      }`}
    />
  );
}
