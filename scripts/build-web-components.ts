import { copyFile, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';

const repositoryRoot = join(import.meta.dir, '..');
const webDistRoot = join(repositoryRoot, 'web-dist');
const treeViewOutput = join(webDistRoot, 'tree-view');

await rm(webDistRoot, { force: true, recursive: true });
await mkdir(treeViewOutput, { recursive: true });

const buildResult = await Bun.build({
  entrypoints: [
    join(
      repositoryRoot,
      'src/features/tree-view/adapters/inbound/web-artifact/TreeView.tsx',
    ),
  ],
  outdir: treeViewOutput,
  target: 'browser',
  format: 'esm',
  splitting: false,
  minify: false,
  external: ['react', 'react/jsx-runtime'],
});

if (!buildResult.success) {
  throw new Error(buildResult.logs.map((log) => String(log)).join('\n'));
}

await copyFile(
  join(
    repositoryRoot,
    'dist/features/tree-view/adapters/inbound/web-artifact/TreeView.d.ts',
  ),
  join(treeViewOutput, 'TreeView.d.ts'),
);
