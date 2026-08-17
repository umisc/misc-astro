type BingoConfig = {
  eventName: string;
  subtitle: string;
  preventDuplicateNames: boolean;
  randomizeBoard: boolean;
  boardSize: number;
};

export const bingoConfig: BingoConfig = {
  eventName: 'People Bingo',
  subtitle: 'Meet people, find matches, complete the board.',
  preventDuplicateNames: true,
  randomizeBoard: true,
  boardSize: 5,
};

export const bingoPrompts = [
  'Has worked as a pentester',
  'Has found a security vulnerability',
  'Has worked in a SOC',
  'Has participated in a CTF',
  'Uses Linux as their main OS',
  'Has worked in red teaming',
  'Has worked in blue teaming',
  'Has reported a CVE',
  'Has attended a cybersecurity conference',
  'Has built a homelab',
  'Has written a detection rule',
  'Has used Wireshark this month',
  'Has configured a firewall',
  'Has worked with SIEM alerts',
  'Has performed threat hunting',
  'Has written a YARA rule',
  'Has reverse engineered malware',
  'Has used Burp Suite',
  'Has hardened a cloud account',
  'Has managed incident response',
  'Has presented a security talk',
  'Has contributed to open source security',
  'Has broken a lab machine',
  'Has passed a security certification',
  'Has written a phishing simulation',
  'Has reviewed application code',
  'Has worked with Kubernetes security',
  'Has built a password manager workflow',
  'Has automated a security task',
  'Has run a tabletop exercise',
  'Has worked with digital forensics',
  'Has used threat intelligence feeds',
  'Has patched a critical vulnerability',
  'Has mentored someone in cybersecurity',
  'Has joined a bug bounty program',
  'Has defended an audit finding',
  'Has built a capture-the-flag challenge',
  'Has worked with identity and access management',
  'Has secured an API',
  'Has deployed endpoint protection',
  'Has investigated suspicious logins',
  'Has used multi-factor authentication recovery',
  'Has created a security dashboard',
  'Has tested backup recovery',
  'Has documented a security process',
];

export const bingoStorageKey = 'people-bingo-progress-v1';
