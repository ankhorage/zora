import { describe, expect, test } from 'bun:test';

import { ZORA_COLOR_HARMONIES, ZORA_COLOR_TONES } from '../../theme/types';
import { zoraDefaultTheme } from '../../theme/zoraDefaultTheme';
import {
  createThemeFromThemeComposerRecommendation,
  findThemeComposerRecommendation,
  formatThemeComposerLabel,
  hueDegreesToZoraHexColor,
} from './recommendations';
import type { ThemeComposerProps, ThemeComposerRecommendation } from './types';

// Validate the exported types compile correctly by asserting shape
describe('ThemeComposerProps', () => {
  test('accepts a valid ZoraTheme as value', () => {
    const props: ThemeComposerProps = {
      value: zoraDefaultTheme,
      onChange: () => undefined,
    };
    expect(props.value.primaryColor).toBe('#0f766e');
    expect(props.value.harmony).toBe('analogous');
    expect(props.value.colorTone).toBe('jewel');
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

  test('accepts optional recommendation inputs', () => {
    const recommendation: ThemeComposerRecommendation = {
      appCategory: 'finance_money',
      appMood: 'trustworthy',
      suggestedColorTone: 'mineral',
      suggestedHarmony: 'analogous',
      suggestedPrimaryHueDegrees: 195,
    };
    const props: ThemeComposerProps = {
      value: zoraDefaultTheme,
      onChange: () => undefined,
      appCategory: 'finance_money',
      appMood: 'trustworthy',
      recommendations: [recommendation],
    };

    expect(props.recommendations?.[0]?.suggestedColorTone).toBe('mineral');
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

describe('ZORA_COLOR_TONES coverage for ThemeComposer', () => {
  test('all color tones are present for the Select options', () => {
    const expected = [
      'neutral',
      'pastel',
      'earth',
      'mineral',
      'muted',
      'jewel',
      'fluorescent',
      'obsidian',
      'vaporwave',
      'monochromeAccent',
    ] as const;
    expect(ZORA_COLOR_TONES).toEqual(expected);
  });
});

describe('onChange propagation contract', () => {
  test('onChange receives updated theme with new harmony', () => {
    const received: typeof zoraDefaultTheme[] = [];
    const props: ThemeComposerProps = {
      value: zoraDefaultTheme,
      onChange: (t) => received.push(t),
    };
    // Simulate what the component does internally
    props.onChange({ ...zoraDefaultTheme, harmony: 'triadic' });
    expect(received).toHaveLength(1);
    expect(received[0]?.harmony).toBe('triadic');
  });

  test('onChange receives updated theme with new colorTone', () => {
    const received: typeof zoraDefaultTheme[] = [];
    const props: ThemeComposerProps = {
      value: zoraDefaultTheme,
      onChange: (t) => received.push(t),
    };
    props.onChange({ ...zoraDefaultTheme, colorTone: 'obsidian' });
    expect(received[0]?.colorTone).toBe('obsidian');
  });
});

describe('ThemeComposer recommendation helpers', () => {
  const recommendations: readonly ThemeComposerRecommendation[] = [
    {
      appCategory: 'finance_money',
      appMood: 'trustworthy',
      suggestedColorTone: 'mineral',
      suggestedHarmony: 'analogous',
      suggestedPrimaryHueDegrees: 195,
    },
    {
      appCategory: 'graphics_design',
      appMood: 'creative',
      suggestedColorTone: 'vaporwave',
      suggestedHarmony: 'splitComplementary',
    },
  ];

  test('finds a recommendation by app category and mood', () => {
    const found = findThemeComposerRecommendation({
      appCategory: 'finance_money',
      appMood: 'trustworthy',
      recommendations,
    });

    expect(found?.suggestedColorTone).toBe('mineral');
  });

  test('does not find a recommendation with mismatched mood', () => {
    const found = findThemeComposerRecommendation({
      appCategory: 'finance_money',
      appMood: 'creative',
      recommendations,
    });

    expect(found).toBeUndefined();
  });

  test('creates an updated theme only when recommendation is explicitly applied', () => {
    const recommendation = recommendations[0];
    if (recommendation === undefined) {
      throw new Error('Expected fixture recommendation.');
    }

    const updated = createThemeFromThemeComposerRecommendation({
      value: zoraDefaultTheme,
      recommendation,
    });

    expect(zoraDefaultTheme.colorTone).toBe('jewel');
    expect(updated.colorTone).toBe('mineral');
    expect(updated.harmony).toBe('analogous');
    expect(updated.primaryColor).not.toBe(zoraDefaultTheme.primaryColor);
  });

  test('keeps the current primary color when recommendation has no hue', () => {
    const recommendation = recommendations[1];
    if (recommendation === undefined) {
      throw new Error('Expected fixture recommendation.');
    }

    const updated = createThemeFromThemeComposerRecommendation({
      value: zoraDefaultTheme,
      recommendation,
    });

    expect(updated.primaryColor).toBe(zoraDefaultTheme.primaryColor);
    expect(updated.colorTone).toBe('vaporwave');
  });

  test('formats serialized labels for display', () => {
    expect(formatThemeComposerLabel('finance_money')).toBe('Finance money');
    expect(formatThemeComposerLabel('splitComplementary')).toBe('Split Complementary');
  });

  test('converts hue degrees to lowercase hex', () => {
    expect(hueDegreesToZoraHexColor(195)).toMatch(/^#[0-9a-f]{6}$/);
    expect(hueDegreesToZoraHexColor(555)).toBe(hueDegreesToZoraHexColor(195));
  });
});
