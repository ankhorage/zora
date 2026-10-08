import type { ExplorerSelectionMode } from '../../../types/explorer';

/***
 * Resolve selection against ordered stable identities; shift-range extends from the last anchor.
 * Range may replace or extend a multi-selection, but never affects the underlying catalogue.
 */
export function resolveExplorerSelection(
  orderedIds: readonly string[],
  currentIds: readonly string[],
  targetId: string,
  anchorId: string | null,
  intent: 'replace' | 'toggle' | 'range',
  mode: ExplorerSelectionMode,
): readonly string[] {
  const targetIndex = orderedIds.indexOf(targetId);
  if (targetIndex < 0) return currentIds;
  if (mode === 'single' || intent === 'replace') return [targetId];
  if (intent === 'toggle') {
    return currentIds.includes(targetId)
      ? currentIds.filter((id) => id !== targetId)
      : [...currentIds, targetId];
  }
  const anchorIndex = anchorId === null ? -1 : orderedIds.indexOf(anchorId);
  if (anchorIndex < 0) return [targetId];
  const start = Math.min(anchorIndex, targetIndex);
  const end = Math.max(anchorIndex, targetIndex);
  return orderedIds.slice(start, end + 1);
}
