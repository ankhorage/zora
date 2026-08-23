import { createKnipConfig } from '@ankhorage/devtools/knip';

export default createKnipConfig({
  entry: [
    'scripts/scaffold-zora-example-app.ts',
    'examples/basic-app/App.tsx',
    'test-fixtures/platformAcceptance.test.tsx',
    'test-fixtures/registrySnapshot.test.ts',
  ],
  ignoreFiles: [
    '.prettierrc.js',
    'eslint.config.mjs',
    'eslint.examples.config.mjs',
    'eslint.local.config.mjs',
    'examples/expo-showcase/**',
    'examples/*/*/**',
    'paradox.config.ts',
  ],
});
