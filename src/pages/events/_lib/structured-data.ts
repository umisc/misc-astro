import type { EventViewModel } from './types';

const miscOrganization = {
  '@type': 'Organization',
  name: 'Melbourne Information Security Club',
  alternateName: 'MISC',
  url: 'https://www.umisc.club/',
};

export function eventStructuredData(event: EventViewModel, url: URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: event.dateISO,
    description: event.description,
    image: [new URL(event.image.src, url).href],
    category: event.category,
    url: url.href,
    organizer: miscOrganization,
  };
}
