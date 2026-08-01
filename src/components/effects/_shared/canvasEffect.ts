export function syncCanvasSize(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  size: {
    width: number;
    height: number;
    maxPixelRatio?: number;
  },
) {
  const width = Number.isFinite(size.width) ? Math.max(1, size.width) : 1;
  const height = Number.isFinite(size.height) ? Math.max(1, size.height) : 1;
  const maxPixelRatio =
    size.maxPixelRatio === undefined || !Number.isFinite(size.maxPixelRatio)
      ? 2
      : Math.max(1, size.maxPixelRatio);
  const devicePixelRatio =
    typeof window === 'undefined' ||
    !Number.isFinite(window.devicePixelRatio) ||
    window.devicePixelRatio <= 0
      ? 1
      : window.devicePixelRatio;
  const pixelRatio = Math.min(devicePixelRatio, maxPixelRatio);

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvas.width = Math.max(1, Math.round(width * pixelRatio));
  canvas.height = Math.max(1, Math.round(height * pixelRatio));
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  return { width, height, pixelRatio };
}
