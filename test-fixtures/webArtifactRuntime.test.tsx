import { mkdir, mkdtemp, rm } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

import { afterAll, beforeAll, expect, test } from 'bun:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { buildWebArtifact } from '../scripts/web-artifacts/buildWebArtifact';
import { discoverWebArtifactTargets } from '../scripts/web-artifacts/discoverWebArtifactTargets';

const repositoryRoot = join(import.meta.dir, '..');
const sourceRoot = join(repositoryRoot, 'src');
const require = createRequire(import.meta.url);
const surfacePackageRoot = dirname(require.resolve('@ankhorage/surface/package.json'));
const state: {
  directory?: string;
  AppBar?: React.ComponentType<Record<string, unknown>>;
  Text?: React.ComponentType<Record<string, unknown>>;
} = {};

beforeAll(async () => {
  const cache = join(repositoryRoot, '.cache');
  await mkdir(cache, { recursive: true });
  const directory = await mkdtemp(join(cache, 'web-artifact-runtime-'));
  state.directory = directory;
  const targets = await discoverWebArtifactTargets({
    featuresRoot: join(sourceRoot, 'features'),
    repositoryRoot,
    sourceRoot,
  });
  for (const name of ['app-bar', 'text']) {
    const target = targets.find((candidate) => candidate.component === name);
    if (target === undefined) throw new Error(`Missing artifact ${name}`);
    await buildWebArtifact(target, {
      cacheRoot: join(directory, 'entrypoints'),
      repositoryRoot,
      sourceRoot,
      surfacePackageRoot,
      webDistRoot: directory,
    });
  }
  const appBar = await import(join(directory, 'app-bar/AppBar.js'));
  const text = await import(join(directory, 'text/Text.js'));
  state.AppBar = appBar.AppBar;
  state.Text = text.Text;
}, 30_000);

afterAll(async () => {
  if (state.directory !== undefined) await rm(state.directory, { recursive: true, force: true });
});

test('renders one generated AppBar without a consumer responsive provider', () => {
  const { AppBar } = state;
  if (AppBar === undefined) throw new Error('AppBar was not built.');
  expect(renderToStaticMarkup(<AppBar title="Standalone workspace" />)).toContain(
    'Standalone workspace',
  );
});

test('composes independently generated AppBar and Text artifacts without split contexts', () => {
  const { AppBar, Text } = state;
  if (AppBar === undefined || Text === undefined) throw new Error('Artifacts were not built.');
  const markup = renderToStaticMarkup(
    <>
      <AppBar title="Composed workspace" />
      <Text>Graph ready</Text>
    </>,
  );
  expect(markup).toContain('Composed workspace');
  expect(markup).toContain('Graph ready');
});
