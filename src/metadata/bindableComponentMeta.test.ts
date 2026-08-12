import type { UiComponentMetaRegistry } from '@ankhorage/contracts';
import { describe, expect, it } from 'bun:test';

import { ZORA_BINDABLE_COMPONENT_META } from './bindableComponentMeta';
import { ZORA_COMPONENT_META } from './componentMeta';

describe('ZORA bindable component metadata', () => {
  it('matches the shared UI metadata registry shape', () => {
    const registry: UiComponentMetaRegistry = ZORA_BINDABLE_COMPONENT_META;

    expect(registry.Text?.bindings?.props?.text?.value.type).toBe('string');
    expect(registry.Heading?.bindings?.props?.text?.value.type).toBe('string');
    expect(registry.Button?.bindings?.props?.children?.value.type).toBe('string');
    expect(registry.Input?.bindings?.props?.value?.value.type).toBe('string');
    expect(registry.Select?.bindings?.props?.value?.value.type).toBe('string');
    expect(registry.Image?.bindings?.props?.source?.value.type).toBe('imageAsset');
    expect(registry.DataTable?.bindings?.props?.rows?.value.type).toBe('array');
  });

  it('shares canonical Image authoring metadata while preserving dynamic image bindings', () => {
    const image = ZORA_BINDABLE_COMPONENT_META.Image;

    expect(image.props.source).toMatchObject({
      type: 'media',
      mediaKinds: ['image'],
    });
    expect(image.props).toEqual(ZORA_COMPONENT_META.Image.props);
    expect(image.directManifestNode).toBe(ZORA_COMPONENT_META.Image.directManifestNode);
    expect(image.bindings.props.source.value.type).toBe('imageAsset');
  });
});
