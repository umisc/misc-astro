export function eventDateTimestamp(dateISO: string) {
  return Date.parse(`${dateISO}T00:00:00Z`);
}

export function formatEventDate(dateISO: string) {
  return new Intl.DateTimeFormat('en-AU', {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(new Date(eventDateTimestamp(dateISO)));
}

export function todayDateTimestamp() {
  return eventDateTimestamp(new Date().toISOString().slice(0, 10));
}
