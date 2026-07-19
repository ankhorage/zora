import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createConfig } from '@ankhorage/devtools/eslint';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default createConfig({
  tsconfigRootDir: __dirname,
  project: ['./tsconfig.eslint.json'],
  files: ['examples/**/*.{ts,tsx}', 'src/**/*.{ts,tsx}'],
});
