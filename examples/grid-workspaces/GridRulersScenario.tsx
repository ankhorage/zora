/***
 * Supplies a standalone passive-ruler scenario for the next published ZORA version without
 * coupling this installed example app to unreleased package source.
 */
export const GridRulersScenario = {
  guides: [{ axis: 'x' as const, id: 'playhead', label: 'Playhead', position: 80 }],
  viewport: {
    height: 240,
    offsetX: 40,
    offsetY: 20,
    pixelsPerUnitX: 2,
    pixelsPerUnitY: 2,
    width: 320,
  },
  xTickSource: {
    kind: 'ticks' as const,
    specification: { majorEvery: 5, mode: 'fixed' as const, step: 20 },
  },
  yTickSource: {
    categories: [
      { id: 'intro', size: 35, start: 40 },
      { id: 'verse', size: 65, start: 75 },
      { id: 'chorus', size: 120, start: 140 },
    ],
    kind: 'categories' as const,
  },
} as const;
