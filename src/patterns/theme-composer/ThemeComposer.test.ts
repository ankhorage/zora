import { describe, expect, test } from 'bun:test';

import { ZORA_COLOR_HARMONIES, ZORA_COLOR_TONES } from '../../theme/types';
import { zoraDefaultTheme } from '../../theme/zoraDefaultTheme';
import type { ThemeComposerProps } from './types';

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
    const received: unknown[] = [];
    const props: ThemeComposerProps = {
      value: zoraDefaultTheme,
      onChange: (t) => received.push(t),
    };
    // Simulate what the component does internally
    props.onChange({ ...zoraDefaultTheme, harmony: 'triadic' });
    expect(received).toHaveLength(1);
    expect((received[0] as typeof zoraDefaultTheme).harmony).toBe('triadic');
  });

  test('onChange receives updated theme with new colorTone', () => {
    const received: unknown[] = [];
    const props: ThemeComposerProps = {
      value: zoraDefaultTheme,
      onChange: (t) => received.push(t),
    };
    props.onChange({ ...zoraDefaultTheme, colorTone: 'obsidian' });
    expect((received[0] as typeof zoraDefaultTheme).colorTone).toBe('obsidian');
  });
});
