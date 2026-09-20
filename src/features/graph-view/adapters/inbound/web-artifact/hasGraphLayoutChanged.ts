import type { GraphRuntimeUpdate } from '../../../../../types/graphViewRuntime';
import { getGraphTopologyKey } from './getGraphTopologyKey';

/*** Detect topology and explicit layout-policy changes independently of highlight metadata. */
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
