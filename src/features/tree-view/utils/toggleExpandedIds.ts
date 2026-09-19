/*** Toggle one tree node id while preserving immutable expansion state. */
export function toggleExpandedIds<TId extends string>(
  expandedIds: readonly TId[],
  id: TId,
): readonly TId[] {
  return expandedIds.includes(id)
    ? expandedIds.filter((expandedId) => expandedId !== id)
    : [...expandedIds, id];
}
