/**
 * Content Collections Configuration
 * 
 * This file defines the structure and schema for your content collections.
 * Collections provide type-safe content management with automatic validation.
 */

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Schema for blog posts
const blogCollection = defineCollection({
  loader: glob({ 
    pattern: '**/*.{md,mdx}', 
    base: './usr/content/blog' 
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
    base: './usr/content/docs' 
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

// Schema for static data files (CSV, JSON, YAML)
// menu.yaml is excluded here — it has its own `menuCollection` below.
const dataCollection = defineCollection({
  loader: glob({ 
    pattern: ['**/*.{json,yaml,csv}', '!menu.yaml'], 
    base: './usr/content/data' 
  }),
  schema: z.object({
    // Flexible schema for data files
    id: z.string().or(z.number()).optional(),
  }).passthrough(),
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

// Schema for usr/content/data/menu.yaml — top-level array of menu items
const menuCollection = defineCollection({
  loader: glob({
    pattern: 'menu.yaml',
    base: './usr/content/data',
  }),
  schema: z.array(menuItemSchema),
});

// Export all collections
export const collections = {
  blog: blogCollection,
  docs: docsCollection,
  data: dataCollection,
  menu: menuCollection,
};
