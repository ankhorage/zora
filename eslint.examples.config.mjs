import { createConfig } from '@ankhorage/devtools/eslint';

const exampleFiles = ['examples/**/*.{ts,tsx}'];

export default [
  ...createConfig({
    tsconfigRootDir: import.meta.dirname,
    project: ['./tsconfig.eslint.json'],
    files: exampleFiles,
  }),
  {
    files: exampleFiles,
    rules: {
      'react-native/no-inline-styles': 'off',
      'max-lines-per-function': ['error', { max: 600, skipBlankLines: true, skipComments: true }],
      'max-lines': ['error', { max: 728, skipBlankLines: true, skipComments: true }],
      complexity: ['error', { max: 31, variant: 'modified' }],
    },
  },
];
