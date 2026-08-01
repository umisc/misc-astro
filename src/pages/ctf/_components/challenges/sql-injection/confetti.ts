import { animate } from 'motion';
import type { Point } from '@/types/geometry';

type MutablePoint = {
  x: number;
  y: number;
};

type ConfettiOptions = {
  origin: Point;
  colors: readonly string[];
  particleCount?: number;
  spread?: number;
};

type Particle = MutablePoint & {
  color: string;
  rotation: number;
  rotationSpeed: number;
  size: number;
  velocity: MutablePoint;
};

const GRAVITY = 0.18;
const DRAG = 0.985;
const DURATION_SECONDS = 2.4;

export function burstConfetti({
  origin,
  colors,
  particleCount = 150,
  spread = 80,
}: ConfettiOptions) {
  if (typeof document === 'undefined' || colors.length === 0) return;

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return;

  canvas.setAttribute('aria-hidden', 'true');
  Object.assign(canvas.style, {
    inset: '0',
    pointerEvents: 'none',
    position: 'fixed',
    zIndex: '9999',
  });
  document.body.append(canvas);

  const resize = () => {
    const scale = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * scale;
    canvas.height = window.innerHeight * scale;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    context.setTransform(scale, 0, 0, scale, 0, 0);
  };
  resize();
  window.addEventListener('resize', resize);

  const halfSpread = spread / 2;
  const particles = Array.from({ length: particleCount }, (): Particle => {
    const angle =
      ((-90 + (Math.random() * spread - halfSpread)) * Math.PI) / 180;
    const speed = 7 + Math.random() * 9;

    return {
      ...origin,
      color: colors[Math.floor(Math.random() * colors.length)]!,
      rotation: Math.random() * Math.PI,
      rotationSpeed: (Math.random() - 0.5) * 0.3,
      size: 5 + Math.random() * 6,
      velocity: {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed,
      },
    };
  });

  const remove = () => {
    window.removeEventListener('resize', resize);
    canvas.remove();
  };

  let previousProgress = 0;

  animate(0, 1, {
    duration: DURATION_SECONDS,
    ease: 'linear',
    onUpdate: (progress) => {
      const frameScale =
        ((progress - previousProgress) * DURATION_SECONDS * 1_000) /
        (1_000 / 60);
      previousProgress = progress;

      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (const particle of particles) {
        const drag = DRAG ** frameScale;
        particle.velocity.x *= drag;
        particle.velocity.y = particle.velocity.y * drag + GRAVITY * frameScale;
        particle.x += particle.velocity.x * frameScale;
        particle.y += particle.velocity.y * frameScale;
        particle.rotation += particle.rotationSpeed * frameScale;

        context.save();
        context.globalAlpha = 1 - progress;
        context.fillStyle = particle.color;
        context.translate(particle.x, particle.y);
        context.rotate(particle.rotation);
        context.fillRect(
          -particle.size / 2,
          -particle.size / 4,
          particle.size,
          particle.size / 2,
        );
        context.restore();
      }
    },
    onComplete: remove,
  });
}
