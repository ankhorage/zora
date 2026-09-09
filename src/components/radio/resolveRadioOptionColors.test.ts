import { createTheme } from '@ankhorage/surface/theme';
import { expect, test } from 'bun:test';

import { resolveRadioOptionColors } from './resolveRadioOptionColors';

const source = {
  id: 'radio',
  name: 'Radio',
  light: { primaryColor: '#0060FF', harmony: 'monochromatic' as const },
  dark: { primaryColor: '#0060FF', harmony: 'monochromatic' as const },
};

for (const mode of ['light', 'dark'] as const) {
  test(`radio selection preserves role contrast and field states in ${mode} mode`, () => {
    const theme = createTheme(source, mode);
    const selected = resolveRadioOptionColors(theme, { color: 'secondary' });
    expect(selected.accent).toBe(theme.semantics.secondary.base);
    expect(selected.onAccent).toBe(theme.semantics.secondary.onSolidText);
    const invalid = resolveRadioOptionColors(theme, { color: 'secondary', invalid: true });
    expect(invalid.accent).toBe(theme.semantics.error.base);
    const disabled = resolveRadioOptionColors(theme, {
      color: 'secondary',
      invalid: true,
      disabled: true,
    });
    expect(disabled.accent).toBe(theme.semantics.content.disabled);
    expect(disabled.surface).toBe(theme.semantics.surface.disabled);
  });
}
