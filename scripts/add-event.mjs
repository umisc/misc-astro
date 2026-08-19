import { access, readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { parseArgs } from 'node:util';

const categories = ['Workshop', 'Social', 'Industry'];
const defaultEventsFile = 'content/events.json';

function showHelp() {
  console.log(`Add an event to the MISC website.

Usage:
  pnpm event:add
  pnpm event:add --title "Intro to OSINT" --date 03/09/2026

Options:
  --title <title>
  --date <YYYY-MM-DD|DD/MM/YYYY>
  --category <Workshop|Social|Industry>
  --image <filename|relative-path>
  --description <card-description>
  --details <full-description>
  --yes, -y                         Skip the confirmation
  --dry-run                         Preview without changing events.json
  --help, -h                        Show this help
`);
}

function parseOptions() {
  return parseArgs({
    options: {
      title: { type: 'string' },
      date: { type: 'string' },
      category: { type: 'string' },
      image: { type: 'string' },
      description: { type: 'string' },
      details: { type: 'string' },
      yes: { type: 'boolean', short: 'y' },
      'dry-run': { type: 'boolean' },
      help: { type: 'boolean', short: 'h' },
    },
    strict: true,
  }).values;
}

function slugify(value) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’']/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function normalizeDate(value) {
  const input = value.trim();
  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input);
  const localMatch = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(input);

  let year;
  let month;
  let day;

  if (isoMatch) {
    [, year, month, day] = isoMatch;
  } else if (localMatch) {
    [, day, month, year] = localMatch;
    month = month.padStart(2, '0');
    day = day.padStart(2, '0');
  } else {
    throw new Error('Use YYYY-MM-DD or DD/MM/YYYY.');
  }

  const dateISO = `${year}-${month}-${day}`;
  const date = new Date(`${dateISO}T00:00:00Z`);

  if (
    Number.isNaN(date.valueOf()) ||
    date.toISOString().slice(0, 10) !== dateISO
  ) {
    throw new Error('Enter a real calendar date.');
  }

  return dateISO;
}

function normalizeCategory(value) {
  const input = value.trim();
  const numberedCategory = categories[Number(input) - 1];
  const namedCategory = categories.find(
    (category) => category.toLowerCase() === input.toLowerCase(),
  );
  const category = numberedCategory ?? namedCategory;

  if (!category) {
    throw new Error('Choose Workshop, Social, or Industry.');
  }

  return category;
}

function normalizeImagePath(value) {
  const input = value.trim();

  if (!input) {
    throw new Error('Choose an event image.');
  }

  return input.startsWith('.') ? input : `./images/events/${input}`;
}

function createUniqueId(events, dateISO, title) {
  const titleSlug = slugify(title);

  if (!titleSlug) {
    throw new Error('The title must contain at least one letter or number.');
  }

  const existingIds = new Set(events.map((event) => event.id));
  const baseId = `${dateISO}-${titleSlug}`;
  let id = baseId;
  let suffix = 2;

  while (existingIds.has(id)) {
    id = `${baseId}-${suffix}`;
    suffix += 1;
  }

  return id;
}

async function promptUntilValid(readline, label, initialValue, normalize) {
  let value = initialValue;

  while (true) {
    if (value === undefined) {
      value = await readline.question(label);
    }

    try {
      return normalize(value);
    } catch (error) {
      console.error(`  ${error.message}`);
      value = undefined;
    }
  }
}

async function promptForDetails(readline, initialValue, description) {
  if (initialValue !== undefined) {
    return initialValue.trim() || description;
  }

  console.log(
    'Full description: enter or paste multiple lines, then enter a line containing only ".".',
  );
  console.log('Enter "." immediately to reuse the card description.');

  process.stdout.write('> ');

  return new Promise((resolveDetails) => {
    const lines = [];

    const finish = () => {
      readline.off('line', collectLine);
      readline.off('close', finish);

      const details = lines.join('\n').trim();
      resolveDetails(details || description);
    };

    const collectLine = (line) => {
      if (line === '.') {
        finish();
        return;
      }

      lines.push(line);
    };

    readline.on('line', collectLine);
    readline.once('close', finish);
  });
}

async function imageExists(eventsFile, image) {
  try {
    await access(resolve(dirname(eventsFile), image));
    return true;
  } catch {
    return false;
  }
}

async function promptForImage(readline, initialValue, eventsFile) {
  let value = initialValue;

  while (true) {
    const image = await promptUntilValid(
      readline,
      'Image filename or path: ',
      value,
      normalizeImagePath,
    );

    if (await imageExists(eventsFile, image)) {
      return image;
    }

    console.error(
      `  Image not found at ${resolve(dirname(eventsFile), image)}`,
    );
    value = undefined;
  }
}

async function main() {
  const options = parseOptions();

  if (options.help) {
    showHelp();
    return;
  }

  const eventsFile = resolve(defaultEventsFile);
  const events = JSON.parse(await readFile(eventsFile, 'utf8'));

  if (!Array.isArray(events)) {
    throw new Error(`${defaultEventsFile} must contain an array of events.`);
  }

  const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const title = await promptUntilValid(
      readline,
      'Title: ',
      options.title,
      (value) => {
        const title = value.trim();
        if (!title) throw new Error('Enter a title.');
        return title;
      },
    );
    const dateISO = await promptUntilValid(
      readline,
      'Date (YYYY-MM-DD or DD/MM/YYYY): ',
      options.date,
      normalizeDate,
    );

    if (options.category === undefined) {
      console.log('Category: 1) Workshop  2) Social  3) Industry');
    }

    const category = await promptUntilValid(
      readline,
      'Category: ',
      options.category,
      normalizeCategory,
    );
    const image = await promptForImage(readline, options.image, eventsFile);
    const description = await promptUntilValid(
      readline,
      'Card description: ',
      options.description,
      (value) => {
        const description = value.trim();
        if (!description) throw new Error('Enter a card description.');
        return description;
      },
    );
    const modalDescription = await promptForDetails(
      readline,
      options.details,
      description,
    );
    const event = {
      id: createUniqueId(events, dateISO, title),
      title,
      description,
      category,
      image,
      modalDescription,
      dateISO,
    };

    console.log('\nEvent preview:\n');
    console.log(JSON.stringify(event, null, 2));

    if (!options.yes) {
      const confirmation = await readline.question('\nAdd this event? [Y/n] ');

      if (confirmation && !/^y(es)?$/i.test(confirmation.trim())) {
        console.log('No changes made.');
        return;
      }
    }

    if (options['dry-run']) {
      console.log('\nDry run complete; no changes made.');
      return;
    }

    events.push(event);
    events.sort(
      (first, second) =>
        first.dateISO.localeCompare(second.dateISO) ||
        first.title.localeCompare(second.title),
    );

    await writeFile(eventsFile, `${JSON.stringify(events, null, 2)}\n`);
    console.log(`\nAdded ${event.id} to ${defaultEventsFile}.`);
  } finally {
    readline.close();
  }
}

main().catch((error) => {
  console.error(`Could not add event: ${error.message}`);
  process.exitCode = 1;
});
