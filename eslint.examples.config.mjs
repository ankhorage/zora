// This file is managed by @ankhorage/devtools.
import { existsSync } from 'node:fs';

import { createConfig } from '@ankhorage/devtools/eslint';
import localConfig from './eslint.local.config.mjs';

const exampleFiles = ['examples/**/*.{ts,tsx}'];
const localEntries = Array.isArray(localConfig) ? localConfig : [localConfig];
const rootProjects = ['./tsconfig.eslint.json', './tsconfig.json'].filter((project) =>
  existsSync(new URL(project, import.meta.url)),
);

export default [
  ...createConfig({
    files: exampleFiles,
    project: [...rootProjects, './examples/**/tsconfig.json'],
    tsconfigRootDir: import.meta.dirname,
  }),
  ...localEntries,
];
