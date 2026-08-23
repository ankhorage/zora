import { createConfig } from '@ankhorage/devtools/eslint';

const sourceFiles = ['src/**/*.{ts,tsx}'];
const validationScriptFiles = [
  'scripts/validate-example-projects.ts',
  'scripts/validate-expo-candidate.ts',
];
const files = [...sourceFiles, ...validationScriptFiles];

export default [
  ...createConfig({
    tsconfigRootDir: import.meta.dirname,
    project: ['./tsconfig.scripts.json'],
    files: validationScriptFiles,
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
      'react-native/no-inline-styles': 'off',
      'max-lines-per-function': ['error', { max: 600, skipBlankLines: true, skipComments: true }],
      'max-lines': ['error', { max: 728, skipBlankLines: true, skipComments: true }],
      complexity: ['error', { max: 31, variant: 'modified' }],
    },
  },
];
