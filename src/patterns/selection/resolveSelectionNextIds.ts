import type { SelectionMode } from './types';

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

export function areIdsEqual(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false;
  for (let index = 0; index < a.length; index += 1) {
    if (a.at(index) !== b.at(index)) return false;
  }

  return true;
}

export function clearIds(): readonly string[] {
  return [];
}

export function selectId({
  mode,
  ids,
  id,
}: {
  mode: SelectionMode;
  ids: readonly string[];
  id: string;
}): readonly string[] {
  if (mode === 'single') {
    return [id];
  }

  if (ids.includes(id)) {
    return ids;
  }

  return [...ids, id];
}

export function toggleId({
  mode,
  ids,
  id,
}: {
  mode: SelectionMode;
  ids: readonly string[];
  id: string;
}): readonly string[] {
  if (ids.includes(id)) {
    return ids.filter((existingId) => existingId !== id);
  }

  if (mode === 'single') {
    return [id];
  }

  return [...ids, id];
}
