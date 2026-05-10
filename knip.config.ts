import { createKnipConfig } from '@ankhorage/devtools/knip';

export default createKnipConfig({
  ignoreDependencies: ['expo-font'],
  ignoreFiles: [
    '.prettierrc.js',
    'eslint.config.mjs',
    'examples/expo-showcase/**',
  ],
});
