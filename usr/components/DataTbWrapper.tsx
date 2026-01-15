/**
 * DataTb Wrapper
 * 
 * Re-exports the DataTb component from core so it can be properly bundled
 * for client-side hydration by Astro
 */

export { DataTb } from '../../core/components/DataTb';
export type { DataTbProps, ColumnConfig, SourceConfig } from '../../core/components/DataTb/types';
