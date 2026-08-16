import type { SidebarLayoutSizing } from './types';

export function resolveSidebarLayoutSizing(sizing: SidebarLayoutSizing = 'content') {
  const fillsAvailableSpace = sizing === 'fill';

  return {
    root: {
      align: fillsAvailableSpace ? 'stretch' : 'flex-start',
      flex: fillsAvailableSpace ? 1 : undefined,
      minHeight: fillsAvailableSpace ? 0 : undefined,
      minWidth: fillsAvailableSpace ? 0 : undefined,
    },
    child: {
      minHeight: fillsAvailableSpace ? 0 : undefined,
      minWidth: fillsAvailableSpace ? 0 : undefined,
    },
  } as const;
}
