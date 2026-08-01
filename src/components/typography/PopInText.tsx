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
        {words.map((word, wordIndex) =>
          /^\s+$/.test(word) ? (
            <span key={`${word}-${wordIndex}`} aria-hidden="true">
              {word}
            </span>
          ) : (
            <span
              key={`${word}-${wordIndex}`}
              className="inline-block whitespace-nowrap"
            >
              {Array.from(word).map((character, characterIndex) => (
                <motion.span
                  key={`${character}-${characterIndex}`}
                  className="inline-block"
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
                >
                  {character}
                </motion.span>
              ))}
            </span>
          ),
        )}
      </motion.span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
