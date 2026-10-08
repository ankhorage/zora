/***
 * Resolve focus along actual tile positions while skipping unavailable items
 * without collapsing the visual row geometry.
 */
export function getExplorerNextFocusId(
  ids: readonly string[],
  currentId: string | null,
  key: string,
  columns: number,
  disabledIds: ReadonlySet<string> = new Set(),
): string | null {
  const delta = resolveFocusDelta(key, columns);
  if (delta === null || ids.length === 0) return null;

  const firstIndex = ids.findIndex((id) => !disabledIds.has(id));
  if (firstIndex < 0) return null;

  const currentIndex = Math.max(firstIndex, ids.indexOf(currentId ?? ''));
  const candidateIndex =
    delta === Number.NEGATIVE_INFINITY
      ? 0
      : delta === Number.POSITIVE_INFINITY
        ? ids.length - 1
        : Math.max(0, Math.min(ids.length - 1, currentIndex + delta));
  const direction =
    delta === Number.NEGATIVE_INFINITY
      ? 1
      : delta === Number.POSITIVE_INFINITY
        ? -1
        : Math.sign(delta);

  for (let index = candidateIndex; index >= 0 && index < ids.length; index += direction) {
    const candidate = ids.at(index);
    if (candidate !== undefined && !disabledIds.has(candidate)) return candidate;
  }
  const current = ids.at(currentIndex);
  return current !== undefined && !disabledIds.has(current)
    ? current
    : (ids.at(firstIndex) ?? null);
}

/*** Translate navigation keys into collection-relative movements. */
function resolveFocusDelta(key: string, columns: number): number | null {
  const rowSize = Math.max(1, Math.floor(columns));
  switch (key) {
    case 'ArrowLeft':
      return -1;
    case 'ArrowRight':
      return 1;
    case 'ArrowUp':
      return -rowSize;
    case 'ArrowDown':
      return rowSize;
    case 'Home':
      return Number.NEGATIVE_INFINITY;
    case 'End':
      return Number.POSITIVE_INFINITY;
    default:
      return null;
  }
}
