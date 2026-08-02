// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  security: {
    csp: false,
  },
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [mdx(), react()],
  adapter: vercel({ staticHeaders: true }),
});
