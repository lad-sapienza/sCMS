/**
 * Content Collections Configuration
 * 
 * This file defines the structure and schema for your content collections.
 * Collections provide type-safe content management with automatic validation.
 */

import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

// Schema for blog posts
const blogCollection = defineCollection({
  loader: glob({ 
    pattern: '**/*.{md,mdx}', 
    base: './src/content/blog' 
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    author: z.string().optional(),
    tags: z.array(z.string()).optional(),
    image: z.string().optional(),
    draft: z.boolean().optional(),
    menu_position: z.number().optional(),
  }),
});

// Schema for documentation
const docsCollection = defineCollection({
  loader: glob({ 
    pattern: '**/*.{md,mdx}', 
    base: './src/content/docs' 
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().optional(),
    category: z.string().optional(),
    draft: z.boolean().optional(),
    menu_position: z.number().optional(),
  }),
});

// Recursive schema for a single menu item (supports up to any nesting depth)
type MenuItem = {
  href?: string;
  label: string;
  match?: string;
  children?: MenuItem[];
};
const menuItemSchema: z.ZodType<MenuItem> = z.lazy(() =>
  z.object({
    href:     z.string().optional(),
    label:    z.string(),
    match:    z.string().optional(),
    children: z.array(menuItemSchema).optional(),
  })
);

// Schema for src/content/data/{locale}/menu.yaml — one menu per language,
// top-level array of menu items. hrefs stay locale-agnostic (prefixed with
// the current locale at render time — see src/utils/i18n.ts); only `label`
// needs translating per locale.
const menuCollection = defineCollection({
  loader: glob({
    pattern: '*/menu.yaml',
    base: './src/content/data',
  }),
  schema: z.array(menuItemSchema),
});

// Export all collections
export const collections = {
  blog: blogCollection,
  docs: docsCollection,
  menu: menuCollection,
};
