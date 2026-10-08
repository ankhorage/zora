/*** Resolve roving focus from semantic keyboard input without coupling focus policy to a renderer. */
export function getExplorerNextFocusId(
  ids: readonly string[],
  currentId: string | null,
  key: string,
  columns: number,
): string | null {
  if (ids.length === 0) return null;
  const currentIndex = currentId === null ? 0 : Math.max(0, ids.indexOf(currentId));
  const delta = resolveFocusDelta(key, columns);
  if (delta === null) return null;
  return ids[Math.max(0, Math.min(ids.length - 1, currentIndex + delta))] ?? null;
}

/*** Translate supported Explorer navigation keys into an ordered collection displacement. */
function resolveFocusDelta(key: string, columns: number): number | null {
  switch (key) {
    case 'ArrowLeft':
      return -1;
    case 'ArrowRight':
      return 1;
    case 'ArrowUp':
      return -Math.max(1, columns);
    case 'ArrowDown':
      return Math.max(1, columns);
    case 'Home':
      return Number.NEGATIVE_INFINITY;
    case 'End':
      return Number.POSITIVE_INFINITY;
    default:
      return null;
  }
}
