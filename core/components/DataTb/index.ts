/**
 * DataTb Component Exports
 * 
 * Main entry point for the DataTb component system
 */

// Main component (use the .astro wrapper in Astro files)
export { DataTb } from './DataTb';

// Source components
export {
  CsvSource,
  JsonSource,
  DirectusSource,
  ApiSource,
} from './sources';

// Types
export type {
  DataRow,
  ColumnConfig,
  PaginationConfig,
  DataTbProps,
  CsvSourceConfig,
  JsonSourceConfig,
  DirectusSourceConfig,
  ApiSourceConfig,
  SourceConfig,
} from './types';

export type {
  CsvSourceProps,
  JsonSourceProps,
  DirectusSourceProps,
  ApiSourceProps,
} from './sources';
