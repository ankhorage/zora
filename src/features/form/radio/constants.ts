/** Shared arrow-key offsets; string keys also permit lookup of unrelated keyboard events. */
export const DIRECTION_MODIFIERS: ReadonlyMap<string, number> = new Map([
  ['ArrowRight', 1],
  ['ArrowDown', 1],
  ['ArrowLeft', -1],
  ['ArrowUp', -1],
]);
