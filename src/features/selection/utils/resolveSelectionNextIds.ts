import type { SelectionMode } from '../../../types/selection';

/*** Normalize selected ids to stable unique membership within the configured selection mode. */
export function normalizeIds(
  ids: readonly string[] | undefined,
  mode: SelectionMode,
): readonly string[] {
  const uniqueIds: string[] = [];
  const seen = new Set<string>();

  for (const id of ids ?? []) {
    if (seen.has(id)) continue;
    seen.add(id);
    uniqueIds.push(id);
    if (mode === 'single') break;
  }

  return uniqueIds;
}

/*** Compare ordered selection ids without allocating replacement arrays. */
export function areIdsEqual(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false;
  for (let index = 0; index < a.length; index += 1) {
    if (a.at(index) !== b.at(index)) return false;
  }

  return true;
}

/*** Produce the canonical empty selection. */
export function clearIds(): readonly string[] {
  return [];
}

/*** Ensure one id is selected while preserving multi-selection membership. */
export function selectId({
  mode,
  ids,
  id,
}: {
  mode: SelectionMode;
  ids: readonly string[];
  id: string;
}): readonly string[] {
  if (mode === 'single') return [id];
  if (ids.includes(id)) return ids;
  return [...ids, id];
}
