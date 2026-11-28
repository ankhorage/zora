import { expect, test } from 'bun:test';

import { resolveColorPickerGeometry } from './resolveColorPickerGeometry';

test('keeps the reference Grid and Wheel stage geometry at the approved width', () => {
  const geometry = resolveColorPickerGeometry({
    height: 700,
    hostHeight: 700,
    hostWidth: 560,
    showTabs: true,
    width: 560,
  });

  expect(geometry.insufficientSpace).toBe(false);
  expect(geometry.stage).toBe(340);
  expect(geometry.width).toBe(560);
});

test('uses the largest coherent geometry that fits a height-constrained host', () => {
  const geometry = resolveColorPickerGeometry({
    hostHeight: 500,
    hostWidth: 560,
    showTabs: true,
  });

  expect(geometry.insufficientSpace).toBe(false);
  expect(geometry.height).toBeLessThanOrEqual(500);
  expect(geometry.stage).toBeGreaterThanOrEqual(218);
  expect(geometry.stage).toBeLessThan(340);
});

test('reports insufficient host height instead of hiding a shrunken unusable picker', () => {
  const geometry = resolveColorPickerGeometry({
    hostHeight: 360,
    hostWidth: 560,
    showTabs: true,
  });

  expect(geometry.insufficientSpace).toBe(true);
  expect(geometry.stage).toBeGreaterThanOrEqual(218);
  expect(geometry.minimumHeight).toBeGreaterThan(360);
});
