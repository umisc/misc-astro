import { useCallback, useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

const characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+';

type Options = {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: 'start' | 'end' | 'center';
};

export function useScrambledText({
  text,
  speed = 30,
  maxIterations = 20,
  sequential = true,
  revealDirection = 'start',
}: Options) {
  const reducedMotion = usePrefersReducedMotion();
  const [displayText, setDisplayText] = useState(text);
  const [run, setRun] = useState(0);
  const reducedMotionRef = useRef(reducedMotion);
  reducedMotionRef.current = reducedMotion;

  const start = useCallback(() => {
    if (reducedMotionRef.current) {
      setDisplayText(text);
      return;
    }
    setRun((current) => current + 1);
  }, [text]);

  useEffect(() => {
    if (!run || reducedMotion) {
      setDisplayText(text);
      return;
    }

    let iteration = 0;
    const revealed = new Set<number>();
    const unrevealedIndices = () =>
      [...Array(text.length).keys()].filter(
        (index) => !revealed.has(index) && text[index] !== ' ',
      );

    const timer = window.setInterval(() => {
      const indices = unrevealedIndices();
      if (sequential && !indices.length) {
        window.clearInterval(timer);
        setDisplayText(text);
        return;
      }

      if (sequential) {
        const index =
          revealDirection === 'end'
            ? indices[indices.length - 1]
            : revealDirection === 'center'
              ? indices.sort(
                  (a, b) =>
                    Math.abs(a - text.length / 2) -
                    Math.abs(b - text.length / 2),
                )[0]
              : indices[0];
        if (index !== undefined) {
          revealed.add(index);
        }
      }

      const result = text
        .split('')
        .map((character, index) =>
          character === ' ' || revealed.has(index)
            ? character
            : characters[Math.floor(Math.random() * characters.length)],
        )
        .join('');
      setDisplayText(result);
      iteration += 1;

      if (
        (!sequential && iteration >= maxIterations) ||
        revealed.size === text.replace(/ /g, '').length
      ) {
        window.clearInterval(timer);
        setDisplayText(text);
      }
    }, speed);

    return () => window.clearInterval(timer);
  }, [
    maxIterations,
    reducedMotion,
    revealDirection,
    run,
    sequential,
    speed,
    text,
  ]);

  return { displayText, start };
}
