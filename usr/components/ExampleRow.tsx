import type { ReactNode } from 'react';

interface Props {
  /** The code snippet to display on the left (string or JSX). */
  code: ReactNode;
  /** The live result to show on the right. */
  children: ReactNode;
  /** Optional section title rendered above the row. */
  title?: string;
  /** Controls the relative widths of the code vs result columns. */
  codeWidth?: 'narrow' | 'default' | 'equal' | 'full';
}

const codeColClass: Record<NonNullable<Props['codeWidth']>, string> = {
  narrow:  'col-md-4',
  default: 'col-md-5',
  equal:   'col-md-6',
  full:    'col-12',
};

const resultColClass: Record<NonNullable<Props['codeWidth']>, string> = {
  narrow:  'col-md-8',
  default: 'col-md-7',
  equal:   'col-md-6',
  full:    'col-12',
};

export default function ExampleRow({ code, children, title, codeWidth = 'default' }: Props) {
  return (
    <>
      {title && <h2>{title}</h2>}
      <div className="row g-3">
        <div className={codeColClass[codeWidth]}>
          <pre><code>{code}</code></pre>
        </div>
        <div className={resultColClass[codeWidth]}>
          {children}
        </div>
      </div>
    </>
  );
}
