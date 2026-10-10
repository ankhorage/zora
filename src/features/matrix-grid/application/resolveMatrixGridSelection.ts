import { applySelectionIntent, type SelectionIntent } from '@ankhorage/utility/selection';

import type { SelectionMode } from '../../../types/selection';

/*** Apply ZORA's canonical selection intent while retaining the configured selection mode. */
export function resolveMatrixGridSelection(
  selectedIds: readonly string[],
  cellId: string,
  intent: SelectionIntent,
  mode: SelectionMode,
): readonly string[] {
  return mode === 'single'
    ? applySelectionIntent(selectedIds, cellId, 'replace')
    : applySelectionIntent(selectedIds, cellId, intent);
}
