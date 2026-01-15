/**
 * DataTb Utility Functions
 * 
 * Helper functions for data transformation, column generation, and formatting
 */

import type { ColumnDef } from '@tanstack/react-table';
import type { DataRow, ColumnConfig } from './types';

/**
 * Auto-detect columns from data
 */
export function autoDetectColumns(data: DataRow[]): ColumnConfig[] {
  if (!data || data.length === 0) return [];
  
  const firstRow = data[0];
  const keys = Object.keys(firstRow);
  
  return keys.map(key => ({
    key,
    header: formatHeader(key),
    sortable: true,
  }));
}

/**
 * Convert snake_case or camelCase to Title Case
 */
export function formatHeader(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1') // camelCase to words
    .replace(/_/g, ' ') // snake_case to words
    .replace(/\b\w/g, (l) => l.toUpperCase()) // capitalize first letter
    .trim();
}

/**
 * Format value based on format type
 */
export function formatValue(value: any, format?: string): string {
  if (value === null || value === undefined) return '';
  
  switch (format) {
    case 'date':
      return formatDate(value);
    case 'number':
      return formatNumber(value);
    case 'currency':
      return formatCurrency(value);
    case 'percent':
      return formatPercent(value);
    default:
      return String(value);
  }
}

/**
 * Format date value
 */
export function formatDate(value: any): string {
  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) return String(value);
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return String(value);
  }
}

/**
 * Format number value
 */
export function formatNumber(value: any): string {
  const num = Number(value);
  if (isNaN(num)) return String(value);
  
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Format currency value (USD by default)
 */
export function formatCurrency(value: any, currency: string = 'USD'): string {
  const num = Number(value);
  if (isNaN(num)) return String(value);
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(num);
}

/**
 * Format percentage value
 */
export function formatPercent(value: any): string {
  const num = Number(value);
  if (isNaN(num)) return String(value);
  
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Convert ColumnConfig to TanStack ColumnDef
 */
export function columnConfigToColumnDef(config: ColumnConfig): ColumnDef<DataRow> {
  return {
    id: config.key,
    accessorKey: config.key,
    header: config.header,
    enableSorting: config.sortable ?? true,
    size: config.width ? parseInt(config.width) : undefined,
    cell: (info) => {
      const value = info.getValue();
      const row = info.row.original;
      
      // Use custom render if provided
      if (config.render) {
        return config.render(value, row);
      }
      
      // Apply format if specified
      return formatValue(value, config.format);
    },
  };
}

/**
 * Merge auto-detected columns with user-provided overrides
 */
export function mergeColumns(
  autoColumns: ColumnConfig[],
  userColumns?: ColumnConfig[]
): ColumnConfig[] {
  if (!userColumns || userColumns.length === 0) {
    return autoColumns;
  }
  
  // Create a map of user columns by key
  const userColumnMap = new Map(
    userColumns.map(col => [col.key, col])
  );
  
  // Merge: use user config if exists, otherwise use auto-detected
  const merged = autoColumns.map(autoCol => {
    const userCol = userColumnMap.get(autoCol.key);
    return userCol ? { ...autoCol, ...userCol } : autoCol;
  });
  
  // Add any user columns that weren't in auto-detected
  userColumns.forEach(userCol => {
    if (!autoColumns.find(autoCol => autoCol.key === userCol.key)) {
      merged.push(userCol);
    }
  });
  
  return merged;
}

/**
 * Global filter function for searchable tables
 */
export function globalFilterFn(
  row: any,
  columnId: string,
  filterValue: string
): boolean {
  const value = row.getValue(columnId);
  
  if (value === null || value === undefined) return false;
  
  return String(value)
    .toLowerCase()
    .includes(String(filterValue).toLowerCase());
}
