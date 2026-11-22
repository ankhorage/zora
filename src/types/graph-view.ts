import type { Graph, GraphEdge, GraphId, GraphNode } from '@ankhorage/graph';
import type { SelectionIntent } from '@ankhorage/utility/selection';
import type React from 'react';

export type GraphViewLayoutName = 'breadthfirst' | 'circle' | 'concentric' | 'elk' | 'grid';
export type GraphViewTopologyUpdatePolicy = 'preserve-positions';
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

/*** Preserve one canonical graph node alongside its GraphView presentation projection. */
export interface GraphViewCanonicalNodeData<NodeData = unknown, NodeId extends GraphId = GraphId> {
  readonly canonicalNode: GraphNode<NodeData, NodeId>;
}

/*** Preserve one canonical graph edge alongside its GraphView presentation projection. */
export interface GraphViewCanonicalEdgeData<
  EdgeData = unknown,
  NodeId extends GraphId = GraphId,
  EdgeId extends GraphId = GraphId,
> {
  readonly canonicalEdge: GraphEdge<EdgeData, NodeId, EdgeId>;
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

export interface GraphViewNodeMeasurement {
  readonly id: string;
  readonly position: GraphViewPoint;
  readonly size: GraphViewSize;
}

export interface GraphViewMeasurement {
  readonly nodes: readonly GraphViewNodeMeasurement[];
  readonly viewport: GraphViewSize;
}

export interface GraphViewViewport {
  readonly zoom: number;
  readonly pan: GraphViewPoint;
}

export interface GraphViewFitOptions {
  /**
   * Optimize effective rendered fit without rerunning the layout algorithm; whole-graph fits only.
   * Stops at the configured fit-size target and keeps semantic labels collision-safe.
   */
  readonly optimizeSpacing?: boolean;
  readonly nodeIds?: readonly string[];
  readonly padding?: number;
}

export interface GraphViewElementEvent {
  readonly id: string;
  readonly type: GraphViewElementEventType;
  readonly selectionIntent?: SelectionIntent;
}

export interface GraphViewController {
  fit(options?: GraphViewFitOptions): void;
  /** Measure rendered node geometry without exposing the backing graph engine. */
  measureNodes?(nodeIds: readonly string[]): GraphViewMeasurement | null;
  getViewport(): GraphViewViewport;
  getZoomRange(): { readonly min: number; readonly max: number };
  setPan(pan: GraphViewPoint): void;
  setZoom(zoom: number): void;
  zoomBy(factor: number): void;
}

/*** The browser lifecycle events carry only the existing public graph controller. */
export interface GraphViewDomControllerEventDetail {
  readonly controller: GraphViewController;
}

interface GraphViewSharedProps {
  readonly layout?: GraphViewLayoutName;
  readonly layoutOptions?: Readonly<Record<string, unknown>>;
  /**
   * Preserve the settled viewport and retained-node positions during controlled topology updates.
   * New nodes receive a deterministic initial position; call controller.fit() or change layout to
   * intentionally fit or relayout the graph. Without this opt-in, topology changes relayout.
   */
  readonly topologyUpdatePolicy?: GraphViewTopologyUpdatePolicy;
  readonly spacingFactor?: number;
  readonly styleRules?: readonly GraphViewStyleRule[];
  readonly selectedNodeIds?: readonly string[];
  readonly renderNode?: (context: GraphViewNodeRenderContext) => React.ReactNode;
  readonly getNodeSize?: (node: GraphViewNode) => GraphViewSize | undefined;
  readonly fitPadding?: number;
  readonly minZoom?: number;
  readonly maxZoom?: number;
  readonly minReadableLabelSize?: number;
  readonly maxFitLabelSize?: number;
  /** Zoom values and bounds use the full-node fit as 1 when fit-relative is selected. */
  readonly zoomMode?: 'absolute' | 'fit-relative';
  /** Measure plain labels before layout instead of estimating width from character count. */
  readonly sizeNodesToLabels?: boolean;
  readonly className?: string;
  readonly style?: React.CSSProperties;
  readonly ariaLabel?: string;
  readonly onReady?: (controller: GraphViewController) => void;
  readonly onLayoutComplete?: (controller: GraphViewController) => void;
  readonly onNodeEvent?: (event: GraphViewElementEvent) => void;
  readonly onEdgeEvent?: (event: GraphViewElementEvent) => void;
  readonly onViewportChange?: (viewport: GraphViewViewport) => void;
  readonly onSpacingFactorChange?: (spacingFactor: number) => void;
}

/*** Retain the original GraphView nodes and edges input contract. */
export interface GraphViewProps extends GraphViewSharedProps {
  readonly nodes: readonly GraphViewNode[];
  readonly edges: readonly GraphViewEdge[];
  readonly graph?: never;
}

/*** Accept a published canonical graph without introducing a second domain graph model. */
export interface GraphViewCanonicalGraphProps extends GraphViewSharedProps {
  readonly graph: Graph<unknown, unknown, GraphId, GraphId>;
  readonly nodes?: never;
  readonly edges?: never;
}

/*** Accept either the established presentation elements or one canonical Ankhorage graph. */
export type GraphViewInput = GraphViewProps | GraphViewCanonicalGraphProps;

/*** Describe the resolved element input consumed by the existing GraphView runtime. */
export type ResolvedGraphViewProps = GraphViewProps;

export type GraphViewCallbacks = Pick<
  GraphViewSharedProps,
  | 'onEdgeEvent'
  | 'onLayoutComplete'
  | 'onNodeEvent'
  | 'onReady'
  | 'onViewportChange'
  | 'onSpacingFactorChange'
>;
