import React, { useState } from 'react';
import type { SearchInFields, SearchQuery, SearchOperators } from '../types';
import { SearchUISimple } from './SearchUISimple';
import { SearchUIAdvanced } from './SearchUIAdvanced';

export interface SearchUIProps {
  fieldList: SearchInFields;
  onSearch: (query: SearchQuery) => void;
  operators?: Partial<SearchOperators>;
  isLoading?: boolean;
  limitTo?: 'simple' | 'advanced';
  currentQuery?: SearchQuery;
}

/**
 * Main search UI component
 * Handles switching between simple and advanced search modes
 */
export function SearchUI({ 
  fieldList, 
  onSearch, 
  operators,
  isLoading = false,
  limitTo,
  currentQuery 
}: SearchUIProps) {
  const [isAdvanced, setIsAdvanced] = useState(limitTo === 'advanced');

  const toggleMode = () => {
    if (limitTo) return; // Don't allow toggling if limited to one mode
    setIsAdvanced(!isAdvanced);
  };

  if (!fieldList || Object.keys(fieldList).length === 0) {
    return (
      <div className="text-red-600 text-sm">
        No searchable fields configured for this layer.
      </div>
    );
  }

  // Show advanced by default if limitTo is 'advanced', simple if limitTo is 'simple'
  const showAdvanced = limitTo === 'advanced' || (limitTo !== 'simple' && isAdvanced);

  return (
    <div className="search-ui">
      {isLoading && (
        <div className="text-center mb-3">
          <div className="w-6 h-6 mx-auto border-2 border-blue-600 border-t-transparent rounded-full animate-spin" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      
      {showAdvanced ? (
        <SearchUIAdvanced
          fieldList={fieldList}
          onSearch={onSearch}
          operators={operators}
          isLoading={isLoading}
          onToggleSimple={limitTo ? undefined : toggleMode}
          currentQuery={currentQuery}
        />
      ) : (
        <SearchUISimple
          fieldList={fieldList}
          onSearch={onSearch}
          isLoading={isLoading}
          onToggleAdvanced={limitTo ? undefined : toggleMode}
          currentQuery={currentQuery}
        />
      )}
    </div>
  );
}