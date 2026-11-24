import { expect, test } from 'bun:test';

import repository from './repository.json';

/** Verifies that the declared build targets retain their independently owned compiler inputs. */
test('declares explicit universal and browser compiler roots', () => {
  expect(repository.build).toEqual({
    targets: {
      native: {
        language: 'typescript',
        framework: 'react-native',
        platforms: ['ios', 'android', 'web'],
        entry: '.',
        outDir: 'dist',
        sources: { include: ['src/**/*.ts', 'src/**/*.tsx'] },
        builder: { script: 'build' },
      },
      web: {
        language: 'typescript',
        framework: 'react',
        platforms: ['web'],
        entry: './web/*',
        outDir: 'web-dist',
        sources: { include: ['src/features/**/public.ts', 'src/authoring.browser.ts'] },
        builder: { script: 'build' },
      },
    },
  });
});
