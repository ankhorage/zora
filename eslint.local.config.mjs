import { createConfig } from '@ankhorage/devtools/eslint';

const files = ['examples/**/*.{ts,tsx}', 'src/**/*.{ts,tsx}'];

export default [
  ...createConfig({
    tsconfigRootDir: import.meta.dirname,
    project: ['./tsconfig.eslint.json'],
    files: ['examples/**/*.{ts,tsx}'],
  }),
  {
    files,
    rules: {
      'no-unused-vars': 'off',
      'max-lines-per-function': [
        'error',
        { max: 600, skipBlankLines: true, skipComments: true },
      ],
      'max-lines': ['error', { max: 728, skipBlankLines: true, skipComments: true }],
      complexity: ['error', { max: 31, variant: 'modified' }],
    },
  },
];
