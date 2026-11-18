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
  const ThemeModeToggle = await loadWebComponentAsync(
    '@ankhorage/zora/web/theme-mode-toggle',
    'ThemeModeToggle',
  );
  expect(ThemeModeToggle).toBeDefined();
  const headlessFacade = await Bun.file('src/features/theme/public.ts').text();
  expect(headlessFacade).not.toContain('ThemeModeToggle');
});

test('SSR-renders ordinary UI from its public web subpaths', async () => {
  const [ZoraProvider, AppShell, Button, Screen, Text] = await Promise.all([
    loadWebComponentAsync('@ankhorage/zora/web/runtime', 'ZoraProvider'),
    loadWebComponentAsync('@ankhorage/zora/web/app-shell', 'AppShell'),
    loadWebComponentAsync('@ankhorage/zora/web/button', 'Button'),
    loadWebComponentAsync('@ankhorage/zora/web/screen', 'Screen'),
    loadWebComponentAsync('@ankhorage/zora/web/text', 'Text'),
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

/** Loads one public web component and rejects an incomplete package boundary before rendering it. */
async function loadWebComponentAsync(
  specifier: string,
  exportName: string,
): Promise<React.ComponentType> {
  const module: unknown = await import(specifier);
  const exported = readModuleExport(module, exportName);
  if (!isReactComponent(exported)) {
    throw new Error(`Expected ${exportName} from ${specifier} to be a React component.`);
  }
  return exported;
}

/** Reads one named export from an untyped runtime module without treating arbitrary input as a map. */
function readModuleExport(module: unknown, exportName: string): unknown {
  if (typeof module !== 'object' || module === null) return undefined;
  return Object.entries(module).find(([name]) => name === exportName)?.[1];
}

/** Narrows the React component representation exposed by the package's public ESM boundary. */
function isReactComponent(value: unknown): value is React.ComponentType {
  return typeof value === 'function';
}

/** Verifies that the authoring boundary delegates its portable controls to released Surface. */
test('publishes browser-safe authoring controls through the released Surface boundary', async () => {
  const entrypoint = await Bun.file(join('src', 'authoring.ts')).text();
  expect(entrypoint).toContain("from '@ankhorage/surface/authoring-controls'");
  for (const control of authoringControls) expect(entrypoint).toContain(control);
  expect(entrypoint).not.toContain("from './features/theme/runtime'");
});
