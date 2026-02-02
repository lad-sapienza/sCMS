// Core package exports
export { default as DataTable } from './components/DataTable.astro';
export { default as MapLeaflet } from './components/MapLeaflet.astro';
export { default as VectorLayer } from './components/VectorLayer.astro';
export { default as Search } from './components/Search.astro';
export { default as Record } from './components/Record.astro';
export { default as Field } from './components/Field.astro';
export { default as GalleryAstro } from './components/Gallery/Gallery.astro';
export { Gallery, GalleryMdx, processGalleryImages } from './components/Gallery';
export { default as TableOfContents } from './components/TableOfContents.astro';

// Layouts
export { default as BaseLayout } from './layouts/BaseLayout.astro';

// Utils
export * from './utils/directus';
export * from './utils/content';
export * from './utils/directus-config';

// Types
export type * from './types';
