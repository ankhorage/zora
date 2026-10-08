import type { GridRectItem } from '@ankhorage/grid-view';

import type { TileGridItem } from '../../../types/grid-view';

/** A presentation-level spatial layout, expressed in engine-owned world rectangles. */
export interface TileGridLayout {
  readonly items: readonly GridRectItem[];
  readonly width: number;
  readonly height: number;
  readonly columns: number;
}

/*** Arrange keyed tiles into responsive rows without constructing placeholder grid cells. */
export function layoutTileGrid(
  items: readonly TileGridItem[],
  viewportWidth: number,
  tileSize: number,
  gap: number,
  zoom = 1,
): TileGridLayout {
  if (
    ![viewportWidth, tileSize, gap, zoom].every(Number.isFinite) ||
    viewportWidth < 0 ||
    tileSize <= 0 ||
    gap < 0 ||
    zoom <= 0
  ) {
    throw new RangeError(
      'Tile layout requires finite, nonnegative dimensions and positive scales.',
    );
  }
  const columns = Math.max(1, Math.floor((viewportWidth / zoom + gap) / (tileSize + gap)));
  const rows = Math.ceil(items.length / columns);
  return {
    columns,
    width: columns * (tileSize + gap) - gap,
    height: Math.max(0, rows * (tileSize + gap) - gap),
    items: items.map((item, index) => ({
      id: item.id,
      x: (index % columns) * (tileSize + gap),
      y: Math.floor(index / columns) * (tileSize + gap),
      width: tileSize,
      height: tileSize,
    })),
  };
}
