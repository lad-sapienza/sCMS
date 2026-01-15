/**
 * DataTb Type Definitions
 * 
 * Core types for the DataTb component system
 */

import type { ColumnDef } from '@tanstack/react-table';

/**
 * Base data row type - can be extended with specific fields
 */
export type DataRow = Record<string, any>;

/**
 * Column configuration with optional formatting
 */
export interface ColumnConfig {
  /** Column key matching data property */
  key: string;
  
  /** Display header text */
  header: string;
  
  /** Enable sorting for this column */
  sortable?: boolean;
  
  /** Format type for automatic formatting */
  format?: 'date' | 'number' | 'currency' | 'percent';
  
  /** Custom render function */
  render?: (value: any, row: DataRow) => React.ReactNode;
  
  /** Column width (CSS value) */
  width?: string;
}

/**
 * Pagination configuration
 */
export interface PaginationConfig {
  /** Number of rows per page */
  pageSize?: number;
  
  /** Show page size selector */
  showPageSize?: boolean;
  
  /** Available page size options */
  pageSizeOptions?: number[];
}

/**
 * Source type discriminators
 */
export type SourceType = 'csv' | 'json' | 'directus' | 'api';

/**
 * CSV Source configuration
 */
export interface CsvSourceConfig {
  type: 'csv';
  url: string;
  /** Delimiter (default: ',') */
  delimiter?: string;
  /** Skip first N rows */
  skipRows?: number;
}

/**
 * JSON Source configuration
 */
export interface JsonSourceConfig {
  type: 'json';
  /** Inline data */
  data?: DataRow[];
  /** URL to fetch JSON from */
  url?: string;
}

/**
 * Directus Source configuration
 */
export interface DirectusSourceConfig {
  type: 'directus';
  /** Collection name */
  collection: string;
  /** Filter query */
  filter?: Record<string, any>;
  /** Fields to select */
  fields?: string[];
  /** Sort order */
  sort?: string[];
  /** Limit results */
  limit?: number;
}

/**
 * Generic API Source configuration
 */
export interface ApiSourceConfig {
  type: 'api';
  /** API endpoint URL */
  url: string;
  /** HTTP method */
  method?: 'GET' | 'POST';
  /** Request headers */
  headers?: Record<string, string>;
  /** Request body (for POST) */
  body?: any;
  /** Transform response data */
  transformer?: (data: any) => DataRow[];
}

/**
 * Union of all source configurations
 */
export type SourceConfig = 
  | CsvSourceConfig 
  | JsonSourceConfig 
  | DirectusSourceConfig 
  | ApiSourceConfig;

/**
 * Props for source components
 */
export interface SourceComponentProps {
  /** Callback to provide data to parent */
  onDataLoad: (data: DataRow[]) => void;
  /** Callback for loading state */
  onLoadingChange?: (loading: boolean) => void;
  /** Callback for error state */
  onError?: (error: Error) => void;
}

/**
 * DataTb main component props
 */
export interface DataTbProps {
  /** Column definitions (optional - will auto-detect if not provided) */
  columns?: ColumnConfig[];
  
  /** Enable global search/filter */
  searchable?: boolean;
  
  /** Pagination configuration */
  pagination?: boolean | PaginationConfig;
  
  /** Enable column sorting */
  sortable?: boolean;
  
  /** Initial sort state */
  initialSort?: {
    columnKey: string;
    direction: 'asc' | 'desc';
  };
  
  /** Custom CSS classes */
  className?: string;
  
  /** Data source configuration */
  source?: SourceConfig;
  
  /** Loading state message */
  loadingMessage?: string;
  
  /** Empty state message */
  emptyMessage?: string;
  
  /** Error message */
  errorMessage?: string;
}
