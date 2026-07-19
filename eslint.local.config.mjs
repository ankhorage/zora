import { createConfig } from '@ankhorage/devtools/eslint';

const sourceFiles = ['src/**/*.{ts,tsx}'];
const exampleFiles = ['examples/**/*.{ts,tsx}'];
const files = [...sourceFiles, ...exampleFiles];

export default [
  ...createConfig({
    tsconfigRootDir: import.meta.dirname,
    project: ['./tsconfig.eslint.json'],
    files: exampleFiles,
  }),
  {
    files: sourceFiles,
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.eslint.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files,
    rules: {
      'max-lines-per-function': ['error', { max: 600, skipBlankLines: true, skipComments: true }],
      'max-lines': ['error', { max: 728, skipBlankLines: true, skipComments: true }],
      complexity: ['error', { max: 31, variant: 'modified' }],
    },
  },
];
