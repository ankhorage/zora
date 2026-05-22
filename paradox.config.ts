import { defineParadoxConfig } from '@ankhorage/paradox';

export default defineParadoxConfig({
  mode: 'write',

  docs: {
    title: '@ankhorage/zora',
    description:
      'ZORA — an opinionated UI kit for React Native + Web built on top of @ankhorage/surface.',
    usage: {
      entrypoints: ['examples/basic-app/App.tsx'],
    },
  },

  package: {
    root: '.',
    entrypoints: ['src/index.ts'],
  },

  output: {
    dir: './paradox',
  },
});