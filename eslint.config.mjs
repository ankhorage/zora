import { createConfig } from '@ankhorage/devtools/eslint';
import localConfig from './eslint.local.config.mjs';

const localEntries = Array.isArray(localConfig) ? localConfig : [localConfig];

export default [
  ...createConfig({
    files: ['src/**/*.{ts,tsx}'],
    project: ['./tsconfig.json'],
    tsconfigRootDir: import.meta.dirname,
  }),
  ...localEntries,
];
