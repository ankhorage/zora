import { expect, test } from 'bun:test';

import { FEATURE_MANIFEST_ELEMENTS } from './constants';
import { ZORA_CORE_PLUGIN_METADATA } from './corePluginMetadata';
import { ZORA_COMPONENT_META } from './metadata/componentMeta';

test('every selected feature element is directly authorable through its canonical public facade', async () => {
  const catalog = new Map(Object.entries(ZORA_COMPONENT_META));
  for (const [family, names] of Object.entries(FEATURE_MANIFEST_ELEMENTS)) {
    const source = await Bun.file(`src/features/${family}/public.ts`).text();
    for (const name of names) {
      const meta = catalog.get(name);
      expect(meta?.directManifestNode, name).toBe(true);
      expect(Object.keys(meta?.props ?? {}).length, name).toBeGreaterThan(0);
      expect(source, name).toContain(name);
    }
  }
});

test('interactive authoring retains state and event payload bindings after plugin composition', () => {
  const meta = ZORA_CORE_PLUGIN_METADATA.componentMeta;
  expect(meta.DataTable?.bindings?.props?.sort?.value.type).toBe('object');
  expect(meta.DataTable?.bindings?.props?.rows?.value.type).toBe('array');
  expect(meta.Uploader?.bindings?.props?.value?.value.type).toBe('object');
  expect(meta.Uploader?.bindings?.events?.uploadRequest?.payload?.fields).toContainEqual({
    path: 'asset',
    type: 'object',
  });
  expect(meta.BottomSheet?.bindings?.props?.open?.value.type).toBe('boolean');
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
