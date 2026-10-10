import { join } from 'node:path';

const repositoryRoot = join(import.meta.dir, '..');
const result = await Bun.build({
  entrypoints: [join(repositoryRoot, 'src', 'capabilities', 'index.ts')],
  outdir: join(repositoryRoot, 'dist', 'capabilities'),
  format: 'esm',
  target: 'node',
  packages: 'external',
  sourcemap: 'external',
});

if (!result.success) {
  throw new Error(result.logs.map(({ message }) => message).join('\n'));
}
