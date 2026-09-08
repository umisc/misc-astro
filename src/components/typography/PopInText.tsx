import { motion, useReducedMotion } from 'motion/react';

type Props = {
  text: string;
  delay?: number;
  duration?: number;
  className?: string;
};

/** Reveals each character once when the text enters the viewport. */
export default function PopInText({
  text,
  delay = 100,
  duration = 600,
  className = '',
}: Props) {
  const reducedMotion = useReducedMotion();
  const words = text.split(/(\s+)/);
  // Start offset of each word: stable identity even when words repeat.
  const wordStarts: number[] = [];
  {
    let offset = 0;
    for (const word of words) {
      wordStarts.push(offset);
      offset += word.length;
    }
  }

  return (
    <span className={className}>
      <motion.span
        aria-hidden="true"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={{
          visible: { transition: { staggerChildren: delay / 1000 } },
        }}
      >
        {words.map((word, wordIndex) => {
          const start = wordStarts[wordIndex] ?? 0;
          return /^\s+$/.test(word) ? (
            <span key={start} aria-hidden="true">
              {word}
            </span>
          ) : (
            <span key={start} className="inline-block whitespace-nowrap">
              {Array.from(word).map((character, characterIndex) => (
                <motion.span
                  key={`${start + characterIndex}-${character}`}
                  className="inline-block before:content-[attr(data-character)]"
                  data-character={character}
                  variants={{
                    hidden: reducedMotion
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: '2.5rem' },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: reducedMotion
                        ? { duration: 0 }
                        : {
                            duration: duration / 1000,
                            ease: [0.22, 1, 0.36, 1],
                          },
                    },
                  }}
                  aria-hidden="true"
                />
              ))}
            </span>
          );
        })}
      </motion.span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
