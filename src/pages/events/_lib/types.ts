import type { CollectionEntry } from 'astro:content';

type EventData = CollectionEntry<'events'>['data'];
export type EventCategory = EventData['category'];
export type EventViewModel = Omit<EventData, 'image'> & {
  id: string;
  image: { src: string; width: number; height: number };
};
