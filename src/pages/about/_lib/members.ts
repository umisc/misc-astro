import { getImage } from 'astro:assets';
import { getCollection } from 'astro:content';
import type { MemberViewModel } from './types';

export async function getMemberViewModels(): Promise<MemberViewModel[]> {
  return (
    await Promise.all(
      (await getCollection('team')).map(async ({ id, data }) => {
        const { image: sourceImage, ...memberData } = data;
        if (!sourceImage)
          return { id, ...memberData } satisfies MemberViewModel;

        const image = await getImage({
          src: sourceImage,
          width: 320,
          height: 320,
          fit: 'cover',
          format: 'webp',
        });

        return {
          id,
          ...memberData,
          image: {
            src: image.src,
            width: image.attributes.width,
            height: image.attributes.height,
          },
        } satisfies MemberViewModel;
      }),
    )
  ).sort((a, b) => a.order - b.order);
}
