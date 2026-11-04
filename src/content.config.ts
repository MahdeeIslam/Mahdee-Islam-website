import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Articles written directly on the site. Add a .md file to
// src/content/articles/ and it appears on the Articles page.
// Files whose names start with an underscore are ignored.
const articles = defineCollection({
  loader: glob({ pattern: ['**/*.md', '!**/_*.md'], base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };
