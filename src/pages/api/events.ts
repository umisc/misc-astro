import type { APIRoute } from 'astro';
import { getDb } from '@/lib/db';

export const prerender = false;

interface EventRow {
  id: string;
  title: string;
  description: string;
  modal_description: string;
  category: 'Workshop' | 'Social' | 'Industry';
  image: string;
  date_iso: string;
}

export const GET: APIRoute = async () => {
  const { results } = await getDb()
    .prepare(
      `SELECT id, title, description, modal_description, category, image, date_iso
       FROM events
       ORDER BY date_iso ASC, title ASC`,
    )
    .all<EventRow>();

  return Response.json({
    events: results.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      modalDescription: row.modal_description,
      category: row.category,
      image: row.image,
      dateISO: row.date_iso,
    })),
  });
};
