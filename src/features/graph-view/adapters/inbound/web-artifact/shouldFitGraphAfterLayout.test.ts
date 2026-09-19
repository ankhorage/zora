import { describe, expect, it } from 'bun:test';

import { shouldFitGraphAfterLayout } from './shouldFitGraphAfterLayout';

describe('shouldFitGraphAfterLayout', () => {
  it('fits the initial layout once', () => {
    expect(shouldFitGraphAfterLayout(false)).toBe(true);
  });

  it('preserves viewport after the graph is ready', () => {
    expect(shouldFitGraphAfterLayout(true)).toBe(false);
  });
});
