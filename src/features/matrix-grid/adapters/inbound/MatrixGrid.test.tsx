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

const layout = {
  columns: Array.from({ length: 100 }, (_, index) => ({
    id: `column-${index}`,
    size: 10 + (index % 3),
  })),
  rows: Array.from({ length: 100 }, (_, index) => ({ id: `row-${index}`, size: 8 + (index % 4) })),
};

const cells = layout.rows.flatMap((row) =>
  layout.columns.map((column) => ({
    id: `${row.id}-${column.id}`,
    rowId: row.id,
    columnId: column.id,
  })),
);

type MatrixGridComponent = React.ComponentType<{
  readonly cells: typeof cells;
  readonly height: number;
  readonly interactionPolicy?: 'passive';
  readonly layout: typeof layout;
  readonly onSelectionChange?: (ids: readonly string[]) => void;
  readonly onViewportChange?: (viewport: unknown) => void;
  readonly renderCell: (cell: { readonly id: string }) => React.ReactNode;
  readonly readOnly?: boolean;
  readonly selectedCellIds?: readonly string[];
  readonly selectionMode?: 'multi';
  readonly testID: string;
  readonly viewport?: {
    readonly height: number;
    readonly offsetX: number;
    readonly offsetY: number;
    readonly pixelsPerUnitX: number;
    readonly pixelsPerUnitY: number;
    readonly width: number;
  };
  readonly width: number;
  readonly zoomX?: number;
  readonly zoomY?: number;
}>;

type ZoraProviderComponent = React.ComponentType<{ readonly children: React.ReactNode }>;

test('mounts only visible sparse cells with independent axis zoom and preserves native-web selection', async () => {
  await withMatrixDom(async (host, browser) => {
    const selected: (readonly string[])[] = [];
    const root = createRoot(host);
    const { MatrixGrid } = (await load('components/matrix-grid/MatrixGrid.js')) as {
      MatrixGrid: MatrixGridComponent;
    };
    const { ZoraProvider } = (await load('runtime/ZoraProvider.js')) as {
      ZoraProvider: ZoraProviderComponent;
    };
    try {
      act(() =>
        root.render(
          <ZoraProvider>
            <MatrixGrid
              cells={cells}
              height={96}
              layout={layout}
              selectedCellIds={[]}
              selectionMode="multi"
              testID="matrix"
              viewport={{
                height: 96,
                offsetX: 0,
                offsetY: 0,
                pixelsPerUnitX: 2,
                pixelsPerUnitY: 3,
                width: 120,
              }}
              width={120}
              onSelectionChange={(ids) => selected.push(ids)}
              renderCell={(cell) => <span>{cell.id}</span>}
            />
          </ZoraProvider>,
        ),
      );
      const mountedCells = host.querySelectorAll('[data-testid^="matrix-cell-"]');
      expect(cells).toHaveLength(10_000);
      expect(mountedCells.length).toBeGreaterThan(1);
      expect(mountedCells.length).toBeLessThan(100);
      const target = host.querySelector('[data-testid="matrix-cell-row-1-column-1"]');
      expect(target).not.toBeNull();
      expect(target?.parentElement?.parentElement?.getAttribute('style')).toContain('left: 20px');
      expect(target?.parentElement?.parentElement?.getAttribute('style')).toContain('top: 24px');
      void act(() => target?.dispatchEvent(new browser.MouseEvent('click', { bubbles: true })));
      expect(selected).toEqual([['row-1-column-1']]);
    } finally {
      act(() => root.unmount());
    }
  });
});

test('does not propose controlled viewports on mount or fresh parent callback identities', async () => {
  await withMatrixDom(async (host) => {
    const proposals: unknown[] = [];
    const root = createRoot(host);
    const { MatrixGrid } = (await load('components/matrix-grid/MatrixGrid.js')) as {
      MatrixGrid: MatrixGridComponent;
    };
    const { ZoraProvider } = (await load('runtime/ZoraProvider.js')) as {
      ZoraProvider: ZoraProviderComponent;
    };
    const render = () => (
      <ZoraProvider>
        <MatrixGrid
          cells={cells}
          height={96}
          layout={layout}
          testID="controlled-matrix"
          viewport={{
            height: 96,
            offsetX: 0,
            offsetY: 0,
            pixelsPerUnitX: 2,
            pixelsPerUnitY: 3,
            width: 120,
          }}
          width={120}
          onViewportChange={(proposal) => proposals.push(proposal)}
          renderCell={(cell) => <span>{cell.id}</span>}
        />
      </ZoraProvider>
    );
    try {
      act(() => root.render(render()));
      act(() => root.render(render()));
      expect(proposals).toEqual([]);
    } finally {
      act(() => root.unmount());
    }
  });
});

test('proposes an uncontrolled horizontal pan in world units while retaining independent axis zoom', async () => {
  await withMatrixDom(async (host, browser) => {
    const proposals: unknown[] = [];
    const root = createRoot(host);
    const { MatrixGrid } = (await load('components/matrix-grid/MatrixGrid.js')) as {
      MatrixGrid: MatrixGridComponent;
    };
    const { ZoraProvider } = (await load('runtime/ZoraProvider.js')) as {
      ZoraProvider: ZoraProviderComponent;
    };
    try {
      act(() =>
        root.render(
          <ZoraProvider>
            <MatrixGrid
              cells={cells}
              height={96}
              layout={layout}
              testID="uncontrolled-matrix"
              width={120}
              zoomX={2}
              zoomY={3}
              onViewportChange={(proposal) => proposals.push(proposal)}
              renderCell={(cell) => <span>{cell.id}</span>}
            />
          </ZoraProvider>,
        ),
      );
      const horizontalScroll = host.querySelector(
        '[data-testid="uncontrolled-matrix-horizontal-scroll"]',
      );
      if (!horizontalScroll) throw new Error('Missing MatrixGrid horizontal scroll viewport.');
      horizontalScroll.scrollLeft = 40;
      await act(async () => {
        horizontalScroll.dispatchEvent(new browser.Event('scroll', { bubbles: true }));
        await new Promise<void>((resolve) => browser.setTimeout(resolve, 200));
      });
      expect(proposals).toEqual([
        {
          height: 96,
          offsetX: 20,
          offsetY: 0,
          pixelsPerUnitX: 2,
          pixelsPerUnitY: 3,
          width: 120,
        },
      ]);
    } finally {
      act(() => root.unmount());
    }
  });
});

test('navigates sparse cells by keyboard and applies range and modifier selection intents', async () => {
  await withMatrixDom(async (host, browser) => {
    const selections: (readonly string[])[] = [];
    const root = createRoot(host);
    const { MatrixGrid } = (await load('components/matrix-grid/MatrixGrid.js')) as {
      MatrixGrid: MatrixGridComponent;
    };
    const { ZoraProvider } = (await load('runtime/ZoraProvider.js')) as {
      ZoraProvider: ZoraProviderComponent;
    };
    const sparseLayout = {
      columns: [
        { id: 'column-0', size: 20 },
        { id: 'column-1', size: 20 },
        { id: 'column-2', size: 20 },
      ],
      rows: [
        { id: 'row-0', size: 20 },
        { id: 'row-1', size: 20 },
        { id: 'row-2', size: 20 },
      ],
    };
    const sparseCells = [
      { columnId: 'column-0', id: 'a1', rowId: 'row-0' },
      { columnId: 'column-2', id: 'c1', rowId: 'row-0' },
      { columnId: 'column-0', id: 'a3', rowId: 'row-2' },
      { columnId: 'column-2', id: 'c3', rowId: 'row-2' },
    ];

    function KeyboardMatrix() {
      const [selectedIds, setSelectedIds] = React.useState<readonly string[]>(['a1']);
      return (
        <ZoraProvider>
          <MatrixGrid
            cells={sparseCells}
            height={80}
            layout={sparseLayout}
            selectedCellIds={selectedIds}
            selectionMode="multi"
            testID="keyboard-matrix"
            width={80}
            onSelectionChange={(ids) => {
              selections.push(ids);
              setSelectedIds(ids);
            }}
            renderCell={(cell) => <span>{cell.id}</span>}
          />
        </ZoraProvider>
      );
    }

    try {
      act(() => root.render(<KeyboardMatrix />));
      const a1 = host.querySelector<HTMLElement>('[data-testid="keyboard-matrix-cell-a1"]');
      if (!a1) throw new Error('Missing initial sparse matrix cell.');
      act(() => a1.focus());
      act(() => {
        void a1.dispatchEvent(
          new browser.KeyboardEvent('keydown', { bubbles: true, key: 'ArrowRight' }),
        );
      });
      const c1 = host.querySelector<HTMLElement>('[data-testid="keyboard-matrix-cell-c1"]');
      expect(c1).not.toBeNull();
      expect(document.activeElement).toBe(c1);
      act(() => {
        void c1?.dispatchEvent(
          new browser.KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown', shiftKey: true }),
        );
      });
      expect(selections).toEqual([['a1', 'c1', 'a3', 'c3']]);
      const c3 = host.querySelector<HTMLElement>('[data-testid="keyboard-matrix-cell-c3"]');
      act(() => {
        void c3?.dispatchEvent(
          new browser.KeyboardEvent('keydown', { bubbles: true, ctrlKey: true, key: 'Enter' }),
        );
      });
      expect(selections.at(-1)).toEqual(['a1', 'c1', 'a3']);
      act(() => {
        void c3?.dispatchEvent(new browser.KeyboardEvent('keydown', { bubbles: true, key: ' ' }));
      });
      expect(selections.at(-1)).toEqual(['c3']);
    } finally {
      act(() => root.unmount());
    }
  });
});

test('does not capture keyboard input from interactive cell content and respects read-only selection', async () => {
  await withMatrixDom(async (host, browser) => {
    const selections: (readonly string[])[] = [];
    const root = createRoot(host);
    const { MatrixGrid } = (await load('components/matrix-grid/MatrixGrid.js')) as {
      MatrixGrid: MatrixGridComponent;
    };
    const { ZoraProvider } = (await load('runtime/ZoraProvider.js')) as {
      ZoraProvider: ZoraProviderComponent;
    };
    const oneCellLayout = {
      columns: [{ id: 'column-0', size: 20 }],
      rows: [{ id: 'row-0', size: 20 }],
    };
    const oneCell = [{ columnId: 'column-0', id: 'a1', rowId: 'row-0' }];

    try {
      act(() =>
        root.render(
          <ZoraProvider>
            <MatrixGrid
              cells={oneCell}
              height={40}
              layout={oneCellLayout}
              readOnly
              testID="interactive-matrix"
              width={40}
              onSelectionChange={(ids) => selections.push(ids)}
              renderCell={() => <input data-testid="matrix-editor" />}
            />
          </ZoraProvider>,
        ),
      );
      const editor = host.querySelector<HTMLInputElement>('[data-testid="matrix-editor"]');
      const cell = host.querySelector<HTMLElement>('[data-testid="interactive-matrix-cell-a1"]');
      if (!editor) throw new Error('Missing embedded matrix editor.');
      if (!cell) throw new Error('Missing read-only matrix cell.');
      act(() => {
        void cell.dispatchEvent(new browser.MouseEvent('click', { bubbles: true }));
      });
      act(() => editor.focus());
      act(() => {
        void editor.dispatchEvent(
          new browser.KeyboardEvent('keydown', { bubbles: true, key: 'ArrowRight' }),
        );
        void editor.dispatchEvent(
          new browser.KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }),
        );
        void editor.dispatchEvent(
          new browser.KeyboardEvent('keydown', { bubbles: true, key: ' ' }),
        );
      });
      expect(document.activeElement).toBe(editor);
      expect(selections).toEqual([]);
    } finally {
      act(() => root.unmount());
    }
  });
});

test('suppresses selection from passive matrix cells', async () => {
  await withMatrixDom(async (host, browser) => {
    const selections: (readonly string[])[] = [];
    const root = createRoot(host);
    const { MatrixGrid } = (await load('components/matrix-grid/MatrixGrid.js')) as {
      MatrixGrid: MatrixGridComponent;
    };
    const { ZoraProvider } = (await load('runtime/ZoraProvider.js')) as {
      ZoraProvider: ZoraProviderComponent;
    };
    const oneCellLayout = {
      columns: [{ id: 'column-0', size: 20 }],
      rows: [{ id: 'row-0', size: 20 }],
    };
    const oneCell = [{ columnId: 'column-0', id: 'a1', rowId: 'row-0' }];

    try {
      act(() =>
        root.render(
          <ZoraProvider>
            <MatrixGrid
              cells={oneCell}
              height={40}
              interactionPolicy="passive"
              layout={oneCellLayout}
              testID="passive-matrix"
              width={40}
              onSelectionChange={(ids) => selections.push(ids)}
              renderCell={(cell) => <span>{cell.id}</span>}
            />
          </ZoraProvider>,
        ),
      );
      const cell = host.querySelector<HTMLElement>('[data-testid="passive-matrix-cell-a1"]');
      if (!cell) throw new Error('Missing passive matrix cell.');
      act(() => {
        void cell.dispatchEvent(new browser.MouseEvent('click', { bubbles: true }));
        void cell.dispatchEvent(
          new browser.KeyboardEvent('keydown', { bubbles: true, key: 'ArrowRight' }),
        );
      });
      expect(selections).toEqual([]);
    } finally {
      act(() => root.unmount());
    }
  });
});

test('reveals an offscreen keyboard target through a controlled viewport with independent axis zoom', async () => {
  await withMatrixDom(async (host, browser) => {
    const root = createRoot(host);
    const { MatrixGrid } = (await load('components/matrix-grid/MatrixGrid.js')) as {
      MatrixGrid: MatrixGridComponent;
    };
    const { ZoraProvider } = (await load('runtime/ZoraProvider.js')) as {
      ZoraProvider: ZoraProviderComponent;
    };
    const sparseLayout = {
      columns: [
        { id: 'column-0', size: 20 },
        { id: 'column-1', size: 20 },
        { id: 'column-2', size: 20 },
      ],
      rows: [{ id: 'row-0', size: 20 }],
    };
    const sparseCells = [
      { columnId: 'column-0', id: 'a1', rowId: 'row-0' },
      { columnId: 'column-2', id: 'c1', rowId: 'row-0' },
    ];
    function ControlledMatrix() {
      const [viewport, setViewport] = React.useState<MatrixGridViewport>({
        height: 20,
        offsetX: 0,
        offsetY: 0,
        pixelsPerUnitX: 2,
        pixelsPerUnitY: 3,
        width: 20,
      });
      return (
        <MatrixGrid
          cells={sparseCells}
          height={20}
          layout={sparseLayout}
          overscanPixels={0}
          testID="controlled-keyboard-matrix"
          viewport={viewport}
          width={20}
          onViewportChange={(proposal) => {
            const nextViewport = proposal as MatrixGridViewport;
            setViewport(nextViewport);
          }}
          renderCell={(cell) => <span>{cell.id}</span>}
        />
      );
    }

    try {
      act(() =>
        root.render(
          <ZoraProvider>
            <ControlledMatrix />
          </ZoraProvider>,
        ),
      );
      const a1 = host.querySelector<HTMLElement>(
        '[data-testid="controlled-keyboard-matrix-cell-a1"]',
      );
      if (!a1) throw new Error('Missing controlled focus origin.');
      await act(async () => {
        await new Promise<void>((resolve) => browser.setTimeout(resolve, 0));
        a1.focus();
        void a1.dispatchEvent(
          new browser.KeyboardEvent('keydown', { bubbles: true, key: 'ArrowRight' }),
        );
        await new Promise<void>((resolve) => browser.setTimeout(resolve, 20));
      });
      const c1 = host.querySelector<HTMLElement>(
        '[data-testid="controlled-keyboard-matrix-cell-c1"]',
      );
      expect(c1).not.toBeNull();
      expect(document.activeElement).toBe(c1);
    } finally {
      act(() => root.unmount());
    }
  });
});

type MatrixGridViewport = NonNullable<React.ComponentProps<MatrixGridComponent>['viewport']>;
