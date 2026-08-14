import { getImage } from 'astro:assets';
import { getCollection } from 'astro:content';
import type { EventViewModel } from './types';

export async function getEventViewModels(): Promise<EventViewModel[]> {
  return (
    await Promise.all(
      (await getCollection('events')).map(async ({ id, data }) => {
        const image = await getImage({
          src: data.image,
          width: 768,
          height: 384,
          fit: 'cover',
          format: 'webp',
        });

        return {
          id,
          ...data,
          image: {
            src: image.src,
            width: image.attributes.width,
            height: image.attributes.height,
          },
        } satisfies EventViewModel;
      }),
    )
  ).sort((a, b) => a.dateISO.localeCompare(b.dateISO));
}
