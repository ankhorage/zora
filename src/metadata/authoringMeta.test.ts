import { describe, expect, test } from 'bun:test';

import { ZORA_COMPONENT_META, type ZoraComponentPropAuthoring } from './index';

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
    expect(ZORA_COMPONENT_META.Button.props.children?.authoring).toEqual({
      authority: 'instance',
    });
    expect(ZORA_COMPONENT_META.Card.props.title?.authoring).toEqual({ authority: 'instance' });
    expect(ZORA_COMPONENT_META.Heading.props.text?.authoring).toEqual({ authority: 'instance' });
    expect(ZORA_COMPONENT_META.Heading.props.level?.authoring).toEqual({ authority: 'instance' });
    expect(ZORA_COMPONENT_META.Text.props.text?.authoring).toEqual({ authority: 'instance' });
    expect(ZORA_COMPONENT_META.Panel.props.description?.authoring).toEqual({
      authority: 'instance',
    });
  });

  test('classifies component and pattern styling as theme authority', () => {
    expect(ZORA_COMPONENT_META.Button.props.size?.authoring).toEqual({
      authority: 'theme',
      scope: 'component',
    });
    expect(ZORA_COMPONENT_META.Card.props.tone?.authoring).toEqual({
      authority: 'theme',
      scope: 'component',
    });
    expect(ZORA_COMPONENT_META.Heading.props.size?.authoring).toEqual({
      authority: 'theme',
      scope: 'component',
    });
    expect(ZORA_COMPONENT_META.Text.props.variant?.authoring).toEqual({
      authority: 'theme',
      scope: 'component',
    });
    expect(ZORA_COMPONENT_META.Panel.props.compact?.authoring).toEqual({
      authority: 'theme',
      scope: 'pattern',
    });
  });

  test('keeps Heading blueprint content useful before instance editing', () => {
    expect(ZORA_COMPONENT_META.Heading.blueprint?.defaultProps).toEqual({
      text: 'Heading',
      level: 2,
    });
  });

  test('treats absent authoring metadata as not authorable', () => {
    expect(ZORA_COMPONENT_META.Progress.props.value?.authoring).toBeUndefined();
  });

  test('does not introduce a system authority', () => {
    expect(JSON.stringify(ZORA_COMPONENT_META)).not.toContain('"authority":"system"');
  });
});
