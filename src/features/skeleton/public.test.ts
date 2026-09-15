import { expect, test } from 'bun:test';

import { ZORA_COMPONENT_META } from '../authoring/componentMeta';

test('skeletons support direct authoring and automatic feature loading states', async () => {
  const [dataTableSource, publicSource] = await Promise.all([
    Bun.file('src/features/data-table/adapters/inbound/DataTable.tsx').text(),
    Bun.file('src/features/skeleton/public.ts').text(),
  ]);

  expect(ZORA_COMPONENT_META.Skeleton.directManifestNode).toBe(true);
  expect(ZORA_COMPONENT_META.SkeletonCard.directManifestNode).toBe(true);
  expect(ZORA_COMPONENT_META.SkeletonList.directManifestNode).toBe(true);
  expect(ZORA_COMPONENT_META.SkeletonText.directManifestNode).toBe(true);
  expect(publicSource).toContain('Skeleton');
  expect(publicSource).toContain('SkeletonCard');
  expect(publicSource).toContain('SkeletonList');
  expect(publicSource).toContain('SkeletonText');
  expect(ZORA_COMPONENT_META.SkeletonList.bindings?.props?.rows?.value.type).toBe('number');

  expect(dataTableSource).toContain("from '../../../skeleton/public'");
  expect(dataTableSource).toContain('if (loading)');
  expect(dataTableSource).toContain('<SkeletonList rows={loadingRows}');
});
