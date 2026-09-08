import { expect, test } from 'bun:test';

import { resolveRadioGroupThemeRecipe } from './resolveRadioGroupThemeRecipe';

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

test('card presentation stays on the RadioGroup and Surface Radio semantic path', async () => {
  const source = await Bun.file('src/components/radio/RadioGroup.tsx').text();

  expect(source).toContain('accessibilityRole="radiogroup"');
  expect(source).toContain('checked={value === option.value}');
  expect(source).toContain('<Radio');
  expect(source).toContain("const isCard = presentation === 'card';");
  expect(source).not.toContain('<Button');
  expect(source).not.toContain('SelectableItem');
});
