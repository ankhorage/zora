import { describe, expect, test } from 'bun:test';

import { resolveGameEntityMotionPlan } from './resolveGameEntityMotionPlan';

describe('resolveGameEntityMotionPlan configuration', () => {
  test('preserves explicit transition and repeating alternate motion', () => {
    expect(
      resolveGameEntityMotionPlan(
        {
          transitionDurationMs: 70,
          transitionEasing: 'ease-out',
          motionOffsetY: 8,
          motionDurationMs: 1200,
          motionDelayMs: 100,
          motionEasing: 'ease-in-out',
          motionRepeat: true,
          motionAlternate: true,
        },
        false,
      ),
    ).toEqual({
      transitionDurationMs: 70,
      transitionEasing: 'ease-out',
      motionDurationMs: 1200,
      motionDelayMs: 100,
      motionEasing: 'ease-in-out',
      motionEnabled: true,
      motionRepeat: true,
      motionAlternate: true,
      motionPaused: false,
    });
  });

  test('uses alternate only for repeating motion', () => {
    expect(
      resolveGameEntityMotionPlan(
        { motionOffsetY: 5, motionDurationMs: 100, motionAlternate: true },
        false,
      ).motionAlternate,
    ).toBe(false);
  });
});

describe('resolveGameEntityMotionPlan reduced motion', () => {
  test('disables decorative motion and transitions', () => {
    const plan = resolveGameEntityMotionPlan(
      { transitionDurationMs: 80, motionOffsetX: 12, motionDurationMs: 500 },
      true,
    );

    expect(plan.transitionDurationMs).toBe(0);
    expect(plan.motionEnabled).toBe(false);
  });

  test('keeps essential trajectories enabled', () => {
    const plan = resolveGameEntityMotionPlan(
      { motionOffsetY: 70, motionDurationMs: 600, motionEssential: true },
      true,
    );

    expect(plan.motionEnabled).toBe(true);
  });
});
