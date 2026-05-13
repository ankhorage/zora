import { createKnipConfig } from '@ankhorage/devtools/knip';

export default createKnipConfig({
  entry: ['src/index.ts', 'scripts/scaffold-zora-example-app.ts'],
  ignoreDependencies: ['expo-font'],
  ignoreFiles: [
    '.prettierrc.js',
    'eslint.config.mjs',
    'examples/expo-showcase/**',
    'examples/*/*/**',
  ],
});
