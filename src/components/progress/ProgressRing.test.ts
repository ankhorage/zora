import { describe, expect, test } from 'bun:test';

import { progressRingMeta } from './meta';

describe('ProgressRing public contract', () => {
  test('is exported from the component and package entrypoints', async () => {
    const [componentIndex, rootIndex] = await Promise.all([
      Bun.file('src/components/progress/index.ts').text(),
      Bun.file('src/index.ts').text(),
    ]);

    expect(componentIndex).toContain("export { ProgressRing } from './ProgressRing';");
    expect(componentIndex).toContain('ProgressRingProps');
    expect(rootIndex).toContain("export { Progress, ProgressRing } from './components/progress';");
    expect(rootIndex).toContain('ProgressProps, ProgressRingProps');
  });

  test('exposes native progress semantics and uses canonical normalization and colors', async () => {
    const source = await Bun.file('src/components/progress/ProgressRing.tsx').text();

    expect(source).toContain('accessibilityRole="progressbar"');
    expect(source).toContain('accessibilityValue={{');
    expect(source).toContain('resolveProgressFraction({ max, value })');
    expect(source).toContain('resolveProgressRole(theme, color)');
    expect(source).not.toMatch(/#[0-9A-Fa-f]{3,8}|rgba?\(|hsla?\(/);
  });

  test('declares a complete serializable manifest blueprint', () => {
    expect(progressRingMeta.directManifestNode).toBe(true);
    expect(progressRingMeta.allowedChildren).toEqual([]);
    expect(progressRingMeta.blueprint.defaultProps).toEqual({
      value: 68,
      max: 100,
      color: 'primary',
      trackColor: 'neutral',
      size: 120,
      thickness: 10,
      centerValue: '68%',
      centerLabel: 'Complete',
      accessibilityLabel: 'Progress',
      accessibilityValueText: '68% complete',
    });
    expect(Object.keys(progressRingMeta.props).sort()).toEqual(
      Object.keys(progressRingMeta.blueprint.defaultProps).sort(),
    );
    expect(JSON.parse(JSON.stringify(progressRingMeta))).toEqual(progressRingMeta);
  });
});
