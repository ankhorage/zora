import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { expect, test } from 'bun:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const forbiddenWebDependencies = [
  'expo-document-picker',
  'expo-image-picker',
  '@gorhom/bottom-sheet',
  'react-native-gesture-handler',
] as const;

const authoringControls = [
  'Button',
  'Card',
  'Field',
  'Pressable',
  'Text',
  'TextInput',
  'View',
] as const;

interface WebArtifactManifest {
  readonly artifacts: readonly {
    readonly component: string;
    readonly exportName: string;
    readonly files: readonly string[];
  }[];
}

/** Verifies that each generated package subpath exposes exactly its discovered component contract. */
test('isolates every generated component web runtime and declaration entrypoint', async () => {
  const manifest = (await Bun.file('web-dist/manifest.json').json()) as WebArtifactManifest;

  await Promise.all(
    manifest.artifacts.map(async ({ component, exportName, files }) => {
      const directory = join('web-dist', 'components', component);
      const [runtimeEntry, declarationEntry] = await Promise.all([
        Bun.file(join(directory, 'index.js')).text(),
        Bun.file(join(directory, 'index.d.ts')).text(),
      ]);
      const artifact = (await import(`@ankhorage/zora/web/${component}`)) as Record<
        string,
        unknown
      >;

      expect(Object.keys(artifact).sort(), component).toEqual([exportName]);
      expect(runtimeEntry, component).toBe(
        `'use client';\nexport { ${exportName} } from './${exportName}.js';\n`,
      );
      expect(declarationEntry, component).toStartWith(
        `export { ${exportName} } from './${exportName}';\n`,
      );
      expect(declarationEntry, component).not.toContain('export *');
      for (const declaration of files.filter((file) => file.endsWith('.d.ts'))) {
        expect(await Bun.file(join('web-dist', declaration)).text(), declaration).not.toContain(
          "from '@ankhorage/zora'",
        );
      }
    }),
  );
});

/** Verifies that shared feature facades retain exact component-specific declaration contracts. */
test('keeps shared facade component type exports isolated and portable', async () => {
  const contracts = [
    ['grid-view', 'GridView', 'GridViewProps'],
    ['tile-grid', 'TileGrid', 'TileGridProps'],
    ['tabs', 'Tabs', 'TabsProps'],
    ['tab', 'Tab', 'TabProps'],
    ['tab-list', 'TabList', 'TabListProps'],
    ['tab-panel', 'TabPanel', 'TabPanelProps'],
  ] as const;

  await Promise.all(
    contracts.map(async ([component, runtimeExport, typeExport]) => {
      const declaration = await Bun.file(
        join('web-dist', 'components', component, 'index.d.ts'),
      ).text();
      expect(declaration, component).toBe(
        `export { ${runtimeExport} } from './${runtimeExport}';\nexport type { ${typeExport} } from './${runtimeExport}';\n`,
      );
      expect(declaration, component).not.toContain("@ankhorage/zora'");
    }),
  );

  const gridViewDeclaration = await Bun.file(
    join('web-dist', 'components', 'grid-view', 'index.d.ts'),
  ).text();
  const tileGridDeclaration = await Bun.file(
    join('web-dist', 'components', 'tile-grid', 'index.d.ts'),
  ).text();
  expect(gridViewDeclaration).not.toContain('TileGrid');
  expect(tileGridDeclaration).not.toContain('GridView');

  const gridViewTypes = await Bun.file(
    join('web-dist', 'components', 'grid-view', 'GridView.types-0.d.ts'),
  ).text();
  const tileGridTypes = await Bun.file(
    join('web-dist', 'components', 'tile-grid', 'TileGrid.types-0.d.ts'),
  ).text();
  expect(gridViewTypes).not.toContain('TileGrid');
  expect(tileGridTypes).not.toContain('GridViewProps');
});

/** Verifies that specialized browser artifacts retain their directly owned public types. */
test('keeps specialized browser component types on their canonical web subpaths', async () => {
  const treeViewDeclaration = await Bun.file(
    join('web-dist', 'components', 'tree-view', 'index.d.ts'),
  ).text();
  expect(treeViewDeclaration).toBe(
    [
      "export { TreeView } from './TreeView';",
      "export type { TreeItemNode, TreeItemRenderProps, TreeViewProps } from './TreeView';",
      '',
    ].join('\n'),
  );

  const activityIndicatorDeclaration = await Bun.file(
    join('web-dist', 'components', 'activity-indicator', 'index.d.ts'),
  ).text();
  expect(activityIndicatorDeclaration).toBe(
    [
      "export { ActivityIndicator } from './ActivityIndicator';",
      "export type { ActivityIndicatorProps } from './ActivityIndicator';",
      '',
    ].join('\n'),
  );
});

/** Verifies that one-component feature facades retain their complete public supporting type contract. */
test('keeps GraphView facade-owned public types on its canonical web subpath', async () => {
  const declaration = await Bun.file(
    join('web-dist', 'components', 'graph-view', 'index.d.ts'),
  ).text();
  expect(declaration).toBe(
    [
      "export { GraphView } from './GraphView';",
      "export type { GraphViewCallbacks, GraphViewCanonicalEdgeData, GraphViewCanonicalGraphProps, GraphViewCanonicalNodeData, GraphViewController, GraphViewDomControllerEventDetail, GraphViewEdge, GraphViewElementEvent, GraphViewElementEventType, GraphViewFitOptions, GraphViewInput, GraphViewLayoutName, GraphViewMeasurement, GraphViewNode, GraphViewNodeMeasurement, GraphViewNodeRenderContext, GraphViewPoint, GraphViewProps, GraphViewRenderedNode, GraphViewSize, GraphViewStyleRule, GraphViewTopologyUpdatePolicy, GraphViewViewport, ResolvedGraphViewProps } from './GraphView';",
      '',
    ].join('\n'),
  );
});

/** Verifies that stable package web subpaths resolve only their requested UI graph. */
test('publishes SSR-safe ordinary UI through canonical web subpaths', async () => {
  const packageJson = (await Bun.file('package.json').json()) as {
    readonly exports: Record<string, unknown>;
  };
  expect(packageJson.exports['./web/runtime']).toEqual({
    types: './web-dist/runtime/ZoraProvider.d.ts',
    import: './web-dist/runtime/ZoraProvider.js',
    default: './web-dist/runtime/ZoraProvider.js',
  });
  expect(packageJson.exports['./web/*']).toEqual({
    types: './web-dist/components/*/index.d.ts',
    import: './web-dist/components/*/index.js',
    default: './web-dist/components/*/index.js',
  });
  expect(packageJson.exports['./cli']).toBeUndefined();

  const temporaryDirectory = await mkdtemp(join(process.cwd(), '.cache-zora-web-entrypoints-'));
  try {
    const entrypoint = join(temporaryDirectory, 'dashboard.tsx');
    await writeFile(
      entrypoint,
      [
        "export { ZoraProvider } from '@ankhorage/zora/web/runtime';",
        "export { AppBar } from '@ankhorage/zora/web/app-bar';",
        "export { AppShell } from '@ankhorage/zora/web/app-shell';",
        "export { Badge } from '@ankhorage/zora/web/badge';",
        "export { Button } from '@ankhorage/zora/web/button';",
        "export { Card } from '@ankhorage/zora/web/card';",
        "export { DataTable } from '@ankhorage/zora/web/data-table';",
        "export { Dialog } from '@ankhorage/zora/web/dialog';",
        "export { MetricCard } from '@ankhorage/zora/web/metric-card';",
        "export { PopoverMenu } from '@ankhorage/zora/web/popover-menu';",
        "export { Select } from '@ankhorage/zora/web/select';",
        "export { TextInput } from '@ankhorage/zora/web/text-input';",
        "export { Text } from '@ankhorage/zora/web/text';",
        "export { Heading } from '@ankhorage/zora/web/heading';",
        "export { View } from '@ankhorage/zora/web/view';",
        '',
      ].join('\n'),
      'utf8',
    );

    const build = await Bun.build({
      entrypoints: [entrypoint],
      target: 'browser',
      format: 'esm',
      external: ['react', 'react/*', 'react-dom', 'react-dom/*'],
    });
    expect(build.success).toBe(true);
    const graph = (await Promise.all(build.outputs.map((output) => output.text()))).join('\n');
    for (const dependency of forbiddenWebDependencies) {
      expect(graph).not.toContain(dependency);
    }
  } finally {
    await rm(temporaryDirectory, { force: true, recursive: true });
  }
});

/** Renders the generated public web entrypoints without a native runtime host. */
test('resolves ThemeModeToggle through the canonical package web subpath', async () => {
  const { ThemeModeToggle } = await import('@ankhorage/zora/web/theme-mode-toggle');
  expect(ThemeModeToggle).toBeDefined();
  const headlessFacade = await Bun.file('src/features/theme/public.ts').text();
  expect(headlessFacade).not.toContain('ThemeModeToggle');
});

test('SSR-renders ordinary UI from its public web subpaths', async () => {
  const [{ ZoraProvider }, { AppShell }, { Button }, { Screen }, { Text }] = await Promise.all([
    import('@ankhorage/zora/web/runtime'),
    import('@ankhorage/zora/web/app-shell'),
    import('@ankhorage/zora/web/button'),
    import('@ankhorage/zora/web/screen'),
    import('@ankhorage/zora/web/text'),
  ]);
  const markup = renderToStaticMarkup(
    React.createElement(
      ZoraProvider,
      { mode: 'light' },
      React.createElement(
        AppShell,
        undefined,
        React.createElement(
          Screen,
          undefined,
          React.createElement(Text, undefined, 'Web entrypoint'),
          React.createElement(Button, undefined, 'Continue'),
        ),
      ),
    ),
  );

  expect(markup).toContain('Web entrypoint');
  expect(markup).toContain('Continue');
});

/** Verifies that the color controls are available through their generated public web entrypoints. */
test('publishes the independent color controls through canonical web subpaths', async () => {
  const [{ ColorPicker }, { ColorWheel }, { ColorTone }, { ColorHueScale }] = await Promise.all([
    import('@ankhorage/zora/web/color-picker'),
    import('@ankhorage/zora/web/color-wheel'),
    import('@ankhorage/zora/web/color-tone'),
    import('@ankhorage/zora/web/color-hue-scale'),
  ]);

  expect(ColorPicker).toBeDefined();
  expect(ColorWheel).toBeDefined();
  expect(ColorTone).toBeDefined();
  expect(ColorHueScale).toBeDefined();
});

/** Verifies that the authoring boundary delegates its portable controls to released Surface. */
test('publishes browser-safe authoring controls through the released Surface boundary', async () => {
  const entrypoint = await Bun.file(join('src', 'authoring.ts')).text();
  expect(entrypoint).toContain("from '@ankhorage/surface/authoring-controls'");
  for (const control of authoringControls) expect(entrypoint).toContain(control);
  expect(entrypoint).not.toContain("from './features/theme/runtime'");
});
