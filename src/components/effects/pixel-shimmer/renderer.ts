import type { Point } from '@/types/geometry';
import { syncCanvasSize } from '../_shared/canvasEffect';

type Pixel = Point & {
  color: string;
  phase: number;
  size: number;
};

type Burst = Point & {
  startedAt: number;
};

type Reveal = Point & {
  startedAt: number;
  progress: number;
};

const TAU = Math.PI * 2;
const BURST_DURATION = 620;
const REVEAL_DURATION = 800;
const MAX_BURSTS = 4;

export function createPixelShimmer(
  canvas: HTMLCanvasElement,
  colors: readonly string[],
  gap = 8,
) {
  const context = canvas.getContext('2d');
  if (!context || colors.length === 0) return null;

  let pixels: Pixel[] = [];
  let width = 0;
  let height = 0;
  let frame = 0;
  let active = false;
  let reducedMotion = false;
  let documentVisible = true;
  let bursts: Burst[] = [];
  let reveal: Reveal | null = null;

  const stop = () => {
    cancelAnimationFrame(frame);
    frame = 0;
  };

  const draw = (time: number, showShimmer = active) => {
    context.clearRect(0, 0, width, height);
    if (reducedMotion) return;

    const maxRadius = Math.hypot(width, height);
    const waveWidth = Math.max(48, maxRadius * 0.13);
    const easedRevealProgress = reveal
      ? 1 - Math.pow(1 - reveal.progress, 3)
      : 1;
    const revealRadius = reveal
      ? Math.max(
          Math.hypot(reveal.x, reveal.y),
          Math.hypot(width - reveal.x, reveal.y),
          Math.hypot(reveal.x, height - reveal.y),
          Math.hypot(width - reveal.x, height - reveal.y),
        ) * easedRevealProgress
      : maxRadius;
    const revealEdge = Math.max(gap * 2, Math.min(width, height) * 0.08);

    for (const pixel of pixels) {
      let brightness = showShimmer
        ? 0.42 + Math.sin(time * 0.0024 + pixel.phase) * 0.2
        : 0;
      if (showShimmer && reveal && reveal.progress < 1) {
        const distance = Math.hypot(pixel.x - reveal.x, pixel.y - reveal.y);
        const edgeProgress = Math.max(
          0,
          Math.min(1, (revealRadius - distance + revealEdge) / revealEdge),
        );
        brightness *= edgeProgress * edgeProgress * (3 - 2 * edgeProgress);
      }

      for (const burst of bursts) {
        const distance = Math.hypot(pixel.x - burst.x, pixel.y - burst.y);
        const burstAge = time - burst.startedAt;
        const burstProgress = Math.min(burstAge / BURST_DURATION, 1);
        const burstRadius = burstProgress * maxRadius;
        brightness +=
          Math.max(0, 1 - Math.abs(distance - burstRadius) / waveWidth) *
          (1 - burstProgress) *
          1.25;
      }

      if (brightness <= 0) continue;
      const size = pixel.size * (0.82 + Math.min(brightness, 1.2) * 0.38);
      context.globalAlpha = Math.min(brightness, 1);
      context.fillStyle = pixel.color;
      context.fillRect(pixel.x - size / 2, pixel.y - size / 2, size, size);
    }
    context.globalAlpha = 1;
  };

  const animate = (time: number) => {
    frame = 0;
    bursts = bursts.filter((burst) => time - burst.startedAt < BURST_DURATION);
    if (reveal && reveal.progress < 1) {
      reveal.progress = Math.min(
        (time - reveal.startedAt) / REVEAL_DURATION,
        1,
      );
    }
    draw(time);
    if (documentVisible && !reducedMotion && (active || bursts.length > 0)) {
      frame = requestAnimationFrame(animate);
    } else if (!reducedMotion && !active) {
      draw(time, true);
    }
  };

  const render = () => {
    if (frame || reducedMotion || !documentVisible) return;
    frame = requestAnimationFrame(animate);
  };

  return {
    resize(nextWidth: number, nextHeight: number) {
      ({ width, height } = syncCanvasSize(canvas, context, {
        width: nextWidth,
        height: nextHeight,
      }));

      pixels = [];
      for (let x = gap / 2; x < width; x += gap) {
        for (let y = gap / 2; y < height; y += gap) {
          if (Math.random() > 0.68) continue;
          const color = colors[Math.floor(Math.random() * colors.length)];
          if (color === undefined) continue;
          pixels.push({
            x,
            y,
            color,
            phase: Math.random() * TAU,
            size: 0.65 + Math.random() * 1.7,
          });
        }
      }
      draw(performance.now(), true);
    },
    setActive(nextActive: boolean, origin?: Point) {
      if (nextActive && !active) {
        reveal = {
          x: origin?.x ?? width / 2,
          y: origin?.y ?? height / 2,
          startedAt: performance.now(),
          progress: 0,
        };
      } else if (!nextActive) {
        reveal = null;
      }
      active = nextActive;
      if (active || bursts.length > 0) {
        render();
      } else {
        stop();
      }
    },
    setReducedMotion(nextReducedMotion: boolean) {
      reducedMotion = nextReducedMotion;
      if (reducedMotion) {
        stop();
        bursts = [];
        reveal = null;
        draw(performance.now());
      } else if (active || bursts.length > 0) {
        render();
      } else {
        draw(performance.now(), true);
      }
    },
    setDocumentVisible(nextVisible: boolean) {
      documentVisible = nextVisible;
      if (documentVisible && (active || bursts.length > 0)) {
        render();
      } else if (!documentVisible) {
        stop();
      }
    },
    burstAt(x: number, y: number) {
      if (reducedMotion) return;

      const burst = { x, y, startedAt: performance.now() };
      bursts.push(burst);
      if (bursts.length > MAX_BURSTS) {
        bursts.splice(0, bursts.length - MAX_BURSTS);
      }

      render();
    },
    destroy() {
      stop();
      pixels = [];
      bursts = [];
      reveal = null;
      context.clearRect(0, 0, width, height);
    },
  };
}
