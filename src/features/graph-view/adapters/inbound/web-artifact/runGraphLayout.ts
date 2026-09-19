import type { Core, LayoutOptions, Layouts } from 'cytoscape';

import type { GraphViewLayoutName } from './GraphView';

interface RunGraphLayoutInput {
  readonly layout: GraphViewLayoutName;
  readonly layoutOptions?: Readonly<Record<string, unknown>>;
  readonly spacingFactor: number;
}

interface GraphLayoutSession {
  stop(): void;
}

/*** Run one Cytoscape layout with automatic fitting disabled and explicit stop ownership. */
export function runGraphLayout(
  cy: Core,
  input: RunGraphLayoutInput,
  onComplete: () => void
): GraphLayoutSession {
  const layout = cy.layout(createLayoutOptions(input));
  const handleStop = () => onComplete();
  cy.one('layoutstop', handleStop);
  layout.run();

  return {
    stop() {
      stopGraphLayout(cy, layout, handleStop);
    },
  };
}

/*** Build layout options while reserving fit ownership for the graph runtime. */
function createLayoutOptions(input: RunGraphLayoutInput): LayoutOptions {
  return {
    ...(input.layoutOptions ?? {}),
    name: input.layout,
    spacingFactor: input.spacingFactor,
    nodeDimensionsIncludeLabels: true,
    fit: false,
    animate: false,
  } as LayoutOptions;
}

/*** Stop one layout without allowing its stale layout-stop callback to escape. */
function stopGraphLayout(cy: Core, layout: Layouts, handleStop: () => void) {
  cy.off('layoutstop', handleStop);
  try {
    layout.stop();
  } catch {
    // Cytoscape may already have disposed a superseded layout.
  }
}
