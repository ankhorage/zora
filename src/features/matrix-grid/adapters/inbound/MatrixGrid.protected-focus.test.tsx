import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { expect, test } from 'bun:test';
import { Window } from 'happy-dom';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';

const browserKeys = [
  'window',
  'document',
  'Node',
  'navigator',
  'ShadowRoot',
  'IS_REACT_ACT_ENVIRONMENT',
] as const;
const webDistRoot = join(import.meta.dir, '../../../../../web-dist');
const load = (path: string) => import(pathToFileURL(join(webDistRoot, path)).href);

interface MatrixCell {
  readonly columnId: string;
  readonly id: string;
  readonly rowId: string;
}

interface MatrixLayout {
  readonly columns: readonly { readonly id: string; readonly size: number }[];
  readonly rows: readonly { readonly id: string; readonly size: number }[];
}
type MatrixGridComponent = React.ComponentType<{
  readonly cells: readonly MatrixCell[];
  readonly height: number;
  readonly layout: MatrixLayout;
  readonly protectedCellIds?: readonly string[];
  readonly renderCell: (cell: MatrixCell) => React.ReactNode;
  readonly testID: string;
  readonly width: number;
}>;
type ZoraProviderComponent = React.ComponentType<{ readonly children: React.ReactNode }>;

/*** Mount MatrixGrid through React Native Web and restore the ambient DOM after each assertion. */
async function withMatrixDom(assertion: (host: HTMLElement, browser: Window) => Promise<void>) {
  const browser = new Window();
  const previous = browserKeys.map(
    (key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)] as const,
  );
  Object.assign(globalThis, {
    IS_REACT_ACT_ENVIRONMENT: true,
    window: browser,
    document: browser.document,
    Node: browser.Node,
    navigator: browser.navigator,
    ShadowRoot: browser.ShadowRoot,
  });
  const host = document.createElement('div');
  document.body.appendChild(host);
  try {
    await assertion(host, browser);
  } finally {
    browser.close();
    for (const [key, descriptor] of previous) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
  }
}

/*** Load the compiled MatrixGrid and provider used by React Native Web interaction tests. */
async function loadMatrixGrid() {
  const { MatrixGrid } = (await load('components/matrix-grid/MatrixGrid.js')) as {
    MatrixGrid: MatrixGridComponent;
  };
  const { ZoraProvider } = (await load('runtime/ZoraProvider.js')) as {
    ZoraProvider: ZoraProviderComponent;
  };
  return { MatrixGrid, ZoraProvider };
}

test('retains focus when protected terminal cells block all four arrow directions', async () => {
  await withMatrixDom(async (host, browser) => {
    const root = createRoot(host);
    const { MatrixGrid, ZoraProvider } = await loadMatrixGrid();
    const layout = {
      columns: Array.from({ length: 3 }, (_, index) => ({ id: `column-${index}`, size: 20 })),
      rows: Array.from({ length: 3 }, (_, index) => ({ id: `row-${index}`, size: 20 })),
    };
    const cells = [
      { columnId: 'column-1', id: 'up', rowId: 'row-0' },
      { columnId: 'column-0', id: 'left', rowId: 'row-1' },
      { columnId: 'column-1', id: 'origin', rowId: 'row-1' },
      { columnId: 'column-2', id: 'right', rowId: 'row-1' },
      { columnId: 'column-1', id: 'down', rowId: 'row-2' },
    ];
    try {
      act(() =>
        root.render(
          <ZoraProvider>
            <MatrixGrid
              cells={cells}
              height={60}
              layout={layout}
              protectedCellIds={['left', 'right', 'up', 'down']}
              testID="terminal-protected-matrix"
              width={60}
              renderCell={(cell) => <span>{cell.id}</span>}
            />
          </ZoraProvider>,
        ),
      );
      const origin = host.querySelector<HTMLElement>(
        '[data-testid="terminal-protected-matrix-cell-origin"]',
      );
      if (!origin) throw new Error('Missing terminal-protected focus origin.');
      act(() => origin.focus());
      for (const key of ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']) {
        act(() => {
          void origin.dispatchEvent(new browser.KeyboardEvent('keydown', { bubbles: true, key }));
        });
        expect(document.activeElement).toBe(origin);
      }
    } finally {
      act(() => root.unmount());
    }
  });
});

test('skips consecutive protected cells and retains the origin when a direction has no navigable cell', async () => {
  await withMatrixDom(async (host, browser) => {
    const root = createRoot(host);
    const { MatrixGrid, ZoraProvider } = await loadMatrixGrid();
    const layout = {
      columns: Array.from({ length: 4 }, (_, index) => ({ id: `column-${index}`, size: 20 })),
      rows: [{ id: 'row-0', size: 20 }],
    };
    const cells = ['a', 'b', 'c', 'd'].map((id, index) => ({
      columnId: `column-${index}`,
      id,
      rowId: 'row-0',
    }));
    const render = (protectedCellIds: readonly string[], testID: string) => (
      <ZoraProvider>
        <MatrixGrid
          cells={cells}
          height={20}
          layout={layout}
          protectedCellIds={protectedCellIds}
          testID={testID}
          width={80}
          renderCell={(cell) => <span>{cell.id}</span>}
        />
      </ZoraProvider>
    );
    try {
      act(() => root.render(render(['b', 'c'], 'consecutive-protected-matrix')));
      const a = host.querySelector<HTMLElement>(
        '[data-testid="consecutive-protected-matrix-cell-a"]',
      );
      const d = host.querySelector<HTMLElement>(
        '[data-testid="consecutive-protected-matrix-cell-d"]',
      );
      if (!a || !d) throw new Error('Missing consecutive-protected cells.');
      act(() => {
        a.focus();
        void a.dispatchEvent(
          new browser.KeyboardEvent('keydown', { bubbles: true, key: 'ArrowRight' }),
        );
      });
      expect(document.activeElement).toBe(d);

      act(() => root.render(render(['b', 'c', 'd'], 'blocked-direction-matrix')));
      const blockedOrigin = host.querySelector<HTMLElement>(
        '[data-testid="blocked-direction-matrix-cell-a"]',
      );
      if (!blockedOrigin) throw new Error('Missing blocked-direction focus origin.');
      act(() => {
        blockedOrigin.focus();
        void blockedOrigin.dispatchEvent(
          new browser.KeyboardEvent('keydown', { bubbles: true, key: 'ArrowRight' }),
        );
      });
      expect(document.activeElement).toBe(blockedOrigin);
    } finally {
      act(() => root.unmount());
    }
  });
});

test('reconciles roving focus when protected cells change and leaves fully protected matrices without a tab stop', async () => {
  await withMatrixDom(async (host, browser) => {
    const root = createRoot(host);
    const { MatrixGrid, ZoraProvider } = await loadMatrixGrid();
    const layout = {
      columns: Array.from({ length: 3 }, (_, index) => ({ id: `column-${index}`, size: 20 })),
      rows: [{ id: 'row-0', size: 20 }],
    };
    const cells = ['a', 'b', 'c'].map((id, index) => ({
      columnId: `column-${index}`,
      id,
      rowId: 'row-0',
    }));
    let setProtectedCellIds: React.Dispatch<React.SetStateAction<readonly string[]>> | undefined;

    function DynamicProtectionMatrix() {
      const [protectedCellIds, setProtected] = React.useState<readonly string[]>([]);
      setProtectedCellIds = setProtected;
      return (
        <ZoraProvider>
          <MatrixGrid
            cells={cells}
            height={20}
            layout={layout}
            protectedCellIds={protectedCellIds}
            testID="dynamic-protected-matrix"
            width={60}
            renderCell={(cell) => <span>{cell.id}</span>}
          />
        </ZoraProvider>
      );
    }

    try {
      act(() => root.render(<DynamicProtectionMatrix />));
      const a = host.querySelector<HTMLElement>('[data-testid="dynamic-protected-matrix-cell-a"]');
      if (!a) throw new Error('Missing dynamic-protection focus origin.');
      act(() => a.focus());
      act(() => setProtectedCellIds?.(['a']));
      const protectedA = host.querySelector<HTMLElement>(
        '[data-testid="dynamic-protected-matrix-cell-a"]',
      );
      const b = host.querySelector<HTMLElement>('[data-testid="dynamic-protected-matrix-cell-b"]');
      if (!protectedA || !b) throw new Error('Missing dynamic-protection cells.');
      expect(protectedA.getAttribute('aria-disabled')).toBe('true');
      expect(protectedA.getAttribute('tabindex')).not.toBe('0');
      expect(b.getAttribute('tabindex')).toBe('0');
      act(() => {
        b.focus();
        void b.dispatchEvent(
          new browser.KeyboardEvent('keydown', { bubbles: true, key: 'ArrowRight' }),
        );
      });
      const c = host.querySelector<HTMLElement>('[data-testid="dynamic-protected-matrix-cell-c"]');
      expect(document.activeElement).toBe(c);

      act(() => setProtectedCellIds?.(['a', 'b', 'c']));
      expect(
        host.querySelectorAll('[data-testid^="dynamic-protected-matrix-cell-"][tabindex="0"]'),
      ).toHaveLength(0);
    } finally {
      act(() => root.unmount());
    }
  });
});
