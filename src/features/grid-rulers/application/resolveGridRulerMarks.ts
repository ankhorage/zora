import {
  getAxisCategoryTicks,
  getAxisTicks,
  type GridAxisName,
  type GridAxisTick,
  type GridViewport,
  worldToViewport,
} from '@ankhorage/grid-view';

import type { GridRulerMark, GridRulerTickSource } from '../../../types/grid-rulers';

/*** Resolves bounded engine ticks into viewport-pixel ruler marks without changing interaction state. */
export function resolveGridRulerMarks(
  viewport: GridViewport,
  axis: GridAxisName,
  tickSource: GridRulerTickSource,
  formatLabel?: (tick: GridAxisTick) => string | undefined,
): readonly GridRulerMark[] {
  const ticks =
    tickSource.kind === 'categories'
      ? getAxisCategoryTicks(viewport, axis, tickSource.categories)
      : getAxisTicks(viewport, axis, tickSource.specification, tickSource.provider);

  return ticks.map((tick) => ({
    position: projectPosition(viewport, axis, tick.position),
    level: tick.level,
    ...(tick.label !== undefined || formatLabel?.(tick) !== undefined
      ? { label: formatLabel?.(tick) ?? tick.label }
      : {}),
    ...('categoryId' in tick && typeof tick.categoryId === 'string'
      ? { categoryId: tick.categoryId }
      : {}),
  }));
}

/*** Projects one world-axis coordinate through the published viewport transform. */
function projectPosition(viewport: GridViewport, axis: GridAxisName, position: number): number {
  const point = worldToViewport(
    axis === 'x' ? { x: position, y: viewport.offsetY } : { x: viewport.offsetX, y: position },
    viewport,
  );
  return axis === 'x' ? point.x : point.y;
}
