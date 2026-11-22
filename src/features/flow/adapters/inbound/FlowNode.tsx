import React from 'react';
import { Pressable, View } from 'react-native';

import type { ZoraBaseProps } from '../../../../types/base';
import type {
  FlowNodeData,
  FlowNodeKind,
  FlowNodePresentationStatus,
  FlowPortAddress,
} from '../../../../types/flow';
import { Card } from '../../../card/public';
import completedStatusSource from '../../../flow-status/assets/completed.svg';
import waitingStatusSource from '../../../flow-status/assets/waiting.svg';
import aiAgentNodeKindSource from '../../../icon/assets/flow/node-kinds/ai-agent.svg';
import analyticsNodeKindSource from '../../../icon/assets/flow/node-kinds/analytics.svg';
import approvalNodeKindSource from '../../../icon/assets/flow/node-kinds/approval.svg';
import conditionNodeKindSource from '../../../icon/assets/flow/node-kinds/condition.svg';
import contentInputNodeKindSource from '../../../icon/assets/flow/node-kinds/content-input.svg';
import loopNodeKindSource from '../../../icon/assets/flow/node-kinds/loop.svg';
import manualNodeKindSource from '../../../icon/assets/flow/node-kinds/manual.svg';
import publishNodeKindSource from '../../../icon/assets/flow/node-kinds/publish.svg';
import transformNodeKindSource from '../../../icon/assets/flow/node-kinds/transform.svg';
import triggerNodeKindSource from '../../../icon/assets/flow/node-kinds/trigger.svg';
import webhookNodeKindSource from '../../../icon/assets/flow/node-kinds/webhook.svg';
import { Icon } from '../../../icon/public';
import { withZoraThemeScope } from '../../../theme/adapters/inbound/withZoraThemeScope';
import { useZoraTheme } from '../../../theme/composition/useZoraTheme';
import { Text as ZoraText } from '../../../typography/public';

interface FlowNodeProps extends ZoraBaseProps {
  readonly node: FlowNodeData;
  readonly selected: boolean;
  readonly readOnly: boolean;
  readonly zoomRef: React.RefObject<number>;
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
export const FlowNode = React.memo(withZoraThemeScope(FlowNodeInner));

/** Render node content in the active ZORA theme scope. */
function FlowNodeInner(props: FlowNodeProps) {
  const { canvasRef, node, onPortLayout } = props;
  const dragCancelled = React.useRef(false);
  const dragMoved = React.useRef(false);
  const dragStart = React.useRef<{ readonly x: number; readonly y: number } | null>(null);
  const pointerSelectionHandled = React.useRef(false);
  const portRefs = React.useRef(new Map<string, View | null>());
  const { theme } = useZoraTheme();
  const accessibilityLabel = resolveFlowNodeAccessibilityLabel(props.node);
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
        left: props.node.position.x,
        width: 224,
        position: 'absolute',
        top: props.node.position.y,
      }}
    >
      <Card
        compact
        padding="xs"
        style={{
          borderColor: props.selected
            ? theme.semantics.selection.border
            : theme.semantics.neutral.divider,
          borderRadius: 12,
          borderWidth: props.selected ? 2 : 1,
          elevation: props.selected ? 3 : 1,
          shadowColor: theme.semantics.neutral.text,
          shadowOpacity: props.selected ? 0.16 : 0.08,
          shadowRadius: props.selected ? 10 : 6,
        }}
      >
        <View
          accessible={false}
          collapsable={false}
          onResponderGrant={(event) => {
            dragCancelled.current = false;
            dragMoved.current = false;
            dragStart.current = { x: event.nativeEvent.pageX, y: event.nativeEvent.pageY };
          }}
          onResponderMove={(event) => {
            const start = dragStart.current;
            if (!start || dragCancelled.current || props.readOnly) return;
            const delta = {
              x: (event.nativeEvent.pageX - start.x) / props.zoomRef.current,
              y: (event.nativeEvent.pageY - start.y) / props.zoomRef.current,
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
          style={{
            backgroundColor: theme.semantics.surface.default,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            padding: 8,
          }}
        >
          <View>
            <Pressable
              aria-selected={props.selected}
              accessibilityLabel={accessibilityLabel}
              accessibilityRole="button"
              accessibilityState={{
                disabled: props.readOnly || props.node.disabled,
                selected: props.selected,
              }}
              disabled={props.readOnly ? true : props.node.disabled}
              testID={`flow-node-${props.node.id}`}
              accessibilityHint="Select this node. Drag to move it."
              style={{ alignItems: 'flex-start', flexDirection: 'row', gap: 8 }}
              onPress={() => {
                if (pointerSelectionHandled.current) {
                  pointerSelectionHandled.current = false;
                  return;
                }
                props.onNodePress(props.node.id);
              }}
            >
              {props.node.presentation?.nodeKind ? (
                <View
                  accessible={false}
                  style={{
                    alignItems: 'center',
                    backgroundColor: theme.semantics.brand.softBg,
                    borderRadius: 10,
                    height: 36,
                    justifyContent: 'center',
                    minWidth: 36,
                    width: 36,
                  }}
                >
                  <Icon
                    color={theme.semantics.brand.onSoftText}
                    size={20}
                    source={resolveFlowNodeKindSource(props.node.presentation.nodeKind)}
                    testID={`flow-node-${props.node.id}-icon`}
                  />
                </View>
              ) : null}
              <View
                style={{
                  flex: 1,
                  minWidth: 0,
                  paddingRight: props.node.presentation?.status ? 4 : 0,
                }}
              >
                <ZoraText ellipsizeMode="tail" numberOfLines={1} variant="body" weight="bold">
                  {props.node.title}
                </ZoraText>
                {props.node.description ? (
                  <ZoraText
                    ellipsizeMode="tail"
                    emphasis="muted"
                    numberOfLines={2}
                    variant="bodySmall"
                  >
                    {props.node.description}
                  </ZoraText>
                ) : null}
              </View>
              {props.node.presentation?.status ? (
                <Icon
                  size={16}
                  source={resolveFlowNodeStatusSource(props.node.presentation.status)}
                  testID={`flow-node-${props.node.id}-status`}
                />
              ) : null}
            </Pressable>
          </View>
          {props.children}
        </View>
        <View style={{ paddingHorizontal: 4 }}>
          {props.node.ports.map((port) => (
            <View
              key={port.id}
              style={{
                alignItems: 'center',
                flexDirection: 'row',
                height: 44,
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
                  alignItems: 'center',
                  height: 44,
                  justifyContent: 'center',
                  width: 44,
                }}
                onLayout={() => reportPortAnchor({ nodeId: props.node.id, portId: port.id })}
                onPress={() => props.onPortPress({ nodeId: props.node.id, portId: port.id })}
              >
                <View
                  accessible={false}
                  style={{
                    backgroundColor:
                      port.direction === 'input'
                        ? theme.semantics.surface.default
                        : theme.semantics.brand.base,
                    borderColor:
                      port.direction === 'input'
                        ? theme.semantics.brand.outline
                        : theme.semantics.brand.base,
                    borderRadius: 6,
                    borderWidth: 2,
                    height: 12,
                    width: 12,
                  }}
                />
              </Pressable>
            </View>
          ))}
        </View>
      </Card>
    </View>
  );
}

/*** Describe the caller-supplied Flow presentation once at its actionable accessibility boundary. */
function resolveFlowNodeAccessibilityLabel(node: FlowNodeData): string {
  switch (node.presentation?.status) {
    case 'completed':
      return `${node.title}. Completed`;
    case 'waiting':
      return `${node.title}. Waiting for review`;
    default:
      return node.title;
  }
}

/*** Resolve a reviewed Flow node-kind SVG without creating a package-wide icon registry. */
function resolveFlowNodeKindSource(nodeKind: FlowNodeKind) {
  switch (nodeKind) {
    case 'trigger':
    case 'schedule':
      return triggerNodeKindSource;
    case 'webhook':
      return webhookNodeKindSource;
    case 'manual':
      return manualNodeKindSource;
    case 'content-input':
      return contentInputNodeKindSource;
    case 'transform':
      return transformNodeKindSource;
    case 'ai-agent':
      return aiAgentNodeKindSource;
    case 'approval':
      return approvalNodeKindSource;
    case 'publish':
      return publishNodeKindSource;
    case 'analytics':
      return analyticsNodeKindSource;
    case 'condition':
      return conditionNodeKindSource;
    case 'loop':
      return loopNodeKindSource;
  }
}

/*** Resolve an explicitly supplied, presentation-only Flow node status badge. */
function resolveFlowNodeStatusSource(status: FlowNodePresentationStatus) {
  switch (status) {
    case 'completed':
      return completedStatusSource;
    case 'waiting':
      return waitingStatusSource;
  }
}
