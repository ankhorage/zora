import { describe, expect, test } from 'bun:test';

import { normalizeHueDegrees, rotateHueDegrees } from './hue';

describe('normalizeHueDegrees', () => {
  test('normalizes negative hues into [0, 360)', () => {
    expect(normalizeHueDegrees(-30)).toBe(330);
    expect(normalizeHueDegrees(-390)).toBe(330);
  });

  test('normalizes hues >= 360 into [0, 360)', () => {
    expect(normalizeHueDegrees(390)).toBe(30);
    expect(normalizeHueDegrees(720)).toBe(0);
  });

  test('preserves in-range hues', () => {
    expect(normalizeHueDegrees(0)).toBe(0);
    expect(normalizeHueDegrees(12.5)).toBe(12.5);
    expect(normalizeHueDegrees(359.99)).toBe(359.99);
  });
});

describe('rotateHueDegrees', () => {
  test('rotates and normalizes', () => {
    expect(rotateHueDegrees(350, 30)).toBe(20);
    expect(rotateHueDegrees(10, -30)).toBe(340);
  });
});
