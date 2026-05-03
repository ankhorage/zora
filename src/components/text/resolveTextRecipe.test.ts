import type {
  AnkhTheme,
  Breakpoint,
  FontWeight,
  Responsive,
  RoleSemantics,
} from '@ankhorage/surface';
import { describe, expect, mock, test } from 'bun:test';

const breakpointOrder: readonly Breakpoint[] = ['base', 'sm', 'md', 'lg', 'xl'];

function isResponsiveRecord<T>(value: Responsive<T>): value is Partial<Record<Breakpoint, T>> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function resolveResponsiveMock<T>(
  value: Responsive<T> | undefined,
  breakpoint: Breakpoint,
): T | undefined {
  if (value === undefined) return undefined;
  if (!isResponsiveRecord(value)) return value;

  const activeIndex = breakpointOrder.indexOf(breakpoint);
  for (let i = activeIndex; i >= 0; i -= 1) {
    const key = breakpointOrder[i];
    if (!key) continue;
    const candidate = value[key];
    if (candidate !== undefined) return candidate;
  }

  return undefined;
}

await mock.module('@ankhorage/surface', () => ({
  resolveResponsive: resolveResponsiveMock,
}));

const { resolveTextStyle } = await import('./resolveTextRecipe');

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
        systemTone: 'jewel',
      },
      dark: {
        primaryColor: '#2dd4bf',
        harmony: 'analogous',
        systemTone: 'jewel',
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

describe('resolveTextStyle', () => {
  test('resolves default body text from theme typography and content color', () => {
    const style = resolveTextStyle({ theme, breakpoint: 'base' });

    expect(style.fontSize).toBe(theme.typography.sizes.m);
    expect(style.lineHeight).toBe(24);
    expect(style.fontWeight).toBe(theme.typography.weights.regular);
    expect(style.color).toBe(theme.semantics.content.default);
    expect(style.elevation).toBe(0);
  });

  test('maps bodySmall, caption, and label recipes', () => {
    expect(resolveTextStyle({ theme, breakpoint: 'base', variant: 'bodySmall' })).toMatchObject({
      fontSize: theme.typography.sizes.s,
      lineHeight: 20,
      fontWeight: theme.typography.weights.regular,
    });

    expect(resolveTextStyle({ theme, breakpoint: 'base', variant: 'caption' })).toMatchObject({
      fontSize: theme.typography.sizes.xs,
      lineHeight: 16,
      fontWeight: theme.typography.weights.regular,
    });

    expect(resolveTextStyle({ theme, breakpoint: 'base', variant: 'label' })).toMatchObject({
      fontSize: theme.typography.sizes.s,
      lineHeight: 18,
      fontWeight: theme.typography.weights.medium,
    });
  });

  test('resolves lead smaller on base and larger on md', () => {
    expect(resolveTextStyle({ theme, breakpoint: 'base', variant: 'lead' })).toMatchObject({
      fontSize: theme.typography.sizes.m,
      lineHeight: 24,
    });

    expect(resolveTextStyle({ theme, breakpoint: 'md', variant: 'lead' })).toMatchObject({
      fontSize: theme.typography.sizes.l,
      lineHeight: 28,
    });
  });

  test('resolves eyebrow uppercase, letter spacing, and semibold weight', () => {
    const style = resolveTextStyle({ theme, breakpoint: 'base', variant: 'eyebrow' });

    expect(style.textTransform).toBe('uppercase');
    expect(style.letterSpacing).toBe(0.8);
    expect(style.fontWeight).toBe(theme.typography.weights.semiBold);
  });

  test('resolves code as monospace text', () => {
    expect(resolveTextStyle({ theme, breakpoint: 'base', variant: 'code' }).fontFamily).toBe(
      'monospace',
    );
  });

  test('maps tones to semantic colors', () => {
    expect(resolveTextStyle({ theme, breakpoint: 'base', tone: 'default' }).color).toBe(
      theme.semantics.content.default,
    );
    expect(resolveTextStyle({ theme, breakpoint: 'base', tone: 'muted' }).color).toBe(
      theme.semantics.content.muted,
    );
    expect(resolveTextStyle({ theme, breakpoint: 'base', tone: 'subtle' }).color).toBe(
      theme.semantics.content.subtle,
    );
    expect(resolveTextStyle({ theme, breakpoint: 'base', tone: 'inverse' }).color).toBe(
      theme.semantics.content.inverse,
    );
    expect(resolveTextStyle({ theme, breakpoint: 'base', tone: 'primary' }).color).toBe(
      theme.semantics.brand.base,
    );
    expect(resolveTextStyle({ theme, breakpoint: 'base', tone: 'danger' }).color).toBe(
      theme.semantics.danger.base,
    );
    expect(resolveTextStyle({ theme, breakpoint: 'base', tone: 'success' }).color).toBe(
      theme.semantics.success.base,
    );
    expect(resolveTextStyle({ theme, breakpoint: 'base', tone: 'warning' }).color).toBe(
      theme.semantics.warning.base,
    );
  });

  test('allows explicit weight to override the recipe weight', () => {
    const style = resolveTextStyle({
      theme,
      breakpoint: 'base',
      variant: 'caption',
      weight: 'bold',
    });

    expect(style.fontWeight).toBe(theme.typography.weights.bold);
  });

  test('uses italic font family when available', () => {
    const fontTheme = createTestTheme();
    fontTheme.typography.fonts.italic[fontTheme.typography.weights.medium] = 'ZoraMediumItalic';

    const style = resolveTextStyle({
      theme: fontTheme,
      breakpoint: 'base',
      italic: true,
      weight: 'medium',
    });

    expect(style.fontStyle).toBe('italic');
    expect(style.fontFamily).toBe('ZoraMediumItalic');
  });

  test('resolves responsive variant, tone, align, and weight values', () => {
    const style = resolveTextStyle({
      theme,
      breakpoint: 'md',
      variant: { base: 'bodySmall', md: 'lead' },
      tone: { base: 'muted', md: 'primary' },
      align: { base: 'center', md: 'left' },
      weight: { base: 'regular', md: 'semiBold' },
    });

    expect(style.fontSize).toBe(theme.typography.sizes.l);
    expect(style.lineHeight).toBe(28);
    expect(style.color).toBe(theme.semantics.brand.base);
    expect(style.textAlign).toBe('left');
    expect(style.fontWeight).toBe(theme.typography.weights.semiBold);
  });
});
