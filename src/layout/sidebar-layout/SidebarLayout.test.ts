import { describe, expect, it } from 'bun:test';

import { resolveSidebarLayoutSizing } from './resolveSidebarLayoutSizing';

describe('SidebarLayout sizing contract', () => {
  it('keeps content-flow sizing as the default', () => {
    expect(resolveSidebarLayoutSizing()).toEqual({
      root: {
        align: 'flex-start',
        flex: undefined,
        minHeight: undefined,
        minWidth: undefined,
      },
      child: {
        minHeight: undefined,
        minWidth: undefined,
      },
    });
  });

  it('fills a bounded parent for child-owned scroll areas', () => {
    expect(resolveSidebarLayoutSizing('fill')).toEqual({
      root: {
        align: 'stretch',
        flex: 1,
        minHeight: 0,
        minWidth: 0,
      },
      child: {
        minHeight: 0,
        minWidth: 0,
      },
    });
  });
});
