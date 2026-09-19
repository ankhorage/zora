'use client';

import type { CytoscapeOptions } from 'cytoscape';
import React from 'react';

import { createGraphRuntime } from './createGraphRuntime';

export type GraphViewLayoutName = 'breadthfirst' | 'circle' | 'concentric' | 'elk' | 'grid';
export type GraphViewElementEventType =
  | 'press'
  | 'double-press'
  | 'select'
  | 'unselect'
  | 'pointer-enter'
  | 'pointer-leave';

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
  const containerRef = React.useRef<GraphContainer | null>(null);
  const runtimeRef = React.useRef<ReturnType<typeof createGraphRuntime> | null>(null);
  const callbacksRef = React.useRef<GraphViewCallbacks>(readCallbacks(props));
  callbacksRef.current = readCallbacks(props);

  React.useEffect(() => {
    const container = containerRef.current;
    if (container === null) return;

    const runtime = createGraphRuntime(container, callbacksRef);
    runtimeRef.current = runtime;
    return () => {
      runtime.destroy();
      runtimeRef.current = null;
    };
  }, []);

  React.useEffect(() => {
    runtimeRef.current?.update({
      edges: props.edges,
      fitPadding: props.fitPadding,
      layout: props.layout,
      layoutOptions: props.layoutOptions,
      maxZoom: props.maxZoom,
      minZoom: props.minZoom,
      nodes: props.nodes,
      spacingFactor: props.spacingFactor,
      styleRules: props.styleRules,
    });
  }, [
    props.edges,
    props.fitPadding,
    props.layout,
    props.layoutOptions,
    props.maxZoom,
    props.minZoom,
    props.nodes,
    props.spacingFactor,
    props.styleRules,
  ]);

  React.useEffect(() => {
    runtimeRef.current?.setSelectedNodeIds(props.selectedNodeIds);
  }, [props.selectedNodeIds]);

  return (
    <div
      ref={containerRef}
      aria-label={props.ariaLabel ?? 'Graph'}
      className={props.className}
      role="application"
      style={{ height: '100%', minHeight: 0, minWidth: 0, width: '100%', ...props.style }}
    />
  );
}

/*** Read callback props separately so callback changes never restart the graph runtime. */
function readCallbacks(props: GraphViewProps): GraphViewCallbacks {
  return {
    onEdgeEvent: props.onEdgeEvent,
    onLayoutComplete: props.onLayoutComplete,
    onNodeEvent: props.onNodeEvent,
    onReady: props.onReady,
    onViewportChange: props.onViewportChange,
  };
}
