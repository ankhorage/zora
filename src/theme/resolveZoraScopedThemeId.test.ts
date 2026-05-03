import { describe, expect, it } from 'bun:test';

import { resolveZoraScopedThemeId } from './resolveZoraScopedThemeId';

describe('resolveZoraScopedThemeId', () => {
  it('inherits the theme id when omitted', () => {
    expect(resolveZoraScopedThemeId({ desiredThemeId: undefined, inheritedThemeId: 'zora' })).toBe(
      'zora',
    );
  });

  it('accepts the inherited theme id when explicitly provided', () => {
    expect(resolveZoraScopedThemeId({ desiredThemeId: 'zora', inheritedThemeId: 'zora' })).toBe(
      'zora',
    );
  });

  it('throws in non-production for unknown theme ids', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'test';

    expect(() =>
      resolveZoraScopedThemeId({ desiredThemeId: 'studio', inheritedThemeId: 'zora' }),
    ).toThrow(/Unknown ZORA theme id 'studio'/);

    process.env.NODE_ENV = originalEnv;
  });

  it('warns and falls back in production for unknown theme ids', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const originalWarn = console.warn;
    const warnings: string[] = [];
    console.warn = (message: string) => {
      warnings.push(message);
    };

    expect(resolveZoraScopedThemeId({ desiredThemeId: 'studio', inheritedThemeId: 'zora' })).toBe(
      'zora',
    );
    expect(warnings.join('\n')).toMatch(/Unknown ZORA theme id 'studio'/);

    console.warn = originalWarn;
    process.env.NODE_ENV = originalEnv;
  });
});
