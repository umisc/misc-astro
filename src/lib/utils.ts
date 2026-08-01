import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      spacing: [
        'fluid-3xs',
        'fluid-2xs',
        'fluid-xs',
        'fluid-s',
        'fluid-m',
        'fluid-l',
        'fluid-xl',
        'fluid-2xl',
        'fluid-3xl',
        'fluid-s-l',
        'fluid-xs-2xl',
        'fluid-m-2xl',
        'fluid-l-xl',
        'page-inline',
        'page-block',
        'page-section',
        'section',
        'section-content',
        'content',
        'cluster',
        'card',
        'card-compact',
        'card-spacious',
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  // eslint-disable-next-line tailwindcss/no-custom-classname -- `inputs` is a function parameter, not a class name.
  return twMerge(clsx(inputs));
}
