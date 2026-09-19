import { copyFile, mkdir, readFile, rm } from 'node:fs/promises';
import { join } from 'node:path';

const repositoryRoot = join(import.meta.dir, '..');
const webDistRoot = join(repositoryRoot, 'web-dist');
const treeViewOutput = join(webDistRoot, 'tree-view');

await rm(webDistRoot, { force: true, recursive: true });
await mkdir(treeViewOutput, { recursive: true });

const buildResult = await Bun.build({
  entrypoints: [
    join(repositoryRoot, 'src/features/tree-view/adapters/inbound/web-artifact/TreeView.tsx'),
  ],
  outdir: treeViewOutput,
  target: 'browser',
  format: 'esm',
  splitting: false,
  minify: false,
  external: ['react', 'react/jsx-runtime'],
  jsx: {
    development: false,
    factory: 'React.createElement',
    fragment: 'React.Fragment',
    importSource: 'react',
    runtime: 'automatic',
    sideEffects: false,
  },
});

if (!buildResult.success) {
  throw new Error(buildResult.logs.map((log) => String(log)).join('\n'));
}

const treeViewBundlePath = join(treeViewOutput, 'TreeView.js');
const treeViewBundle = await readFile(treeViewBundlePath, 'utf8');
if (treeViewBundle.includes('jsxDEV') || treeViewBundle.includes('react/jsx-dev-runtime')) {
  throw new Error('Web component artifacts must use the production React JSX runtime.');
}

await copyFile(
  join(repositoryRoot, 'dist/features/tree-view/adapters/inbound/web-artifact/TreeView.d.ts'),
  join(treeViewOutput, 'TreeView.d.ts'),
);
