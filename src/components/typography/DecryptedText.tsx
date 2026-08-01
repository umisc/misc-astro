import { motion } from 'motion/react';
import type { ComponentProps } from 'react';
import { useScrambledText } from './useScrambledText';

type Props = Omit<ComponentProps<typeof motion.span>, 'children'> & {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: 'start' | 'end' | 'center';
  animateOn?: 'view' | 'hover';
};

export default function DecryptedText({
  text,
  speed = 30,
  maxIterations = 20,
  sequential = true,
  revealDirection = 'start',
  animateOn = 'hover',
  className = '',
  ...props
}: Props) {
  const { displayText, start } = useScrambledText({
    text,
    speed,
    maxIterations,
    sequential,
    revealDirection,
  });
  const tokens = [...text.matchAll(/\s+|\S+/g)];

  return (
    <motion.span
      className="relative inline-block whitespace-pre-wrap"
      {...(animateOn === 'hover' ? { onMouseEnter: start } : {})}
      {...(animateOn === 'view' ? { onViewportEnter: start } : {})}
      viewport={{ once: true }}
      {...props}
    >
      <span aria-hidden="true">
        {tokens.map((match, tokenIndex) => {
          const token = match[0];
          const tokenStart = match.index;

          if (/^\s+$/.test(token)) {
            return token;
          }

          return (
            <span className="inline-block" key={`${tokenStart}-${tokenIndex}`}>
              {token.split('').map((finalCharacter, wordIndex) => {
                const index = tokenStart + wordIndex;

                return (
                  <span
                    className="relative inline-block"
                    key={`${index}-${finalCharacter}`}
                  >
                    <span className={`invisible ${className}`}>
                      {finalCharacter}
                    </span>
                    <span
                      className={`absolute top-0 left-0 whitespace-nowrap ${className}`}
                    >
                      {displayText[index]}
                    </span>
                  </span>
                );
              })}
            </span>
          );
        })}
      </span>
      <span className="sr-only">{text}</span>
    </motion.span>
  );
}
