import React, { type ReactNode } from 'react';

interface ShowExampleProps {
  /** The code to display as a string */
  code: string;
  /** The language for syntax highlighting */
  language?: string;
  /** The example/demo to render */
  children: ReactNode;
  /** Column ratio: 'narrow' (1:2), 'default' (2:3), 'equal' (1:1) */
  codeWidth?: 'narrow' | 'default' | 'equal';
}

export function ShowExample({ 
  code, 
  language = 'jsx', 
  children,
  codeWidth = 'default'
}: ShowExampleProps) {
  const gridCols = {
    narrow: 'md:grid-cols-[1fr_2fr]',
    default: 'md:grid-cols-[2fr_3fr]',
    equal: 'md:grid-cols-2'
  }[codeWidth];

  // Create a code block element that will be processed by Expressive Code
  const codeBlock = `\`\`\`${language}\n${code}\n\`\`\``;

  return (
    <div className={`grid grid-cols-1 ${gridCols} gap-4`}>
      <div dangerouslySetInnerHTML={{ __html: codeBlock }} />
      <div>{children}</div>
    </div>
  );
}
