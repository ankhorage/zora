import React from 'react';

import type {
  GraphViewElementEventType,
  GraphViewNode,
  GraphViewNodeRenderContext,
  GraphViewRenderedNode,
  GraphViewSize,
} from './GraphView';

interface GraphNodeOverlayProps {
  readonly nodes: readonly GraphViewNode[];
  readonly renderedNodes: readonly GraphViewRenderedNode[];
  readonly renderNode: (context: GraphViewNodeRenderContext) => React.ReactNode;
  readonly onNodeEvent: (id: string, type: GraphViewElementEventType) => void;
  readonly onNodeSize: (id: string, size: GraphViewSize) => void;
}

/*** Render optional React node content above Cytoscape at its authoritative rendered positions. */
export function GraphNodeOverlay(props: GraphNodeOverlayProps) {
  const nodesById = React.useMemo(
    () => new Map(props.nodes.map((node) => [node.id, node] as const)),
    [props.nodes],
  );

  return (
    <div
      aria-hidden
      style={{
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        position: 'absolute',
      }}
    >
      {props.renderedNodes.map((renderedNode) => {
        const node = nodesById.get(renderedNode.id);
        if (!node) return null;
        return (
          <MeasuredGraphNode
            key={node.id}
            node={node}
            renderedNode={renderedNode}
            renderNode={props.renderNode}
            onNodeEvent={props.onNodeEvent}
            onNodeSize={props.onNodeSize}
          />
        );
      })}
    </div>
  );
}

interface MeasuredGraphNodeProps {
  readonly node: GraphViewNode;
  readonly renderedNode: GraphViewRenderedNode;
  readonly renderNode: GraphNodeOverlayProps['renderNode'];
  readonly onNodeEvent: GraphNodeOverlayProps['onNodeEvent'];
  readonly onNodeSize: GraphNodeOverlayProps['onNodeSize'];
}

/*** Measure one rich node at model scale and translate its DOM interactions into graph events. */
function MeasuredGraphNode(props: MeasuredGraphNodeProps) {
  const elementRef = React.useRef<HTMLDivElement | null>(null);
  const { node, onNodeSize, renderedNode } = props;

  React.useLayoutEffect(() => {
    const element = elementRef.current;
    if (element === null) return;
    reportElementSize(element, node.id, onNodeSize);

    const Observer = readResizeObserverConstructor();
    if (Observer === null) return;
    const observer = new Observer(() => reportElementSize(element, node.id, onNodeSize));
    observer.observe(element);
    return () => observer.disconnect();
  }, [node.id, onNodeSize]);

  return (
    <div
      ref={(element) => {
        elementRef.current = element;
      }}
      style={{
        left: renderedNode.position.x,
        pointerEvents: 'auto',
        position: 'absolute',
        top: renderedNode.position.y,
        transform: `translate(-50%, -50%) scale(${renderedNode.zoom})`,
        transformOrigin: 'center',
      }}
      onClick={() => props.onNodeEvent(node.id, 'press')}
      onDoubleClick={() => props.onNodeEvent(node.id, 'double-press')}
      onMouseEnter={() => props.onNodeEvent(node.id, 'pointer-enter')}
      onMouseLeave={() => props.onNodeEvent(node.id, 'pointer-leave')}
    >
      {props.renderNode({
        hovered: renderedNode.hovered,
        node,
        selected: renderedNode.selected,
        zoom: renderedNode.zoom,
      })}
    </div>
  );
}

/*** Report unscaled DOM dimensions only when a measurable node has positive size. */
function reportElementSize(
  element: unknown,
  nodeId: string,
  onNodeSize: (id: string, size: GraphViewSize) => void,
) {
  const measured = element as {
    readonly offsetHeight?: unknown;
    readonly offsetWidth?: unknown;
  };
  if (typeof measured.offsetWidth !== 'number' || typeof measured.offsetHeight !== 'number') return;
  if (measured.offsetWidth <= 0 || measured.offsetHeight <= 0) return;
  onNodeSize(nodeId, {
    width: measured.offsetWidth,
    height: measured.offsetHeight,
  });
}

/*** Read ResizeObserver without requiring the DOM lib in the package TypeScript target. */
function readResizeObserverConstructor(): ResizeObserverConstructorLike | null {
  const observer = (
    globalThis as unknown as {
      ResizeObserver?: ResizeObserverConstructorLike;
    }
  ).ResizeObserver;
  return observer ?? null;
}

interface ResizeObserverLike {
  disconnect(): void;
  observe(target: unknown): void;
}

type ResizeObserverConstructorLike = new (callback: () => void) => ResizeObserverLike;
