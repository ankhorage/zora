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
  readonly onNodePress: (nodeId: string) => void;
  readonly onPortPress: (address: FlowPortAddress) => void;
  readonly onMove: (nodeId: string, delta: { readonly x: number; readonly y: number }) => void;
  readonly children?: React.ReactNode;
}

/** Render an accessible flow node with typed, independently focusable ports. */
export const FlowNode = withZoraThemeScope(FlowNodeInner);

/** Render node content in the active ZORA theme scope. */
function FlowNodeInner(props: FlowNodeProps) {
  const gestureStart = React.useRef<{ readonly x: number; readonly y: number } | null>(null);
  const { theme } = useZoraTheme();
  return (
    <View
      accessible
      accessibilityLabel={props.node.title}
      accessibilityRole="summary"
      accessibilityState={{ disabled: props.node.disabled, selected: props.selected }}
      style={{
        backgroundColor: theme.semantics.neutral.surface,
        borderColor: props.selected ? theme.colors.primary : theme.semantics.neutral.divider,
        borderRadius: 12,
        borderWidth: 2,
        elevation: props.selected ? 4 : 1,
        left: props.node.position.x,
        minWidth: 180,
        padding: 12,
        position: 'absolute',
        shadowColor: theme.semantics.neutral.text,
        shadowOpacity: props.selected ? 0.16 : 0.08,
        shadowRadius: 8,
        top: props.node.position.y,
      }}
      onResponderGrant={(event) => {
        gestureStart.current = { x: event.nativeEvent.pageX, y: event.nativeEvent.pageY };
      }}
      onResponderRelease={(event) => {
        const start = gestureStart.current;
        gestureStart.current = null;
        if (!start || props.readOnly || props.node.disabled) return;
        props.onMove(props.node.id, {
          x: event.nativeEvent.pageX - start.x,
          y: event.nativeEvent.pageY - start.y,
        });
      }}
      onStartShouldSetResponder={() => !props.readOnly && !props.node.disabled}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: props.node.disabled, selected: props.selected }}
        disabled={props.node.disabled}
        onPress={() => props.onNodePress(props.node.id)}
      >
        <Text style={{ color: theme.semantics.neutral.text, fontSize: 16, fontWeight: '700' }}>
          {props.node.title}
        </Text>
        {props.node.description ? (
          <Text style={{ color: theme.semantics.neutral.textMuted }}>{props.node.description}</Text>
        ) : null}
      </Pressable>
      {props.children}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
        {props.node.ports.map((port) => (
          <Pressable
            key={port.id}
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
              paddingHorizontal: 8,
              paddingVertical: 5,
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
        ))}
      </View>
    </View>
  );
}
