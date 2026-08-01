import { syncCanvasSize } from '../_shared/canvasEffect';

type MatrixRainColors = Readonly<{
  primary: string;
  highlight: string;
}>;

const GLYPHS = '01アイウエオカキクケコサシスセソ<>/{}[]#$%&*';
const FONT_SIZE = 10;
const FRAME_INTERVAL = 1000 / 30;

export function createMatrixRain(
  canvas: HTMLCanvasElement,
  colors: MatrixRainColors,
) {
  const context = canvas.getContext('2d');
  if (!context) return null;

  let width = 0;
  let height = 0;
  let frame = 0;
  let previousTime = 0;
  let active = false;
  let reducedMotion = false;
  let documentVisible = true;
  let drops: number[] = [];

  const configureText = () => {
    context.font = `${FONT_SIZE}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    context.textAlign = 'center';
  };

  const drawStatic = () => {
    context.clearRect(0, 0, width, height);
    configureText();
    context.fillStyle = colors.primary;
    context.globalAlpha = 0.45;

    for (let index = 0; index < drops.length; index += 2) {
      const glyph = GLYPHS.charAt((index * 5) % GLYPHS.length);
      const x = index * FONT_SIZE + FONT_SIZE / 2;
      const y = 10 + ((index * 13) % Math.max(12, height - 6));
      context.fillText(glyph, x, y);
    }

    context.globalAlpha = 1;
  };

  const stop = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    previousTime = 0;
  };

  const draw = (time: number) => {
    frame = 0;

    if (!active || reducedMotion || !documentVisible) {
      return;
    }

    frame = requestAnimationFrame(draw);
    if (time - previousTime < FRAME_INTERVAL) return;
    previousTime = time;

    context.globalCompositeOperation = 'destination-out';
    context.globalAlpha = 0.2;
    context.fillRect(0, 0, width, height);
    context.globalCompositeOperation = 'source-over';
    context.globalAlpha = 1;
    configureText();

    for (let index = 0; index < drops.length; index += 1) {
      const glyph = GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));
      const drop = drops[index];
      if (drop === undefined) continue;
      const x = index * FONT_SIZE + FONT_SIZE / 2;
      const y = drop * FONT_SIZE;

      context.fillStyle =
        Math.random() > 0.88 ? colors.highlight : colors.primary;
      context.globalAlpha = Math.random() > 0.88 ? 1 : 0.95;
      context.fillText(glyph, x, y);

      if (y > height && Math.random() > 0.94) {
        drops[index] = -Math.random() * 4;
      } else {
        drops[index] = drop + 0.85 + Math.random() * 0.45;
      }
    }

    context.globalAlpha = 1;
  };

  const start = () => {
    if (frame || !active || reducedMotion || !documentVisible) return;
    frame = requestAnimationFrame(draw);
  };

  return {
    resize(nextWidth: number, nextHeight: number) {
      ({ width, height } = syncCanvasSize(canvas, context, {
        width: nextWidth,
        height: nextHeight,
      }));

      drops = Array.from(
        { length: Math.ceil(width / FONT_SIZE) },
        () => -Math.random() * 8,
      );
      drawStatic();
      start();
    },
    setActive(nextActive: boolean) {
      active = nextActive;
      if (active) {
        start();
      } else {
        stop();
        drawStatic();
      }
    },
    setReducedMotion(nextReducedMotion: boolean) {
      reducedMotion = nextReducedMotion;
      if (reducedMotion) {
        stop();
        drawStatic();
      } else {
        start();
      }
    },
    setDocumentVisible(nextVisible: boolean) {
      documentVisible = nextVisible;
      if (documentVisible) {
        start();
      } else {
        stop();
      }
    },
    destroy() {
      stop();
      drops = [];
      context.clearRect(0, 0, width, height);
    },
  };
}
