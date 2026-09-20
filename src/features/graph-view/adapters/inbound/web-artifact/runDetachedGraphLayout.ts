import { isRecord } from '@ankhorage/utility/object';
import cytoscape, { type Core, type LayoutOptions } from 'cytoscape';

/***
 * Isolate an uncancellable layout from the displayed core and discard stopped generations.
 * @performance Apply current positions in one batch without rebuilding the displayed graph.
 * A stopped ELK computation still runs to completion; this guard does not cancel its CPU work.
 */
export function runDetachedGraphLayout(cy: Core, options: LayoutOptions, onComplete: () => void) {
  const graph = createLayoutSnapshot(cy);
  const state = { stopped: false };
  const elkOptions: unknown = 'elk' in options ? options.elk : undefined;
  const layoutOptions = {
    ...options,
    fit: false,
    animate: false,
    elk: {
      aspectRatio: cy.width() / Math.max(cy.height(), 1),
      ...(isRecord(elkOptions) ? elkOptions : {}),
    },
  };
  const layout = graph.layout(layoutOptions);
  layout.one('layoutstop', () => {
    try {
      if (state.stopped || cy.destroyed()) return;
      cy.batch(() => {
        cy.nodes()
          .not(':parent')
          .positions((node) => graph.getElementById(node.id()).position());
      });
      onComplete();
    } finally {
      graph.destroy();
    }
  });
  layout.run();

  return {
    stop() {
      // ELK's stop() is a no-op. Keep its isolated core alive until it settles.
      state.stopped = true;
    },
  };
}

/*** Capture graph data and measured node sizes without retaining the browser renderer. */
function createLayoutSnapshot(cy: Core): Core {
  const graph = cytoscape({
    headless: true,
    styleEnabled: true,
    elements: cy.elements().map((element) => {
      const data: unknown = element.data();
      return { data: isRecord(data) ? { ...data } : {}, classes: element.classes() };
    }),
    style: [{ selector: 'node', style: { label: '', padding: '0px', 'border-width': 0 } }],
  });
  graph.batch(() => {
    cy.nodes().forEach((node) => {
      if (node.isParent()) {
        const padding: unknown = node.style('padding');
        if (typeof padding === 'string') graph.getElementById(node.id()).style({ padding });
        return;
      }
      const dimensions = node.layoutDimensions({ nodeDimensionsIncludeLabels: true });
      graph.getElementById(node.id()).style({ width: dimensions.w, height: dimensions.h });
    });
  });
  return graph;
}
