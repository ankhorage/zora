import type React from 'react';

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
  /** Optimize existing layout spacing without rerunning its algorithm; whole-graph fits only. */
  readonly optimizeSpacing?: boolean;
  readonly nodeIds?: readonly string[];
  readonly padding?: number;
}

export interface GraphViewElementEvent {
  readonly id: string;
  readonly type: GraphViewElementEventType;
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

export type GraphViewCallbacks = Pick<
  GraphViewProps,
  | 'onEdgeEvent'
  | 'onLayoutComplete'
  | 'onNodeEvent'
  | 'onReady'
  | 'onViewportChange'
  | 'onSpacingFactorChange'
>;
