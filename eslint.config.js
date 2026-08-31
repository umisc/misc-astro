import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import astroPlugin from 'eslint-plugin-astro';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import tailwindcss from 'eslint-plugin-tailwindcss';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const astroConfigs = astroPlugin.configs['flat/recommended'];
const reactHooksRecommended = {
  plugins: { 'react-hooks': reactHooks },
  rules: reactHooks.configs.recommended.rules,
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
    files: ['**/*.{jsx,tsx}'],
    ...react.configs.flat.recommended,
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['**/*.{jsx,tsx}'],
    ...react.configs.flat['jsx-runtime'],
  },
  {
    files: ['**/*.{jsx,tsx}'],
    ...reactHooksRecommended,
  },
  {
    files: [
      'src/components/effects/aurora/**/*.{jsx,tsx}',
      'src/pages/_home/_components/MiscHead.tsx',
    ],
    rules: {
      'react/no-unknown-property': [
        'error',
        {
          ignore: ['attach', 'frustumCulled', 'geometry', 'object'],
        },
      ],
    },
  },
);
