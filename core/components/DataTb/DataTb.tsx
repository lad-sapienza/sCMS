/**
 * DataTb Component
 * 
 * Main data table component using TanStack Table
 * Supports sorting, filtering, and pagination
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type SortingState,
  type ColumnFiltersState,
} from '@tanstack/react-table';
import { fetchData } from '../../utils/data-fetcher';
import type { DataRow, DataTbProps, ColumnConfig, SourceConfig } from './types';
import {
  autoDetectColumns,
  mergeColumns,
  columnConfigToColumnDef,
  globalFilterFn,
} from './utils';

export function DataTb({
  columns: userColumns,
  searchable = false,
  pagination = true,
  sortable = true,
  initialSort,
  className = '',
  source,
  loadingMessage = 'Loading data...',
  emptyMessage = 'No data available',
  errorMessage = 'Error loading data',
}: DataTbProps) {
  const [data, setData] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [sorting, setSorting] = useState<SortingState>(
    initialSort ? [{ id: initialSort.columnKey, desc: initialSort.direction === 'desc' }] : []
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  // Use a ref to track source changes more reliably
  const sourceRef = useRef<string>('');
  const currentSourceKey = JSON.stringify(source);

  // Pagination config
  const paginationConfig = typeof pagination === 'object' ? pagination : {};
  const pageSize = paginationConfig.pageSize || 10;
  const pageSizeOptions = paginationConfig.pageSizeOptions || [10, 20, 50, 100];

  // Fetch data based on source configuration
  useEffect(() => {
    // Check if source has actually changed
    if (currentSourceKey === sourceRef.current) {
      return;
    }

    sourceRef.current = currentSourceKey;

    if (!source) {
      setError(new Error('No data source provided'));
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const fetchedData = await fetchData(source);
        
        setData(fetchedData);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load data'));
        setLoading(false);
      }
    };

    loadData();
  }, [currentSourceKey]); // Use stringified source as dependency

  // Auto-detect or merge columns
  const finalColumns = useMemo(() => {
    if (data.length === 0) {
      return [];
    }

    const autoColumns = autoDetectColumns(data);
    const merged = mergeColumns(autoColumns, userColumns);
    return merged;
  }, [data, userColumns]);

  // Convert to TanStack column definitions
  const columnDefs = useMemo(
    () => finalColumns.map(columnConfigToColumnDef),
    [finalColumns]
  );

  // Initialize table
  const table = useReactTable({
    data,
    columns: columnDefs,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: sortable ? getSortedRowModel() : undefined,
    getFilteredRowModel: searchable ? getFilteredRowModel() : undefined,
    getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: globalFilterFn,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  // Render loading state
  if (loading) {
    return (
      <div className="datatb-container">
        <div className="datatb-loading p-8 text-center text-gray-600">
          {loadingMessage}
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="datatb-container">
        <div className="datatb-error p-8 text-center text-red-600">
          {errorMessage}: {error.message}
        </div>
      </div>
    );
  }

  // Render empty state
  if (data.length === 0) {
    return (
      <div className="datatb-container">
        <div className="datatb-empty p-8 text-center text-gray-600">
          {emptyMessage}
        </div>
      </div>
    );
  }

  return (
    <div className={`datatb-container ${className}`}>

      {/* Search input */}
      {searchable && (
        <div className="datatb-search mb-4">
          <input
            type="text"
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
            className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Table */}
      <div className="datatb-table-wrapper overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="datatb-table min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <th
                    key={header.id}
                    className={`p-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider ${
                      index === 0 ? 'pl-6 pr-6' : 'px-6'
                    }`}
                    style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort()
                            ? 'flex items-center gap-2 cursor-pointer select-none hover:text-gray-900'
                            : 'flex items-center gap-2'
                        }
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <span className="text-gray-400">
                            {{
                              asc: '↑',
                              desc: '↓',
                            }[header.column.getIsSorted() as string] ?? '↕'}
                          </span>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {row.getVisibleCells().map((cell, index) => (
                  <td
                    key={cell.id}
                    className={`p-4 text-sm text-gray-900 ${
                      index === 0 ? 'pl-6 pr-6' : 'px-6'
                    }`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="datatb-pagination mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="scms-btn scms-btn-secondary rounded-r-none border-r-0"
            >
              {'<<'}
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="scms-btn scms-btn-secondary rounded-none border-r-0"
            >
              {'<'}
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="scms-btn scms-btn-secondary rounded-none border-r-0"
            >
              {'>'}
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="scms-btn scms-btn-secondary rounded-l-none"
            >
              {'>>'}
            </button>
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            <span className="text-sm text-text-light whitespace-nowrap">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>

            {paginationConfig.showPageSize !== false && (
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
                className="scms-select"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    Show {size}
                  </option>
                ))}
              </select>
            )}

            <span className="text-sm text-text-light whitespace-nowrap">
              {data.length} total rows
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
