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
