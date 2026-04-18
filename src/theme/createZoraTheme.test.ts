import { describe, expect, test } from 'bun:test';

import { createZoraTheme } from './createZoraTheme';

describe('createZoraTheme', () => {
  test('keeps the default preset stable', () => {
    const theme = createZoraTheme();

    expect(theme.id).toBe('zora');
    expect(theme.light.primaryColor).toBe('#0f766e');
    expect(theme.dark.primaryColor).toBe('#2dd4bf');
  });

  test('merges overrides without dropping the preset identity', () => {
    const theme = createZoraTheme({
      light: {
        primaryColor: '#1d4ed8',
      },
    });

    expect(theme.id).toBe('zora');
    expect(theme.light.primaryColor).toBe('#1d4ed8');
    expect(theme.dark.primaryColor).toBe('#2dd4bf');
  });
});
