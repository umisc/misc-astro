import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const ctf = defineCollection({
  loader: glob({ base: './src/pages/ctf/_content', pattern: '*.mdx' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    order: z.number().int().nonnegative(),
  }),
});

const events = defineCollection({
  loader: file('content/events.json'),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      dateISO: z.iso.date(),
      description: z.string(),
      modalDescription: z.string(),
      category: z.enum(['Workshop', 'Social', 'Industry']),
      image: image(),
      legacyId: z.number(),
    }),
});

const team = defineCollection({
  loader: file('content/team.json'),
  schema: ({ image }) =>
    z.object({
      order: z.number(),
      name: z.string(),
      role: z.string(),
      image: image().optional(),
      bio: z.string(),
      linkedin: z.url().optional(),
    }),
});

const sponsors = defineCollection({
  loader: file('content/sponsors.json'),
  schema: ({ image }) =>
    z.object({
      order: z.number(),
      name: z.string(),
      tier: z.enum(['Platinum', 'Gold', 'Silver', 'Community']),
      logo: image(),
      href: z.url(),
    }),
});

export const collections = { ctf, events, team, sponsors };
