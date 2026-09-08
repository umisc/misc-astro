import eslint from '@eslint/js';
import eslintReact from '@eslint-react/eslint-plugin';
import { defineConfig } from 'eslint/config';
import astroPlugin from 'eslint-plugin-astro';
import reactHooks from 'eslint-plugin-react-hooks';
import tailwindcss from 'eslint-plugin-tailwindcss';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const astroConfigs = astroPlugin.configs['flat/recommended'];
const reactHooksRecommended = {
  plugins: { 'react-hooks': reactHooks },
  rules: reactHooks.configs['recommended-latest'].rules,
};

export default defineConfig(
  {
    ignores: [
      'dist/**',
      '.vercel/**',
      '.astro/**',
      '.wrangler/**',
      '.pi-subagents/**',
      'node_modules/**',
      'content/**',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...astroConfigs,
  tailwindcss.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    settings: {
      tailwindcss: {
        cssConfigPath: './src/styles/global.css',
      },
    },
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ['**/*.{js,jsx}'],
    extends: [eslintReact.configs.recommended],
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [eslintReact.configs['recommended-typescript']],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ...reactHooksRecommended,
  },
);
