import type { MemberViewModel } from './types';

export function memberStructuredData(member: MemberViewModel, url: URL) {
  const personId = `${url.href}#person`;
  const profilePage = {
    '@type': 'ProfilePage',
    '@id': `${url.href}#profile`,
    name: `${member.name} — MISC Team`,
    description: member.bio,
    url: url.href,
    mainEntity: { '@id': personId },
  };
  const person = {
    '@type': 'Person',
    '@id': personId,
    name: member.name,
    jobTitle: member.role,
    description: member.bio,
    url: url.href,
    ...(member.image ? { image: new URL(member.image.src, url).href } : {}),
    ...(member.linkedin ? { sameAs: [member.linkedin] } : {}),
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [profilePage, person],
  };
}
