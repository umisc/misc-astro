import type { CollectionEntry } from 'astro:content';

type SponsorData = CollectionEntry<'sponsors'>['data'];
export type SponsorTier = SponsorData['tier'];
export type Sponsor = Omit<SponsorData, 'logo'> & {
  logo: { src: string; width: number; height: number };
};
