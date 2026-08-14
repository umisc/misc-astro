import type { CollectionEntry } from 'astro:content';

type MemberData = CollectionEntry<'team'>['data'];

export type MemberViewModel = Omit<MemberData, 'image'> & {
  id: string;
  image?: {
    src: string;
    width: number;
    height: number;
  };
};
