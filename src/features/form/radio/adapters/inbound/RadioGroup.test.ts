import { expect, test } from 'bun:test';

import { radioGroupMeta } from '../../radioMeta';
import { resolveRadioGroupThemeRecipe } from '../../utils/resolveRadioGroupThemeRecipe';

test('resolves RadioGroup theme defaults while preserving instance overrides', () => {
  expect(resolveRadioGroupThemeRecipe({ themeFields: {} })).toEqual({
    gap: 's',
    color: 'primary',
    size: 'm',
  });

  expect(
    resolveRadioGroupThemeRecipe({
      gap: 'l',
      color: 'danger',
      size: 's',
      themeFields: { gap: 'xs', color: 'secondary', size: 'l' },
    }),
  ).toEqual({ gap: 'l', color: 'danger', size: 's' });
});

test('icon radio options expose serializable authoring metadata', () => {
  expect(radioGroupMeta.directManifestNode).toBe(true);
  expect(radioGroupMeta.blueprint.label).toBe('Radio button group');
  expect(radioGroupMeta.blueprint.defaultProps.options.map((option) => option.value)).toContain(
    radioGroupMeta.blueprint.defaultProps.defaultValue,
  );
  expect(
    radioGroupMeta.props.options.itemSchema.find((field) => field.key === 'iconSource')?.schema,
  ).toMatchObject({ type: 'media', mediaKinds: ['image'] });
  expect(radioGroupMeta.props.columns.enum).toEqual([1, 2, 3, 4]);
  expect(radioGroupMeta.props.contentOrientation.enum).toEqual(['horizontal', 'vertical']);
  expect(radioGroupMeta.events.valueChange.eventType).toBe('radioGroup.valueChange');
});
