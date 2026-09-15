import { existsSync } from 'node:fs';

import { expect, test } from 'bun:test';

import { ZORA_CORE_PLUGIN_METADATA } from '../plugin/ZORA_CORE_PLUGIN_METADATA';
import { ZORA_COMPONENT_META } from './componentMeta';
import { FEATURE_MANIFEST_ELEMENTS } from './constants';

test('every selected feature element is directly authorable through its canonical public facade', async () => {
  const catalog = new Map(Object.entries(ZORA_COMPONENT_META));
  for (const [family, names] of Object.entries(FEATURE_MANIFEST_ELEMENTS)) {
    const source = await Bun.file(`src/features/${family}/public.ts`).text();
    for (const name of names) {
      const meta = catalog.get(name);
      const hasAuthorableShape =
        Object.keys(meta?.props ?? {}).length > 0 || (meta?.allowedChildren.length ?? 0) > 0;
      expect(meta?.directManifestNode, name).toBe(true);
      expect(hasAuthorableShape, name).toBe(true);
      expect(source, name).toContain(name);
    }
  }
});

test('feature ownership has no remaining legacy ownership roots', () => {
  expect(existsSync('src/components')).toBe(false);
  expect(existsSync('src/patterns')).toBe(false);
});

test('form composition has one canonical feature owner', () => {
  expect(existsSync('src/components/form')).toBe(false);
  expect(existsSync('src/patterns/form-field')).toBe(false);
});

test('migrated picker and presentation elements have one canonical feature owner', () => {
  for (const legacyPath of [
    'src/components/gradient',
    'src/components/date-picker',
    'src/components/skeleton',
    'src/components/time-picker',
    'src/patterns/hero',
    'src/patterns/missing-element',
    'src/patterns/auth',
  ]) {
    expect(existsSync(legacyPath), legacyPath).toBe(false);
  }
});

test('existing interactive authoring retains bindings after plugin composition', () => {
  const meta = ZORA_CORE_PLUGIN_METADATA.componentMeta;
  expect(meta.DataTable?.bindings?.props?.sort?.value.type).toBe('object');
  expect(meta.DataTable?.bindings?.props?.rows?.value.type).toBe('array');
  expect(meta.Uploader?.bindings?.props?.value?.value.type).toBe('object');
  expect(meta.Uploader?.bindings?.events?.uploadRequest?.payload?.fields).toContainEqual({
    path: 'asset',
    type: 'object',
  });
  expect(meta.BottomSheet?.bindings?.props?.open?.value.type).toBe('boolean');
});

test('final ownership data components retain bindings after plugin composition', () => {
  const meta = ZORA_CORE_PLUGIN_METADATA.componentMeta;
  expect(meta.Dialog?.bindings?.props?.visible?.value.type).toBe('boolean');
  expect(meta.Dialog?.bindings?.events?.dismiss?.payload?.eventType).toBe('dialog.dismiss');
  expect(meta.Pagination?.bindings?.props?.page?.value.type).toBe('number');
  expect(meta.Pagination?.bindings?.events?.pageChange?.payload?.eventType).toBe(
    'pagination.pageChange',
  );
  expect(meta.Rating?.bindings?.props?.value?.value.type).toBe('number');
});

test('final ownership form and tab components retain bindings after plugin composition', () => {
  const meta = ZORA_CORE_PLUGIN_METADATA.componentMeta;
  expect(meta.SearchInput?.bindings?.props?.value?.value.type).toBe('string');
  expect(meta.SearchInput?.bindings?.events?.submit?.payload?.eventType).toBe('searchInput.submit');
  expect(meta.Tabs?.bindings?.props?.value?.value.type).toBe('string');
  expect(meta.Tabs?.bindings?.events?.valueChange?.payload?.eventType).toBe('tabs.valueChange');
});

test('existing scalar authoring bindings remain available after plugin composition', () => {
  const meta = ZORA_CORE_PLUGIN_METADATA.componentMeta;
  expect(meta.Heading?.bindings?.props?.level?.value.type).toBe('number');
  expect(meta.Image?.bindings?.props?.radius?.value.type).toBe('unknown');
});

test('authoring schemas omit layout and avatar options ignored by the underlying components', () => {
  const meta = ZORA_CORE_PLUGIN_METADATA.componentMeta;
  expect(meta.Divider?.props).not.toHaveProperty('width');
  expect(meta.Container?.props).not.toHaveProperty('width');
  expect(meta.AvatarGroup?.props.items?.itemSchema?.map(({ key }) => key)).not.toContain('size');
  expect(meta.AvatarGroup?.props.items?.itemSchema?.map(({ key }) => key)).not.toContain('shape');
});

test('ContentRail accepts chips and all card elements and offers intrinsic-width scrolling', () => {
  const rail = ZORA_COMPONENT_META.ContentRail;
  for (const child of ['ChipGroup', ...FEATURE_MANIFEST_ELEMENTS.card])
    expect(rail.allowedChildren).toContain(child);
  expect(rail.props.itemSize?.enum).toContain('content');
  expect(rail.props).not.toHaveProperty('stickyHeaderIndices');
});
