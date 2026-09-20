import type { Core, LayoutOptions, Layouts } from 'cytoscape';

import type { GraphViewLayoutName } from './GraphView';
import { runDetachedGraphLayout } from './runDetachedGraphLayout';

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
  onComplete: () => void,
): GraphLayoutSession {
  if (input.layout === 'elk') {
    return runDetachedGraphLayout(cy, createLayoutOptions(input), onComplete);
  }
  const layout = cy.layout(createLayoutOptions(input));
  const handleStop = () => onComplete();
  layout.one('layoutstop', handleStop);
  layout.run();

  return {
    stop() {
      stopGraphLayout(layout, handleStop);
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
  };
}

/*** Stop one layout without allowing its stale layout-stop callback to escape. */
function stopGraphLayout(layout: Layouts, handleStop: () => void) {
  layout.off('layoutstop', handleStop);
  try {
    layout.stop();
  } catch {
    // Cytoscape may already have disposed a superseded layout.
  }
}
