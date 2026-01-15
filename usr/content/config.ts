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
  }),
});

// Schema for static data files (CSV, JSON, YAML)
const dataCollection = defineCollection({
  loader: glob({ 
    pattern: '**/*.{json,yaml,csv}', 
    base: './usr/content/data' 
  }),
  schema: z.object({
    // Flexible schema for data files
    id: z.string().or(z.number()).optional(),
  }).passthrough(),
});

// Export all collections
export const collections = {
  blog: blogCollection,
  data: dataCollection,
};
