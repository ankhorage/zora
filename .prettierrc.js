import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

export default require('@ankhorage/devtools/prettier');
