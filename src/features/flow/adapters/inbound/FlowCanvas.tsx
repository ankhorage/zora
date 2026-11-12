import React from 'react';
import { Pressable, Text, View } from 'react-native';

import type { FlowCanvasProps, FlowPortAddress } from '../../../../types/flow';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../../../theme/composition/useZoraTheme';
import { createFlowEditorController } from '../../application/createFlowEditorController';
import { FlowNode } from './FlowNode';

/** Render the controlled, accessible process-editor canvas shared by React Native and React Native Web. */
export const FlowCanvas = withZoraThemeScope(FlowCanvasInner);

/** Compose controlled flow interactions into the themed canvas boundary. */
function FlowCanvasInner(props: FlowCanvasProps) {
  const controller = React.useMemo(() => createFlowEditorController(props), [props]);
  const [pendingSource, setPendingSource] = React.useState<FlowPortAddress | null>(null);
  const { theme } = useZoraTheme();
  const selectedNodeIds = props.selectedNodeIds ?? [];
  const minZoom = props.minZoom ?? 0.5;
  const maxZoom = props.maxZoom ?? 2;
  const selectPort = (address: FlowPortAddress) => {
    const port = props.nodes
      .find((node) => node.id === address.nodeId)
      ?.ports.find((item) => item.id === address.portId);
    if (!port || props.readOnly) return;
    if (pendingSource === null) {
      if (port.direction === 'output') setPendingSource(address);
      return;
    }
    controller.connect(pendingSource, address);
    setPendingSource(null);
  };
  const setZoom = (zoom: number) =>
    controller.setViewport({ ...props.viewport, zoom: Math.max(minZoom, Math.min(maxZoom, zoom)) });

  return (
    <View
      accessible
      accessibilityLabel="Flow canvas"
      accessibilityRole="summary"
      style={{
        backgroundColor: theme.semantics.surface.default,
        minHeight: 360,
        overflow: 'hidden',
      }}
      testID={props.testID}
    >
      <FlowToolbar
        canRedo={props.canRedo === true}
        canUndo={props.canUndo === true}
        readOnly={props.readOnly === true}
        onRedo={props.onRedo}
        onUndo={props.onUndo}
        onZoomIn={() => setZoom(props.viewport.zoom + 0.1)}
        onZoomOut={() => setZoom(props.viewport.zoom - 0.1)}
      />
      <View
        style={{
          flex: 1,
          minHeight: 300,
          transform: [
            { translateX: props.viewport.pan.x },
            { translateY: props.viewport.pan.y },
            { scale: props.viewport.zoom },
          ],
        }}
      >
        {props.nodes.map((node) => (
          <FlowNode
            key={node.id}
            node={node}
            readOnly={props.readOnly === true}
            selected={selectedNodeIds.includes(node.id)}
            onMove={controller.moveNode}
            onNodePress={controller.selectNode}
            onPortPress={selectPort}
          >
            {props.renderNode?.(node, { selected: selectedNodeIds.includes(node.id) })}
          </FlowNode>
        ))}
      </View>
      <FlowConnections
        connections={props.connections}
        readOnly={props.readOnly === true}
        onDisconnect={props.onDisconnect}
      />
      <FlowPalette
        items={props.paletteItems}
        readOnly={props.readOnly === true}
        onInsert={props.onInsert}
      />
    </View>
  );
}

interface FlowToolbarProps {
  readonly canUndo: boolean;
  readonly canRedo: boolean;
  readonly readOnly: boolean;
  readonly onUndo: (() => void) | undefined;
  readonly onRedo: (() => void) | undefined;
  readonly onZoomIn: () => void;
  readonly onZoomOut: () => void;
}

/** Present keyboard-accessible viewport and history controls. */
function FlowToolbar(props: FlowToolbarProps) {
  return (
    <View style={{ flexDirection: 'row', gap: 8, padding: 10 }}>
      <FlowControl label="Zoom out" onPress={props.onZoomOut} />
      <FlowControl label="Zoom in" onPress={props.onZoomIn} />
      <FlowControl
        disabled={props.readOnly || !props.canUndo}
        label="Undo"
        onPress={props.onUndo}
      />
      <FlowControl
        disabled={props.readOnly || !props.canRedo}
        label="Redo"
        onPress={props.onRedo}
      />
    </View>
  );
}

/** Render one focusable command control. */
function FlowControl(props: {
  readonly label: string;
  readonly disabled?: boolean;
  readonly onPress?: () => void;
}) {
  const { theme } = useZoraTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: props.disabled }}
      disabled={props.disabled}
      style={{
        backgroundColor: theme.colors.primary,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 7,
      }}
      onPress={props.onPress}
    >
      <Text style={{ color: theme.semantics.surface.default }}>{props.label}</Text>
    </Pressable>
  );
}

/** Render disconnection controls without attempting to own connection routing geometry. */
function FlowConnections(props: {
  readonly connections: FlowCanvasProps['connections'];
  readonly readOnly: boolean;
  readonly onDisconnect: FlowCanvasProps['onDisconnect'];
}) {
  const { theme } = useZoraTheme();
  return (
    <View accessibilityLabel="Flow connections" style={{ gap: 4, padding: 10 }}>
      {props.connections.map((connection) => (
        <Pressable
          key={connection.id}
          accessibilityHint="Disconnect this flow connection"
          accessibilityLabel={connection.label ?? `Connection ${connection.id}`}
          accessibilityRole="button"
          accessibilityState={{ disabled: props.readOnly }}
          disabled={props.readOnly}
          onPress={() => props.onDisconnect?.(connection.id)}
        >
          <Text style={{ color: theme.colors.primary }}>
            {connection.label ?? `${connection.source.nodeId} → ${connection.target.nodeId}`}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

/** Render controlled palette insertion requests. */
function FlowPalette(props: {
  readonly items: FlowCanvasProps['paletteItems'];
  readonly readOnly: boolean;
  readonly onInsert: FlowCanvasProps['onInsert'];
}) {
  const { theme } = useZoraTheme();
  if (!props.items?.length) return null;
  return (
    <View
      accessibilityLabel="Flow palette"
      style={{ backgroundColor: theme.colors.primary, gap: 8, padding: 12 }}
    >
      {props.items.map((item) => (
        <Pressable
          key={item.id}
          accessibilityHint="Insert this node"
          accessibilityLabel={item.title}
          accessibilityRole="button"
          accessibilityState={{ disabled: props.readOnly || item.disabled }}
          disabled={props.readOnly || item.disabled}
          style={{ backgroundColor: theme.semantics.neutral.surface, borderRadius: 8, padding: 10 }}
          onPress={() => props.onInsert?.(item.id)}
        >
          <Text style={{ color: theme.semantics.neutral.text, fontWeight: '700' }}>
            {item.title}
          </Text>
          {item.description ? (
            <Text style={{ color: theme.semantics.neutral.textMuted }}>{item.description}</Text>
          ) : null}
        </Pressable>
      ))}
    </View>
  );
}
