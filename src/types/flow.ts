import type React from 'react';

import type { ZoraBaseProps } from './base';

/** A position in the caller-owned flow coordinate space. */
export interface FlowPoint {
  readonly x: number;
  readonly y: number;
}

/** A typed connection endpoint owned by one flow node. */
export interface FlowPort {
  readonly id: string;
  readonly direction: 'input' | 'output';
  readonly label: string;
  readonly disabled?: boolean;
}

/** A caller-owned node rendered on the flow canvas. */
export interface FlowNodeData {
  readonly id: string;
  readonly title: string;
  readonly position: FlowPoint;
  readonly ports: readonly FlowPort[];
  readonly description?: string;
  readonly disabled?: boolean;
}

/** A stable address for a typed flow port. */
export interface FlowPortAddress {
  readonly nodeId: string;
  readonly portId: string;
}

/** A directed connection from an output port to an input port. */
export interface FlowConnection {
  readonly id: string;
  readonly source: FlowPortAddress;
  readonly target: FlowPortAddress;
  readonly label?: string;
}

/** A palette entry that asks the controlled host to insert a node. */
export interface FlowPaletteItem {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly disabled?: boolean;
}

/** The controlled viewport for pan and zoom. */
export interface FlowViewport {
  readonly pan: FlowPoint;
  readonly zoom: number;
}

/** State given to a custom node renderer. */
export interface FlowNodeRenderState {
  readonly selected: boolean;
}

/** Public controlled interaction contract for the shared React Native and React Native Web canvas. */
export interface FlowCanvasProps extends ZoraBaseProps {
  readonly nodes: readonly FlowNodeData[];
  readonly connections: readonly FlowConnection[];
  readonly viewport: FlowViewport;
  readonly paletteItems?: readonly FlowPaletteItem[];
  readonly selectedNodeIds?: readonly string[];
  readonly readOnly?: boolean;
  readonly canUndo?: boolean;
  readonly canRedo?: boolean;
  readonly minZoom?: number;
  readonly maxZoom?: number;
  readonly renderNode?: (node: FlowNodeData, state: FlowNodeRenderState) => React.ReactNode;
  readonly onNodeSelectionChange?: (nodeIds: readonly string[]) => void;
  readonly onNodesMove?: (nodes: readonly FlowNodeData[]) => void;
  readonly onViewportChange?: (viewport: FlowViewport) => void;
  readonly onConnect?: (source: FlowPortAddress, target: FlowPortAddress) => void;
  readonly onDisconnect?: (connectionId: string) => void;
  readonly onInsert?: (paletteItemId: string) => void;
  readonly onUndo?: () => void;
  readonly onRedo?: () => void;
}
