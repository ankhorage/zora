import { expect, test } from 'bun:test';
import { isHexColor, parseHexColorOrThrow } from '@ankhorage/color-theory';

import { resolveColorAtHue } from './resolveColorAtHue';
import { resolveColorHue } from './resolveColorHue';
import { resolveOklchColor } from './resolveOklchColor';

test('converts a consumer-provided OKLCH target without a ZORA tone catalog', () => {
  const color = resolveOklchColor({ lightness: 0.53, chroma: 0.18 }, 280);

  expect(isHexColor(color)).toBe(true);
});

test('preserves an editable hue through the published color-theory conversion boundary', () => {
  const base = parseHexColorOrThrow('#2563eb');
  const adjusted = resolveColorAtHue(base, 120);

  expect(isHexColor(adjusted)).toBe(true);
  expect(Math.abs(resolveColorHue(adjusted) - 120)).toBeLessThan(5);
});
