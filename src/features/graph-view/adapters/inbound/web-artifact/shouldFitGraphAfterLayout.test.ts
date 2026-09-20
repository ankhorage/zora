import { describe, expect, it } from 'bun:test';

import { shouldFitGraphAfterLayout } from './shouldFitGraphAfterLayout';

describe('shouldFitGraphAfterLayout', () => {
  it('fits the initial layout once', () => {
    expect(shouldFitGraphAfterLayout(false, false)).toBe(true);
  });

  it('preserves viewport after the graph is ready', () => {
    expect(shouldFitGraphAfterLayout(true, false)).toBe(false);
  });

  it('fits a changed package depth or filtered topology after readiness', () => {
    expect(shouldFitGraphAfterLayout(true, true)).toBe(true);
  });
});
