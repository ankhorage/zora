import { expect, test } from 'bun:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { TreeView } from './TreeView';

test('renders a standalone web tree without a ZORA or React Native provider', () => {
  const markup = renderToStaticMarkup(
    <TreeView
      defaultExpandedIds={['src']}
      nodes={[
        {
          id: 'src',
          label: 'src',
          icon: <span>folder</span>,
          children: [{ id: 'index', label: 'index.ts' }],
        },
      ]}
      selectedId="index"
    />,
  );

  expect(markup).toContain('role="tree"');
  expect(markup).toContain('role="treeitem"');
  expect(markup).toContain('folder');
  expect(markup).toContain('index.ts');
  expect(markup).toContain('aria-selected="true"');
});
