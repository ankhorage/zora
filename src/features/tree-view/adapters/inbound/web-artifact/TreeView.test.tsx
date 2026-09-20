import { expect, test } from 'bun:test';
import { Window } from 'happy-dom';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { renderToStaticMarkup } from 'react-dom/server';

import { TreeView } from './TreeView';

test('expands from the leading control without selecting the row, including keyboard activation', async () => {
  const browserWindow = new Window();
  const keys = ['window', 'document', 'Node', 'navigator', 'IS_REACT_ACT_ENVIRONMENT'] as const;
  const previous = keys.map(
    (key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)] as const,
  );
  Object.assign(globalThis, {
    IS_REACT_ACT_ENVIRONMENT: true,
    window: browserWindow,
    document: browserWindow.document,
    Node: browserWindow.Node,
    navigator: browserWindow.navigator,
  });
  const host = document.createElement('div');
  document.body.appendChild(host);
  const selected: string[] = [];
  const expanded: (readonly string[])[] = [];
  const root = createRoot(host);
  const interactAsync = (action: () => void) => act(() => Promise.resolve().then(action));
  try {
    await interactAsync(() =>
      root.render(
        <TreeView
          nodes={[{ id: 'src', label: 'source', children: [{ id: 'leaf', label: 'leaf' }] }]}
          onSelect={(id) => selected.push(id)}
          onExpandedChange={(ids) => expanded.push(ids)}
        />,
      ),
    );
    const row = host.querySelector('[role="treeitem"]');
    const button = row?.querySelector('button');
    if (!row || !button) throw new Error('Missing tree row or expander');
    expect(row.firstElementChild).toBe(button);
    await interactAsync(() => {
      button.dispatchEvent(
        new browserWindow.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
      );
      button.click();
    });
    expect(selected).toEqual([]);
    expect(expanded).toEqual([['src']]);
    expect(host.querySelector('[role="group"]')?.textContent).toContain('leaf');
    await interactAsync(() => {
      row.dispatchEvent(new browserWindow.MouseEvent('click', { bubbles: true }));
    });
    expect(selected).toEqual(['src']);
    expect(expanded).toEqual([['src']]);
    await interactAsync(() => button.click());
    expect(expanded).toEqual([['src'], []]);
    expect(host.querySelector('[role="group"]')).toBeNull();
  } finally {
    await interactAsync(() => root.unmount());
    browserWindow.close();
    for (const [key, descriptor] of previous) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
});

test('renders a standalone web tree without a ZORA or React Native provider', () => {
  const markup = renderToStaticMarkup(
    <TreeView
      expansionIndicator="chevron"
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
  expect(markup.indexOf('aria-label="Collapse"')).toBeLessThan(markup.indexOf('folder'));
});

test('supports folder/file indicators without duplicating supplied row icons', () => {
  const markup = renderToStaticMarkup(
    <TreeView
      expansionIndicator="folder"
      defaultExpandedIds={['src']}
      nodes={[
        {
          id: 'src',
          label: 'src',
          icon: <span>duplicate-icon</span>,
          children: [{ id: 'file', label: 'file.ts' }],
        },
      ]}
    />,
  );
  expect(markup).toContain('aria-label="Collapse"');
  expect(markup).toContain('file.ts');
  expect(markup).not.toContain('duplicate-icon');
  expect(markup.match(/<svg/g)?.length).toBe(2);
});
