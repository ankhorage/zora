import React from 'react';
import { Pressable, Text, View } from 'react-native';

import type { ZoraBaseProps } from '../../../../types/base';
import type { FlowNodeData, FlowPortAddress } from '../../../../types/flow';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../../../theme/composition/useZoraTheme';

interface FlowNodeProps extends ZoraBaseProps {
  readonly node: FlowNodeData;
  readonly selected: boolean;
  readonly readOnly: boolean;
  readonly zoom: number;
  readonly canvasRef: React.RefObject<View | null>;
  readonly onNodePress: (nodeId: string) => void;
  readonly onPortPress: (address: FlowPortAddress) => void;
  readonly onPortLayout: (
    address: FlowPortAddress,
    anchor: { readonly x: number; readonly y: number },
  ) => void;
  readonly onMove: (nodeId: string, delta: { readonly x: number; readonly y: number }) => void;
  readonly children?: React.ReactNode;
}

/** Render an accessible flow node with typed, independently focusable ports. */
export const FlowNode = withZoraThemeScope(FlowNodeInner);

/** Render node content in the active ZORA theme scope. */
function FlowNodeInner(props: FlowNodeProps) {
  const { canvasRef, node, onPortLayout } = props;
  const dragCancelled = React.useRef(false);
  const dragMoved = React.useRef(false);
  const dragStart = React.useRef<{ readonly x: number; readonly y: number } | null>(null);
  const pointerSelectionHandled = React.useRef(false);
  const portRefs = React.useRef(new Map<string, View | null>());
  const { theme } = useZoraTheme();
  const reportPortAnchor = React.useCallback(
    (address: FlowPortAddress) => {
      const port = portRefs.current.get(address.portId);
      const canvas = canvasRef.current;
      if (!port || !canvas) return;
      port.measureLayout(
        canvas,
        (x, y, width, height) => onPortLayout(address, { x: x + width / 2, y: y + height / 2 }),
        () => undefined,
      );
    },
    [canvasRef, onPortLayout],
  );
  const reportAllPortAnchors = React.useCallback(
    () => node.ports.forEach((port) => reportPortAnchor({ nodeId: node.id, portId: port.id })),
    [node.id, node.ports, reportPortAnchor],
  );
  React.useLayoutEffect(() => {
    reportAllPortAnchors();
  }, [reportAllPortAnchors, node.position.x, node.position.y]);
  return (
    <View
      onLayout={reportAllPortAnchors}
      style={{
        backgroundColor: theme.semantics.neutral.surface,
        borderColor: props.selected ? theme.colors.primary : theme.semantics.neutral.divider,
        borderRadius: 12,
        borderWidth: 2,
        elevation: props.selected ? 4 : 1,
        left: props.node.position.x,
        minWidth: 224,
        position: 'absolute',
        shadowColor: theme.semantics.neutral.text,
        shadowOpacity: props.selected ? 0.16 : 0.08,
        shadowRadius: 8,
        top: props.node.position.y,
      }}
    >
      <View
        accessible
        accessibilityLabel={props.node.title}
        accessibilityRole="summary"
        accessibilityState={{ disabled: props.node.disabled, selected: props.selected }}
        style={{ padding: 12 }}
      >
        <View
          onResponderGrant={(event) => {
            dragCancelled.current = false;
            dragMoved.current = false;
            dragStart.current = { x: event.nativeEvent.pageX, y: event.nativeEvent.pageY };
          }}
          onResponderMove={(event) => {
            const start = dragStart.current;
            if (!start || dragCancelled.current || props.readOnly) return;
            const delta = {
              x: (event.nativeEvent.pageX - start.x) / props.zoom,
              y: (event.nativeEvent.pageY - start.y) / props.zoom,
            };
            if (Math.abs(delta.x) < 2 && Math.abs(delta.y) < 2) return;
            dragMoved.current = true;
            dragStart.current = { x: event.nativeEvent.pageX, y: event.nativeEvent.pageY };
            props.onMove(props.node.id, delta);
          }}
          onResponderRelease={() => {
            dragStart.current = null;
            pointerSelectionHandled.current = true;
            if (dragCancelled.current || props.readOnly || dragMoved.current) return;
            props.onNodePress(props.node.id);
          }}
          onResponderTerminate={() => {
            dragCancelled.current = true;
            dragStart.current = null;
          }}
          onResponderTerminationRequest={() => false}
          onStartShouldSetResponderCapture={() => !props.readOnly && !props.node.disabled}
        >
          <Pressable
            accessibilityLabel={props.node.title}
            accessibilityRole="button"
            accessibilityState={{ disabled: props.node.disabled, selected: props.selected }}
            disabled={props.readOnly ? true : props.node.disabled}
            testID={`flow-node-${props.node.id}`}
            accessibilityHint="Select this node. Drag to move it."
            onPress={() => {
              if (pointerSelectionHandled.current) {
                pointerSelectionHandled.current = false;
                return;
              }
              props.onNodePress(props.node.id);
            }}
          >
            <Text style={{ color: theme.semantics.neutral.text, fontSize: 16, fontWeight: '700' }}>
              {props.node.title}
            </Text>
            {props.node.description ? (
              <Text style={{ color: theme.semantics.neutral.textMuted }}>
                {props.node.description}
              </Text>
            ) : null}
          </Pressable>
        </View>
        {props.children}
      </View>
      <View style={{ gap: 4, paddingHorizontal: 12 }}>
        {props.node.ports.map((port) => (
          <View
            key={port.id}
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              height: 32,
              justifyContent: port.direction === 'input' ? 'flex-start' : 'flex-end',
            }}
          >
            <Pressable
              ref={(instance) => {
                portRefs.current.set(port.id, instance);
              }}
              accessibilityHint={`Connect ${port.direction} port`}
              accessibilityLabel={`${props.node.title}: ${port.label}`}
              accessibilityRole="button"
              accessibilityState={{ disabled: props.readOnly || port.disabled }}
              disabled={props.readOnly || port.disabled}
              testID={`flow-port-${props.node.id}-${port.id}`}
              style={{
                backgroundColor:
                  port.direction === 'input'
                    ? theme.semantics.neutral.surfaceHover
                    : theme.colors.primary,
                borderRadius: 999,
                minHeight: 32,
                minWidth: 44,
                paddingHorizontal: 10,
                justifyContent: 'center',
              }}
              onLayout={() => reportPortAnchor({ nodeId: props.node.id, portId: port.id })}
              onPress={() => props.onPortPress({ nodeId: props.node.id, portId: port.id })}
            >
              <Text
                style={{
                  color:
                    port.direction === 'input'
                      ? theme.colors.primary
                      : theme.semantics.surface.default,
                  fontSize: 12,
                }}
              >
                {port.label}
              </Text>
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}
