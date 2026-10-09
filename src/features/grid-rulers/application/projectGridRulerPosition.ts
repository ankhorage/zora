import { type GridAxisName, type GridViewport, worldToViewport } from '@ankhorage/grid-view';

/*** Projects a stable world-axis coordinate into the matching visual ruler or overlay position. */
export function projectGridRulerPosition(
  viewport: GridViewport,
  axis: GridAxisName,
  position: number,
  direction: 'ltr' | 'rtl' = 'ltr',
): number {
  const point = worldToViewport(
    axis === 'x' ? { x: position, y: viewport.offsetY } : { x: viewport.offsetX, y: position },
    viewport,
  );
  const projectedPosition = axis === 'x' ? point.x : point.y;

  return axis === 'x' && direction === 'rtl'
    ? viewport.width - projectedPosition
    : projectedPosition;
}
