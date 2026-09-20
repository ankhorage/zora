import type {
  GraphViewEdge,
  GraphViewLayoutName,
  GraphViewNode,
  GraphViewStyleRule,
} from '../features/graph-view/adapters/inbound/web-artifact/GraphView';

export interface GraphRuntimeUpdate {
  readonly edges: readonly GraphViewEdge[];
  readonly fitPadding?: number;
  readonly layout?: GraphViewLayoutName;
  readonly layoutOptions?: Readonly<Record<string, unknown>>;
  readonly maxZoom?: number;
  readonly minReadableLabelSize?: number;
  readonly maxFitLabelSize?: number;
  readonly minZoom?: number;
  readonly zoomMode?: 'absolute' | 'fit-relative';
  readonly sizeNodesToLabels?: boolean;
  readonly nodes: readonly GraphViewNode[];
  readonly richNodeRendering: boolean;
  readonly spacingFactor?: number;
  readonly styleRules?: readonly GraphViewStyleRule[];
}
