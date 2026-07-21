import { createKnipConfig } from '@ankhorage/devtools/knip';

export default createKnipConfig({
  entry: [
    'scripts/scaffold-zora-example-app.ts',
    'examples/basic-app/App.tsx',
    'test-fixtures/registrySnapshot.test.ts',
  ],
  ignoreDependencies: ['expo-font'],
  ignoreFiles: [
    '.prettierrc.js',
    'eslint.config.mjs',
    'eslint.local.config.mjs',
    'examples/expo-showcase/**',
    'examples/*/*/**',
    'paradox.config.ts',
  ],
});
