import { describe, expect, test } from 'bun:test';

import { ZORA_COMPONENT_META, type ZoraComponentPropAuthoring } from './index';

function authoring(component: string, prop: string): ZoraComponentPropAuthoring | undefined {
  return ZORA_COMPONENT_META[component]?.props[prop]?.authoring;
}

describe('ZORA component prop authoring authority', () => {
  test('supports the canonical instance and theme scope combinations', () => {
    const values: readonly ZoraComponentPropAuthoring[] = [
      { authority: 'instance' },
      { authority: 'theme', scope: 'global' },
      { authority: 'theme', scope: 'component' },
      { authority: 'theme', scope: 'pattern' },
    ];

    expect(values).toEqual([
      { authority: 'instance' },
      { authority: 'theme', scope: 'global' },
      { authority: 'theme', scope: 'component' },
      { authority: 'theme', scope: 'pattern' },
    ]);
  });

  test('classifies representative instance content without exposing arbitrary styling', () => {
    expect(authoring('Button', 'children')).toEqual({ authority: 'instance' });
    expect(authoring('Card', 'title')).toEqual({ authority: 'instance' });
    expect(authoring('Text', 'text')).toEqual({ authority: 'instance' });
    expect(authoring('Panel', 'description')).toEqual({ authority: 'instance' });
  });

  test('classifies component and pattern styling as theme authority', () => {
    expect(authoring('Button', 'size')).toEqual({ authority: 'theme', scope: 'component' });
    expect(authoring('Card', 'tone')).toEqual({ authority: 'theme', scope: 'component' });
    expect(authoring('Text', 'variant')).toEqual({ authority: 'theme', scope: 'component' });
    expect(authoring('Panel', 'compact')).toEqual({ authority: 'theme', scope: 'pattern' });
  });

  test('treats absent authoring metadata as not authorable', () => {
    expect(authoring('Image', 'resizeMode')).toBeUndefined();
  });

  test('does not introduce a system authority', () => {
    expect(JSON.stringify(ZORA_COMPONENT_META)).not.toContain('"authority":"system"');
  });
});
