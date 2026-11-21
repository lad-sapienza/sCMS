import { useState } from 'react';
import { SearchUINested } from '@lad-sapienza/scms-core/components/Search';
import type { NestedField, NestedSearchResult } from '@lad-sapienza/scms-core/components/Search';

/**
 * Live demos for the Nested Search docs page. Field definitions live here
 * (not in the MDX) because they contain functions, which cannot be passed
 * from MDX into a `client:only` island. All data is invented.
 */

const basicFields: Record<string, NestedField> = {
  name: { label: 'Name' },
  material: { label: 'Material', type: 'select', values: ['ceramic', 'bronze', 'stone', 'glass'] },
  height: { label: 'Height (cm)', type: 'number' },
  notes: { label: 'Notes' },
};

const customFields: Record<string, NestedField> = {
  name: {
    label: 'Name',
    // Typed text is lower-cased and stripped of accents before it enters the filter.
    transformValue: (v) => v.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(),
  },
  height: { label: 'Height (cm)', type: 'number', ops: ['eq', 'ge', 'le', 'between'] },
  period: {
    label: 'Period (years)',
    type: 'date',
    ops: ['overlap', 'within'],
    opLabels: { overlap: 'overlaps', within: 'includes the year' },
    twoValueOps: ['overlap'],
    // A record covers [year_from, year_to]: "overlaps" is an interval intersection.
    buildFilter: (c) => {
      const lo = Number(c.v);
      if (c.v.trim() === '' || isNaN(lo)) return null;
      const hi = c.v2.trim() === '' || isNaN(Number(c.v2)) ? lo : Number(c.v2);
      return c.o === 'within'
        ? { _and: [{ year_from: { _lte: lo } }, { year_to: { _gte: lo } }] }
        : { _and: [{ year_from: { _lte: hi } }, { year_to: { _gte: lo } }] };
    },
  },
};

const RESTORED = '["A",["name","contains","amphora"],["O",["material","eq","ceramic"],["material","eq","glass"]]]';

export type NestedSearchDemoVariant = 'basic' | 'custom' | 'restored' | 'options';

export default function NestedSearchDemo({ variant = 'basic' }: { variant?: NestedSearchDemoVariant }) {
  const [result, setResult] = useState<NestedSearchResult | null>(null);

  const common = { onSearch: setResult };
  let search;
  if (variant === 'custom') search = <SearchUINested fields={customFields} {...common} />;
  else if (variant === 'restored')
    search = <SearchUINested fields={basicFields} initialQuery={RESTORED} onChange={setResult} onSearch={setResult} />;
  else if (variant === 'options')
    search = <SearchUINested fields={basicFields} submitOnEnter={false} showSummary={false} {...common} />;
  else search = <SearchUINested fields={basicFields} {...common} />;

  return (
    <div>
      {search}
      <p className="small text-secondary mt-3 mb-1">
        {variant === 'restored' ? 'Updates on every edit (onChange); the output is' : 'On submit, onSearch receives'}:
      </p>
      <pre className="small border rounded p-2 mb-0" style={{ maxHeight: 260, overflow: 'auto' }}>
        {result
          ? JSON.stringify(
              { filter: result.filter, flat: result.flat ?? null, serialized: result.serialized },
              null,
              2,
            )
          : '(nothing yet)'}
      </pre>
    </div>
  );
}
