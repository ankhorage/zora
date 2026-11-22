import type { Breakpoint } from '@ankhorage/surface';

import type { MasterDetailActivePane, MasterDetailDesktopMode } from '../../../types/master-detail';

export type MasterDetailPresentation = 'detail' | 'master' | 'split';

/** Resolves the visual pane projection without changing Navigator-owned route state. */
export function resolveMasterDetailPresentation(
  breakpoint: Breakpoint,
  activePane: MasterDetailActivePane,
  desktopMode: MasterDetailDesktopMode,
): MasterDetailPresentation {
  if (breakpoint === 'base' || breakpoint === 'sm') return activePane;
  return desktopMode === 'master' ? 'master' : 'split';
}
