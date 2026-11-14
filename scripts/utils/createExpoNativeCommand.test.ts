import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { expect, test } from 'bun:test';

import {
  createExpoMetroCommand,
  createExpoNativeRunCommand,
  getExpoNativeMetroPort,
} from './createExpoNativeCommand';

const repositoryRoot = resolve(import.meta.dir, '..', '..');

test('uses Expo 57 no-bundler launch without the incompatible port argument', () => {
  const command = createExpoNativeRunCommand('android');

  expect(command).toEqual(['bunx', 'expo', 'run:android', '--no-bundler']);
  expect(command).not.toContain('--port');
});

test('owns the default native Metro port in the separate Expo server command', () => {
  expect(createExpoMetroCommand()).toEqual([
    'bunx',
    'expo',
    'start',
    '--localhost',
    '--port',
    '8081',
  ]);
  expect(getExpoNativeMetroPort()).toBe(8081);
});

test('the isolated FlowCanvas native fixture declares Expo-compatible TypeScript', () => {
  const manifest = JSON.parse(
    readFileSync(
      join(repositoryRoot, 'test-fixtures', 'flow-canvas-native', 'package.json'),
      'utf8',
    ),
  ) as { devDependencies?: Record<string, string> };

  expect(manifest.devDependencies?.typescript).toMatch(/^~6\.0\.\d+$/);
});
