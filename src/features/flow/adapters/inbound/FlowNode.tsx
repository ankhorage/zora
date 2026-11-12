import React from 'react';
import { Pressable, Text, View } from 'react-native';

import type { ZoraBaseProps } from '../../../../types/base';
import type { FlowNodeData, FlowPortAddress } from '../../../../types/flow';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../../../theme/composition/useZoraTheme';
import { getFlowNodeHeight, getFlowNodeWidth } from '../../application/getFlowPortAnchor';

interface FlowNodeProps extends ZoraBaseProps {
  readonly node: FlowNodeData;
  readonly selected: boolean;
  readonly readOnly: boolean;
  readonly zoom: number;
  readonly onNodePress: (nodeId: string) => void;
  readonly onPortPress: (address: FlowPortAddress) => void;
  readonly onMove: (nodeId: string, delta: { readonly x: number; readonly y: number }) => void;
  readonly children?: React.ReactNode;
}

/** Render an accessible flow node with typed, independently focusable ports. */
export const FlowNode = withZoraThemeScope(FlowNodeInner);

/** Render node content in the active ZORA theme scope. */
function FlowNodeInner(props: FlowNodeProps) {
  const dragStart = React.useRef<{ readonly x: number; readonly y: number } | null>(null);
  const { theme } = useZoraTheme();
  return (
    <View
      style={{
        backgroundColor: theme.semantics.neutral.surface,
        borderColor: props.selected ? theme.colors.primary : theme.semantics.neutral.divider,
        borderRadius: 12,
        borderWidth: 2,
        elevation: props.selected ? 4 : 1,
        left: props.node.position.x,
        height: getFlowNodeHeight(props.node),
        width: getFlowNodeWidth(),
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
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: props.node.disabled, selected: props.selected }}
          disabled={props.node.disabled}
          accessibilityHint="Select this node. Drag to move it."
          onPressIn={(event) => {
            dragStart.current = { x: event.nativeEvent.pageX, y: event.nativeEvent.pageY };
          }}
          onPressOut={(event) => {
            const start = dragStart.current;
            dragStart.current = null;
            if (!start || props.readOnly) return;
            const delta = {
              x: (event.nativeEvent.pageX - start.x) / props.zoom,
              y: (event.nativeEvent.pageY - start.y) / props.zoom,
            };
            if (Math.abs(delta.x) < 2 && Math.abs(delta.y) < 2) props.onNodePress(props.node.id);
            else props.onMove(props.node.id, delta);
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
              accessibilityHint={`Connect ${port.direction} port`}
              accessibilityLabel={`${props.node.title}: ${port.label}`}
              accessibilityRole="button"
              accessibilityState={{ disabled: props.readOnly || port.disabled }}
              disabled={props.readOnly || port.disabled}
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
