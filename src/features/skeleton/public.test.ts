import { expect, test } from 'bun:test';

import { skeletonCardMeta, skeletonListMeta, skeletonMeta, skeletonTextMeta } from './skeletonMeta';

test('skeletons support direct authoring and automatic feature loading states', async () => {
  const [dataTableSource, publicSource] = await Promise.all([
    Bun.file('src/features/data-table/adapters/inbound/DataTable.tsx').text(),
    Bun.file('src/features/skeleton/public.ts').text(),
  ]);

  expect(skeletonMeta.directManifestNode).toBe(true);
  expect(skeletonCardMeta.directManifestNode).toBe(true);
  expect(skeletonListMeta.directManifestNode).toBe(true);
  expect(skeletonTextMeta.directManifestNode).toBe(true);
  expect(publicSource).toContain('Skeleton');
  expect(publicSource).toContain('SkeletonCard');
  expect(publicSource).toContain('SkeletonList');
  expect(publicSource).toContain('SkeletonText');
  expect(skeletonListMeta.bindings?.props?.rows?.value.type).toBe('number');

  expect(dataTableSource).toContain("from '../../../skeleton/public'");
  expect(dataTableSource).toContain('if (loading)');
  expect(dataTableSource).toContain('<SkeletonList rows={loadingRows}');
});
