import { NuqsAdapter } from 'nuqs/adapters/react';
import { parseAsString, parseAsStringEnum, useQueryStates } from 'nuqs';
import { useMemo, useState, type ReactNode } from 'react';
import { ArrowUpRightIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import type { EventCategory, EventViewModel } from '../_lib/types';
import {
  eventDateTimestamp,
  formatEventDate,
  todayDateTimestamp,
} from '../_lib/event-dates';

type SortOption = 'date' | 'alphabetical' | 'industry' | 'social' | 'workshop';
type Props = { events: EventViewModel[] };

const sortLabels: Record<SortOption, string> = {
  date: 'Date',
  alphabetical: 'Alphabetical',
  industry: 'Industry',
  social: 'Social',
  workshop: 'Workshop',
};
const categoryFilters: Partial<Record<SortOption, EventCategory>> = {
  industry: 'Industry',
  social: 'Social',
  workshop: 'Workshop',
};

function EventDescription({ description }: { description: string }) {
  const parts: ReactNode[] = [];
  const linkPattern =
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s]+)/g;
  let lastIndex = 0;

  for (const match of description.matchAll(linkPattern)) {
    const [text, alias, aliasedUrl, bareUrl] = match;
    const index = match.index;
    const url = aliasedUrl ?? bareUrl;

    if (!url) continue;

    parts.push(description.slice(lastIndex, index));
    parts.push(
      <a
        key={`${url}-${index}`}
        href={url}
        target="_blank"
        rel="noreferrer"
        className="text-primary underline underline-offset-4 hover:text-foreground"
      >
        {alias ?? url}
      </a>,
    );
    lastIndex = index + text.length;
  }

  parts.push(description.slice(lastIndex));
  return <>{parts}</>;
}

function EventsContent({ events }: Props) {
  const [{ view, event: selectedId }, setQuery] = useQueryStates({
    view: parseAsStringEnum(['upcoming', 'past'])
      .withDefault('upcoming')
      .withOptions({ clearOnDefault: false }),
    event: parseAsString,
  });
  const [query, setSearchQuery] = useState('');
  const [sort, setSort] = useState<SortOption>('date');
  const today = todayDateTimestamp();
  const selected = events.find((item) => item.id === selectedId) ?? null;
  const closeModal = () => {
    void setQuery({ event: null }, { history: 'replace' });
  };

  useDocumentTitle(selected ? `${selected.title} — MISC` : 'Events — MISC');

  const shown = useMemo(() => {
    const filtered = events
      .filter((item) =>
        view === 'upcoming'
          ? eventDateTimestamp(item.dateISO) >= today
          : eventDateTimestamp(item.dateISO) < today,
      )
      .filter((item) =>
        `${item.title} ${item.description}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      )
      .filter((item) =>
        categoryFilters[sort] ? item.category === categoryFilters[sort] : true,
      );
    return [...filtered].sort((a, b) =>
      sort === 'alphabetical'
        ? a.title.localeCompare(b.title)
        : eventDateTimestamp(b.dateISO) - eventDateTimestamp(a.dateISO),
    );
  }, [events, view, query, sort, today]);

  const eventResults = shown.length ? (
    <div className="grid gap-content text-left sm:grid-cols-2 lg:grid-cols-3">
      {shown.map((item) => (
        <Card
          as="a"
          variant="interactive"
          density="compact"
          effect="pixel-shimmer"
          key={item.id}
          href={`/events/?view=${view}&event=${encodeURIComponent(item.id)}`}
          aria-labelledby={`event-card-title-${item.id}`}
          onClick={(click) => {
            if (
              click.button !== 0 ||
              click.metaKey ||
              click.ctrlKey ||
              click.shiftKey ||
              click.altKey
            )
              return;
            click.preventDefault();
            void setQuery({ event: item.id }, { history: 'push' });
          }}
          className="flex min-h-112.5 flex-col text-left"
        >
          <img
            src={item.image.src}
            alt=""
            width={item.image.width}
            height={item.image.height}
            loading="lazy"
            decoding="async"
            className="h-57.5 w-full object-cover"
          />
          <CardHeader className="gap-cluster pb-0">
            <div className="flex justify-between text-xs font-medium">
              <Badge>{item.category}</Badge>
              <span>{formatEventDate(item.dateISO)}</span>
            </div>
            <CardTitle
              as="h2"
              id={`event-card-title-${item.id}`}
              className="line-clamp-2 min-h-14 transition-colors group-hover:text-primary motion-reduce:transition-none"
            >
              {item.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pt-cluster">
            <CardDescription className="min-h-12">
              {item.description}
            </CardDescription>
          </CardContent>
          <CardFooter className="justify-end">
            <span className="flex items-center gap-1 text-sm font-semibold tracking-wide text-primary uppercase">
              View Details
              <ArrowUpRightIcon
                aria-hidden="true"
                className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
              />
            </span>
          </CardFooter>
        </Card>
      ))}
    </div>
  ) : (
    <p className="py-page-block text-muted-foreground">
      We are planning more events soon! Stay tuned.
    </p>
  );

  return (
    <div className="flex flex-col gap-section text-center">
      <Tabs
        value={view}
        onValueChange={(value) => {
          if (value === 'upcoming' || value === 'past') {
            void setQuery({ view: value }, { history: 'push' });
          }
        }}
        className="w-full gap-content"
        orientation="horizontal"
      >
        <div className="mx-auto flex w-full max-w-360 flex-row flex-wrap gap-cluster rounded-2xl">
          <TabsList className="flex-1">
            <TabsTrigger value="upcoming" className="uppercase">
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="past" className="uppercase">
              Past
            </TabsTrigger>
          </TabsList>
          <label className="relative flex-3 basis-sm">
            <span className="sr-only">Search events</span>
            <MagnifyingGlassIcon
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={query}
              onChange={(event) => {
                setSearchQuery(event.target.value);
              }}
              placeholder="Search events"
              className="h-12 pr-4 pl-11 focus-visible:border-primary/70 focus-visible:shadow-[0_0_12px] focus-visible:ring-0 focus-visible:shadow-primary/20 focus-visible:ring-offset-0"
            />
          </label>
          <div className="flex w-full items-center text-left sm:w-48 sm:flex-none">
            <Select
              items={sortLabels}
              value={sort}
              onValueChange={(value) => {
                if (value) {
                  setSort(value);
                }
              }}
            >
              <SelectTrigger
                id="event-sort"
                aria-label="Filter and sort events"
                className="w-full px-3 data-[size=default]:h-12"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="start" alignItemWithTrigger={false}>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
                <SelectItem value="industry">Industry</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <TabsContent value="upcoming" className="text-left">
          {eventResults}
        </TabsContent>
        <TabsContent value="past" className="text-left">
          {eventResults}
        </TabsContent>
      </Tabs>
      <Dialog
        modal="trap-focus"
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) closeModal();
        }}
      >
        {selected && (
          <DialogContent aria-labelledby="event-title" className="sm:max-w-3xl">
            <img
              src={selected.image.src}
              alt={selected.title}
              width={selected.image.width}
              height={selected.image.height}
              decoding="async"
              className="h-64 w-full rounded-lg object-cover sm:h-96"
            />
            <div className="flex justify-between gap-cluster text-sm">
              <Badge>{selected.category}</Badge>
              <time
                dateTime={selected.dateISO}
                className="text-muted-foreground"
              >
                {formatEventDate(selected.dateISO)}
              </time>
            </div>
            <DialogTitle id="event-title" className="text-3xl">
              {selected.title}
            </DialogTitle>
            <DialogDescription className="leading-7 whitespace-pre-wrap text-muted-foreground">
              <EventDescription description={selected.modalDescription} />
            </DialogDescription>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

export default function EventsExperience(props: Props) {
  return (
    <NuqsAdapter>
      <EventsContent {...props} />
    </NuqsAdapter>
  );
}
