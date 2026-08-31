import { describe, expect, test } from 'bun:test';

import type {
  ContentRailControlPressEvent,
  ContentRailProps,
  ContentRailVisibleRangeChangeEvent,
} from '../../index';

describe('ContentRail public contract', () => {
  test('exports serializable manifest and event inputs from the package root', () => {
    const props: ContentRailProps = {
      direction: 'rtl',
      gap: 'm',
      itemSize: 'responsive',
      motion: 'reduced',
      padding: 'm',
      peek: 32,
      showControls: true,
    };
    const control: ContentRailControlPressEvent = { direction: 'next', targetIndex: 2 };
    const range: ContentRailVisibleRangeChangeEvent = {
      firstVisibleIndex: 1,
      lastVisibleIndex: 3,
      itemCount: 6,
    };

    expect(() => JSON.stringify(props)).not.toThrow();
    expect(() => JSON.stringify(control)).not.toThrow();
    expect(() => JSON.stringify(range)).not.toThrow();
  });

  test('keeps product data, navigation, and platform coupling outside the pattern', async () => {
    const source = await Bun.file('src/patterns/content-rail/ContentRail.tsx').text();

    expect(source).toContain('ScrollView');
    expect(source).toContain('I18nManager.isRTL');
    expect(source).toContain('accessibilityRole="list"');
    expect(source).toContain('reducedMotion');
    expect(source).toContain('accessibilityLiveRegion="polite"');
    expect(source).not.toContain('expo-');
    expect(source).not.toContain('fetch(');
    expect(source).not.toContain('router');
  });
});
