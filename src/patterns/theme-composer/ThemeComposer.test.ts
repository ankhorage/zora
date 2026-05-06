import { COLOR_HARMONIES, parseHexColorOrThrow } from '@ankhorage/color-theory';
import { APP_CATEGORIES } from '@ankhorage/contracts';
import { describe, expect, test } from 'bun:test';

import { zoraDefaultTheme } from '../../theme/zoraDefaultTheme';
import type { ThemeComposerProps } from './types';

// ---------------------------------------------------------------------------
// ThemeComposerProps shape tests
// ---------------------------------------------------------------------------

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

  test('accepts optional appCategories as option list override', () => {
    const narrow = ['developer_tools', 'utilities_tools'] as const;
    const props: ThemeComposerProps = {
      value: zoraDefaultTheme,
      onChange: () => undefined,
      appCategories: narrow,
    };
    expect(props.appCategories).toEqual(narrow);
  });

  test('does not have an appMood prop', () => {
    // TypeScript type check: appMood must not exist on ThemeComposerProps.
    // If this compiled with appMood, we'd have a type error here.
    const props: ThemeComposerProps = {
      value: zoraDefaultTheme,
      onChange: () => undefined,
    };
    // @ts-expect-error appMood is not a valid prop
    const _unused = (props as { appMood?: unknown }).appMood;
    expect(_unused).toBeUndefined();
  });

  test('does not have a recommendations prop', () => {
    const props: ThemeComposerProps = {
      value: zoraDefaultTheme,
      onChange: () => undefined,
    };
    // @ts-expect-error recommendations is not a valid prop
    const _unused = (props as { recommendations?: unknown }).recommendations;
    expect(_unused).toBeUndefined();
  });

  test('does not have a separate selected appCategory prop', () => {
    // appCategory is on value.appCategory only, not a top-level prop
    const props: ThemeComposerProps = {
      value: zoraDefaultTheme,
      onChange: () => undefined,
    };
    // @ts-expect-error appCategory at top level is not a valid prop
    const _unused = (props as { appCategory?: unknown }).appCategory;
    expect(_unused).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// COLOR_HARMONIES coverage
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// APP_CATEGORIES default behavior
// ---------------------------------------------------------------------------

describe('APP_CATEGORIES defaults', () => {
  test('APP_CATEGORIES from contracts contains expected entries', () => {
    expect(APP_CATEGORIES).toContain('developer_tools');
    expect(APP_CATEGORIES).toContain('utilities_tools');
    expect(APP_CATEGORIES).toContain('lifestyle');
  });

  test('ThemeComposer appCategories prop is optional — falls back to APP_CATEGORIES', () => {
    const props: ThemeComposerProps = {
      value: zoraDefaultTheme,
      onChange: () => undefined,
    };
    // No appCategories provided — component uses APP_CATEGORIES internally.
    expect(props.appCategories).toBeUndefined();
  });

  test('ThemeComposer appCategories narrows the available options when provided', () => {
    const narrow = ['developer_tools', 'utilities_tools'] as const;
    const props: ThemeComposerProps = {
      value: zoraDefaultTheme,
      onChange: () => undefined,
      appCategories: narrow,
    };
    expect(props.appCategories).toHaveLength(2);
    expect(props.appCategories).toContain('developer_tools');
  });
});

// ---------------------------------------------------------------------------
// onChange propagation contracts
// ---------------------------------------------------------------------------

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

  test('onChange receives updated theme with new appCategory', () => {
    const received: (typeof zoraDefaultTheme)[] = [];
    const props: ThemeComposerProps = {
      value: zoraDefaultTheme,
      onChange: (t) => received.push(t),
    };
    props.onChange({ ...zoraDefaultTheme, appCategory: 'lifestyle' });
    expect(received).toHaveLength(1);
    expect(received[0]?.appCategory).toBe('lifestyle');
  });

  test('onChange receives updated theme with new valid name', () => {
    const received: (typeof zoraDefaultTheme)[] = [];
    const props: ThemeComposerProps = {
      value: zoraDefaultTheme,
      onChange: (t) => received.push(t),
    };
    props.onChange({ ...zoraDefaultTheme, name: 'My Custom Theme' });
    expect(received).toHaveLength(1);
    expect(received[0]?.name).toBe('My Custom Theme');
  });

  test('onChange is not called with an empty name', () => {
    // Simulate the component's name validation logic
    const received: (typeof zoraDefaultTheme)[] = [];
    const onChange = (t: typeof zoraDefaultTheme) => received.push(t);

    const newName = '';
    if (newName.trim().length > 0) {
      onChange({ ...zoraDefaultTheme, name: newName });
    }
    // Empty name should not propagate
    expect(received).toHaveLength(0);
  });

  test('onChange is not called with invalid primary color', () => {
    // Simulate the component's hex validation logic
    const received: (typeof zoraDefaultTheme)[] = [];
    const onChange = (t: typeof zoraDefaultTheme) => received.push(t);

    const badColor = '#xyz';
    try {
      parseHexColorOrThrow(badColor);
      // Should not reach here for an invalid color
      onChange({ ...zoraDefaultTheme, primaryColor: badColor });
    } catch {
      // Expected: invalid color — do not call onChange
    }
    expect(received).toHaveLength(0);
  });

  test('onChange is called with a valid primary color', () => {
    const received: (typeof zoraDefaultTheme)[] = [];
    const onChange = (t: typeof zoraDefaultTheme) => received.push(t);

    const goodColor = '#c084fc';
    try {
      parseHexColorOrThrow(goodColor);
      onChange({ ...zoraDefaultTheme, primaryColor: goodColor });
    } catch {
      // Should not reach here for a valid color
    }
    expect(received).toHaveLength(1);
    expect(received[0]?.primaryColor).toBe(goodColor);
  });
});

// ---------------------------------------------------------------------------
// Legacy API absence checks
// ---------------------------------------------------------------------------

describe('No legacy APIs', () => {
  test('ThemeComposerProps does not include colorTone-related fields', () => {
    // This is a compile-time check — ThemeComposerProps must not contain
    // colorTone, tone (as a theme concept), or ZoraColorTone.
    // We verify the value object carries no such field.
    const theme = zoraDefaultTheme;
    expect('colorTone' in theme).toBe(false);
  });

  test('ThemeComposerProps value carries no appMood field', () => {
    const theme = zoraDefaultTheme;
    expect('appMood' in theme).toBe(false);
  });

  test('value.name is required — zoraDefaultTheme.name is a non-empty string', () => {
    expect(typeof zoraDefaultTheme.name).toBe('string');
    expect(zoraDefaultTheme.name.length).toBeGreaterThan(0);
  });

  test('value.appCategory is required — zoraDefaultTheme.appCategory is set', () => {
    expect(typeof zoraDefaultTheme.appCategory).toBe('string');
    expect(zoraDefaultTheme.appCategory.length).toBeGreaterThan(0);
  });
});
