import { describe, expect, test } from 'bun:test';

import { ZORA_COMPONENT_META, type ZoraComponentPropAuthoring } from './index';

const componentMetaByName = new Map(Object.entries(ZORA_COMPONENT_META));

describe('ZORA component prop authoring authority', () => {
  test('supports instance and theme authority with explicit instance override capability', () => {
    const values: readonly ZoraComponentPropAuthoring[] = [
      { authority: 'instance' },
      { authority: 'theme', scope: 'global' },
      { authority: 'theme', scope: 'component', allowInstanceOverride: true },
      { authority: 'theme', scope: 'pattern', allowInstanceOverride: true },
    ];
    expect(values).toHaveLength(4);
  });

  test('keeps representative content and semantics instance-owned', () => {
    expect(ZORA_COMPONENT_META.Button.props.children?.authoring).toEqual({ authority: 'instance' });
    expect(ZORA_COMPONENT_META.Card.props.title?.authoring).toEqual({ authority: 'instance' });
    expect(ZORA_COMPONENT_META.Heading.props.level?.authoring).toEqual({ authority: 'instance' });
    expect(ZORA_COMPONENT_META.Text.props.text?.authoring).toEqual({ authority: 'instance' });
  });

  test('marks recipe props theme-owned while allowing explicit instance overrides', () => {
    for (const name of ['Button', 'Card', 'Heading', 'Text', 'Panel']) {
      const meta = componentMetaByName.get(name);
      expect(meta, name).toBeDefined();
      for (const prop of Object.values(meta?.props ?? {})) {
        if (prop.authoring?.authority !== 'theme') continue;
        expect(prop.authoring.allowInstanceOverride, name).toBe(true);
      }
    }
  });

  test('keeps Heading blueprint semantic content useful', () => {
    expect(ZORA_COMPONENT_META.Heading.blueprint?.defaultProps).toEqual({
      text: 'Heading',
      level: 2,
    });
  });

  test('does not introduce a system authority', () => {
    expect(JSON.stringify(ZORA_COMPONENT_META)).not.toContain('"authority":"system"');
  });
});
