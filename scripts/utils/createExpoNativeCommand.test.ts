import { expect, test } from 'bun:test';

import {
  createExpoMetroCommand,
  createExpoNativeRunCommand,
  getExpoNativeMetroPort,
} from './createExpoNativeCommand';

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
