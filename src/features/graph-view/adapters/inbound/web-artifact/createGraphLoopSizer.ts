import type { Core } from 'cytoscape';

/***
 * Keeps self-loop control points outside the rendered node, independent of label size and direction.
 * @performance Reconcile loop geometry only after size/style/layout changes, never on pan or zoom.
 * Preserve valid dependencies and configured larger loops; do not hide edges or silence warnings.
 */
export function createGraphLoopSizer(cy: Core) {
  const configured = new Map<string, { step: number; distance: number }>();

  /*** Releases only this owner's overrides before a new stylesheet is applied. */
  function reset() {
    for (const id of configured.keys()) {
      cy.getElementById(id).removeStyle('control-point-step-size control-point-distances');
    }
    configured.clear();
  }

  /*** Reconciles loop clearances, including compound bounds after layout completion. */
  function update() {
    const loops = cy.edges(':loop');
    const active = new Set(loops.map((edge) => edge.id()));
    for (const id of configured.keys()) {
      if (active.has(id)) continue;
      cy.getElementById(id).removeStyle('control-point-step-size control-point-distances');
      configured.delete(id);
    }
    cy.batch(() => {
      loops.forEach((edge) => {
        const node = edge.source();
        const original = configured.get(edge.id()) ?? {
          step: Number.parseFloat(String(edge.style('control-point-step-size'))) || 40,
          distance: Number.parseFloat(String(edge.style('control-point-distances'))) || 40,
        };
        configured.set(edge.id(), original);
        const clearance = Math.max(
          16,
          edge.width() * Number.parseFloat(String(edge.style('arrow-scale'))) * 2,
        );
        const minimum = (Math.hypot(node.outerWidth(), node.outerHeight()) / 2 + clearance) / 1.4;
        const step = Math.max(original.step, minimum);
        const distance = Math.max(original.distance, minimum);
        if (Number.parseFloat(String(edge.style('control-point-step-size'))) !== step)
          edge.style('control-point-step-size', step);
        if (Number.parseFloat(String(edge.style('control-point-distances'))) !== distance)
          edge.style('control-point-distances', distance);
      });
    });
  }

  return { reset, update };
}
