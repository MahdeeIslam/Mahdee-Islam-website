import { getCollection, type CollectionEntry } from 'astro:content';
import { XMLParser } from 'fast-xml-parser';
import { readFile } from 'node:fs/promises';
import { SUBSTACK_URL, HIDDEN_SUBSTACK_POSTS, SUBSTACK_TAGS } from '../config';

export type Article = {
  slug: string;
  title: string;
  description: string;
  date: Date;
  tags: string[];
  readingMinutes: number;
  source: 'site' | 'substack';
  /** Original Substack post, when the article came from Substack. */
  externalUrl?: string;
  cover?: string;
  /** Full HTML for Substack posts. */
  html?: string;
  /** Collection entry for articles written on the site. */
  entry?: CollectionEntry<'articles'>;
};

const WORDS_PER_MINUTE = 230;

function stripTags(html: string) {
  return html.replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ');
}

function minutesFor(text: string) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/** Remove Substack's subscribe forms and buttons, which do nothing off Substack. */
function cleanSubstackHtml(html: string) {
  return html
    .replace(/<form[\s\S]*?<\/form>/gi, '')
    .replace(/<p class="button-wrapper"[\s\S]*?<\/p>/gi, '')
    .replace(/<div class="subscription-widget-wrap[\s\S]*?<\/div>\s*<\/div>/gi, '');
}

async function loadFeedXml(): Promise<string | null> {
  // For local testing without network access: SUBSTACK_FEED_FILE=path/to/feed.xml
  const file = process.env.SUBSTACK_FEED_FILE;
  if (file) return readFile(file, 'utf8');
  if (!SUBSTACK_URL) return null;
  const feedUrl = SUBSTACK_URL.replace(/\/+$/, '') + '/feed';
  const res = await fetch(feedUrl, { headers: { 'User-Agent': 'mahdeeislam.com site build' } });
  if (!res.ok) throw new Error(`Substack feed returned ${res.status}`);
  return res.text();
}

async function loadSubstack(): Promise<Article[]> {
  let xml: string | null;
  try {
    xml = await loadFeedXml();
  } catch (err) {
    console.warn(`[articles] Could not load the Substack feed: ${(err as Error).message}`);
    return [];
  }
  if (!xml) return [];

  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_', cdataPropName: false });
  const doc = parser.parse(xml);
  const raw = doc?.rss?.channel?.item ?? [];
  const items: any[] = Array.isArray(raw) ? raw : [raw];

  return items
    .map((item): Article | null => {
      const link: string = String(item.link ?? '');
      const slug = link.match(/\/p\/([^/?#]+)/)?.[1];
      if (!slug || HIDDEN_SUBSTACK_POSTS.includes(slug)) return null;
      const html = cleanSubstackHtml(String(item['content:encoded'] ?? ''));
      const description = String(item.description ?? '').trim();
      return {
        slug,
        title: String(item.title ?? '').trim(),
        description,
        date: new Date(item.pubDate),
        tags: SUBSTACK_TAGS[slug] ?? [],
        readingMinutes: minutesFor(stripTags(html)),
        source: 'substack',
        externalUrl: link,
        cover: item.enclosure?.['@_url'],
        html,
      };
    })
    .filter((a): a is Article => a !== null && a.title.length > 0 && a.html!.length > 0);
}

async function loadLocal(): Promise<Article[]> {
  const entries = await getCollection('articles', ({ data }) => !data.draft);
  return entries.map((entry) => ({
    slug: entry.id,
    title: entry.data.title,
    description: entry.data.description ?? '',
    date: entry.data.date,
    tags: entry.data.tags,
    readingMinutes: minutesFor(entry.body ?? ''),
    source: 'site' as const,
    entry,
  }));
}

let cache: Promise<Article[]> | undefined;

/** All published articles, newest first. Site articles win on a slug clash. */
export function getArticles(): Promise<Article[]> {
  cache ??= (async () => {
    const [local, substack] = await Promise.all([loadLocal(), loadSubstack()]);
    const seen = new Set(local.map((a) => a.slug));
    const merged = [...local, ...substack.filter((a) => !seen.has(a.slug))];
    return merged.sort((a, b) => b.date.getTime() - a.date.getTime());
  })();
  return cache;
}

export function formatDate(date: Date) {
  return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
}
