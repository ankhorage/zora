import { describe, expect, test } from 'bun:test';

import { ZORA_COLOR_HARMONIES } from '../../theme/types';
import { zoraDefaultTheme } from '../../theme/zoraDefaultTheme';
import {
  applyHarmonyRecommendation,
  formatThemeComposerLabel,
  hueDegreesToHexColor,
  type ThemeComposerHarmonyRecommendation,
} from './recommendations';
import type { ThemeComposerProps } from './types';

// Validate the exported types compile correctly by asserting shape
describe('ThemeComposerProps', () => {
  test('accepts a valid ZoraTheme as value', () => {
    const props: ThemeComposerProps = {
      value: zoraDefaultTheme,
      onChange: () => undefined,
    };
    expect(props.value.primaryColor).toBe(zoraDefaultTheme.primaryColor);
    expect(props.value.harmony).toBe('analogous');
    expect(props.value.appCategory).toBe('developer_tools');
  });

  test('accepts optional mode and onModeChange', () => {
    const props: ThemeComposerProps = {
      value: zoraDefaultTheme,
      onChange: () => undefined,
      mode: 'dark',
      onModeChange: (_mode) => undefined,
    };
    expect(props.mode).toBe('dark');
  });

  test('accepts optional onSubmit', () => {
    let submitted = false;
    const props: ThemeComposerProps = {
      value: zoraDefaultTheme,
      onChange: () => undefined,
      onSubmit: () => {
        submitted = true;
      },
    };
    props.onSubmit?.(zoraDefaultTheme);
    expect(submitted).toBe(true);
  });
});

describe('ZORA_COLOR_HARMONIES coverage for ThemeComposer', () => {
  test('all harmony values are present for the Select options', () => {
    const expected = [
      'monochromatic',
      'analogous',
      'complementary',
      'splitComplementary',
      'triadic',
      'tetradic',
    ] as const;
    expect(ZORA_COLOR_HARMONIES).toEqual(expected);
  });
});

describe('onChange propagation contract', () => {
  test('onChange receives updated theme with new harmony', () => {
    const received: (typeof zoraDefaultTheme)[] = [];
    const props: ThemeComposerProps = {
      value: zoraDefaultTheme,
      onChange: (t) => received.push(t),
    };
    // Simulate what the component does internally
    props.onChange({ ...zoraDefaultTheme, harmony: 'triadic' });
    expect(received).toHaveLength(1);
    expect(received[0]?.harmony).toBe('triadic');
  });
});

describe('ThemeComposer recommendation helpers', () => {
  const recommendations: readonly ThemeComposerHarmonyRecommendation[] = [
    {
      suggestedHarmony: 'analogous',
      suggestedPrimaryHueDegrees: 195,
    },
    {
      suggestedHarmony: 'splitComplementary',
    },
  ];

  test('applies harmony recommendation with hue', () => {
    const [recommendation] = recommendations;
    if (recommendation === undefined) {
      throw new Error('Expected fixture recommendation.');
    }

    const updated = applyHarmonyRecommendation(zoraDefaultTheme, recommendation);

    expect(updated.harmony).toBe('analogous');
    expect(updated.primaryColor).not.toBe(zoraDefaultTheme.primaryColor);
  });

  test('keeps the current primary color when recommendation has no hue', () => {
    const [, recommendation] = recommendations;
    if (recommendation === undefined) {
      throw new Error('Expected fixture recommendation.');
    }

    const updated = applyHarmonyRecommendation(zoraDefaultTheme, recommendation);

    expect(updated.primaryColor).toBe(zoraDefaultTheme.primaryColor);
    expect(updated.harmony).toBe('splitComplementary');
  });

  test('formats serialized labels for display', () => {
    expect(formatThemeComposerLabel('finance_money')).toBe('Finance money');
    expect(formatThemeComposerLabel('splitComplementary')).toBe('Split Complementary');
  });

  test('converts hue degrees to lowercase hex', () => {
    expect(hueDegreesToHexColor(195)).toMatch(/^#[0-9a-f]{6}$/);
    expect(hueDegreesToHexColor(555)).toBe(hueDegreesToHexColor(195));
  });
});
