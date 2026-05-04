import type { AnkhTheme, FontWeight, RoleSemantics } from '@ankhorage/surface';
import { describe, expect, test } from 'bun:test';

import { resolveHeadingRecipe, resolveHeadingSizeFromLevel } from './resolveHeadingRecipe';

const emptyFonts: Record<FontWeight, string | undefined> = {
  '100': undefined,
  '200': undefined,
  '300': undefined,
  '400': undefined,
  '500': undefined,
  '600': undefined,
  '700': undefined,
  '800': undefined,
  '900': undefined,
  bold: undefined,
  normal: undefined,
};

function createRole(base: string): RoleSemantics {
  return {
    base,
    hover: `${base}-hover`,
    strong: `${base}-strong`,
    softBg: `${base}-soft-bg`,
    softHover: `${base}-soft-hover`,
    softActive: `${base}-soft-active`,
    outline: `${base}-outline`,
    onSolidText: `${base}-on-solid-text`,
  };
}

function createTestTheme(): AnkhTheme {
  return {
    colors: {
      primary: '#0f766e',
      secondary: '#2563eb',
      accent: '#7c3aed',
      highlight: '#f59e0b',
      background: '#ffffff',
      surface: '#ffffff',
      text: '#111827',
      textSecondary: '#4b5563',
      border: '#d1d5db',
      error: '#dc2626',
      success: '#16a34a',
      warning: '#d97706',
    },
    config: {
      id: 'zora-test',
      name: 'ZORA Test',
      light: {
        primaryColor: '#0f766e',
        harmony: 'analogous',
        colorTone: 'jewel',
      },
      dark: {
        primaryColor: '#2dd4bf',
        harmony: 'analogous',
        colorTone: 'jewel',
      },
    },
    radii: {
      none: 0,
      s: 4,
      m: 8,
      l: 16,
      full: 9999,
    },
    scales: {},
    semantics: {
      neutral: {
        bg: '#ffffff',
        bgSubtle: '#f9fafb',
        surface: '#ffffff',
        surfaceHover: '#f3f4f6',
        surfaceActive: '#e5e7eb',
        border: '#d1d5db',
        borderStrong: '#9ca3af',
        divider: '#e5e7eb',
        text: '#111827',
        textMuted: '#4b5563',
        textSubtle: '#6b7280',
      },
      brand: createRole('#0f766e'),
      secondary: createRole('#2563eb'),
      accent: createRole('#7c3aed'),
      highlight: createRole('#f59e0b'),
      danger: createRole('#dc2626'),
      success: createRole('#16a34a'),
      warning: createRole('#d97706'),
      surface: {
        default: '#ffffff',
        subtle: '#f9fafb',
        raised: '#ffffff',
      },
      content: {
        default: '#111827',
        muted: '#4b5563',
        subtle: '#6b7280',
        inverse: '#ffffff',
      },
      border: {
        default: '#d1d5db',
        strong: '#9ca3af',
        focus: '#0f766e',
      },
      action: {
        primary: createRole('#0f766e'),
        neutral: createRole('#4b5563'),
        danger: createRole('#dc2626'),
      },
    },
    shadows: {
      soft: 2,
      medium: 4,
      hard: 8,
    },
    spacing: {
      none: 0,
      xs: 4,
      s: 8,
      m: 16,
      l: 24,
      xl: 32,
      xxl: 48,
    },
    typography: {
      headings: {
        1: { size: 32, lineHeight: 40, weight: 'bold' },
        2: { size: 24, lineHeight: 32, weight: 'bold' },
        3: { size: 20, lineHeight: 28, weight: 'bold' },
        4: { size: 18, lineHeight: 24, weight: 'semiBold' },
        5: { size: 16, lineHeight: 22, weight: 'semiBold' },
        6: { size: 14, lineHeight: 20, weight: 'semiBold' },
      },
      sizes: {
        xs: 12,
        s: 14,
        m: 16,
        l: 18,
        xl: 20,
        xxl: 24,
        '3xl': 30,
        h1: 32,
        h2: 24,
        h3: 20,
        h4: 18,
        h5: 16,
        h6: 14,
      },
      weights: {
        thin: '100',
        extraLight: '200',
        light: '300',
        regular: '400',
        medium: '500',
        semiBold: '600',
        bold: '700',
        extraBold: '800',
        black: '900',
      },
      fonts: {
        normal: { ...emptyFonts },
        italic: { ...emptyFonts },
      },
    },
  };
}

const theme = createTestTheme();

describe('resolveHeadingRecipe', () => {
  test('maps level 1 default size to h1 typography', () => {
    const style = resolveHeadingRecipe(theme, { level: 1 });

    expect(style.fontSize).toBe(theme.typography.headings[1].size);
    expect(style.lineHeight).toBe(theme.typography.headings[1].lineHeight);
    expect(style.fontWeight).toBe(theme.typography.weights.bold);
    expect(style.color).toBe(theme.semantics.content.default);
    expect(style.elevation).toBe(0);
  });

  test('maps level 3 default size to h3 typography', () => {
    const style = resolveHeadingRecipe(theme, { level: 3 });

    expect(style.fontSize).toBe(theme.typography.headings[3].size);
    expect(style.lineHeight).toBe(theme.typography.headings[3].lineHeight);
    expect(style.fontWeight).toBe(theme.typography.weights.bold);
  });

  test('allows size to override level-derived visual size', () => {
    const style = resolveHeadingRecipe(theme, { level: 1, size: 'h4' });

    expect(style.fontSize).toBe(theme.typography.headings[4].size);
    expect(style.lineHeight).toBe(theme.typography.headings[4].lineHeight);
    expect(style.fontWeight).toBe(theme.typography.weights.semiBold);
  });

  test('resolves display size from existing theme typography tokens', () => {
    const style = resolveHeadingRecipe(theme, { level: 1, size: 'display' });

    expect(style.fontSize).toBe(theme.typography.sizes['3xl']);
    expect(style.lineHeight).toBe(theme.typography.sizes['3xl'] + 8);
    expect(style.fontWeight).toBe(theme.typography.weights.bold);
  });

  test('maps semantic tones to theme colors', () => {
    expect(resolveHeadingRecipe(theme, { level: 2, tone: 'primary' }).color).toBe(
      theme.semantics.brand.base,
    );
    expect(resolveHeadingRecipe(theme, { level: 2, tone: 'muted' }).color).toBe(
      theme.semantics.content.muted,
    );
    expect(resolveHeadingRecipe(theme, { level: 2, tone: 'subtle' }).color).toBe(
      theme.semantics.content.subtle,
    );
    expect(resolveHeadingRecipe(theme, { level: 2, tone: 'inverse' }).color).toBe(
      theme.semantics.content.inverse,
    );
    expect(resolveHeadingRecipe(theme, { level: 2, tone: 'danger' }).color).toBe(
      theme.semantics.danger.base,
    );
    expect(resolveHeadingRecipe(theme, { level: 2, tone: 'success' }).color).toBe(
      theme.semantics.success.base,
    );
    expect(resolveHeadingRecipe(theme, { level: 2, tone: 'warning' }).color).toBe(
      theme.semantics.warning.base,
    );
  });

  test('applies alignment', () => {
    const style = resolveHeadingRecipe(theme, { level: 2, align: 'center' });

    expect(style.textAlign).toBe('center');
  });

  test('allows explicit weight to override the recipe weight', () => {
    const style = resolveHeadingRecipe(theme, { level: 4, weight: 'medium' });

    expect(style.fontWeight).toBe(theme.typography.weights.medium);
  });

  test('uses italic font family when available', () => {
    const fontTheme = createTestTheme();
    fontTheme.typography.fonts.italic[fontTheme.typography.weights.semiBold] = 'ZoraSemiBoldItalic';

    const style = resolveHeadingRecipe(fontTheme, { level: 4, italic: true });

    expect(style.fontStyle).toBe('italic');
    expect(style.fontFamily).toBe('ZoraSemiBoldItalic');
  });
});

describe('resolveHeadingSizeFromLevel', () => {
  test('maps semantic levels to default visual sizes', () => {
    expect(resolveHeadingSizeFromLevel(1)).toBe('h1');
    expect(resolveHeadingSizeFromLevel(2)).toBe('h2');
    expect(resolveHeadingSizeFromLevel(3)).toBe('h3');
    expect(resolveHeadingSizeFromLevel(4)).toBe('h4');
    expect(resolveHeadingSizeFromLevel(5)).toBe('h5');
    expect(resolveHeadingSizeFromLevel(6)).toBe('h6');
  });
});
