import { env } from 'cloudflare:workers';

export function getDb(): D1Database {
  if (!env.DB) {
    throw new Error(
      'D1 binding `DB` not found. Is `d1_databases` configured in wrangler.jsonc?',
    );
  }
  return env.DB;
}
