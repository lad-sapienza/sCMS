/**
 * Content Utility Functions
 * Helper functions for working with Astro Content Collections
 */

import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * Get all entries from a collection sorted by a field
 */
export async function getSortedCollection<T extends 'docs' | 'blog'>(
  collectionName: T,
  sortField: keyof CollectionEntry<T>['data'] = 'date' as any,
  order: 'asc' | 'desc' = 'desc'
) {
  const entries = await getCollection(collectionName);
  
  return entries.sort((a, b) => {
    const aValue = a.data[sortField];
    const bValue = b.data[sortField];
    
    if (aValue instanceof Date && bValue instanceof Date) {
      return order === 'desc' 
        ? bValue.valueOf() - aValue.valueOf()
        : aValue.valueOf() - bValue.valueOf();
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return order === 'desc' ? bValue - aValue : aValue - bValue;
    }
    
    return 0;
  });
}

/**
 * Get menu items from docs collection
 */
export async function getMenuItems() {
  const docs = await getCollection('docs');
  
  return docs
    .filter(doc => doc.data.menu_position && doc.data.menu_position > 0)
    .sort((a, b) => (a.data.menu_position || 0) - (b.data.menu_position || 0))
    .map(doc => ({
      title: doc.data.title,
      slug: doc.slug,
      position: doc.data.menu_position,
    }));
}

/**
 * Parse CSV string to JSON
 */
export async function parseCSV(csvText: string): Promise<any[]> {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];

  const headers = lines[0].split(',').map(h => h.trim());
  const results = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const obj: any = {};
    headers.forEach((header, index) => {
      obj[header] = values[index];
    });
    results.push(obj);
  }

  return results;
}

/**
 * Fetch and parse remote data
 */
export async function fetchRemoteData(url: string): Promise<any> {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type');
  
  if (contentType?.includes('application/json')) {
    return await response.json();
  }
  
  if (contentType?.includes('text/csv') || url.endsWith('.csv')) {
    const text = await response.text();
    return await parseCSV(text);
  }
  
  return await response.text();
}
