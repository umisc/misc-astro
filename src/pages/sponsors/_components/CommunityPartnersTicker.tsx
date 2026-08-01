import { Ticker } from '@/components/ui/ticker';

import type { Sponsor } from '../_lib/types';

type CommunityPartnersTickerProps = {
  sponsors: Sponsor[];
};

export default function CommunityPartnersTicker({
  sponsors,
}: CommunityPartnersTickerProps) {
  const items = sponsors.map((sponsor) => (
    <a
      key={sponsor.name}
      href={sponsor.href}
      target="_blank"
      rel="noreferrer"
      aria-label={`Visit ${sponsor.name}`}
      className="group flex h-32 max-w-64 items-center justify-center rounded-xl p-content transition-colors duration-200 outline-none hover:bg-background/55 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
    >
      <img
        src={sponsor.logo.src}
        alt={sponsor.name}
        width={sponsor.logo.width}
        height={sponsor.logo.height}
        loading="lazy"
        className="h-20 w-auto object-contain transition-transform duration-300 ease-in-out group-hover:scale-110 motion-reduce:transition-none"
      />
    </a>
  ));

  return (
    <Ticker
      velocity={100}
      hoverPauseDuration={500}
      items={items}
      className="gap-content"
    />
  );
}
