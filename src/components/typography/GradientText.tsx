import { motion, useReducedMotion } from 'motion/react';
import type { ComponentProps } from 'react';

export default function GradientText({
  children,
  className = '',
  ...props
}: ComponentProps<typeof motion.span>) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.span
      className={`inline-block bg-[linear-gradient(to_right_in_oklch,var(--brand-gradient-teal),var(--brand-gradient-blue),var(--brand-gradient-violet),var(--brand-gradient-teal),var(--brand-gradient-blue),var(--brand-gradient-violet))] bg-size-[300%_100%] bg-clip-text text-transparent ${className}`}
      {...(reducedMotion
        ? {}
        : { animate: { backgroundPosition: ['0% 50%', '90% 50%'] } })}
      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      {...props}
    >
      {children}
    </motion.span>
  );
}
