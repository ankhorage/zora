import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import type { FlowCanvasProps, FlowPoint, FlowPortAddress } from '../../../../types/flow';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../../../theme/composition/useZoraTheme';
import { createFlowEditorController } from '../../application/createFlowEditorController';
import { getFlowPortAnchor, getFlowPortAnchorKey } from '../../application/getFlowPortAnchor';
import { FlowNode } from './FlowNode';

/** Render the controlled, accessible process-editor canvas shared by React Native and React Native Web. */
export const FlowCanvas = withZoraThemeScope(FlowCanvasInner);

/** Compose controlled flow interactions into the themed canvas boundary. */
function FlowCanvasInner(props: FlowCanvasProps) {
  const controller = React.useMemo(() => createFlowEditorController(props), [props]);
  const [pendingSource, setPendingSource] = React.useState<FlowPortAddress | null>(null);
  const [portAnchors, setPortAnchors] = React.useState<ReadonlyMap<string, FlowPoint>>(new Map());
  const canvasRef = React.useRef<View>(null);
  const panStart = React.useRef<{
    readonly x: number;
    readonly y: number;
    readonly pan: FlowPoint;
  } | null>(null);
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
  const setPortAnchor = React.useCallback((address: FlowPortAddress, anchor: FlowPoint) => {
    const key = getFlowPortAnchorKey(address);
    setPortAnchors((current) => {
      const previous = current.get(key);
      if (previous?.x === anchor.x && previous.y === anchor.y) return current;
      const next = new Map(current);
      next.set(key, anchor);
      return next;
    });
  }, []);
  const updatePan = (event: {
    readonly nativeEvent: { readonly pageX: number; readonly pageY: number };
  }) => {
    const start = panStart.current;
    if (!start) return;
    controller.setViewport({
      ...props.viewport,
      pan: {
        x: start.pan.x + event.nativeEvent.pageX - start.x,
        y: start.pan.y + event.nativeEvent.pageY - start.y,
      },
    });
  };

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
      onStartShouldSetResponder={() => false}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={(event) => {
        panStart.current = {
          pan: props.viewport.pan,
          x: event.nativeEvent.pageX,
          y: event.nativeEvent.pageY,
        };
      }}
      onResponderMove={updatePan}
      onResponderRelease={(event) => {
        updatePan(event);
        panStart.current = null;
      }}
      onResponderTerminate={() => {
        panStart.current = null;
      }}
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
        ref={canvasRef}
        testID={props.testID ? `${props.testID}-viewport` : undefined}
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
        <FlowEdges
          anchors={portAnchors}
          connections={props.connections}
          readOnly={props.readOnly === true}
          onDisconnect={props.onDisconnect}
        />
        {props.nodes.map((node) => (
          <FlowNode
            key={node.id}
            node={node}
            readOnly={props.readOnly === true}
            selected={selectedNodeIds.includes(node.id)}
            canvasRef={canvasRef}
            zoom={props.viewport.zoom}
            onMove={controller.moveNode}
            onNodePress={controller.selectNode}
            onPortPress={selectPort}
            onPortLayout={setPortAnchor}
          >
            {props.renderNode?.(node, { selected: selectedNodeIds.includes(node.id) })}
          </FlowNode>
        ))}
      </View>
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

/** Render visual Bezier edges joined to the exact fixed anchors of their port controls. */
function FlowEdges(props: {
  readonly anchors: ReadonlyMap<string, FlowPoint>;
  readonly connections: FlowCanvasProps['connections'];
  readonly readOnly: boolean;
  readonly onDisconnect: FlowCanvasProps['onDisconnect'];
}) {
  const { theme } = useZoraTheme();
  return (
    <View
      pointerEvents="box-none"
      style={{ bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 }}
    >
      <Svg
        height="100%"
        pointerEvents="none"
        style={{ bottom: 0, left: 0, position: 'absolute', right: 0, top: 0 }}
        width="100%"
      >
        {props.connections.flatMap((connection) => {
          const source = getFlowPortAnchor(props.anchors, connection.source);
          const target = getFlowPortAnchor(props.anchors, connection.target);
          if (!source || !target) return [];
          const controlDistance = Math.max(48, Math.abs(target.x - source.x) / 2);
          return (
            <Path
              key={connection.id}
              d={`M ${source.x} ${source.y} C ${source.x + controlDistance} ${source.y}, ${target.x - controlDistance} ${target.y}, ${target.x} ${target.y}`}
              fill="none"
              stroke={theme.colors.primary}
              strokeWidth={3}
            />
          );
        })}
      </Svg>
      {props.connections.flatMap((connection) => {
        const source = getFlowPortAnchor(props.anchors, connection.source);
        const target = getFlowPortAnchor(props.anchors, connection.target);
        if (!source || !target) return [];
        return (
          <Pressable
            key={connection.id}
            accessibilityHint="Disconnect this flow connection"
            accessibilityLabel={connection.label ?? `Connection ${connection.id}`}
            accessibilityRole="button"
            accessibilityState={{ disabled: props.readOnly }}
            disabled={props.readOnly}
            style={{
              height: 44,
              left: (source.x + target.x) / 2 - 22,
              position: 'absolute',
              top: (source.y + target.y) / 2 - 22,
              width: 44,
            }}
            onPress={() => props.onDisconnect?.(connection.id)}
          />
        );
      })}
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
