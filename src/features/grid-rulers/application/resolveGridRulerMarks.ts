import {
  getAxisCategoryTicks,
  getAxisTicks,
  type GridAxisName,
  type GridAxisTick,
  type GridViewport,
} from '@ankhorage/grid-view';

import type { GridRulerMark, GridRulerTickSource } from '../../../types/grid-rulers';
import { projectGridRulerPosition } from './projectGridRulerPosition';

/*** Resolves bounded engine ticks into viewport-pixel ruler marks without changing interaction state. */
export function resolveGridRulerMarks(
  viewport: GridViewport,
  axis: GridAxisName,
  tickSource: GridRulerTickSource,
  formatLabel?: (tick: GridAxisTick) => string | undefined,
  direction: 'ltr' | 'rtl' = 'ltr',
): readonly GridRulerMark[] {
  const ticks =
    tickSource.kind === 'categories'
      ? getAxisCategoryTicks(viewport, axis, tickSource.categories)
      : getAxisTicks(viewport, axis, tickSource.specification, tickSource.provider);

  return ticks.map((tick) => {
    const formattedLabel = formatLabel?.(tick);

    return {
      position: projectGridRulerPosition(viewport, axis, tick.position, direction),
      level: tick.level,
      ...(tick.label !== undefined || formattedLabel !== undefined
        ? { label: formattedLabel ?? tick.label }
        : {}),
      ...('categoryId' in tick && typeof tick.categoryId === 'string'
        ? { categoryId: tick.categoryId }
        : {}),
    };
  });
}
