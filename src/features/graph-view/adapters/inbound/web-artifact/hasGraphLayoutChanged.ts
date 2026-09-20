import type { GraphRuntimeUpdate } from '../../../../../types/graphViewRuntime';
import { getGraphTopologyKey } from './getGraphTopologyKey';

/***
 * Detects topology and explicit layout-policy changes independently of highlight metadata.
 * @performance
 * New node/edge array identities alone are not a layout request: consumers may update classes
 * and colors on hover or selection. Keep structural identity separate from presentation and
 * combine this decision with measured geometry in the single runtime owner, not consumer effects.
 */
export function hasGraphLayoutChanged(
  previous: GraphRuntimeUpdate | null,
  input: GraphRuntimeUpdate,
): boolean {
  return (
    previous === null ||
    previous.layout !== input.layout ||
    previous.spacingFactor !== input.spacingFactor ||
    previous.layoutOptions !== input.layoutOptions ||
    previous.richNodeRendering !== input.richNodeRendering ||
    getGraphTopologyKey(previous.nodes, previous.edges) !==
      getGraphTopologyKey(input.nodes, input.edges)
  );
}
