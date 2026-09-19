'use client';

import type { CytoscapeOptions } from 'cytoscape';
import React from 'react';

import { createGraphRuntime, type GraphRuntime } from './createGraphRuntime';
import { GraphNodeOverlay } from './GraphNodeOverlay';

export type GraphViewLayoutName = 'breadthfirst' | 'circle' | 'concentric' | 'elk' | 'grid';
export type GraphViewElementEventType =
  'press' | 'double-press' | 'select' | 'unselect' | 'pointer-enter' | 'pointer-leave';

export interface GraphViewNode {
  readonly id: string;
  readonly label?: string;
  readonly parentId?: string;
  readonly classes?: string;
  readonly data?: Readonly<Record<string, unknown>>;
}

export interface GraphViewEdge {
  readonly id?: string;
  readonly source: string;
  readonly target: string;
  readonly classes?: string;
  readonly data?: Readonly<Record<string, unknown>>;
}

export interface GraphViewStyleRule {
  readonly selector: string;
  readonly style: Readonly<Record<string, unknown>>;
}

export interface GraphViewPoint {
  readonly x: number;
  readonly y: number;
}

export interface GraphViewSize {
  readonly width: number;
  readonly height: number;
}

export interface GraphViewNodeRenderContext {
  readonly hovered: boolean;
  readonly node: GraphViewNode;
  readonly selected: boolean;
  readonly zoom: number;
}

export interface GraphViewRenderedNode {
  readonly hovered: boolean;
  readonly id: string;
  readonly position: GraphViewPoint;
  readonly selected: boolean;
  readonly zoom: number;
}

export interface GraphViewViewport {
  readonly zoom: number;
  readonly pan: GraphViewPoint;
}

export interface GraphViewFitOptions {
  readonly nodeIds?: readonly string[];
  readonly padding?: number;
}

export interface GraphViewElementEvent {
  readonly id: string;
  readonly type: GraphViewElementEventType;
}

export interface GraphViewController {
  fit(options?: GraphViewFitOptions): void;
  getViewport(): GraphViewViewport;
  setPan(pan: GraphViewPoint): void;
  setZoom(zoom: number): void;
  zoomBy(factor: number): void;
}

export interface GraphViewProps {
  readonly nodes: readonly GraphViewNode[];
  readonly edges: readonly GraphViewEdge[];
  readonly layout?: GraphViewLayoutName;
  readonly layoutOptions?: Readonly<Record<string, unknown>>;
  readonly spacingFactor?: number;
  readonly styleRules?: readonly GraphViewStyleRule[];
  readonly selectedNodeIds?: readonly string[];
  readonly renderNode?: (context: GraphViewNodeRenderContext) => React.ReactNode;
  readonly getNodeSize?: (node: GraphViewNode) => GraphViewSize | undefined;
  readonly fitPadding?: number;
  readonly minZoom?: number;
  readonly maxZoom?: number;
  readonly className?: string;
  readonly style?: React.CSSProperties;
  readonly ariaLabel?: string;
  readonly onReady?: (controller: GraphViewController) => void;
  readonly onLayoutComplete?: (controller: GraphViewController) => void;
  readonly onNodeEvent?: (event: GraphViewElementEvent) => void;
  readonly onEdgeEvent?: (event: GraphViewElementEvent) => void;
  readonly onViewportChange?: (viewport: GraphViewViewport) => void;
}

export type GraphViewCallbacks = Pick<
  GraphViewProps,
  'onEdgeEvent' | 'onLayoutComplete' | 'onNodeEvent' | 'onReady' | 'onViewportChange'
>;

type GraphContainer = NonNullable<CytoscapeOptions['container']>;

/*** Render a browser graph while one runtime owns Cytoscape layout, viewport, and disposal. */
export function GraphView(props: GraphViewProps) {
  const { containerRef, renderedNodes, runtimeRef } = useGraphViewRuntime(props);

  return (
    <div
      aria-label={props.ariaLabel ?? 'Graph'}
      className={props.className}
      role="application"
      style={{
        height: '100%',
        minHeight: 0,
        minWidth: 0,
        position: 'relative',
        width: '100%',
        ...props.style,
      }}
    >
      <div ref={containerRef} style={{ height: '100%', width: '100%' }} />
      {props.renderNode ? (
        <GraphNodeOverlay
          nodes={props.nodes}
          renderedNodes={renderedNodes}
          renderNode={props.renderNode}
          onNodeEvent={(id, type) => runtimeRef.current?.handleOverlayNodeEvent(id, type)}
          onNodeSize={(id, size) => runtimeRef.current?.setNodeSize(id, size)}
        />
      ) : null}
    </div>
  );
}

/*** Compose React synchronization around the single imperative graph runtime. */
function useGraphViewRuntime(props: GraphViewProps) {
  const containerRef = React.useRef<GraphContainer | null>(null);
  const runtimeRef = React.useRef<GraphRuntime | null>(null);
  const callbacksRef = useGraphCallbacksRef(props);
  const [renderedNodes, setRenderedNodes] = React.useState<readonly GraphViewRenderedNode[]>([]);

  useRuntimeLifecycle(containerRef, runtimeRef, callbacksRef);
  useRuntimeGraphUpdate(runtimeRef, props);
  useRuntimeSelection(runtimeRef, props.selectedNodeIds);
  useRenderedNodeSubscription(runtimeRef, props.renderNode, setRenderedNodes);
  useKnownNodeSizes(runtimeRef, props.nodes, props.getNodeSize);

  return { containerRef, renderedNodes, runtimeRef };
}

/*** Keep the callback ref current without mutating refs during render. */
function useGraphCallbacksRef(props: GraphViewProps) {
  const callbacksRef = React.useRef<GraphViewCallbacks>(readCallbacks(props));
  const {
    onEdgeEvent,
    onLayoutComplete,
    onNodeEvent,
    onReady,
    onViewportChange,
  } = props;

  React.useEffect(() => {
    callbacksRef.current = {
      onEdgeEvent,
      onLayoutComplete,
      onNodeEvent,
      onReady,
      onViewportChange,
    };
  }, [onEdgeEvent, onLayoutComplete, onNodeEvent, onReady, onViewportChange]);

  return callbacksRef;
}

/*** Create and dispose the runtime only with the underlying browser container lifetime. */
function useRuntimeLifecycle(
  containerRef: { current: GraphContainer | null },
  runtimeRef: { current: GraphRuntime | null },
  callbacksRef: { current: GraphViewCallbacks },
) {
  React.useEffect(() => {
    const container = containerRef.current;
    if (container === null) return;
    const runtime = createGraphRuntime(container, callbacksRef);
    runtimeRef.current = runtime;
    return () => {
      runtime.destroy();
      runtimeRef.current = null;
    };
  }, [callbacksRef, containerRef, runtimeRef]);
}

/*** Synchronize graph data and layout policy without exposing Cytoscape to React. */
function useRuntimeGraphUpdate(
  runtimeRef: { current: GraphRuntime | null },
  props: GraphViewProps,
) {
  const {
    edges,
    fitPadding,
    layout,
    layoutOptions,
    maxZoom,
    minZoom,
    nodes,
    renderNode,
    spacingFactor,
    styleRules,
  } = props;

  React.useEffect(() => {
    runtimeRef.current?.update({
      edges,
      fitPadding,
      layout,
      layoutOptions,
      maxZoom,
      minZoom,
      nodes,
      richNodeRendering: renderNode !== undefined,
      spacingFactor,
      styleRules,
    });
  }, [
    edges,
    fitPadding,
    layout,
    layoutOptions,
    maxZoom,
    minZoom,
    nodes,
    renderNode,
    runtimeRef,
    spacingFactor,
    styleRules,
  ]);
}

/*** Synchronize optional controlled selection independently from graph layout. */
function useRuntimeSelection(
  runtimeRef: { current: GraphRuntime | null },
  selectedNodeIds: readonly string[] | undefined,
) {
  React.useEffect(() => {
    runtimeRef.current?.setSelectedNodeIds(selectedNodeIds);
  }, [runtimeRef, selectedNodeIds]);
}

/*** Subscribe the optional rich-node overlay to rendered runtime positions. */
function useRenderedNodeSubscription(
  runtimeRef: { current: GraphRuntime | null },
  renderNode: GraphViewProps['renderNode'],
  setRenderedNodes: (nodes: readonly GraphViewRenderedNode[]) => void,
) {
  React.useEffect(() => {
    const runtime = runtimeRef.current;
    if (runtime === null || renderNode === undefined) {
      setRenderedNodes([]);
      return;
    }
    return runtime.subscribeRenderedNodes(setRenderedNodes);
  }, [renderNode, runtimeRef, setRenderedNodes]);
}

/*** Seed known rich-node dimensions without requiring DOM measurement. */
function useKnownNodeSizes(
  runtimeRef: { current: GraphRuntime | null },
  nodes: readonly GraphViewNode[],
  getNodeSize: GraphViewProps['getNodeSize'],
) {
  React.useEffect(() => {
    const runtime = runtimeRef.current;
    if (runtime === null || getNodeSize === undefined) return;
    for (const node of nodes) {
      const size = getNodeSize(node);
      if (size) runtime.setNodeSize(node.id, size);
    }
  }, [getNodeSize, nodes, runtimeRef]);
}

/*** Read callback props for the initial runtime callback-ref value. */
function readCallbacks(props: GraphViewProps): GraphViewCallbacks {
  return {
    onEdgeEvent: props.onEdgeEvent,
    onLayoutComplete: props.onLayoutComplete,
    onNodeEvent: props.onNodeEvent,
    onReady: props.onReady,
    onViewportChange: props.onViewportChange,
  };
}
