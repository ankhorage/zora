import { COLOR_HARMONIES } from '@ankhorage/color-theory';
import { describe, expect, test } from 'bun:test';

import { zoraDefaultTheme } from '../../theme/zoraDefaultTheme';
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
    expect(props.value.name).toBe('ZORA');
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

describe('COLOR_HARMONIES coverage for ThemeComposer', () => {
  test('all canonical harmony values are present for the Select options', () => {
    const expected = [
      'monochromatic',
      'analogous',
      'complementary',
      'triadic',
      'tetradic',
      'splitComplementary',
    ] as const;
    expect(COLOR_HARMONIES).toEqual(expected);
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
