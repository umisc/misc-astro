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
  boardSize: 4,
};

export const bingoPrompts = [
  'Has worked in security analysis.',
  'Has worked in incident response or digital forensics.',
  'Has worked in pentesting, product security, or vulnerability research.',
  'Has worked in a leadership, manager, director, founder, or CISO role.',
  'Has worked in cybersecurity for 3+ years.',
  'Has worked in cybersecurity for 6+ years.',
  'Uses Python.',
  'Uses Burp Suite or web security tools.',
  'Uses forensic or incident response tools.',
  'Uses SIEM, XDR, EDR, or monitoring tools.',
  'Uses security tooling for networks, cloud, or identity.',
  'Holds at least one cybersecurity certification.',
  'Holds an offensive security or forensic certification.',
  'Has worked outside cybersecurity before.',
  'Has worked in retail, hospitality, food service, or customer service.',
  'Had a first job involving food service or retail.',
  'Has pets.',
  'Enjoys creative problem solving or building things.',
  'Enjoys helping people or organisations.',
  'Has worked with phishing, alerts, incidents, or crises.',
  'Has worked with threat intelligence, vulnerability research, or exploits.',
  'Has used Velociraptor, KAPE, FTK Imager, or forensic workstations.',
  'Has used Excel, SIEMs, or other business/security platforms.',
  'Has a fun fact involving performing, media, teaching, or presenting',
];

export const bingoStorageKey = 'people-bingo-progress-v1';
