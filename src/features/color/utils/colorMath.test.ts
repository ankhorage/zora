import { isHexColor, parseHexColorOrThrow } from '@ankhorage/color-theory';
import { expect, test } from 'bun:test';

import { resolveColorAtHue } from './resolveColorAtHue';
import { resolveColorHue } from './resolveColorHue';
import { resolveOklchColor } from './resolveOklchColor';
import { resolveWheelColor } from './resolveWheelColor';
import { resolveWheelColorComponents } from './resolveWheelColorComponents';

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

test('maps wheel radius to chroma while preserving a selected color lightness', () => {
  const base = parseHexColorOrThrow('#2563eb');
  const centerColor = resolveWheelColor(base, 120, 120, 120, 104, 0.2);
  const edgeColor = resolveWheelColor(base, 120, 16, 120, 104, 0.2);
  const baseValues = resolveWheelColorComponents(base);
  const centerValues = resolveWheelColorComponents(centerColor);
  const edgeValues = resolveWheelColorComponents(edgeColor);

  expect(centerValues.chroma).toBeLessThan(0.01);
  expect(edgeValues.chroma).toBeGreaterThan(centerValues.chroma);
  expect(Math.abs(edgeValues.lightness - baseValues.lightness)).toBeLessThan(0.02);
  const edgeHue = resolveColorHue(edgeColor);
  expect(Math.min(edgeHue, 360 - edgeHue)).toBeLessThan(5);
});
