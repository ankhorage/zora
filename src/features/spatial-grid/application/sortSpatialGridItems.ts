import type { SpatialGridItem } from '../../../types/spatial-grid';

/** Orders free-placement items for deterministic paint and overlap hit-testing. */
export function sortSpatialGridItems(
  items: readonly SpatialGridItem[],
): readonly SpatialGridItem[] {
  return [...items]
    .map((item, index) => ({ index, item }))
    .sort(
      (left, right) =>
        (left.item.zIndex ?? 0) - (right.item.zIndex ?? 0) || left.index - right.index,
    )
    .map(({ item }) => item);
}
